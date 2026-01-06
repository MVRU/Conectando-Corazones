export interface ConfiguracionUbicacionGoogleMaps {
	localidad?: string;
	provincia?: string;
	pais?: string;
	zoom?: number;
	idioma?: string;
}

export interface UrlsVistaPreviaGoogleMaps {
	urlInsertar: string;
	urlLugar: string;
}

const URL_BASE_INSERTAR_GOOGLE_MAPS = 'https://maps.google.com/maps';
const URL_BASE_LUGAR_GOOGLE_MAPS = 'https://www.google.com/maps';
const RUTA_LUGAR_GOOGLE_MAPS = '/place/';
const PAIS_POR_DEFECTO = 'Argentina';
const IDIOMA_POR_DEFECTO = 'es';
const ZOOM_POR_DEFECTO = 13;
const ZOOM_MINIMO = 1;
const ZOOM_MAXIMO = 21;

const PATRON_IDIOMA = /^[a-z]{2}(?:-[A-Z]{2})?$/u;

function normalizarZoom(zoom: number | undefined): number {
	if (!Number.isFinite(zoom)) {
		return ZOOM_POR_DEFECTO;
	}

	const zoomRedondeado = Math.round(zoom as number);
	return Math.min(Math.max(zoomRedondeado, ZOOM_MINIMO), ZOOM_MAXIMO);
}

function normalizarIdioma(idioma: string | undefined): string {
	const recortado = idioma?.trim();

	if (!recortado || !PATRON_IDIOMA.test(recortado)) {
		return IDIOMA_POR_DEFECTO;
	}

	return recortado;
}

function sanitizarParte(valor?: string): string | null {
	const recortado = valor?.trim();

	if (!recortado) {
		return null;
	}

	return recortado.replace(/\s+/gu, ' ');
}

function construirPartesBuscables(config: ConfiguracionUbicacionGoogleMaps): string[] | null {
	const localidadSanitizada = sanitizarParte(config.localidad);
	const provinciaSanitizada = sanitizarParte(config.provincia);

	if (!localidadSanitizada || !provinciaSanitizada) {
		return null;
	}

	const paisSanitizado = sanitizarParte(config.pais) ?? PAIS_POR_DEFECTO;

	return [localidadSanitizada, provinciaSanitizada, paisSanitizado];
}

export function construirUrlsVistaPreviaGoogleMaps(
	config: ConfiguracionUbicacionGoogleMaps = {}
): UrlsVistaPreviaGoogleMaps | null {
	const partesBuscables = construirPartesBuscables(config);

	if (!partesBuscables) {
		return null;
	}

	const idioma = normalizarIdioma(config.idioma);
	const zoom = normalizarZoom(config.zoom);
	const etiquetaLugar = partesBuscables.join(', ');

	const parametrosInsertar = new URLSearchParams({
		q: etiquetaLugar,
		hl: idioma,
		z: String(zoom),
		t: '',
		ie: 'UTF8',
		iwloc: 'B',
		output: 'embed'
	});

	const urlInsertar = `${URL_BASE_INSERTAR_GOOGLE_MAPS}?${parametrosInsertar.toString()}`;

	const urlLugar = `${URL_BASE_LUGAR_GOOGLE_MAPS}${RUTA_LUGAR_GOOGLE_MAPS}${encodeURIComponent(
		etiquetaLugar
	)}?hl=${idioma}`;

	return { urlInsertar, urlLugar };
}

