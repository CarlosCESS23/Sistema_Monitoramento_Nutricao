import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/enviroments';
import { Aluno, CriarAlunoPayload } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class AlunoService {

  private readonly endpoint = `${environment.apiURL}/alunos`;

  constructor(private http: HttpClient) {}

  // ─── Cadastro (rota pública — não exige token) ─────────────────────────────
  cadastrar(payload: CriarAlunoPayload): Observable<Aluno> {
    return this.http.post<Aluno>(`${this.endpoint}/`, payload);
  }

  // ─── Operações autenticadas ────────────────────────────────────────────────
  buscarPorId(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.endpoint}/${id}/`);
  }

  listarPorPai(paiId: number): Observable<Aluno[]> {
    // Usa o query param que configuramos no viewset: /alunos/?pai=3
    return this.http.get<Aluno[]>(`${this.endpoint}/?pai=${paiId}`);
  }

  atualizar(id: number, payload: Partial<CriarAlunoPayload>): Observable<Aluno> {
    return this.http.patch<Aluno>(`${this.endpoint}/${id}/`, payload);
  }

  // Aluno vincula o próprio pai após já ter criado conta
  vincularPai(alunoId: number, paiId: number): Observable<{ status: string }> {
    return this.http.patch<{ status: string }>(
      `${this.endpoint}/${alunoId}/vincular_pai/`,
      { pai_id: paiId }
    );
  }
}