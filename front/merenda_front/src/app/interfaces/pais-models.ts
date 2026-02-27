
export interface PaisModels {
    // Atributos de Pais
    paicodigo? : number;
    painome : string;
    paicpf : string;
    paiemail : string;
    paisenha?: string;

    // Atributos de BaseModel
    create_at? : string;
    modified_at? : string;
    active? : boolean;
}
