import type { Location } from "./Location";

export interface Address {
    id?: number;

    // Calle y número
    street: string;
    streetNumber: string;

    // Piso o departamento (opcional)
    floorOrDepartment?: string;

    // Referencia adicional (ej. "Edificio al lado de la plaza")
    reference?: string;

    // URL a Google Maps (opcional)
    googleMapsUrl?: string;

    // Relación con localidad (ciudad/barrio)
    location: Location;
}