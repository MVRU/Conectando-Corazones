// * DECISIÓN DE DISEÑO: se centralizan utilidades del registro para compartirlas entre componentes y mantener una única fuente de verdad al generar el payload discriminado por rol

import type { Contacto } from '$lib/domain/types/Contacto';

export type TipoColaborador = 'unipersonal' | 'organizacion';

export function crearContactoPrincipal(valor = ''): Contacto {
	return {
		tipo_contacto: 'email',
		etiqueta: 'principal',
		valor
	};
}

export function normalizarSeleccionBoolean(valor: '' | 'true' | 'false'): boolean | null {
	if (valor === 'true') return true;
	if (valor === 'false') return false;
	return null;
}
