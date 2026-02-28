import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../environments/enviroments';

interface Filho {
  alucodigo: number;
  alunome: string;
  alumatricula: string;
  alergias: string[];
}

interface RefeicaoDetalhe {
  refcodigo: number;
  refnome: string;
  refcalorias: number;
  refproteina: number;
  refcarboidrato: number;
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
  imports: [CommonModule, FormsModule], // <-- FormsModule adicionado aqui!
  templateUrl: './dashboard-pai.html',
})
export class DashboardPaiPage implements OnInit {

  carregando = signal(true);
  paiNome    = signal('');
  paiId      = signal(0);

  filhos      = signal<Filho[]>([]);
  filhoAtivo  = signal<Filho | null>(null);

  // Lógica da Semana (Substituindo o Mês)
  semanaAtual = signal(this.getSemanaAtualISO());
  
  diasDaSemanaAtual = computed(() => {
    if (!this.semanaAtual()) return [];
    const [anoStr, semanaStr] = this.semanaAtual().split('-W');
    const ano = parseInt(anoStr, 10);
    const semana = parseInt(semanaStr, 10);

    const simples = new Date(ano, 0, 1 + (semana - 1) * 7);
    const diaSemana = simples.getDay();
    const inicioSemana = new Date(simples);
    inicioSemana.setDate(simples.getDate() - diaSemana + 1); // Força para Segunda-feira

    const dias = [];
    const nomesDias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    
    // Gera apenas de Segunda a Sexta
    for (let i = 0; i < 5; i++) {
      const data = new Date(inicioSemana);
      data.setDate(inicioSemana.getDate() + i);
      dias.push({
        data: data.toISOString().split('T')[0],
        diaSemana: nomesDias[i]
      });
    }
    return dias;
  });

  private _cardapios = signal<Map<string, DiaCardapio>>(new Map());

  // Modal de Detalhe da Refeição
  diaSelecionado = signal<string | null>(null);
  diaAberto = computed<DiaCardapio | null>(() => {
    const data = this.diaSelecionado();
    if (!data) return null;
    return this._cardapios().get(data) ?? null;
  });

  // Modal de Vincular Filho
  modalVinculoAberto = signal(false);
  matriculaBusca = signal('');
  erroVinculo = signal('');
  salvandoVinculo = signal(false);

