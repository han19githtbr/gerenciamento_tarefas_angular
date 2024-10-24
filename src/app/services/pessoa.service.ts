import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pessoa } from '../model/Pessoa.model';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  //public API = 'http://localhost:8090';
  public API = 'https://desafio-backend-java.onrender.com/';
  public CONTROLLER = this.API + '/pessoas';

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  savePessoa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.CONTROLLER + '/salvarPessoa', item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'pessoa'))
    );
  }

  getAllPessoa() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getAllPessoa', { headers: headers, observe: 'response' });
  }

  alterarPessoa(name: string, item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você adicionou uma pessoa.');
    return this.http.put(this.CONTROLLER + '/alterarPessoa/' + name, item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'pessoa'))
    );
  }

  removerPessoa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você removeu uma pessoa.');
    return this.http.delete(this.CONTROLLER + '/removerPessoa/' + item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'pessoa'))
    );
  }

  getPessoasPorDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getPessoasDepartamentos/' + item, { headers: headers, observe: 'response' });
  }

  salvarPessoaOrder(pessoas: Pessoa[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarPessoaOrder', pessoas, { headers: headers });
  }
}
