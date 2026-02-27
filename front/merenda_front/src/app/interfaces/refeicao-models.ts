import { NutricionistaModels } from "./nutricionista-models";

export interface RefeicaoModels {
    // Atributos de refeição
    refcodigo? : number;
    refnome : string;
    refproteina : number;
    refcalorias : number;
    refcarboidrato : number;
    
    // Relacionamento com Nutricionista
    refnutcodigo? : number | null;

    refnutcodigo_detalhes? : NutricionistaModels;

    // Atributos de BaseModel
    create_at? : string;
    update_at? : string;
    active? : boolean;
}
