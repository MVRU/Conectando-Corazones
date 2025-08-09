
export interface Province {
    // Atributos del DER
    id?: number; // código de la provincia según ARCA
    name: string;
    shortName?: string;

    // Atributos opcionales (puede servir para funciones post-mvp)
    isoCode?: string; // para identificación geográfica
    capital?: string;
    region?: string;
}