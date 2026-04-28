import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioLoginComponent } from './usuario-login/usuario-login.component';
import { UsuarioDashboardComponent } from './usuario-dashboard/usuario-dashboard.component';
import { ComponentesModule } from '../components/component.module';

@NgModule({
  declarations: [
    UsuarioLoginComponent,
    UsuarioDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsuarioRoutingModule,
    ComponentesModule
  ]
})
export class UsuarioModule {}
