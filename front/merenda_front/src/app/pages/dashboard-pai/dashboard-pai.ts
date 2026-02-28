import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../environments/enviroments';

interface AlergiaFilho {
  resalu_codigo: number; // ID da relação no banco de dados para podermos deletar
  tipo: string;
}

interface Filho {
  alucodigo: number;
  alunome: string;
  alumatricula: string;
  alergias: AlergiaFilho[];
}

interface RefeicaoDetalhe {
  refcodigo: number;
  refnome: string;
  refdescricao?: string;
  refcalorias: number;
  refproteina: number;
  refcarboidrato: number;
  refgordura?: number;
  reffibra?: number;
  refimagem?: string;
  ingredientes: string[];
  alergenos: string[];
}

interface DiaCardapio {
  data: string;
  refeicoes: RefeicaoDetalhe[];
  temAlergenoParaFilho: boolean;
}

@Component({
  selector: 'app-dashboard-pai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-pai.html',
})
export class DashboardPaiPage implements OnInit {
  carregando = signal(true);
  paiNome = signal('');
  paiId = signal(0);

  filhos = signal<Filho[]>([]);
  filhoAtivo = signal<Filho | null>(null);

  // Lógica da Semana — semanaAtual como string simples para compatibilidade com ngModel
  semanaAtual = this.getSemanaAtualISO();

