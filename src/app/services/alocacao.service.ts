import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Pessoa } from '../model/Pessoa.model';
import { Tarefa } from '../model/Tarefa.model';
import { TarefaService } from './tarefa.service';
import { DialogPessoaTarefaComponent } from '../components/dialog-pessoa-tarefa/dialog-pessoa-tarefa.component';
import { DialogFinalizarTarefaComponent } from '../components/dialog-finalizar-tarefa/dialog-finalizar-tarefa.component';

export interface ResultadoAlocacao {
  sucesso: boolean;
  mensagem: string;
}

export interface ResultadoFinalizacao {
  confirmado: boolean;
}

/**
 * Encapsula toda a lógica de alocação e finalização de tarefas.
 *
 * Antes essa lógica vivia no DashboardComponent, misturada com
 * manipulação de DOM, toasts e navegação. Agora o componente
 * apenas chama esses métodos e reage ao resultado.
 */
@Injectable({ providedIn: 'root' })
export class AlocacaoService {

  constructor(
    private dialog: MatDialog,
    private tarefaService: TarefaService
  ) {}

  /**
   * Valida se a alocação é possível e retorna uma mensagem de erro,
   * ou null se tudo estiver válido.
   */
  validarAlocacao(tarefa: Tarefa, pessoa: Pessoa): string | null {
    if (!tarefa)   return 'Selecione uma tarefa.';
    if (!pessoa)   return 'Selecione uma pessoa.';
    if (!tarefa.id) return 'A tarefa selecionada não tem um ID válido.';
    if (!pessoa.id) return 'A pessoa selecionada não tem um ID válido.';

    // Feature 4: bloqueia tarefa vencida
    if (tarefa.vencida || tarefa.isPrazoVencido) {
      return '🚫 Esta tarefa está com o prazo vencido. Não é possível alocar novas pessoas.';
    }

    const tarefaDeptId = this._getDepartamentoId(tarefa);
    const pessoaDeptId = pessoa.departamentoId ?? (pessoa.departamento as any)?.id;

    if (!tarefaDeptId || !pessoaDeptId)
      return 'Não foi possível identificar o departamento.';

    if (tarefaDeptId !== pessoaDeptId)
      return 'A pessoa não pertence ao mesmo departamento da tarefa.';

    return null;
  }

  desalocarPessoa(tarefaId: number, pessoaId: number): Observable<any> {
    return this.tarefaService.desalocarPessoa(tarefaId, pessoaId);
  }


  /**
   * Abre o dialog de confirmação de alocação.
   * Retorna um Observable com o resultado do dialog.
   */
  abrirDialogAlocacao(tarefa: Tarefa, pessoa: Pessoa): Observable<any> {
    const tarefaDeptId = this._getDepartamentoId(tarefa);

    const dialogRef = this.dialog.open(DialogPessoaTarefaComponent, {
      width: '30rem',
      data: {
        title: 'Alocar Pessoa na Tarefa',
        tarefa: {
          id: tarefa.id,
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          prazo: tarefa.prazo,
          ordem_apresentacao: tarefa.ordem_apresentacao,
          departamentoId: tarefaDeptId,
          pessoaId: pessoa.id
        },
        nomePessoa: pessoa.nome,
        emailAtual: pessoa.email || '',
        message: `Deseja alocar "${pessoa.nome}" na tarefa "${tarefa.titulo}"?`
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Abre o dialog de confirmação de finalização.
   * Retorna um Observable com o resultado do dialog.
   */
  abrirDialogFinalizarTarefa(tarefa: Tarefa): Observable<any> {
    const dialogRef = this.dialog.open(DialogFinalizarTarefaComponent, {
      width: '35rem',
      data: {
        title: 'Finalizar Tarefa',
        message: `Deseja finalizar a tarefa "${tarefa.titulo}"?`,
        tarefa
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Executa a chamada HTTP de finalização.
   * O componente decide o que fazer com a resposta.
   */
  finalizarTarefa(tarefaId: number): Observable<any> {
    return this.tarefaService.finalizarTarefa(tarefaId);
  }

  // ── Helper privado ───────────────────────────────────────────────────────

  private _getDepartamentoId(tarefa: Tarefa): number | undefined {
    if (tarefa.departamentoId) return tarefa.departamentoId;
    if (tarefa.departamento && typeof tarefa.departamento === 'object')
      return (tarefa.departamento as any).id;
    if (typeof tarefa.departamento === 'number')
      return tarefa.departamento;
    return undefined;
  }
}
