import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Departamento } from '../model/Departamento.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  public API = environment.apiUrl;
  public CONTROLLER = this.API + '/departamentos'

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private auth: AuthService
  ) {
    console.log('🔥 API URL em produção:', this.API);
    console.log('🔥 Controller URL:', this.CONTROLLER);
  }

  // Substitua o método authHeaders():
  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.auth.getToken()
    });
  }

  saveDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.CONTROLLER + '/salvarDepartamento', item, { headers: this.authHeaders(), observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'departamento'))
    );
  }


  getAllDepartamento() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getAllDepartamento', { headers: this.authHeaders(), observe: 'response' });
  }

  salvarDepartamentoOrder(departamentos: Departamento[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarDepartamentoOrder', departamentos, { headers: this.authHeaders() });
  }

  alterarDepartamento(titulo: string, item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você alterou um departamento.');
    return this.http.put(this.CONTROLLER + '/alterarDepartamento/' + titulo, item, { headers: this.authHeaders(), observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'departamento'))
    );
  }

  removerDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //this.notificationService.addNotification('Você removeu um departamento.');
    return this.http.delete(this.CONTROLLER + '/removerDepartamento/' + item, { headers: this.authHeaders(), observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'departamento'))
    );
  }
}
