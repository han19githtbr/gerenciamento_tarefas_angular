import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private API = environment.apiUrl + '/usuario';
  private NOTIF_API = environment.apiUrl + '/notificacoes';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Bearer ' + this.auth.getUserToken() });
  }

  getMinhasTarefas(): Observable<any[]> {
    return this.http.get<any[]>(this.API + '/minhas-tarefas', { headers: this.authHeaders() });
  }

  iniciarTarefa(tarefaId: number): Observable<any> {
    return this.http.put(this.API + '/iniciar-tarefa/' + tarefaId, {}, { headers: this.authHeaders() });
  }

  enviarMensagem(tarefaId: number, texto: string): Observable<any> {
    return this.http.post(this.API + '/tarefa/' + tarefaId + '/mensagem',
      { texto }, { headers: this.authHeaders() });
  }

  getNotificacoes(): Observable<any[]> {
    return this.http.get<any[]>(this.NOTIF_API + '/pendentes', { headers: this.authHeaders() });
  }

  marcarNotificacaoLida(id: number): Observable<any> {
    return this.http.put(this.NOTIF_API + '/ler/' + id, {}, { headers: this.authHeaders() });
  }
}
