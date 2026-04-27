import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrls: ['./usuario-login.component.scss']
})
export class UsuarioLoginComponent implements AfterViewInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    if (this.auth.isUserLoggedIn()) {
      this.router.navigate(['/usuario/dashboard']);
      return;
    }
    this.aguardarGoogleSDK(() => {
      setTimeout(() => {
        this.auth.initUserSignIn((_token, _email) => {
          this.router.navigate(['/usuario/dashboard']);
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

  voltarInicio(): void {
    this.router.navigate(['/']);
  }
}
