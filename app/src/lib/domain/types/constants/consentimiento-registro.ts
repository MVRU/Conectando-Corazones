/** Versión vigente de los textos legales aceptados al registrarse (debe alinearse con /terminos y /privacidad). */
export const CONSENTIMIENTO_REGISTRO_VERSION = '1.0';

export const CONSENTIMIENTOS_REGISTRO_OBLIGATORIOS = [
	{ tipo: 'terminos', version: CONSENTIMIENTO_REGISTRO_VERSION },
	{ tipo: 'privacidad', version: CONSENTIMIENTO_REGISTRO_VERSION }
] as const;

export function payloadConsentimientosRegistro(): Array<{ tipo: string; version: string }> {
	return CONSENTIMIENTOS_REGISTRO_OBLIGATORIOS.map((c) => ({ tipo: c.tipo, version: c.version }));
}

export function cumpleConsentimientosRegistro(
	recibidos: Array<{ tipo: string; version: string }> | undefined
): boolean {
	if (!recibidos?.length) return false;
	return CONSENTIMIENTOS_REGISTRO_OBLIGATORIOS.every((req) =>
		recibidos.some((c) => c.tipo === req.tipo && c.version === req.version)
	);
}
