import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../model/Departamento.model';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  public API = 'http://localhost:8090';
  public CONTROLLER = this.API + '/departamentos'

  constructor(private http: HttpClient) { }

  saveDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.CONTROLLER + '/salvarDepartamento', item, { headers: headers, observe: 'response' });
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

    return this.http.put(this.CONTROLLER + '/alterarDepartamento/' + titulo, item, { headers: headers, observe: 'response' });
  }

  removerDepartamento(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.delete(this.CONTROLLER + '/removerDepartamento/' + item, { headers: headers, observe: 'response' });
  }


}