  private readonly api = environment.apiURL;

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const u = this.auth.usuarioLogado();
    if (!u || u.tipo !== 'pai') { this.router.navigate(['/login']); return; }
    this.paiNome.set(u.nome);
    this.paiId.set(u.id);
    this.carregarTudo();
  }

  // Helpers de Data
  getSemanaAtualISO(): string {
    const hoje = new Date();
    const primeiroDiaAno = new Date(hoje.getFullYear(), 0, 1);
    const dias = Math.floor((hoje.getTime() - primeiroDiaAno.getTime()) / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((hoje.getDay() + 1 + dias) / 7);
    return `${hoje.getFullYear()}-W${semana.toString().padStart(2, '0')}`;
  }

  formatarData(dataStr: string): string {
    const [y, m, d] = dataStr.split('-');
    return `${d}/${m}`;
  }

  // Interações
  clicarDia(data: string): void {
    const cardapio = this._cardapios().get(data);
    if (cardapio) this.diaSelecionado.set(data);
  }

  fecharModal(): void { this.diaSelecionado.set(null); }
  
  abrirModalVinculo(): void { 
    this.matriculaBusca.set('');
    this.erroVinculo.set('');
    this.modalVinculoAberto.set(true); 
  }
  
  fecharModalVinculo(): void { this.modalVinculoAberto.set(false); }

  trocarFilho(filho: Filho): void {
    this.filhoAtivo.set(filho);
    this.diaSelecionado.set(null);
    this.carregarCardapios();
  }

  sair(): void { this.auth.logout(); }

  urlImg(ref: RefeicaoDetalhe): string {
    if (!ref.refimagem) return '';
    return ref.refimagem.startsWith('http') ? ref.refimagem : `http://localhost:9000${ref.refimagem}`;
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
      // 1. Busca todos os alunos e acha pela matrícula
      const alunos = await this.get<any[]>('/alunos/');
      const aluno = alunos.find(a => a.alumatricula === this.matriculaBusca().trim());

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

      // 2. Faz o POST para o endpoint do backend
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      await this.http.post(
        `${this.api}/pais/${this.paiId()}/adicionar_filho/`, 
        { aluno_id: aluno.alucodigo }, 
        { headers }
      ).toPromise();

      // Sucesso!
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

      const alergiaMap = new Map<number, string>(alergias.map((a: any) => [a.alecodigo, a.aletipo]));
      const alunoAlergias = new Map<number, string[]>();
      
      restricoes.forEach((r: any) => {
        if (!alunoAlergias.has(r.resalu_alucodigo)) alunoAlergias.set(r.resalu_alucodigo, []);
        const tipo = alergiaMap.get(r.resalu_alecodigo);
        if (tipo) alunoAlergias.get(r.resalu_alucodigo)!.push(tipo);
      });

      const filhos: Filho[] = alunos.map((a: any) => ({
        alucodigo: a.alucodigo,
        alunome: a.alunome,
        alumatricula: a.alumatricula,
        alergias: alunoAlergias.get(a.alucodigo) || [],
      }));

      this.filhos.set(filhos);
      if (filhos.length > 0) this.filhoAtivo.set(filhos[0]);
      
      await this.carregarCardapios();
    } catch(e) {
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
      const [cardapios, refeicoes, refIngredientes, ingredientes, restricoesAlim, alergias, restricoesAlunos] = await Promise.all([
        this.get<any[]>('/cardapios/'),
        this.get<any[]>('/refeicoes/'),
        this.get<any[]>('/refeicao-ingredientes/'),
        this.get<any[]>('/ingredientes/'),
        this.get<any[]>('/restricoes-alimentares/'),
        this.get<any[]>('/alergias/'),
        this.get<any[]>('/restricoes-alunos/'),
      ]);

      const ingMap        = new Map<number, string>(ingredientes.map((i: any) => [i.ingcodigo, i.ingtipo]));
      const alergiaMap    = new Map<number, string>(alergias.map((a: any) => [a.alecodigo, a.aletipo]));
      const refeicaoMap   = new Map<number, any>(refeicoes.map((r: any) => [r.refcodigo, r]));

      const alergiaDoFilho = new Set<string>();
      if (filho) {
        restricoesAlunos
          .filter((r: any) => r.resalu_alucodigo === filho.alucodigo)
          .forEach((r: any) => {
            const t = alergiaMap.get(r.resalu_alecodigo);
            if (t) alergiaDoFilho.add(t);
          });
      }

      const ingAlergenicoIds = new Set<number>();
      restricoesAlim.forEach((ra: any) => {
        const aleTipo = alergiaMap.get(ra.resali_alicodigo);
        if (aleTipo && alergiaDoFilho.has(aleTipo)) ingAlergenicoIds.add(ra.resali_ingcodigo);
      });

      const ingPorRef = new Map<number, number[]>();
      refIngredientes.forEach((ri: any) => {
        if (!ingPorRef.has(ri.refingrefcodigo)) ingPorRef.set(ri.refingrefcodigo, []);
        ingPorRef.get(ri.refingrefcodigo)!.push(ri.refingingcodigo);
      });

      const mapa = new Map<string, DiaCardapio>();

      cardapios.forEach((card: any) => {
        const dataISO = card.cardata?.split('T')[0];
        if (!dataISO) return;

        const refs: RefeicaoDetalhe[] = (card.refeicoes || []).map((cr: any) => {
          const refId = cr.carref_refcodigo;
          const ref = refeicaoMap.get(refId);
          if (!ref) return null;

          const ingsIds = ingPorRef.get(refId) || [];
          const ingredientesNomes = ingsIds.map((id: number) => ingMap.get(id) || '').filter(Boolean);
          const alergenos = ingsIds
            .filter((id: number) => ingAlergenicoIds.has(id))
            .map((id: number) => ingMap.get(id) || '').filter(Boolean);

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
        }).filter(Boolean);

        mapa.set(dataISO, {
          data: dataISO,
          refeicoes: refs,
          temAlergenoParaFilho: refs.some(r => r.alergenos.length > 0),
        });
      });

      this._cardapios.set(mapa);
    } catch(e) {
      console.error('Erro ao carregar cardápios', e);
    }
  }

  private get<T>(path: string): Promise<T> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    return this.http.get<T>(`${this.api}${path}`, { headers }).toPromise() as Promise<T>;
  }
}