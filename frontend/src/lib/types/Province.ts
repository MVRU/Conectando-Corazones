
export interface Province {
    id?: number; // código de la provincia según ARCA
    name: string;

    // Valores opcionales (puede servir para funciones post-mvp)
    isoCode?: string; // para identificación geográfica
    capital?: string;
    region?: string;
}