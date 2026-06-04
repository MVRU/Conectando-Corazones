// * Códigos canónicos
export const TIPOS_PARTICIPACION_DESCRIPCION = ['Voluntariado', 'Especie', 'Monetaria'] as const;

export type TipoParticipacionDescripcion = (typeof TIPOS_PARTICIPACION_DESCRIPCION)[number];

// ! Interfaz
export interface TipoParticipacion {
	id_tipo_participacion?: number;
	descripcion: TipoParticipacionDescripcion;
}

// * Mapa de labels para UI
export const TIPO_PARTICIPACION_LABELS: Record<TipoParticipacionDescripcion, string> = {
	Voluntariado: 'Voluntariado',
	Especie: 'Donación en especie',
	Monetaria: 'Aporte monetario'
};

// * Guards canónicos
export const esTipoParticipacionCanonico = (v: string): v is TipoParticipacionDescripcion =>
	(TIPOS_PARTICIPACION_DESCRIPCION as readonly string[]).includes(v);

// * Tipos que califican para la deducción de Impuesto a las Ganancias (RG 2681).
export const TIPOS_PARTICIPACION_DEDUCIBLES: readonly TipoParticipacionDescripcion[] = ['Monetaria', 'Especie'];
