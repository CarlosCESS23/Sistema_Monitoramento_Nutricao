import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/enviroments';
import { Nutricionista, CriarNutricionistaPayload } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class NutricionistaService {

  private readonly endpoint = `${environment.apiURL}/nutricionistas`;

  constructor(private http: HttpClient) {}

  // ─── Cadastro (rota pública — não exige token) ─────────────────────────────
  cadastrar(payload: CriarNutricionistaPayload): Observable<Nutricionista> {
    return this.http.post<Nutricionista>(`${this.endpoint}/`, payload);
  }

  // ─── Operações autenticadas ────────────────────────────────────────────────
  buscarPorId(id: number): Observable<Nutricionista> {
    return this.http.get<Nutricionista>(`${this.endpoint}/${id}/`);
  }

  atualizar(id: number, payload: Partial<CriarNutricionistaPayload>): Observable<Nutricionista> {
    return this.http.patch<Nutricionista>(`${this.endpoint}/${id}/`, payload);
  }
}