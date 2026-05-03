import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Pessoa } from '../model/Pessoa.model';
import { Departamento } from '../model/Departamento.model';
import { Tarefa } from '../model/Tarefa.model';

import { AdicionarPessoaComponent } from '../components/adicionar-pessoa/adicionar-pessoa.component';
import { AdicionarDepartamentoComponent } from '../components/adicionar-departamento/adicionar-departamento.component';
import { AdicionarTarefaComponent } from '../components/adicionar-tarefa/adicionar-tarefa.component';
import { ConfirmacaoDialogComponent } from '../components/confirmacao-dialog/confirmacao-dialog.component';
import { ConfirmacaoDialogDepartmentComponent } from '../components/confirmacao-dialog-department/confirmacao-dialog-department.component';
import { ConfirmacaoDialogTaskComponent } from '../components/confirmacao-dialog-task/confirmacao-dialog-task.component';

/**
 * Encapsula a abertura de todos os dialogs usados no Dashboard.
 *
 * Antes o DashboardComponent chamava `this.dialog.open(...)` diretamente
 * em 8 lugares diferentes, cada um com sua configuração inline.
 * Agora basta chamar o método nomeado e observar o `afterClosed()`.
 */
@Injectable({ providedIn: 'root' })
export class DashboardDialogService {

  constructor(private dialog: MatDialog) {}

  // ── Pessoa ───────────────────────────────────────────────────────────────

  abrirAdicionarPessoa(): Observable<Pessoa | undefined> {
    return this.dialog.open(AdicionarPessoaComponent, {
      width: '30rem',
      data: { title: 'Adicionar Pessoa', pessoaButton: 'Create' }
    }).afterClosed();
  }

  abrirEditarPessoa(pessoa: Pessoa): Observable<Pessoa | undefined> {
    return this.dialog.open(AdicionarPessoaComponent, {
      width: '30rem',
      data: {
        title: 'Editar Pessoa',
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
        departamentoId: pessoa.departamentoId ?? (pessoa.departamento as any)?.id,
        ordem_apresentacao: pessoa.ordem_apresentacao,
        pessoaButton: 'Edit'
      }
    }).afterClosed();
  }

  abrirConfirmarRemoverPessoa(pessoa: Pessoa): Observable<'Sim' | undefined> {
    return this.dialog.open(ConfirmacaoDialogComponent, {
      width: '30rem',
      data: { title: 'Deletar Pessoa', id: pessoa.id }
    }).afterClosed();
  }

  // ── Departamento ─────────────────────────────────────────────────────────

  abrirAdicionarDepartamento(): Observable<Departamento | undefined> {
    return this.dialog.open(AdicionarDepartamentoComponent, {
      width: '30rem',
      data: { title: 'Adicionar Departamento', departamentoButton: 'Create' }
    }).afterClosed();
  }

  abrirEditarDepartamento(departamento: Departamento): Observable<Departamento | undefined> {
    return this.dialog.open(AdicionarDepartamentoComponent, {
      width: '30rem',
      data: {
        title: 'Editar Departamento',
        id: departamento.id,
        titulo: departamento.titulo,
        ordem_apresentacao: departamento.ordem_apresentacao,
        departamentoButton: 'Edit'
      }
    }).afterClosed();
  }

  abrirConfirmarRemoverDepartamento(departamento: Departamento): Observable<'Sim' | undefined> {
    return this.dialog.open(ConfirmacaoDialogDepartmentComponent, {
      width: '30rem',
      data: {
        title: 'Deletar Departamento',
        id: departamento.id,
        titulo: departamento.titulo,
        ordem_apresentacao: departamento.ordem_apresentacao
      }
    }).afterClosed();
  }

  // ── Tarefa ───────────────────────────────────────────────────────────────

  abrirAdicionarTarefa(): Observable<{ success: boolean } | undefined> {
    return this.dialog.open(AdicionarTarefaComponent, {
      width: '30rem',
      data: { title: 'Adicionar Tarefa', tarefaButton: 'Create' }
    }).afterClosed();
  }

  abrirEditarTarefa(tarefa: Tarefa): Observable<Tarefa | undefined> {
    return this.dialog.open(AdicionarTarefaComponent, {
      width: '30rem',
      data: {
        title: 'Editar Tarefa',
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        prazo: tarefa.prazo,
        ordem_apresentacao: tarefa.ordem_apresentacao,
        tarefaButton: 'Edit',
        departamentoId: (tarefa.departamento as any)?.id ?? tarefa.departamentoId  // ← ADICIONE ESTA LINHA
      }
    }).afterClosed();
  }

  abrirConfirmarRemoverTarefa(tarefa: Tarefa): Observable<'Sim' | undefined> {
    return this.dialog.open(ConfirmacaoDialogTaskComponent, {
      width: '30rem',
      data: { title: 'Deletar Tarefa', id: tarefa.id, ordem_apresentacao: tarefa.ordem_apresentacao }
    }).afterClosed();
  }
}
