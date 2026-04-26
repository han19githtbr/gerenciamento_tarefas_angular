import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoPessoasComponent } from './components/departamento-pessoas/departamento-pessoas.component';
import { HomeSelectorComponent } from './components/home-selector/home-selector.component';

const routes: Routes = [
  { path: '', component: HomeSelectorComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
  },
  { path: 'departamentos/:departamentoId/pessoas', component: DepartamentoPessoasComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
