import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

import { Pessoa } from 'src/app/model/Pessoa.model';
import { Departamento } from 'src/app/model/Departamento.model';
import { Tarefa } from 'src/app/model/Tarefa.model';

import { DashboardStateService } from 'src/app/services/dashboard-state.service';
import { DashboardDialogService } from 'src/app/services/dashboard-dialog.service';
import { AlocacaoService } from 'src/app/services/alocacao.service';
import { ReordenacaoService } from 'src/app/services/reordenacao.service';

const TOAST_OPTIONS = {
  timeOut: 3000,
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-bottom-right',
  tapToDismiss: true,
};

/**
 * DashboardComponent — orquestrador.
 *
 * Após a refatoração, este componente tem uma única responsabilidade:
 * reagir a eventos do usuário (cliques, drops) e delegar o trabalho
 * para os serviços especializados.
 *
 * Ele NÃO:
 *   • faz chamadas HTTP diretamente
 *   • contém lógica de validação de alocação
 *   • abre dialogs com configuração inline
 *   • manipula arrays de reordenação manualmente
 *
 * Ele SIM:
 *   • observa os streams do DashboardStateService
 *   • chama os serviços na resposta a eventos
 *   • exibe toasts de feedback
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // ── Estado local (apenas seleção de UI) ──────────────────────────────────
  tarefaSelecionada: Tarefa | null = null;
  pessoaSelecionada: Pessoa | null = null;
  isCollapsed = false;

  // ── Streams do estado (alimentam o template via async pipe) ──────────────
  readonly pessoas$           = this.state.pessoas$;
  readonly departamentos$     = this.state.departamentos$;
  readonly tarefas$           = this.state.tarefas$;
  readonly tarefasPendentes$  = this.state.tarefasPendentes$;
  readonly tarefasAlocadas$   = this.state.tarefasAlocadas$;
  readonly tarefasEmAndamento$ = this.state.tarefasEmAndamento$;
  readonly tarefasVencidas$ = this.state.tarefasVencidas$;

  private destroy$ = new Subject<void>();

  constructor(
    private state:     DashboardStateService,
    private dialogs:   DashboardDialogService,
    private alocacao:  AlocacaoService,
    private reorder:   ReordenacaoService,
    private toastr:    ToastrService
  ) {}

  ngOnInit(): void {
    this.state.carregarTudo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Seleção (alocação) ───────────────────────────────────────────────────

  selecionarTarefa(event: MatSelectChange): void {
    this.tarefaSelecionada = event.value;
  }

  selecionarPessoa(event: MatSelectChange): void {
    this.pessoaSelecionada = event.value;
  }

  // ── CRUD — Pessoas ───────────────────────────────────────────────────────

  savePessoa(): void {
    this.dialogs.abrirAdicionarPessoa()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pessoaSalva => {
        if (pessoaSalva) {
          // Recarrega para garantir consistência com o servidor
          this.state.recarregarPessoas();
          this.showSuccess('Pessoa adicionada com sucesso!');
        }
      });
  }

  alterarPessoa(index: number, pessoa: Pessoa): void {
    this.dialogs.abrirEditarPessoa(pessoa)
      .pipe(takeUntil(this.destroy$))
      .subscribe(pessoaAlterada => {
        if (pessoaAlterada) {
          this.state.atualizarPessoa(index, pessoaAlterada);
          this.showSuccess('Pessoa alterada com sucesso!');
        }
      });
  }

  removerPessoa(pessoa: Pessoa): void {
    this.dialogs.abrirConfirmarRemoverPessoa(pessoa)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'Sim') {
          this.state.recarregarPessoas();
        }
      });
  }


  // ── CRUD — Departamentos ─────────────────────────────────────────────────

  saveDepartamento(): void {
    this.dialogs.abrirAdicionarDepartamento()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.state.recarregarDepartamentos();
        }
      });
  }

  alterarDepartamento(index: number, departamento: Departamento): void {
    this.dialogs.abrirEditarDepartamento(departamento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // A lista de departamentos é pequena; recarregar é mais seguro
          this.state.recarregarDepartamentos();
        }
      });
  }

  removerDepartamento(departamento: Departamento): void {
    this.dialogs.abrirConfirmarRemoverDepartamento(departamento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'Sim') {
          this.state.recarregarDepartamentos();
        }
      });
  }

  // ── CRUD — Tarefas ───────────────────────────────────────────────────────

  salvarTarefa(): void {
    this.dialogs.abrirAdicionarTarefa()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result?.success) {
          this.state.recarregarTarefas();
          this.showSuccess('Tarefa adicionada com sucesso!');
        }
      });
  }

  alterarTarefa(tarefa: Tarefa): void {
    this.dialogs.abrirEditarTarefa(tarefa)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.state.recarregarTarefas();
        }
      });
  }

  removerTarefa(tarefa: Tarefa): void {
    this.dialogs.abrirConfirmarRemoverTarefa(tarefa)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'Sim') {
          this.state.recarregarTarefas();
        }
      });
  }

  // ── Alocação ─────────────────────────────────────────────────────────────

  alocarPessoaNaTarefa(): void {
    const erro = this.alocacao.validarAlocacao(this.tarefaSelecionada, this.pessoaSelecionada);
    if (erro) {
      this.showError(erro);
      return;
    }

    this.alocacao.abrirDialogAlocacao(this.tarefaSelecionada, this.pessoaSelecionada)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result?.result === 'Sim') {
          this.showSuccess(result.mensagem || 'Pessoa alocada com sucesso!');
          this.state.recarregarTarefas();
          this.tarefaSelecionada = null;
          this.pessoaSelecionada = null;
        } else if (result?.result === 'Erro') {
          this.showError(result.mensagem);
        }
      });
  }


  desalocarPessoa(tarefaId: number, pessoaId: number): void {
    this.alocacao.desalocarPessoa(tarefaId, pessoaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const data = res.body || res;
          if (data?.success) {
            this.showSuccess('Pessoa removida da tarefa.');
            this.state.recarregarTarefas();
          } else {
            this.showError(data?.mensagem || 'Erro ao remover alocação.');
          }
        },
        error: () => this.showError('Erro ao remover alocação.')
      });
  }


  abrirDialogFinalizarTarefa(tarefa: Tarefa): void {
    this.alocacao.abrirDialogFinalizarTarefa(tarefa)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'Sim') {
          this._executarFinalizacao(tarefa.id);
        }
      });
  }

  private _executarFinalizacao(tarefaId: number): void {
    this.alocacao.finalizarTarefa(tarefaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const data = response.body || response;
          if (data?.success) {
            this.showSuccess('Tarefa finalizada com sucesso!');
            this.state.marcarTarefaFinalizada(tarefaId, data.duracao);
          } else {
            this.showError(data?.mensagem || 'Erro ao finalizar tarefa');
          }
        },
        error: (error) => {
          this.showError('Erro ao finalizar tarefa: ' + (error.error?.mensagem || error.message));
        }
      });
  }

  // ── Reordenação — Pessoas ────────────────────────────────────────────────

  reOrdemPessoas(event: CdkDragDrop<Pessoa[]>): void {
    const { lista, salvar$ } = this.reorder.reordenarPorDrop(event, this.state.pessoas);
    this.state.atualizarOrdemPessoas(lista);
    salvar$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  upPeople(index: number): void {
    const result = this.reorder.moverPessoaAcima(index, this.state.pessoas);
    if (result) {
      this.state.atualizarOrdemPessoas(result.lista);
      result.salvar$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  downPeople(index: number): void {
    const result = this.reorder.moverPessoaAbaixo(index, this.state.pessoas);
    if (result) {
      this.state.atualizarOrdemPessoas(result.lista);
      result.salvar$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  // ── Reordenação — Departamentos ──────────────────────────────────────────

  reOrdemDepartamentos(event: CdkDragDrop<Departamento[]>): void {
    const { lista, salvar$ } = this.reorder.reordenarDepartamentosPorDrop(event, this.state.departamentos);
    this.state.atualizarOrdemDepartamentos(lista);
    salvar$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  upDepartment(index: number): void {
    const result = this.reorder.moverDepartamentoAcima(index, this.state.departamentos);
    if (result) {
      this.state.atualizarOrdemDepartamentos(result.lista);
      result.salvar$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  downDepartment(index: number): void {
    const result = this.reorder.moverDepartamentoAbaixo(index, this.state.departamentos);
    if (result) {
      this.state.atualizarOrdemDepartamentos(result.lista);
      result.salvar$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  // ── Reordenação — Tarefas ────────────────────────────────────────────────

  reOrdemTarefas(event: CdkDragDrop<Tarefa[]>): void {
    const { lista, salvar$ } = this.reorder.reordenarTarefasPorDrop(event, this.state.tarefas);
    this.state.atualizarOrdemTarefas(lista);
    salvar$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  upTask(index: number): void {
    const result = this.reorder.moverTarefaAcima(index, this.state.tarefas);
    if (result) {
      this.state.atualizarOrdemTarefas(result.lista);
      result.salvar$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  downTask(index: number): void {
    const result = this.reorder.moverTarefaAbaixo(index, this.state.tarefas);
    if (result) {
      this.state.atualizarOrdemTarefas(result.lista);
      result.salvar$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  // ── Utilitário público ───────────────────────────────────────────────────

  recarregarTudo(): void {
    this.state.carregarTudo();
  }

  // ── Toast helpers ────────────────────────────────────────────────────────

  showSuccess(message: string): void {
    this.toastr.success(message, 'Sucesso', TOAST_OPTIONS);
  }

  showError(message: string): void {
    this.toastr.error(message, 'Erro', TOAST_OPTIONS);
  }
}
