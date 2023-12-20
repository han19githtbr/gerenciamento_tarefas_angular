import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../model/Pessoa.model';


@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  public API = 'http://localhost:8090';
  public CONTROLLER = this.API + '/pessoas';

  constructor(private http: HttpClient) { }

  savePessoa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.CONTROLLER + '/salvarPessoa', item, { headers: headers, observe: 'response' });
  }

  getAllPessoa() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(this.CONTROLLER + '/getAllPessoa', { headers: headers, observe: 'response' });
  }

  alterarPessoa(name: string, item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/alterarPessoa/' + name, item, { headers: headers, observe: 'response' });
  }

  removerPessoa(item: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.delete(this.CONTROLLER + '/removerPessoa/' + item, { headers: headers, observe: 'response' });
  }

  salvarPessoaOrder(pessoas: Pessoa[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.CONTROLLER + '/salvarPessoaOrder', pessoas, { headers: headers });
  }

}
