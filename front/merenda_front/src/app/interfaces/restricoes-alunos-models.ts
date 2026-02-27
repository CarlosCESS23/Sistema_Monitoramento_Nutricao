import { AlunoModels } from "./aluno-models";

export interface RestricoesAlunosModels {
    // Atributos de Restrições dos Alunos

    resalu_codigo : number;

    // Atributos de Aluno
    resalu_alucodigo : number;
    aluno_detalhe : AlunoModels;

    // Atributos de Alergia
    resalu_alecodigo : number;
    resalu_alergia : string;
}
