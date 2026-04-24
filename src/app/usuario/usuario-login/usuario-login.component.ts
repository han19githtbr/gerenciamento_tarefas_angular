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
    if ((window as any).google) {
      this.auth.initUserSignIn((_token, _email) => {
        this.router.navigate(['/usuario/dashboard']);
      });
    }
  }
}
