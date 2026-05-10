// src/app/services/ia.service.ts
//
// Novo serviço Angular para comunicação com os endpoints de IA do back-end.
// Adicione este arquivo em: src/app/services/ia.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SugerirPrazoResponse {
  diasSugeridos: number;
  prazoSugerido: string; // formato ISO: "2026-05-17"
}

export interface GerarDescricaoResponse {
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class IaService {
  private BASE = environment.apiUrl + '/ia';

  constructor(private http: HttpClient) {}

  /**
   * Feature 2 — Sugestão de prazo
   * Envia título e descrição, recebe prazo sugerido em dias e data ISO.
   */
  sugerirPrazo(titulo: string, descricao: string): Observable<SugerirPrazoResponse> {
    return this.http.post<SugerirPrazoResponse>(`${this.BASE}/sugerir-prazo`, {
      titulo,
      descricao
    });
  }

  /**
   * Feature 3 — Geração de descrição
   * Envia o título da tarefa, recebe descrição gerada pela IA.
   */
  gerarDescricao(titulo: string): Observable<GerarDescricaoResponse> {
    return this.http.post<GerarDescricaoResponse>(`${this.BASE}/gerar-descricao`, {
      titulo
    });
  }
}
