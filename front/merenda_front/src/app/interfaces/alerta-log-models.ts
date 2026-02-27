import { AlergiaModels } from "./alergia-models";
import { AlunoModels } from "./aluno-models";
import { RefeicaoModels } from "./refeicao-models";

export interface AlertaLogModels {
    // Atributos de Log
    logcodigo? : number;
    logvisualizacao : boolean;
    
    // Atributos de Aluno
    logalunocodigo? : number;
    aluno_detalhe? : AlunoModels;
    // Atributos de Alergia
    logrefalecodigo? : number;
    alergia_detalhes? : AlergiaModels
    // Atributos de Refeição
    logrefcodigo? : number;
    refeicao_detalhes? : RefeicaoModels;

    create_at : string;
    modified_at? : string;
    active? : boolean;

    

    
}
