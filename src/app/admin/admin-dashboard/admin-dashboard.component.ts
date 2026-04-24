import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
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
  isLoading = true;
  activeTab: 'overview' | 'tarefas' | 'pessoas' | 'departamentos' = 'overview';

  constructor(
    private auth: AuthService,
    private adminService: AdminService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminEmail = this.auth.getAdminEmail();
    this.carregarStatsGerais();
    this.carregarDados();
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
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.auth.getToken() });
    this.http.get<any[]>(environment.apiUrl + '/tarefas/getAllTarefa').subscribe(d => this.todasTarefas = d || []);
    this.http.get<any[]>(environment.apiUrl + '/pessoas/getAllPessoa').subscribe(d => this.todasPessoas = d || []);
    this.http.get<any[]>(environment.apiUrl + '/departamentos/getAllDepartamento').subscribe(d => this.todosDepartamentos = d || []);
  }

  setTab(tab: 'overview' | 'tarefas' | 'pessoas' | 'departamentos'): void {
    this.activeTab = tab;
  }

  logout(): void {
    this.auth.logoutAdmin();
  }

  getStatusBadge(tarefa: any): string {
    if (tarefa.finalizado) return 'concluida';
    if (tarefa.pessoaId || tarefa.pessoa) return 'andamento';
    return 'pendente';
  }

  getStatusLabel(tarefa: any): string {
    if (tarefa.finalizado) return 'Concluída';
    if (tarefa.pessoaId || tarefa.pessoa) return 'Em Andamento';
    return 'Pendente';
  }
}
