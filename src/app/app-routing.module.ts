import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoPessoasComponent } from './components/departamento-pessoas/departamento-pessoas.component';

const routes: Routes = [
  { path: 'departamentos/:departamentoId/pessoas', component: DepartamentoPessoasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
