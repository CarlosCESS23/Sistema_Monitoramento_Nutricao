import { AlergiaModels } from "./alergia-models";
import { IngredientesModels } from "./ingrediente-models";

export interface RestricoesAlimentaresModels {
    // Atributos de Restrições Alimentares
    resali_codigo : number;
    
    // Atributos de Alergia
    resali_alicodigo : number;
    alergia_detalhe : AlergiaModels;


    resali_ingcodigo : number;
    ingrediente_detalhe : IngredientesModels;
}
