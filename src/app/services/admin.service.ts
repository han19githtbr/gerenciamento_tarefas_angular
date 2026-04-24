import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private API = environment.apiUrl + '/admin';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Bearer ' + this.auth.getToken() });
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(this.API + '/dashboard', { headers: this.authHeaders() });
  }
}
