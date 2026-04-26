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
    if ((window as any).google) {
      this.auth.initGoogleSignIn(() => {
        this.router.navigate(['/admin/dashboard']);
      });
    }
  }

  voltarInicio(): void {
    this.router.navigate(['/']);
  }
}
