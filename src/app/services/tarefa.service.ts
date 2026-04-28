import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Tarefa } from '../model/Tarefa.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  public API = environment.apiUrl;
  public CONTROLLER = this.API + '/tarefas';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  salvarTarefa(item: any): Observable<any> {
    return this.http.post(this.CONTROLLER + '/salvarTarefa', item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'tarefa'))
    );
  }

  alocarPessoaNaTarefa(tarefaId: number, pessoaId: number, emailPessoa?: string): Observable<any> {
    const url = `${this.CONTROLLER}/alocar/${tarefaId}/${pessoaId}`;
    const body = emailPessoa ? { emailPessoa } : {};
    return this.http.put(url, body, { observe: 'response' });
  }

  finalizarTarefa(tarefaId: number): Observable<HttpResponse<any>> {
    const url = `${this.CONTROLLER}/finalizar/${tarefaId}`;
    return this.http.put(url, {}, { observe: 'response' });
  }

  removerTarefa(item: any): Observable<any> {
    return this.http.delete(this.CONTROLLER + '/removerTarefa/' + item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'tarefa'))
    );
  }

  listarTarefasPendentes(): Observable<any> {
    return this.http.get(this.CONTROLLER + '/pendentes', { observe: 'response' });
  }

  getAllTarefa(): Observable<any> {
    return this.http.get(this.CONTROLLER + '/getAllTarefa', { observe: 'response' });
  }

  alterarTarefa(titulo: string, item: any): Observable<any> {
    return this.http.put(this.CONTROLLER + '/alterarTarefa/' + titulo, item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'tarefa'))
    );
  }

  salvarTarefaOrder(tarefas: Tarefa[]): Observable<any> {
    return this.http.put(this.CONTROLLER + '/salvarTarefaOrder', tarefas, {});
  }

  getContagemEmAndamento(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(this.CONTROLLER + '/contagemEmAndamento');
  }
}
