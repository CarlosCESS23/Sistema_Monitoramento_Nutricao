import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/enviroments';
import {
  LoginPayload,
  AuthResponse,
  UsuarioLogado,
  TipoUsuario,
  Pais,
  Aluno,
  Nutricionista
} from '../interfaces/models';

// As chaves que usamos para salvar dados no localStorage.
// Centralizamos aqui para evitar erros de digitação espalhados pelo código.
const TOKEN_KEY = 'merenda_access_token';
const REFRESH_KEY = 'merenda_refresh_token';
const USUARIO_KEY = 'merenda_usuario';

@Injectable({
  // 'root' significa que existe uma única instância desse service em toda a aplicação.
  // É como um "singleton" — todos os components compartilham o mesmo AuthService.
  providedIn: 'root'
})
export class AuthService {

  // Signal é a nova forma reativa do Angular de gerenciar estado.
  // Qualquer component que usar usuarioLogado() vai atualizar automaticamente
  // quando o valor mudar — por exemplo, ao fazer login ou logout.
  usuarioLogado = signal<UsuarioLogado | null>(this.carregarUsuarioDoStorage());

  private readonly api = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}

  // ─── Login ─────────────────────────────────────────────────────────────────

  login(payload: LoginPayload): Observable<AuthResponse> {
    // O endpoint de login do JWT do Django recebe email e senha.
    // Mas como temos três tabelas diferentes, precisamos de um endpoint
    // customizado que saiba em qual tabela procurar baseado no tipo.
    // Por enquanto apontamos para /token/ padrão do simplejwt.
    return this.http.post<AuthResponse>(`${this.api}/token/`, {
      email: payload.email,
      password: payload.senha,
      tipo: payload.tipo
    }).pipe(
      // tap() executa um efeito colateral sem modificar o valor que passa por ele.
      // É o lugar certo para salvar o token depois que o login der certo.
      tap(resposta => this.salvarSessao(resposta, payload.tipo))
    );
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioLogado.set(null);
    this.router.navigate(['/login']);
  }

  // ─── Token ─────────────────────────────────────────────────────────────────

  getToken(): string | null {
    // Verifica se está no browser antes de acessar localStorage
    // (necessário por causa do SSR que roda no servidor Node.js)
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  estaLogado(): boolean {
    return this.getToken() !== null;
  }

  getTipoUsuario(): TipoUsuario | null {
    const usuario = this.usuarioLogado();
    return usuario ? usuario.tipo : null;
  }

  // ─── Renovação de Token ────────────────────────────────────────────────────

  renovarToken(): Observable<AuthResponse> {
    // Quando o token de acesso expira (1h), usamos o refresh token para
    // pedir um novo sem precisar que o usuário faça login novamente.
    const refresh = typeof window !== 'undefined'
      ? localStorage.getItem(REFRESH_KEY)
      : null;

    return this.http.post<AuthResponse>(`${this.api}/token/refresh/`, { refresh }).pipe(
      tap(resposta => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, resposta.access);
        }
      })
    );
  }

  // ─── Métodos para carregar o perfil após login ─────────────────────────────
  // Depois que o token é obtido, buscamos os dados completos do usuário
  // para saber o nome, id e outras informações necessárias.

  carregarPerfilPai(id: number): Observable<Pais> {
    return this.http.get<Pais>(`${this.api}/pais/${id}/`).pipe(
      tap(pai => {
        this.atualizarUsuarioLogado({
          id: pai.paicodigo,
          nome: pai.painome,
          email: pai.paiemail,
          tipo: 'pai'
        });
      })
    );
  }

  carregarPerfilAluno(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.api}/alunos/${id}/`).pipe(
      tap(aluno => {
        this.atualizarUsuarioLogado({
          id: aluno.alucodigo,
          nome: aluno.alunome,
          email: aluno.aluemail,
          tipo: 'aluno'
        });
      })
    );
  }

  carregarPerfilNutricionista(id: number): Observable<Nutricionista> {
    return this.http.get<Nutricionista>(`${this.api}/nutricionistas/${id}/`).pipe(
      tap(nut => {
        this.atualizarUsuarioLogado({
          id: nut.nutcodigo,
          nome: nut.nutnome,
          email: nut.nutemail,
          tipo: 'nutricionista'
        });
      })
    );
  }

  // ─── Privados ─────────────────────────────────────────────────────────────

  private salvarSessao(resposta: AuthResponse, tipo: TipoUsuario): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, resposta.access);
    localStorage.setItem(REFRESH_KEY, resposta.refresh);
    // O tipo do usuário é salvo para saber para qual dashboard redirecionar
    localStorage.setItem(USUARIO_KEY, JSON.stringify({ tipo }));
  }

  private atualizarUsuarioLogado(usuario: UsuarioLogado): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
    }
    this.usuarioLogado.set(usuario);
  }

  private carregarUsuarioDoStorage(): UsuarioLogado | null {
    if (typeof window === 'undefined') return null;
    const dados = localStorage.getItem(USUARIO_KEY);
    return dados ? JSON.parse(dados) : null;
  }
}