import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-dashboard',
  templateUrl: './usuario-dashboard.component.html',
  styleUrls: ['./usuario-dashboard.component.scss']
})
export class UsuarioDashboardComponent implements OnInit, OnDestroy {
  userEmail: string = '';
  minhasTarefas: any[] = [];
  notificacoes: any[] = [];
  novasMensagens: { [tarefaId: number]: string } = {};
  mensagensOcultas: Set<number> = new Set();
  tarefasExpandidas: { [tarefaId: number]: boolean } = {};
  respostasVencimento: { [notifId: number]: string } = {};
  isLoading = true;
  private pollingInterval: any;

  // Stats
  get totalTarefas(): number { return this.minhasTarefas.length; }
  get pendentes(): number { return this.minhasTarefas.filter(t => !t.emAndamento && !t.finalizado).length; }
  get emAndamento(): number { return this.minhasTarefas.filter(t => t.emAndamento && !t.finalizado).length; }
  get concluidas(): number { return this.minhasTarefas.filter(t => t.finalizado).length; }

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.auth.getUserEmail();
    this.carregarMinhasTarefas();
    this.iniciarPollingNotificacoes();
  }

  carregarMinhasTarefas(): void {
    this.isLoading = true;
    this.usuarioService.getMinhasTarefas().subscribe({
      next: (data: any[]) => {
        this.minhasTarefas = data || [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  iniciarTarefa(tarefaId: number): void {
    this.usuarioService.iniciarTarefa(tarefaId).subscribe({
      next: () => this.carregarMinhasTarefas(),
      error: (err) => alert(err?.error?.message || 'Erro ao iniciar tarefa')
    });
  }

  toggleMensagens(tarefaId: number): void {
    this.tarefasExpandidas[tarefaId] = !this.tarefasExpandidas[tarefaId];
  }

  enviarMensagem(tarefaId: number): void {
    const texto = this.novasMensagens[tarefaId];
    if (!texto?.trim()) return;
    this.usuarioService.enviarMensagem(tarefaId, texto).subscribe({
      next: () => {
        this.novasMensagens[tarefaId] = '';
        this.carregarMinhasTarefas();
      },
      error: () => alert('Erro ao enviar mensagem')
    });
  }

  toggleOcultarMensagem(msgId: number): void {
    if (this.mensagensOcultas.has(msgId)) {
      this.mensagensOcultas.delete(msgId);
    } else {
      this.mensagensOcultas.add(msgId);
    }
  }

  excluirMensagemUsuario(tarefaId: number, msgId: number): void {
    if (!confirm('Remover esta mensagem?')) return;
    this.usuarioService.excluirMensagem(msgId).subscribe({
      next: () => {
        const tarefa = this.minhasTarefas.find(t => t.id === tarefaId);
        if (tarefa) {
          tarefa.mensagens = tarefa.mensagens.filter((m: any) => m.id !== msgId);
        }
        this.mensagensOcultas.delete(msgId);
      },
      error: () => alert('Erro ao excluir mensagem')
    });
  }

  iniciarPollingNotificacoes(): void {
    this.verificarNotificacoes();
    this.pollingInterval = setInterval(() => this.verificarNotificacoes(), 120000);
  }

  verificarNotificacoes(): void {
    this.usuarioService.getNotificacoes().subscribe({
      next: (notifs: any[]) => {
        this.notificacoes = notifs || [];
      },
      error: () => {}
    });
  }

  dispensarNotificacao(notif: any): void {
    this.usuarioService.marcarNotificacaoLida(notif.id).subscribe({
      next: () => {
        this.notificacoes = this.notificacoes.filter(n => n.id !== notif.id);
      },
      error: () => {}
    });
  }

  responderVencimento(notif: any): void {
    const opcao = this.respostasVencimento[notif.id];
    if (!opcao) {
      alert('Selecione uma opção (A ou B) antes de enviar.');
      return;
    }
    this.usuarioService.responderVencimento(notif.id, opcao).subscribe({
      next: () => {
        // Remove a notificação do banner após resposta
        this.notificacoes = this.notificacoes.filter(n => n.id !== notif.id);
      },
      error: () => alert('Erro ao enviar resposta.')
    });
  }

  getStatusLabel(tarefa: any): string {
    if (tarefa.finalizado) return 'Concluída';
    if (tarefa.vencida) return 'Vencida';
    if (tarefa.emAndamento) return 'Em Andamento';
    return 'Pendente';
  }

  getStatusClass(tarefa: any): string {
    if (tarefa.finalizado) return 'status-concluida';
    if (tarefa.vencida) return 'status-vencida';
    if (tarefa.emAndamento) return 'status-andamento';
    return 'status-pendente';
  }

  isPrazoProximo(prazo: any): boolean {
    if (!prazo) return false;
    const diff = new Date(prazo).getTime() - Date.now();
    return diff > 0 && diff < 86400000 * 2;
  }

  logout(): void {
    this.auth.logoutUser();
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }
}
