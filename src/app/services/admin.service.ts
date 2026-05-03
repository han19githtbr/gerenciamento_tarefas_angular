import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private API = environment.apiUrl + '/admin';
  private TAREFAS_API = environment.apiUrl + '/tarefas';
  private PESSOAS_API = environment.apiUrl + '/pessoas';
  private DEPT_API = environment.apiUrl + '/departamentos';

  constructor(private http: HttpClient, private auth: AuthService) {}


  getDashboard(): Observable<any> {
    return this.http.get<any>(this.API + '/dashboard', { });
  }

  getMensagensPendentes(): Observable<any[]> {
    return this.http.get<any[]>(this.API + '/mensagens/pendentes', { });
  }

  getMinhasNotificacoes(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + '/notificacoes/pendentes',
      { }
    );
  }

  marcarNotificacaoLida(id: number): Observable<any> {
    return this.http.put(
      environment.apiUrl + '/notificacoes/ler/' + id,
      {},
      { }
    );
  }

  responderMensagem(mensagemId: number, resposta: string): Observable<any> {
    return this.http.put(
      this.API + '/mensagem/' + mensagemId + '/responder',
      { resposta },
      { }
    );
  }

  getContagemEmAndamento(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      this.TAREFAS_API + '/contagemEmAndamento',
      { }
    );
  }

  excluirMensagem(mensagemId: number): Observable<any> {
    return this.http.delete(
      this.API + '/mensagem/' + mensagemId,
      { }
    );
  }

  getAllTarefas(): Observable<any[]> {
    return this.http.get<any[]>(this.TAREFAS_API + '/getAllTarefa', { });
  }

  getAllPessoas(): Observable<any[]> {
    return this.http.get<any[]>(this.PESSOAS_API + '/getAllPessoa', { });
  }

  getAllDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.DEPT_API + '/getAllDepartamento', { });
  }

  /*getTarefasVencidas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/tarefas/vencidas/count`);
    // Se quiser a lista completa, crie endpoint GET /tarefas/vencidas no backend
  }*/

  getTarefasVencidas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/tarefas/vencidas`);
  }

  editarTarefa(tarefaId: number, dados: { titulo: string; descricao?: string; prazo?: string }): Observable<any> {
    return this.http.put(`${this.API}/tarefa/${tarefaId}/editar`, dados);
  }

  prorrogarTarefa(tarefaId: number, novoPrazo: string): Observable<any> {
    return this.http.put(`${this.API}/tarefa/${tarefaId}/prorrogar`, { novoPrazo });
  }

  encerrarTarefa(tarefaId: number): Observable<any> {
    return this.http.put(`${this.API}/tarefa/${tarefaId}/encerrar`, {});
  }

  getNotificacoesConclusao(): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/notificacoes/conclusao-pendentes');
  }

  aprovarConclusao(notifId: number, tarefaId: number): Observable<any> {
    return this.http.put(
      environment.apiUrl + `/notificacoes/aprovar-conclusao/${notifId}`,
      { tarefaId }
    );
  }

}
