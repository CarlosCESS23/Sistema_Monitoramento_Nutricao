import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/enviroments';
import { LoginPayload, AuthResponse, UsuarioLogado, TipoUsuario } from '../interfaces/models';

const TOKEN_KEY   = 'merenda_access_token';
const REFRESH_KEY = 'merenda_refresh_token';
const USUARIO_KEY = 'merenda_usuario';

// O backend retorna esses campos extras junto com os tokens
interface LoginResponse extends AuthResponse {
  tipo:  TipoUsuario;
  id:    number;
  nome:  string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Signal inicializado a partir do localStorage (persiste entre reloads)
  usuarioLogado = signal<UsuarioLogado | null>(this._lerUsuarioDoStorage());

  private readonly api = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}

  // ── Login ─────────────────────────────────────────────────────────────────

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/token/`, {
      email:    payload.email,
      password: payload.senha,   // Django espera 'password'
      tipo:     payload.tipo,
    }).pipe(
      tap(resposta => this._salvarSessao(resposta))
    );
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USUARIO_KEY);
    }
    this.usuarioLogado.set(null);   // ← limpa o signal imediatamente
    this.router.navigate(['/login']);
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  estaLogado(): boolean {
    return this.getToken() !== null;
  }

  getTipoUsuario(): TipoUsuario | null {
    return this.usuarioLogado()?.tipo ?? null;
  }

  // ── Renovação de Token ─────────────────────────────────────────────────────

  renovarToken(): Observable<AuthResponse> {
    const refresh = typeof window !== 'undefined'
      ? localStorage.getItem(REFRESH_KEY) : null;

    return this.http.post<AuthResponse>(`${this.api}/token/refresh/`, { refresh }).pipe(
      tap(res => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, res.access);
        }
      })
    );
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  private _salvarSessao(resposta: LoginResponse): void {
    if (typeof window === 'undefined') return;

    // Salva tokens
    localStorage.setItem(TOKEN_KEY, resposta.access);
    localStorage.setItem(REFRESH_KEY, resposta.refresh);

    // Monta o objeto do usuário com os dados que o backend retorna no login
    const usuario: UsuarioLogado = {
      id:    resposta.id,
      nome:  resposta.nome,
      email: resposta.email,
      tipo:  resposta.tipo,
    };

    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));

    // ✅ CRUCIAL: atualiza o signal para que o dashboard leia o usuário correto
    this.usuarioLogado.set(usuario);
  }

  private _lerUsuarioDoStorage(): UsuarioLogado | null {
    if (typeof window === 'undefined') return null;
    const dados = localStorage.getItem(USUARIO_KEY);
    return dados ? JSON.parse(dados) : null;
  }
}