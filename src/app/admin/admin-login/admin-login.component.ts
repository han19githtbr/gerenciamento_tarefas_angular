import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements AfterViewInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    if (this.auth.isAdminLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    this.aguardarGoogleSDK(() => {
      setTimeout(() => {
        this.auth.initGoogleSignIn(() => {
          this.router.navigate(['/admin/dashboard']);
        });
      }, 100);
    });
  }

  private aguardarGoogleSDK(callback: () => void, tentativas = 0): void {
    if ((window as any).google) {
      callback();
    } else if (tentativas < 20) {
      setTimeout(() => this.aguardarGoogleSDK(callback, tentativas + 1), 300);
    }
  }

  signInGoogle(): void {
    this.auth.triggerAdminGoogleSignIn();
  }

  voltarInicio(): void {
    this.router.navigate(['/']);
  }
}
