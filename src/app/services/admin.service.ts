import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private API = environment.apiUrl + '/admin';
  private TAREFAS_API = environment.apiUrl + '/tarefas';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Bearer ' + this.auth.getToken() });
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(this.API + '/dashboard', { headers: this.authHeaders() });
  }

  getMensagensPendentes(): Observable<any[]> {
    return this.http.get<any[]>(this.API + '/mensagens/pendentes', { headers: this.authHeaders() });
  }

  responderMensagem(mensagemId: number, resposta: string): Observable<any> {
    return this.http.put(this.API + '/mensagem/' + mensagemId + '/responder',
      { resposta }, { headers: this.authHeaders() });
  }

  getContagemEmAndamento(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(this.TAREFAS_API + '/contagemEmAndamento', { headers: this.authHeaders() });
  }
}
