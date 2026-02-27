import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/enviroments';
import { Pais, CriarPaisPayload } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class PaisService {

  private readonly endpoint = `${environment.apiURL}/pais`;

  constructor(private http: HttpClient) {}

  // ─── Cadastro (rota pública — não exige token) ─────────────────────────────
  cadastrar(payload: CriarPaisPayload): Observable<Pais> {
    return this.http.post<Pais>(`${this.endpoint}/`, payload);
  }

  // ─── Operações autenticadas ────────────────────────────────────────────────
  buscarPorId(id: number): Observable<Pais> {
    return this.http.get<Pais>(`${this.endpoint}/${id}/`);
  }

  atualizar(id: number, payload: Partial<CriarPaisPayload>): Observable<Pais> {
    return this.http.patch<Pais>(`${this.endpoint}/${id}/`, payload);
  }

  // Pai vincula um aluno já cadastrado como filho
  adicionarFilho(paiId: number, alunoId: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.endpoint}/${paiId}/adicionar_filho/`,
      { aluno_id: alunoId }
    );
  }
}