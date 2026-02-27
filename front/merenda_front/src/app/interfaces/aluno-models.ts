import { PaisModels } from "./pais-models"
export interface AlunoModels {
    // Atributos de Aluno
    alucodigo? : number;
    alunome : string;
    alucpf : string;
    alumatricula : string;
    aluemail : string,
    alusenha? : string;

    // Relacionamento com a tabela de pais

    alupaicodigo? : number | null;

    // Trazendo objeto completo do pais
    alupaicodigo_detalhes? : PaisModels;

    create_at? : string;
    update_at? : string;
    active? : boolean;

    
}
