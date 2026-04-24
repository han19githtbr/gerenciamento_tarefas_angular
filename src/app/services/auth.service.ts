import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CLIENT_ID = environment.googleClientId || 'SEU_GOOGLE_CLIENT_ID';
  private readonly ADMIN_EMAIL = environment.adminEmail || 'SEU_EMAIL@gmail.com';

  constructor(private router: Router) {}

  initGoogleSignIn(callback: (token: string) => void): void {
    (window as any).google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: (response: any) => {
        const payload = this.parseJwt(response.credential);
        if (payload.email === this.ADMIN_EMAIL) {
          localStorage.setItem('admin_token', response.credential);
          localStorage.setItem('admin_email', payload.email);
          callback(response.credential);
        } else {
          alert('Acesso negado. Somente o administrador pode entrar aqui.');
        }
      }
    });
    const btnEl = document.getElementById('google-btn');
    if (btnEl) {
      (window as any).google.accounts.id.renderButton(btnEl, {
        theme: 'filled_blue', size: 'large', text: 'signin_with'
      });
    }
  }

  initUserSignIn(callback: (token: string, email: string) => void): void {
    (window as any).google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: (response: any) => {
        const payload = this.parseJwt(response.credential);
        localStorage.setItem('user_token', response.credential);
        localStorage.setItem('user_email', payload.email);
        callback(response.credential, payload.email);
      }
    });
    const btnEl = document.getElementById('google-btn-user');
    if (btnEl) {
      (window as any).google.accounts.id.renderButton(btnEl, {
        theme: 'filled_blue', size: 'large'
      });
    }
  }

  isAdminLoggedIn(): boolean {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;
    try {
      const payload = this.parseJwt(token);
      return payload.exp * 1000 > Date.now() && payload.email === this.ADMIN_EMAIL;
    } catch { return false; }
  }

  isUserLoggedIn(): boolean {
    const token = localStorage.getItem('user_token');
    if (!token) return false;
    try {
      const payload = this.parseJwt(token);
      return payload.exp * 1000 > Date.now();
    } catch { return false; }
  }

  logoutAdmin(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    this.router.navigate(['/admin/login']);
  }

  logoutUser(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    this.router.navigate(['/usuario/login']);
  }

  getToken(): string | null { return localStorage.getItem('admin_token'); }
  getUserToken(): string | null { return localStorage.getItem('user_token'); }
  getAdminEmail(): string { return localStorage.getItem('admin_email') || ''; }
  getUserEmail(): string { return localStorage.getItem('user_email') || ''; }

  private parseJwt(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
