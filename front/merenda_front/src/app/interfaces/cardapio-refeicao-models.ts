import { CardapioModels } from "./cardapio-models";
import { RefeicaoModels } from "./refeicao-models";

export interface CardapioRefeicaoModels {
    // Atributo de CardapioRefeicao
    carrefcodigo? : number;

    // Atributos de Refeicao
    carref_refcodigo? : number;
    refeicao_detalhes? : RefeicaoModels;

    // Atributos de Cardapio
    carref_carcodigo? : number;
    cardapio_detalhes? : CardapioModels;

    // Atributos de BaseModel
    create_at? : string;
    modified_at? : string;
    active? : boolean;
}
