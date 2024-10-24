import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Departamento } from '../model/Departamento.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  //public API = 'http://localhost:8090';
  public API = 'https://desafio-backend-java.onrender.com/';
  public CONTROLLER = this.API + '/departamentos'

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  saveDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você adicionou um departamento.');
    return this.http.post(this.CONTROLLER + '/salvarDepartamento', item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'departamento'))
    );
  }


  getAllDepartamento() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getAllDepartamento', { headers: headers, observe: 'response' });
  }

  salvarDepartamentoOrder(departamentos: Departamento[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarDepartamentoOrder', departamentos, { headers: headers });
  }

  alterarDepartamento(titulo: string, item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você alterou um departamento.');
    return this.http.put(this.CONTROLLER + '/alterarDepartamento/' + titulo, item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'departamento'))
    );
  }

  removerDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você removeu um departamento.');
    return this.http.delete(this.CONTROLLER + '/removerDepartamento/' + item, { headers: headers, observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'departamento'))
    );
  }
}
