import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pessoa } from '../model/Pessoa.model';
import { Tarefa } from '../model/Tarefa.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  public API = environment.apiUrl;

  public CONTROLLER = this.API + '/tarefas'

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private auth: AuthService
  ) { }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + this.auth.getToken()
    });
  }

  salvarTarefa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você adicionou uma tarefa.');
    return this.http.post(this.CONTROLLER + '/salvarTarefa', item, { headers: this.authHeaders(), observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'tarefa'))
    );
  }

  alocarPessoaNaTarefa(tarefaId: number, pessoaId: number, emailPessoa?: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    const url = `${this.CONTROLLER}/alocar/${tarefaId}/${pessoaId}`;
    const body = emailPessoa ? { emailPessoa } : {};
    console.log('URL da alocação:', url);

    return this.http.put(url, body, {
        headers: this.authHeaders(),
        observe: 'response'
    });
  }


  finalizarTarefa(tarefaId: number): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    // Corrigindo o endpoint - usando template string
    const url = `${this.CONTROLLER}/finalizar/${tarefaId}`;

    return this.http.put(url, {}, {
        headers: this.authHeaders(),
        observe: 'response'
    });
  }


  removerTarefa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você removeu uma tarefa.');
    return this.http.delete(this.CONTROLLER + '/removerTarefa/' + item, { headers: this.authHeaders(), observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'tarefa'))
    );
  }


  listarTarefasPendentes(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/pendentes', { headers: this.authHeaders(), observe: 'response' });
  }


  getAllTarefa(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getAllTarefa', { headers: this.authHeaders(), observe: 'response' });
  }


  alterarTarefa(titulo: string, item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você alterou uma tarefa.');
    return this.http.put(this.CONTROLLER + '/alterarTarefa/' + titulo, item, { headers: this.authHeaders(), observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'tarefa'))
    );
  }


  salvarTarefaOrder(tarefas: Tarefa[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarTarefaOrder', tarefas, { headers: this.authHeaders() });
  }

  getContagemEmAndamento(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(this.CONTROLLER + '/contagemEmAndamento', { headers: this.authHeaders() });
  }
}
