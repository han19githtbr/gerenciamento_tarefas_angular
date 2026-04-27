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

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + this.auth.getToken()
    });
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(this.API + '/dashboard', { headers: this.authHeaders() });
  }

  getMensagensPendentes(): Observable<any[]> {
    return this.http.get<any[]>(this.API + '/mensagens/pendentes', { headers: this.authHeaders() });
  }

  getMinhasNotificacoes(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + '/notificacoes/pendentes',
      { headers: this.authHeaders() }
    );
  }

  marcarNotificacaoLida(id: number): Observable<any> {
    return this.http.put(
      environment.apiUrl + '/notificacoes/ler/' + id,
      {},
      { headers: this.authHeaders() }
    );
  }

  responderMensagem(mensagemId: number, resposta: string): Observable<any> {
    return this.http.put(
      this.API + '/mensagem/' + mensagemId + '/responder',
      { resposta },
      { headers: this.authHeaders() }
    );
  }

  getContagemEmAndamento(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      this.TAREFAS_API + '/contagemEmAndamento',
      { headers: this.authHeaders() }
    );
  }

  excluirMensagem(mensagemId: number): Observable<any> {
    return this.http.delete(
      this.API + '/mensagem/' + mensagemId,
      { headers: this.authHeaders() }
    );
  }

  getAllTarefas(): Observable<any[]> {
    return this.http.get<any[]>(this.TAREFAS_API + '/getAllTarefa', { headers: this.authHeaders() });
  }

  getAllPessoas(): Observable<any[]> {
    return this.http.get<any[]>(this.PESSOAS_API + '/getAllPessoa', { headers: this.authHeaders() });
  }

  getAllDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.DEPT_API + '/getAllDepartamento', { headers: this.authHeaders() });
  }


}
