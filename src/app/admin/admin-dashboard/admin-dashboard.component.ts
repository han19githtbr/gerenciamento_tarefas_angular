import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
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
  respostas: { [id: number]: string } = {};
  isLoading = true;
  activeTab: 'overview' | 'tarefas' | 'pessoas' | 'departamentos' | 'mensagens' = 'overview';

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
    // Poll stats every 30 seconds
    this.pollingInterval = setInterval(() => this.carregarStatsGerais(), 30000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
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

  carregarMensagensPendentes(): void {
    this.adminService.getMensagensPendentes().subscribe({
      next: (data: any[]) => {
        this.mensagensPendentes = data || [];
      },
      error: () => {}
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
