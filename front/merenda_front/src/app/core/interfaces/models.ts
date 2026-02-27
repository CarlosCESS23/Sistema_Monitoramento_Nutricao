// Interfaces são como "contratos" — elas dizem ao TypeScript exatamente
// quais campos um objeto deve ter e qual o tipo de cada campo.
// Isso garante que se a API retornar algo inesperado, o TypeScript avisa antes de quebrar.

// ─── Auth ──────────────────────────────────────────────────────────────────────

// Tipos de usuário possíveis no sistema
export type TipoUsuario = 'pai' | 'aluno' | 'nutricionista';

// O que enviamos para o login
export interface LoginPayload {
  email: string;
  senha: string;
  tipo: TipoUsuario;
}

// O que o Django retorna após o login bem-sucedido (JWT)
export interface AuthResponse {
  access: string;   // token de acesso (expira em 1h)
  refresh: string;  // token de renovação (expira em 7 dias)
}

// O que guardamos no localStorage para saber quem está logado
export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

// ─── Pais ──────────────────────────────────────────────────────────────────────

export interface Pais {
  paicodigo: number;
  painome: string;
  paiemail: string;
  paicpf: string;       // formato 000.000.000-00
  active: boolean;
  create_at?: string;
  modified_at?: string;
  // paisenha nunca vem da API (write_only no serializer)
}

// Payload para criar um novo pai — inclui senha, não inclui campos gerados automaticamente
export interface CriarPaisPayload {
  painome: string;
  paiemail: string;
  paisenha: string;
  paicpf: string;
}

// ─── Aluno ─────────────────────────────────────────────────────────────────────

export interface Aluno {
  alucodigo: number;
  alunome: string;
  aluemail: string;
  alumatricula: string;
  alucpf: string;
  alupaicodigo?: number | null;         // opcional — aluno pode não ter pai vinculado
  alupaicodigo_detalhes?: Pais | null;  // detalhes do pai quando retornados pela API
  active: boolean;
  create_at?: string;
  modified_at?: string;
}

// Payload mínimo para aluno criar a própria conta (sem pai obrigatório)
export interface CriarAlunoPayload {
  alunome: string;
  aluemail: string;
  alusenha: string;
  alumatricula: string;
  alucpf: string;
}

// ─── Nutricionista ─────────────────────────────────────────────────────────────

export interface Nutricionista {
  nutcodigo: number;
  nutnome: string;
  nutemail: string;
  active: boolean;
  create_at?: string;
  modified_at?: string;
}

export interface CriarNutricionistaPayload {
  nutnome: string;
  nutemail: string;
  nutsenha: string;
}

// ─── Alergia ───────────────────────────────────────────────────────────────────

export interface Alergia {
  alecodigo: number;
  aletipo: string;
  active: boolean;
}

// ─── Ingrediente ───────────────────────────────────────────────────────────────

export interface Ingrediente {
  ingcodigo: number;
  ingtipo: string;
  active: boolean;
}

// ─── Refeição ──────────────────────────────────────────────────────────────────

export interface Refeicao {
  refcodigo: number;
  refnome: string;
  refproteina: number;
  refcarboidrato: number;
  refcalorias: number;
  refnutcodigo: number;
  refnutcodigo_detalhes?: Nutricionista;
  active: boolean;
}

// ─── Cardápio ──────────────────────────────────────────────────────────────────

export interface Cardapio {
  carcodigo: number;
  cardata: string;    // ISO 8601: "2025-01-20T00:00:00Z"
  refeicoes?: Refeicao[];
  active: boolean;
}

// ─── Alerta ────────────────────────────────────────────────────────────────────

export interface AlertaLog {
  logcodigo: number;
  logalunocodigo: number;
  logalecodigo: number;
  logrefcodigo: number;
  logvisualizacao: boolean;
  logalunocodigo_detalhes?: Aluno;
  logalecodigo_detalhes?: Alergia;
  logrefcodigo_detalhes?: Refeicao;
  create_at?: string;
}