import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaisService } from '../../../core/services/pais';
import { AlunoService } from '../../../core/services/aluno';
import { NutricionistaService } from '../../../core/services/nutricionista';
import { TipoUsuario } from '../../../core/interfaces/models';

interface FilhoForm {
  nome: string;
  serie: string;
  alergias: string[];
}

const ALERGIAS_DISPONIVEIS = [
  'Glúten',
  'Lactose',
  'Amendoim',
  'Frutos do Mar',
  'Ovo',
  'Soja',
  'Nozes',
  'Corantes',
];

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registro-page.html',
})
export class RegistroPage {
  abaSelecionada = signal<TipoUsuario>('pai');
  carregando = signal(false);
  erro = signal('');
  readonly alergias = ALERGIAS_DISPONIVEIS;

  // ── Formulário do Pai ────────────────────────────────────────
  paiForm = {
    nome: '',
    email: '',
    cpf: '', // ✅ campo CPF — formato: 000.000.000-00
    telefone: '',
    senha: '',
  };

  filhos: FilhoForm[] = [{ nome: '', serie: '', alergias: [] }];

  // ── Formulário do Aluno ──────────────────────────────────────
  alunoForm = {
    nome: '',
    email: '',
    cpf: '',
    idade: null as number | null,
    matricula: '', // Substituído de 'serie' para 'matricula'
    senha: '',
    nomeResponsavel: '',
    alergias: [] as string[],
  };

  // ── Formulário do Nutricionista ──────────────────────────────
  nutricionistaForm = {
    nome: '',
    email: '',
    crn: '',
    escola: '',
    senha: '',
  };

  constructor(
    private paisService: PaisService,
    private alunoService: AlunoService,
    private nutricionistaService: NutricionistaService,
    private router: Router,
  ) {}

  selecionarAba(aba: TipoUsuario): void {
    this.abaSelecionada.set(aba);
    this.erro.set('');
  }

  adicionarFilho(): void {
    this.filhos.push({ nome: '', serie: '', alergias: [] });
  }

  removerFilho(index: number): void {
    if (this.filhos.length > 1) {
      this.filhos.splice(index, 1);
    }
  }

  toggleAlergiaFilho(filho: FilhoForm, alergia: string): void {
    const idx = filho.alergias.indexOf(alergia);
    idx === -1 ? filho.alergias.push(alergia) : filho.alergias.splice(idx, 1);
  }

  toggleAlergiaAluno(alergia: string): void {
    const idx = this.alunoForm.alergias.indexOf(alergia);
    idx === -1 ? this.alunoForm.alergias.push(alergia) : this.alunoForm.alergias.splice(idx, 1);
  }

  cadastrar(): void {
    this.erro.set('');
    this.carregando.set(true);
    const aba = this.abaSelecionada();
    if (aba === 'pai') this.cadastrarPai();
    else if (aba === 'aluno') this.cadastrarAluno();
    else this.cadastrarNutricionista();
  }

  private cadastrarPai(): void {
    const { nome, email, senha, cpf } = this.paiForm;

    if (!nome || !email || !senha || !cpf) {
      this.erro.set('Preencha todos os campos obrigatórios, incluindo o CPF.');
      this.carregando.set(false);
      return;
    }

    this.paisService
      .cadastrar({
        painome: nome,
        paiemail: email,
        paisenha: senha,
        paicpf: cpf, // ✅ CPF real enviado
      })
      .subscribe({
        next: () => {
          this.carregando.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.carregando.set(false);
          // Mostra o erro específico do Django se existir
          const erros = err.error;
          if (erros?.paicpf) this.erro.set('CPF inválido: ' + erros.paicpf[0]);
          else if (erros?.paiemail) this.erro.set('Email inválido: ' + erros.paiemail[0]);
          else this.erro.set('Erro ao criar conta. Verifique os dados.');
        },
      });
  }

  private cadastrarAluno(): void {
    const { nome, email, senha, cpf, matricula, idade } = this.alunoForm; // Aqui também

    if (!nome || !email || !senha || !cpf || !idade || !matricula) {
      this.erro.set(
        'Preencha todos os campos obrigatórios (Nome, Email, Senha, CPF, Idade, Matrícula).',
      );
      this.carregando.set(false);
      return;
    }

    this.alunoService
      .cadastrar({
        alunome: nome,
        aluemail: email,
        alusenha: senha,
        alumatricula: matricula,
        aluidade: idade,
        alucpf: cpf, // ✅ CPF real enviado
      })
      .subscribe({
        next: () => {
          this.carregando.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.carregando.set(false);
          const erros = err.error;
          if (erros?.alucpf) this.erro.set('CPF inválido: ' + erros.alucpf[0]);
          else if (erros?.aluemail) this.erro.set('Email inválido: ' + erros.aluemail[0]);
          else this.erro.set('Erro ao criar conta. Verifique os dados.');
        },
      });
  }

  private cadastrarNutricionista(): void {
    const { nome, email, senha } = this.nutricionistaForm;

    if (!nome || !email || !senha) {
      this.erro.set('Preencha nome, email e senha.');
      this.carregando.set(false);
      return;
    }

    this.nutricionistaService
      .cadastrar({
        nutnome: nome,
        nutemail: email,
        nutsenha: senha,
      })
      .subscribe({
        next: () => {
          this.carregando.set(false);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.carregando.set(false);
          const erros = err.error;
          if (erros?.nutemail) this.erro.set('Email inválido: ' + erros.nutemail[0]);
          else this.erro.set('Erro ao criar conta. Verifique os dados.');
        },
      });
  }
}
