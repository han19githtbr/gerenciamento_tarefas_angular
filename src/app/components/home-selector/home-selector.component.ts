import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-selector',
  templateUrl: './home-selector.component.html',
  styleUrls: ['./home-selector.component.scss']
})
export class HomeSelectorComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Se admin já logado, redireciona para o painel admin
    if (this.auth.isAdminLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    // Se usuário já logado, redireciona para o painel usuário
    if (this.auth.isUserLoggedIn()) {
      this.router.navigate(['/usuario/dashboard']);
      return;
    }
  }

  goAdmin(): void {
    this.router.navigate(['/admin/login']);
  }

  goUsuario(): void {
    this.router.navigate(['/usuario/login']);
  }
}
