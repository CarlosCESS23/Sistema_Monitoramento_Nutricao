import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TipoUsuario } from '../../../core/interfaces/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login-page.html',
})
export class LoginPage {
  // Signal controla qual card de perfil está selecionado
  // O valor inicial é 'pai' — primeiro card já ativo quando a página abre
  perfilSelecionado = signal<TipoUsuario>('pai');

  // Campos do formulário — ligados ao template com [(ngModel)]
  email = '';
  senha = '';

  // Controla se está carregando (desabilita o botão durante a requisição)
  carregando = signal(false);

  // Mensagem de erro exibida abaixo do formulário
  erro = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // Chamado quando usuário clica em um dos 3 cards de perfil
  selecionarPerfil(perfil: TipoUsuario): void {
    this.perfilSelecionado.set(perfil);
    this.erro.set(''); // limpa erro ao trocar de perfil
  }

  // Texto dinâmico do botão conforme perfil selecionado
  get labelBotao(): string {
    const labels: Record<string, string> = {
      pai: 'Entrar como Pai/Responsável',
      nutricionista: 'Entrar como Nutricionista',
    };
    return labels[this.perfilSelecionado()] ?? 'Entrar';
  }

  // Chamado ao submeter o formulário
  entrar(): void {
    if (!this.email || !this.senha) {
      this.erro.set('Preencha o email e a senha.');
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.authService
      .login({
        email: this.email,
        senha: this.senha,
        tipo: this.perfilSelecionado(),
      })
      .subscribe({
        next: () => {
          // Redireciona para o dashboard correto conforme o tipo
          const rotas: Record<string, string> = {
            pai: '/dashboard/pai',
            nutricionista: '/dashboard/nutricionista',
          };
          this.router.navigate([rotas[this.perfilSelecionado()] ?? '/login']);
        },
        error: (err) => {
          this.carregando.set(false);
          // O Django retorna 401 para credenciais inválidas
          if (err.status === 401) {
            this.erro.set('Email ou senha incorretos.');
          } else {
            this.erro.set('Erro ao conectar com o servidor. Tente novamente.');
          }
        },
      });
  }
}
