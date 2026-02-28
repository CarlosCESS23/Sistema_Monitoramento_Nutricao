import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../environments/enviroments';

interface DiaSemana { data: string; diaSemana: string; }

@Component({
  selector: 'app-dashboard-nutricionista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-nutricionista.html',
})
export class DashboardNutricionistaPage implements OnInit {

  // ================= ESTADO GLOBAL =================
  carregando = signal(true);
  nutricionistaNome = signal('');
  nutricionistaId = signal(0);
  abaSelecionada = signal<'dashboard' | 'refeicoes' | 'cardapio'>('dashboard');
  private readonly api = environment.apiURL;

  // ================= DADOS DA API =================
  alunos = signal<any[]>([]);
  alergias = signal<any[]>([]);
  restricoesAlunos = signal<any[]>([]);
  refeicoes = signal<any[]>([]);
  todosIngredientes = signal<any[]>([]);
  
  // Dados do Cardápio
  cardapios = signal<any[]>([]);
  cardapioRefeicoes = signal<any[]>([]);

  // ================= COMPUTEDS (DASHBOARD) =================
  totalAlunos = computed(() => this.alunos().length);
  termoBusca = signal('');
  
  alunosFiltrados = computed(() => {
    const t = this.termoBusca().toLowerCase();
    return this.alunos().filter(a => a.alunome.toLowerCase().includes(t) || a.alumatricula.includes(t));
  });

  totalComAlergias = computed(() => {
    const alunosComAlergia = new Set(this.restricoesAlunos().map(r => r.resalu_alucodigo));
    return alunosComAlergia.size;
  });

  totalTiposAlergias = computed(() => this.alergias().length);
  
  alergiaStats = computed(() => {
    const contagem = new Map<number, number>();
    this.restricoesAlunos().forEach(r => {
      const idAlergia = r.resalu_alecodigo;
      contagem.set(idAlergia, (contagem.get(idAlergia) || 0) + 1);
    });
    
    const cores = ['#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6'];
    let idx = 0;

    return Array.from(contagem.entries()).map(([id, total]) => {
      const obj = this.alergias().find(a => a.alecodigo === id);
      return {
        tipo: obj ? obj.aletipo : 'Desconhecida',
        total,
        cor: cores[idx++ % cores.length]
      };
    }).sort((a, b) => b.total - a.total);
  });

  maxAlergiaTotal = computed(() => {
    const stats = this.alergiaStats();
    if (stats.length === 0) return 1;
    return Math.max(...stats.map(s => s.total));
  });

  // ================= LÓGICA DE DATAS (CARDÁPIO) =================
  semanaAtual = signal(this.getSemanaAtualISO());

