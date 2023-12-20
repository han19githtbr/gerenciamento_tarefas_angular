import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../model/Pessoa.model';
import { Tarefa } from '../model/Tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  public API = 'http://localhost:8090';
  public CONTROLLER = this.API + '/tarefas'

  constructor(private http: HttpClient) { }

  salvarTarefa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.CONTROLLER + '/salvarTarefa', item, { headers: headers, observe: 'response' });
  }


  alocarPessoaNaTarefa(item: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/alocar/{tarefaId}/{pessoaId}', item, { headers: headers, observe: 'response' });
  }


  finalizarTarefa(item: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/finalizar/{tarefaId}', item, { headers: headers, observe: 'response' });
  }


  removerTarefa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.delete(this.CONTROLLER + '/removerTarefa/' + item, { headers: headers, observe: 'response' });
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

    return this.http.put(this.CONTROLLER + '/alterarTarefa/' + titulo, item, { headers: headers, observe: 'response' });
  }


  salvarTarefaOrder(tarefas: Tarefa[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarTarefaOrder', tarefas, { headers: headers });
  }

}
