import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
//import { UsuarioService } from '../../services/usuario.service';
//import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  adminEmail: string = '';
  statsGerais: any = {
    totalPessoas: 0,
    totalDepartamentos: 0,
    totalTarefas: 0,
    emAndamento: 0,
    pendentes: 0,
    concluidas: 0
  };

  todasTarefas: any[] = [];
  todasPessoas: any[] = [];
  todosDepartamentos: any[] = [];
  mensagensPendentes: any[] = [];
  notificacoesAdmin: any[] = [];
  mensagensOcultas: Set<number> = new Set();
  respostas: { [id: number]: string } = {};
  isLoading = true;
  isRefreshing = false;
  mensagensRecolhidas = false;
  activeTab: 'overview' | 'tarefas' | 'pessoas' | 'departamentos' | 'mensagens' = 'overview';
  tarefasVencidas: any[] = [];
  novoPrazo: { [id: number]: string } = {};
  expandedVencidas = false;
  today: string = new Date().toISOString().split('T')[0];

  private pollingInterval: any;

  constructor(
    private auth: AuthService,
    private adminService: AdminService,
    //private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.adminEmail = this.auth.getAdminEmail();
    this.carregarStatsGerais();
    this.carregarDados();
    this.verificarNotificacoesAdmin();
    // Atualiza stats E mensagens a cada 30 segundos
    this.pollingInterval = setInterval(() => {
      this.carregarStatsGerais();
      this.carregarMensagensPendentes();
      this.verificarNotificacoesAdmin();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  carregarStatsGerais(): void {
    this.adminService.getDashboard().subscribe({
      next: (data: any) => {
        this.statsGerais = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  carregarDados(): void {
    this.adminService.getAllTarefas().subscribe({
      next: (d: any) => { this.todasTarefas = d || []; },
      error: () => {}
    });
    this.adminService.getAllPessoas().subscribe({
      next: (d: any) => { this.todasPessoas = d || []; },
      error: () => {}
    });
    this.adminService.getAllDepartamentos().subscribe({
      next: (d: any) => { this.todosDepartamentos = d || []; },
      error: () => {}
    });
    this.carregarMensagensPendentes();
  }


  carregarVencidas(): void {
    this.adminService.getTarefasVencidas().subscribe({
      next: (tarefas) => this.tarefasVencidas = tarefas,
      error: () => {}
    });
  }

  prorrogarTarefa(tarefaId: number): void {
    const prazo = this.novoPrazo[tarefaId];
    if (!prazo) {
      alert('Informe o novo prazo.');
      return;
    }
    this.adminService.prorrogarTarefa(tarefaId, prazo).subscribe({
      next: () => {
        alert('Tarefa prorrogada com sucesso!');
        this.carregarVencidas();
        this.carregarStatsGerais();
      },
      error: () => alert('Erro ao prorrogar tarefa.')
    });
  }

  encerrarTarefa(tarefaId: number): void {
    if (!confirm('Tem certeza que deseja encerrar esta tarefa?')) return;
    this.adminService.encerrarTarefa(tarefaId).subscribe({
      next: () => {
        alert('Tarefa encerrada com sucesso!');
        this.carregarVencidas();
        this.carregarStatsGerais();
      },
      error: () => alert('Erro ao encerrar tarefa.')
    });
  }


  toggleMensagens(): void {
    this.mensagensRecolhidas = !this.mensagensRecolhidas;
  }

  carregarMensagensPendentes(): void {
    this.adminService.getMensagensPendentes().subscribe({
      next: (data: any[]) => {
        this.mensagensPendentes = data || [];
      },
      error: () => {}
    });
  }

  verificarNotificacoesAdmin(): void {
    this.adminService.getMinhasNotificacoes().subscribe({
      next: (notifs: any[]) => {
        this.notificacoesAdmin = notifs || [];
      },
      error: () => {}
    });
  }

  dispensarNotificacaoAdmin(notif: any): void {
    this.adminService.marcarNotificacaoLida(notif.id).subscribe({
      next: () => {
        this.notificacoesAdmin = this.notificacoesAdmin.filter(n => n.id !== notif.id);
      },
      error: () => {}
    });
  }

  irParaMensagens(notif: any): void {
    this.dispensarNotificacaoAdmin(notif);
    this.setTab('mensagens');
  }

  irParaVencidas(notif: any): void {
    this.dispensarNotificacaoAdmin(notif);
    this.carregarVencidas();
    this.expandedVencidas = true;
  }

  toggleOcultarMensagem(id: number): void {
    if (this.mensagensOcultas.has(id)) {
      this.mensagensOcultas.delete(id);
    } else {
      this.mensagensOcultas.add(id);
    }
  }

  excluirMensagemAdmin(mensagemId: number): void {
    if (!confirm('Remover esta mensagem do painel?')) return;
    this.adminService.excluirMensagem(mensagemId).subscribe({
      next: () => {
        this.mensagensPendentes = this.mensagensPendentes.filter(m => m.id !== mensagemId);
        this.mensagensOcultas.delete(mensagemId);
      },
      error: () => alert('Erro ao excluir mensagem')
    });
  }

  responderMensagem(mensagemId: number): void {
    const resposta = this.respostas[mensagemId];
    if (!resposta?.trim()) return;

    this.adminService.responderMensagem(mensagemId, resposta).subscribe({
      next: () => {
        this.respostas[mensagemId] = '';
        this.carregarMensagensPendentes();
      },
      error: () => alert('Erro ao responder mensagem')
    });
  }

  setTab(tab: 'overview' | 'tarefas' | 'pessoas' | 'departamentos' | 'mensagens'): void {
    this.activeTab = tab;
    if (tab === 'mensagens') {
      this.carregarMensagensPendentes();
    }
  }

  logout(): void {
    this.auth.logoutAdmin();
  }

  voltarInicio(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/']);
    });
  }

  atualizarTudo(): void {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    this.carregarStatsGerais();
    this.carregarDados();
    this.verificarNotificacoesAdmin();
    setTimeout(() => { this.isRefreshing = false; }, 1500);
  }


  getStatusBadge(tarefa: any): string {
    if (tarefa.finalizado) return 'concluida';
    if (tarefa.emAndamento) return 'andamento';
    if (tarefa.pessoaId || tarefa.pessoa) return 'alocada';
    return 'pendente';
  }

  getStatusLabel(tarefa: any): string {
    if (tarefa.finalizado) return 'Concluída';
    if (tarefa.emAndamento) return 'Em Andamento';
    if (tarefa.pessoaId || tarefa.pessoa) return 'Alocada';
    return 'Pendente';
  }

  isPrazoUrgente(prazo: any): boolean {
    if (!prazo) return false;
    const diff = new Date(prazo).getTime() - Date.now();
    return diff > 0 && diff < 86400000 * 3;
  }
}
