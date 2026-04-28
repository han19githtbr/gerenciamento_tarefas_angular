import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Pessoa } from '../model/Pessoa.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  public API = environment.apiUrl;

  public CONTROLLER = this.API + '/pessoas';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private auth: AuthService
  ) { }


  savePessoa(item: any): Observable<any> {

    return this.http.post(this.CONTROLLER + '/salvarPessoa', item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('adicionou', 'pessoa'))
    );
  }

  getAllPessoa() {

    return this.http.get(this.CONTROLLER + '/getAllPessoa', { observe: 'response' });
  }

  alterarPessoa(name: string, item: any): Observable<any> {

    return this.http.put(this.CONTROLLER + '/alterarPessoa/' + name, item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('alterou', 'pessoa'))
    );
  }

  removerPessoa(item: any): Observable<any> {

    return this.http.delete(this.CONTROLLER + '/removerPessoa/' + item, { observe: 'response' }).pipe(
      tap(() => this.notificationService.addNotification('removeu', 'pessoa'))
    );
  }

  getPessoasPorDepartamento(item: any): Observable<any> {

    return this.http.get(this.CONTROLLER + '/getPessoasDepartamentos/' + item, { observe: 'response' });
  }

  salvarPessoaOrder(pessoas: Pessoa[]): Observable<any> {

    return this.http.put(this.CONTROLLER + '/salvarPessoaOrder', pessoas, { });
  }

}