  diasDaSemanaAtual = computed<DiaSemana[]>(() => {
    if (!this.semanaAtual()) return [];
    const [anoStr, semanaStr] = this.semanaAtual().split('-W');
    const ano = parseInt(anoStr, 10);
    const semana = parseInt(semanaStr, 10);

    const simples = new Date(ano, 0, 1 + (semana - 1) * 7);
    const diaSemana = simples.getDay();
    const inicioSemana = new Date(simples);
    inicioSemana.setDate(simples.getDate() - diaSemana + 1); 

    const dias = [];
    const nomesDias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    
    for (let i = 0; i < 5; i++) {
      const data = new Date(inicioSemana);
      data.setDate(inicioSemana.getDate() + i);
      dias.push({ data: data.toISOString().split('T')[0], diaSemana: nomesDias[i] });
    }
    return dias;
  });

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const u = this.auth.usuarioLogado();
    if (!u || u.tipo !== 'nutricionista') { this.router.navigate(['/login']); return; }
    this.nutricionistaNome.set(u.nome);
    this.nutricionistaId.set(u.id);
    this.carregarTudo();
  }

  // ================= NAVEGAÇÃO =================
  selecionarAba(abaId: string): void {
    const idCorreto = abaId as 'dashboard' | 'refeicoes' | 'cardapio';
    this.abaSelecionada.set(idCorreto);
  }

  sair(): void { this.auth.logout(); }

  // ================= INTEGRAÇÃO API =================
  private async carregarTudo(): Promise<void> {
    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      
      const [alunos, alergias, resAlunos, refs, ings, cards, cRefs] = await Promise.all([
        this.http.get<any[]>(`${this.api}/alunos/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/alergias/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/restricoes-alunos/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/refeicoes/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/ingredientes/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/cardapios/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/cardapio-refeicoes/`, {headers}).toPromise(),
      ]);

      this.alunos.set(alunos || []);
      this.alergias.set(alergias || []);
      this.restricoesAlunos.set(resAlunos || []);
      this.refeicoes.set(refs || []);
      this.todosIngredientes.set(ings || []);
      this.cardapios.set(cards || []);
      this.cardapioRefeicoes.set(cRefs || []);
    } catch(e) {
      console.error('Erro ao carregar dados', e);
    } finally {
      this.carregando.set(false);
    }
  }

  // ================= GERENCIAMENTO DO CARDÁPIO (A MÁGICA AQUI) =================
  modalCardapioAberto = signal(false);
  diaEditando = signal<DiaSemana | null>(null);
  refsSelecionadas = signal<Set<number>>(new Set());
  salvandoCardapio = signal(false);

  getRefeicoesDoDia(data: string): any[] {
    const card = this.cardapios().find(c => c.cardata.startsWith(data));
    if (!card) return [];
    const links = this.cardapioRefeicoes().filter(cr => cr.carref_carcodigo === card.carcodigo);
    return links.map(cr => this.refeicoes().find(r => r.refcodigo === cr.carref_refcodigo)).filter(Boolean);
  }

  abrirModalCardapio(dia: DiaSemana) {
    this.diaEditando.set(dia);
    const selecionadas = new Set<number>();
    
    // Procura se já tem cardápio salvo para este dia
    const card = this.cardapios().find(c => c.cardata.startsWith(dia.data));
    if (card) {
      const links = this.cardapioRefeicoes().filter(cr => cr.carref_carcodigo === card.carcodigo);
      links.forEach(cr => selecionadas.add(cr.carref_refcodigo));
    }
    
    this.refsSelecionadas.set(selecionadas);
    this.modalCardapioAberto.set(true);
  }

  fecharModalCardapio() {
    this.modalCardapioAberto.set(false);
    this.diaEditando.set(null);
  }

  toggleRefCardapio(refcodigo: number) {
    const set = new Set(this.refsSelecionadas());
    if (set.has(refcodigo)) set.delete(refcodigo);
    else set.add(refcodigo);
    this.refsSelecionadas.set(set);
  }

  async salvarCardapioDia() {
    this.salvandoCardapio.set(true);
    const dia = this.diaEditando();
    if (!dia) return;

    try {
      const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
      let card = this.cardapios().find(c => c.cardata.startsWith(dia.data));

      // 1. Cria o cardápio no Django se for a primeira vez neste dia
      if (!card) {
        const payload = { cardata: `${dia.data}T12:00:00Z` };
        card = await this.http.post<any>(`${this.api}/cardapios/`, payload, {headers}).toPromise();
      }

      const linksAtuais = this.cardapioRefeicoes().filter(cr => cr.carref_carcodigo === card.carcodigo);
      const refIdsAtuais = new Set(linksAtuais.map(cr => cr.carref_refcodigo));
      const refIdsNovas = this.refsSelecionadas();
      let sofreuModificacao = false;

      // 2. Adiciona as refeições marcadas
      for (const refId of refIdsNovas) {
        if (!refIdsAtuais.has(refId)) {
          await this.http.post(`${this.api}/cardapio-refeicoes/`, { carref_carcodigo: card.carcodigo, carref_refcodigo: refId }, {headers}).toPromise();
          sofreuModificacao = true;
        }
      }

      // 3. Remove as refeições desmarcadas
      for (const link of linksAtuais) {
        if (!refIdsNovas.has(link.carref_refcodigo)) {
          await this.http.delete(`${this.api}/cardapio-refeicoes/${link.carrefcodigo}/`, {headers}).toPromise();
          sofreuModificacao = true;
        }
      }

      // 4. GATILHO: Dispara o 'perform_update' do Django para gerar os Alertas aos Pais!
      if (sofreuModificacao) {
        await this.http.patch(`${this.api}/cardapios/${card.carcodigo}/`, { cardata: card.cardata }, {headers}).toPromise();
      }

      // 5. Atualiza a tela
      const [cards, cRefs] = await Promise.all([
        this.http.get<any[]>(`${this.api}/cardapios/`, {headers}).toPromise(),
        this.http.get<any[]>(`${this.api}/cardapio-refeicoes/`, {headers}).toPromise(),
      ]);
      this.cardapios.set(cards || []);
      this.cardapioRefeicoes.set(cRefs || []);

      this.fecharModalCardapio();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar o cardápio. Verifique o console.");
    } finally {
      this.salvandoCardapio.set(false);
    }
  }

  // ================= HELPERS GERAIS =================
  getSemanaAtualISO(): string {
    const hoje = new Date();
    const primeiroDiaAno = new Date(hoje.getFullYear(), 0, 1);
    const dias = Math.floor((hoje.getTime() - primeiroDiaAno.getTime()) / 86400000);
    const semana = Math.ceil((hoje.getDay() + 1 + dias) / 7);
    return `${hoje.getFullYear()}-W${semana.toString().padStart(2, '0')}`;
  }

  formatarData(dataStr: string): string {
    const [y, m, d] = dataStr.split('-');
    return `${d}/${m}`;
  }

  urlImagem(ref: any): string {
    if (!ref.refimagem) return '';
    return ref.refimagem.startsWith('http') ? ref.refimagem : `http://localhost:9000${ref.refimagem}`;
  }

  // ================= MÉTODOS ORIGINAIS DE REFEIÇÃO =================
  modalRefeicaoAberto = signal(false);
  salvandoRefeicao = signal(false);
  novaRefeicao = { refnome: '', refcalorias: null, refproteina: null, refcarboidrato: null, _imagemPreview: null as string | null };

  abrirModalNovaRefeicao() { this.modalRefeicaoAberto.set(true); }
  fecharModal() { this.modalRefeicaoAberto.set(false); }
  onImagemSelecionada(e: any) {}
  salvarRefeicao() {}
  toggleIngrediente(id: number) {}
  ingredienteSelecionado(id: number) { return false; }
}