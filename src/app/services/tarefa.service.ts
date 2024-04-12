import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pessoa } from '../model/Pessoa.model';
import { Tarefa } from '../model/Tarefa.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  //public API = 'http://localhost:8090';
  public API = 'https://desafio-backend-java.onrender.com/';
  public CONTROLLER = this.API + '/tarefas'

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  salvarTarefa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você adicionou uma tarefa.');
    return this.http.post(this.CONTROLLER + '/salvarTarefa', item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'tarefa'))
    );
  }

  alocarPessoaNaTarefa(tarefaId: number, pessoaId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put<any>(`${this.CONTROLLER}/alocar/${tarefaId}/${pessoaId}`, {}, { headers: headers, observe: 'response' });
  }


  finalizarTarefa(item: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/finalizar/{tarefaId}', item, { headers: headers, observe: 'response' });
  }


  removerTarefa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você removeu uma tarefa.');
    return this.http.delete(this.CONTROLLER + '/removerTarefa/' + item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'tarefa'))
    );
  }


  listarTarefasPendentes(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/pendentes', { headers: headers, observe: 'response' });
  }


  getAllTarefa(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getAllTarefa', { headers: headers, observe: 'response' });
  }


  alterarTarefa(titulo: string, item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você alterou uma tarefa.');
    return this.http.put(this.CONTROLLER + '/alterarTarefa/' + titulo, item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'tarefa'))
    );
  }


  salvarTarefaOrder(tarefas: Tarefa[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarTarefaOrder', tarefas, { headers: headers });
  }
}
