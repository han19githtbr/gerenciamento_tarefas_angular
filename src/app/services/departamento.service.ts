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


  saveDepartamento(item: any): Observable<any> {
    return this.http.post(
      this.CONTROLLER + '/salvarDepartamento',
      item,
      { observe: 'response' }
    ).pipe(
        tap(() => this.notificationService.addNotification('adicionou', 'departamento'))
    );
  }


  getAllDepartamento() {

    return this.http.get(this.CONTROLLER + '/getAllDepartamento', { observe: 'response' });
  }

  salvarDepartamentoOrder(departamentos: Departamento[]): Observable<any> {

    return this.http.put(this.CONTROLLER + '/salvarDepartamentoOrder', departamentos, { });
  }

  alterarDepartamento(titulo: string, item: any): Observable<any> {

    return this.http.put(this.CONTROLLER + '/alterarDepartamento/' + titulo, item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'departamento'))
    );
  }

  removerDepartamento(item: any): Observable<any> {

    return this.http.delete(this.CONTROLLER + '/removerDepartamento/' + item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'departamento'))
    );
  }
}