  get diasDaSemanaAtual() {
    const val = this.semanaAtual;
    if (!val) return [];
    const [anoStr, semStr] = val.split('-W');
    const ano = parseInt(anoStr, 10);
    const sem = parseInt(semStr, 10);

    // ISO 8601: semana 1 é a que contém a primeira quinta-feira do ano
    const jan4 = new Date(ano, 0, 4);
    const diaSemJan4 = jan4.getDay() || 7;
    const segunda = new Date(jan4);
    segunda.setDate(jan4.getDate() - diaSemJan4 + 1 + (sem - 1) * 7);

    const nomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(segunda);
      d.setDate(segunda.getDate() + i);
      return { data: d.toISOString().split('T')[0], diaSemana: nomes[i] };
    });
  }

  private _cardapios = signal<Map<string, DiaCardapio>>(new Map());
  refeicaoAtiva = signal<RefeicaoDetalhe | null>(null);

  // @deprecated - used for compat; real detail opens via refeicaoAtiva
  diaAberto = this.refeicaoAtiva;

  // Modal de Vincular Filho
  modalVinculoAberto = signal(false);
  matriculaBusca = signal('');
  erroVinculo = signal('');
  salvandoVinculo = signal(false);

  // ================= GERENCIAR ALERGIAS =================
  todasAlergias = signal<any[]>([]); // Guarda todas as alergias do sistema
  modalAlergiaAberto = signal(false);
  alergiaSelecionada = signal<number | null>(null);
  salvandoAlergia = signal(false);

  // ================= CADASTRAR FILHO =================
  modalCadastrarFilhoAberto = signal(false);
  erroCadastroFilho = signal('');
  salvandoCadastroFilho = signal(false);
  novoFilhoForm = {
    nome: '',
    email: '',
    cpf: '',
    matricula: '',
    idade: null as number | null,
  };

  alergiasDisponiveis = computed(() => {
    const filho = this.filhoAtivo();
    if (!filho) return [];
    // Filtra as alergias para mostrar apenas as que o filho AINDA NÃO TEM
    const nomesAlergiasFilho = filho.alergias.map((a) => a.tipo);
    return this.todasAlergias().filter((a) => !nomesAlergiasFilho.includes(a.aletipo));
  });

  private readonly api = environment.apiURL;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const u = this.auth.usuarioLogado();
    if (!u || u.tipo !== 'pai') {
      this.router.navigate(['/login']);
      return;
    }
    this.paiNome.set(u.nome);
    this.paiId.set(u.id);
    this.carregarTudo();
  }

  // Helpers de Data
  getSemanaAtualISO(): string {
    const hoje = new Date();
    // ISO 8601: usa a quinta-feira como referência da semana
    const quinta = new Date(hoje);
    quinta.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7) + 3); // quinta desta semana
    const inicioAno = new Date(quinta.getFullYear(), 0, 1);
    const semana = Math.ceil(((quinta.getTime() - inicioAno.getTime()) / 86400000 + 1) / 7);
    return `${quinta.getFullYear()}-W${semana.toString().padStart(2, '0')}`;
  }

  formatarData(dataStr: string): string {
    const [y, m, d] = dataStr.split('-');
    return `${d}/${m}`;
  }

  mudarSemana(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (val) {
      this.semanaAtual = val;
      this.carregarCardapios();
    }
  }

  fecharModal(): void {
    this.refeicaoAtiva.set(null);
  }
  abrirModalVinculo(): void {
    this.matriculaBusca.set('');
    this.erroVinculo.set('');
    this.modalVinculoAberto.set(true);
  }
  fecharModalVinculo(): void {
    this.modalVinculoAberto.set(false);
  }

  clicarRefeicao(ref: RefeicaoDetalhe): void {
    this.refeicaoAtiva.set(ref);
  }

  abrirModalCadastrarFilho(): void {
    this.novoFilhoForm = { nome: '', email: '', cpf: '', matricula: '', idade: null };
    this.erroCadastroFilho.set('');
    this.modalCadastrarFilhoAberto.set(true);
  }

  fecharModalCadastrarFilho(): void {
    this.modalCadastrarFilhoAberto.set(false);
  }

  async cadastrarFilho(): Promise<void> {
    const { nome, email, cpf, matricula, idade } = this.novoFilhoForm;
    if (!nome || !email || !cpf || !matricula || !idade) {
      this.erroCadastroFilho.set('Preencha todos os campos obrigatórios.');
      return;
    }
    this.salvandoCadastroFilho.set(true);
    this.erroCadastroFilho.set('');
    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      // 1. Cria o aluno (sem senha - sistema gera automaticamente)
      const novoAluno = await this.http
        .post<any>(
          `${this.api}/alunos/`,
          {
            alunome: nome,
            aluemail: email,
            alusenha: cpf, // usa CPF como senha padrão temporariamente
            alumatricula: matricula,
            alucpf: cpf,
            aluidade: idade,
          },
          { headers },
        )
        .toPromise();

      // 2. Vincula ao pai automaticamente
      await this.http
        .post(
          `${this.api}/pais/${this.paiId()}/adicionar_filho/`,
          { aluno_id: novoAluno.alucodigo },
          { headers },
        )
        .toPromise();

      this.fecharModalCadastrarFilho();
      this.carregando.set(true);
      await this.carregarTudo();
    } catch (e: any) {
      const erros = e?.error;
      if (erros?.alucpf) this.erroCadastroFilho.set('CPF inválido: ' + erros.alucpf[0]);
      else if (erros?.aluemail) this.erroCadastroFilho.set('Email inválido: ' + erros.aluemail[0]);
      else if (erros?.erro) this.erroCadastroFilho.set(erros.erro);
      else this.erroCadastroFilho.set('Erro ao cadastrar. Verifique os dados.');
    } finally {
      this.salvandoCadastroFilho.set(false);
    }
  }

  trocarFilho(filho: Filho): void {
    this.filhoAtivo.set(filho);
    this.refeicaoAtiva.set(null);
    this.carregarCardapios();
  }

  sair(): void {
    this.auth.logout();
  }
  urlImg(ref: RefeicaoDetalhe): string {
    if (!ref.refimagem) return '';
    return ref.refimagem.startsWith('http')
      ? ref.refimagem
      : `http://localhost:9000${ref.refimagem}`;
  }

  // ================= AÇÕES DE ALERGIA =================
  abrirModalAlergia() {
    this.alergiaSelecionada.set(null);
    this.modalAlergiaAberto.set(true);
  }

  fecharModalAlergia() {
    this.modalAlergiaAberto.set(false);
  }

  async adicionarAlergia() {
    const filho = this.filhoAtivo();
    const aleId = this.alergiaSelecionada();
    if (!filho || !aleId) return;

    this.salvandoAlergia.set(true);
    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      await this.http
        .post(
          `${this.api}/restricoes-alunos/`,
          {
            resalu_alucodigo: filho.alucodigo,
            resalu_alecodigo: aleId,
          },
          { headers },
        )
        .toPromise();

      this.fecharModalAlergia();
      this.carregando.set(true);
      await this.carregarTudo(); // Recarrega tudo para atualizar o cardápio
    } catch (e) {
      console.error(e);
      alert('Erro ao adicionar alergia.');
    } finally {
      this.salvandoAlergia.set(false);
    }
  }

  async removerAlergia(resalu_codigo: number) {
    if (!confirm('Tem certeza que deseja remover esta alergia do seu filho?')) return;

    this.carregando.set(true);
    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      await this.http
        .delete(`${this.api}/restricoes-alunos/${resalu_codigo}/`, { headers })
        .toPromise();
      await this.carregarTudo();
    } catch (e) {
      console.error(e);
      alert('Erro ao remover alergia.');
      this.carregando.set(false);
    }
  }

  // API Calls
  async vincularFilho(): Promise<void> {
    if (!this.matriculaBusca().trim()) {
      this.erroVinculo.set('Digite a matrícula do aluno.');
      return;
    }
    this.salvandoVinculo.set(true);
    this.erroVinculo.set('');

    try {
      const alunos = await this.get<any[]>('/alunos/');
      const aluno = alunos.find((a) => a.alumatricula === this.matriculaBusca().trim());

      if (!aluno) {
        this.erroVinculo.set('Nenhum aluno encontrado com essa matrícula.');
        this.salvandoVinculo.set(false);
        return;
      }
      if (aluno.alupaicodigo) {
        this.erroVinculo.set('Este aluno já possui um responsável vinculado.');
        this.salvandoVinculo.set(false);
        return;
      }

      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      await this.http
        .post(
          `${this.api}/pais/${this.paiId()}/adicionar_filho/`,
          { aluno_id: aluno.alucodigo },
          { headers },
        )
        .toPromise();

      this.fecharModalVinculo();
      this.carregando.set(true);
      await this.carregarTudo();
    } catch (e: any) {
      this.erroVinculo.set(e.error?.erro || 'Erro ao vincular. Verifique a matrícula.');
      this.salvandoVinculo.set(false);
    }
  }

  private async carregarTudo(): Promise<void> {
    try {
      const [alunos, restricoes, alergias] = await Promise.all([
        this.get<any[]>(`/alunos/?pai=${this.paiId()}`),
        this.get<any[]>('/restricoes-alunos/'),
        this.get<any[]>('/alergias/'),
      ]);

      this.todasAlergias.set(alergias); // Salva para o Modal de adicionar

      const alergiaMap = new Map<number, string>(
        alergias.map((a: any) => [a.alecodigo, a.aletipo]),
      );
      const alunoAlergias = new Map<number, AlergiaFilho[]>();

      restricoes.forEach((r: any) => {
        if (!alunoAlergias.has(r.resalu_alucodigo)) alunoAlergias.set(r.resalu_alucodigo, []);
        const tipo = alergiaMap.get(r.resalu_alecodigo);
        if (tipo) {
          alunoAlergias.get(r.resalu_alucodigo)!.push({
            resalu_codigo: r.resalu_codigo,
            tipo: tipo,
          });
        }
      });

      const filhos: Filho[] = alunos.map((a: any) => ({
        alucodigo: a.alucodigo,
        alunome: a.alunome,
        alumatricula: a.alumatricula,
        alergias: alunoAlergias.get(a.alucodigo) || [],
      }));

      this.filhos.set(filhos);
      if (filhos.length > 0 && !this.filhoAtivo()) {
        this.filhoAtivo.set(filhos[0]);
      } else if (filhos.length > 0) {
        // Atualiza os dados do filho já ativo (para refletir alergias novas)
        const ativoAtualizado = filhos.find((f) => f.alucodigo === this.filhoAtivo()?.alucodigo);
        if (ativoAtualizado) this.filhoAtivo.set(ativoAtualizado);
      }

      await this.carregarCardapios();
    } catch (e) {
      console.error(e);
    } finally {
      this.carregando.set(false);
      this.salvandoVinculo.set(false);
    }
  }

  getCardapioDia(data: string): DiaCardapio | undefined {
    return this._cardapios().get(data);
  }

  private async carregarCardapios(): Promise<void> {
    const filho = this.filhoAtivo();

    try {
      const [cardapios, ingredientes, restricoesAlim, alergias] = await Promise.all([
        this.get<any[]>('/cardapios/'),
        this.get<any[]>('/ingredientes/'),
        this.get<any[]>('/restricoes-alimentares/'),
        this.get<any[]>('/alergias/'),
      ]);

      // Mapa: ingcodigo → nome
      const ingMap = new Map<number, string>(
        ingredientes.map((i: any) => [i.ingcodigo, i.ingtipo]),
      );

      // Alergias do filho ativo
      const alergiaDoFilho = new Set<string>();
      if (filho) filho.alergias.forEach((a) => alergiaDoFilho.add(a.tipo));

      // Mapa: alecodigo → tipo
      const alergiaMap = new Map<number, string>(
        alergias.map((a: any) => [a.alecodigo, a.aletipo]),
      );

      // IDs de ingredientes que causam alergia no filho
      const ingAlergenicoIds = new Set<number>();
      restricoesAlim.forEach((ra: any) => {
        const aleTipo = alergiaMap.get(ra.resali_alicodigo);
        if (aleTipo && alergiaDoFilho.has(aleTipo)) ingAlergenicoIds.add(ra.resali_ingcodigo);
      });

      const mapa = new Map<string, DiaCardapio>();

      cardapios.forEach((card: any) => {
        const dataISO = card.cardata?.split('T')[0];
        if (!dataISO) return;

        const refsVistas = new Set<number>(); // evita duplicatas de refeição no mesmo dia

        const refs: RefeicaoDetalhe[] = (card.refeicoes || [])
          .map((cr: any) => {
            // Usa os dados já aninhados pelo serializer — ignora active filter
            const ref = cr.carref_refcodigo_detalhes;
            if (!ref) return null;
            if (refsVistas.has(ref.refcodigo)) return null; // deduplicar
            refsVistas.add(ref.refcodigo);

            // IDs de ingredientes (deduplica com Set)
            const ingsIds = [...new Set<number>(ref.refingredientes || [])];
            const ingredientesNomes = ingsIds.map((id) => ingMap.get(id) || '').filter(Boolean);

            // Alergenos: ingredientes da refeição que causam alergia no filho
            const alergenos = ingsIds
              .filter((id) => ingAlergenicoIds.has(id))
              .map((id) => ingMap.get(id) || '')
              .filter(Boolean);

            return {
              refcodigo: ref.refcodigo,
              refnome: ref.refnome,
              refcalorias: ref.refcalorias,
              refproteina: ref.refproteina,
              refcarboidrato: ref.refcarboidrato,
              refimagem: ref.refimagem,
              ingredientes: ingredientesNomes,
              alergenos,
            } as RefeicaoDetalhe;
          })
          .filter(Boolean) as RefeicaoDetalhe[];

        mapa.set(dataISO, {
          data: dataISO,
          refeicoes: refs,
          temAlergenoParaFilho: refs.some((r) => r.alergenos.length > 0),
        });
      });

      this._cardapios.set(mapa);
    } catch (e) {
      console.error('Erro ao carregar cardápios', e);
    }
  }

  private get<T>(path: string): Promise<T> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    return this.http.get<T>(`${this.api}${path}`, { headers }).toPromise() as Promise<T>;
  }
}
