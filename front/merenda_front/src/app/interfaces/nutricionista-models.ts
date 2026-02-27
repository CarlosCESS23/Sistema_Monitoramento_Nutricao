export interface NutricionistaModels {
    // Atributos de Nutricionista
    nutcodigo? : number;
    nutnome : string;
    nutcpf : string;
    nutemail: string;
    nutsenha? : string;

    // Atributos de BaseModel
    create_at? : string;
    update_at? : string;
    active? : boolean;
}
