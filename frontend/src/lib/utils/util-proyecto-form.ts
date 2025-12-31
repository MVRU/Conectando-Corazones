import { ICONOS_CATEGORIA, COLORES_UI, COLORES_CATEGORIA } from './constants';
import { ClipboardDocumentList } from '@steeze-ui/heroicons';
import type { IconSource } from '@steeze-ui/svelte-icon';

export const MAX_BENEFICIARIOS = 100_000;

export function validarBeneficiariosValor(
	n: number | undefined,
	max = MAX_BENEFICIARIOS
): string | null {
	if (n == null || Number.isNaN(n)) return 'Este campo es obligatorio';
	if (!Number.isFinite(n)) return 'El valor ingresado no es válido';
	if (!Number.isSafeInteger(n)) return 'Debe ser un número entero válido';
	if (n <= 0) return 'El número de beneficiarios debe ser mayor a 0';
	if (n > max)
		return `El número ingresado es poco realista (máximo ${max.toLocaleString('es-AR')}).`;
	return null;
}

export function obtenerIconoCategoria(descripcion: string): IconSource {
	return ICONOS_CATEGORIA[descripcion] || ClipboardDocumentList;
}

export function obtenerColorCategoria(descripcion: string): string {
	return COLORES_CATEGORIA[descripcion] || 'gray';
}

export function obtenerClasesColor(color: string, seleccionado: boolean) {
	const c = COLORES_UI[color as keyof typeof COLORES_UI] || COLORES_UI.blue;
	return {
		border: seleccionado ? c.border : 'border-gray-200',
		bg: seleccionado ? c.bg : 'bg-white',
		hover: !seleccionado ? c.hover : '',
		iconColor: seleccionado ? c.iconColor : 'text-gray-400',
		iconBg: seleccionado ? c.iconBg : 'bg-gray-100'
	};
}

export function formatearFechaLarga(iso?: string, estilo: 'de' | 'del' = 'de'): string {
	if (!iso) return '';
	const [y, m, d] = iso.split('-').map(Number);
	if (!y || !m || !d) return '';
	const dt = new Date(Date.UTC(y, m - 1, d));
	const base = new Intl.DateTimeFormat('es-AR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(dt);
	return estilo === 'del' ? base.replace(/\sde\s(\d{4})$/, ' del $1') : base;
}

export function obtenerDescripcionTipo(tipo: string): string {
	return tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

export function capitalizarPrimera(s: string): string {
	const t = (s ?? '').normalize('NFC').trim().replace(/\s+/g, ' ');
	if (!t) return '';
	const [first, ...rest] = [...t];
	return first.toLocaleUpperCase('es-AR') + rest.join('');
}

export function fmtNum(n: number | undefined) {
	return new Intl.NumberFormat('es-AR').format(Number(n) || 0);
}

export function unidadEfectiva(p: { unidad_medida?: string; unidad_medida_otra?: string }): string {
	const base = (p.unidad_medida === 'Otra' ? p.unidad_medida_otra : p.unidad_medida) || '';
	return base.toString().trim();
}

export function objetivoListo(p: {
	tipo_participacion?: { descripcion?: string };
	objetivo?: number;
	unidad_medida?: string;
	unidad_medida_otra?: string;
	especie?: string;
}): boolean {
	const obj = Number(p.objetivo);
	if (!(obj > 0)) return false;
	const tipo = p.tipo_participacion?.descripcion;
	const unidad = unidadEfectiva(p);
	if (!unidad) return false;
	if (tipo === 'Especie' && !p.especie?.trim()) return false;
	return true;
}

export function objetivoTexto(p: {
	tipo_participacion?: { descripcion?: string };
	objetivo?: number;
	unidad_medida?: string;
	unidad_medida_otra?: string;
	especie?: string;
}): string {
	const tipo = p.tipo_participacion?.descripcion;
	const num = fmtNum(p.objetivo);
	const unidad = unidadEfectiva(p);
	const unidadLc = unidad.toLocaleLowerCase('es-AR');

	if (tipo === 'Especie') {
		const item = (p.especie || '').trim();
		const muestraUnidad = unidad && unidadLc !== 'unidades';
		return `Objetivo: alcanzar ${num}${muestraUnidad ? ` ${unidad}` : ''} de ${item}`;
	}

	if (tipo === 'Monetaria') {
		return `Objetivo: recaudar $${num} ${unidad}`;
	}

	if (tipo === 'Voluntariado') {
		if (unidadLc === 'personas') return `Objetivo: convocar ${num} personas`;
		if (unidadLc === 'horas') return `Objetivo: reunir ${num} horas de voluntariado`;
		return `Objetivo: alcanzar ${num} ${unidad}`;
	}

	return `Objetivo: alcanzar ${num} ${unidad}`;
}

// --- Validaciones específicas de campos del formulario ---

export function normalizarTitulo(t: string): string {
	return capitalizarPrimera(t);
}

export function validarTituloProyecto(t: string): string | null {
	if (t == null) return 'Este campo es obligatorio';
	const v = t.normalize('NFC').trim().replace(/\s+/g, ' ');
	if (!v) return 'Este campo es obligatorio';
	if (v.length < 3) return 'Debe tener al menos 3 caracteres';
	if (v.length > 120) return 'Máximo 120 caracteres';
	if (/^\d/.test(v)) return 'No puede comenzar con un número';
	if (/^\d+$/u.test(v)) return 'No puede ser solo números';
	if (!/\p{L}/u.test(v)) return 'Debe incluir letras';
	if (/<|>/.test(v)) return 'Caracteres inválidos detectados.';
	if (!/^[\p{L}\p{N} .,'!?:;\-()/&@#$%*+=[\]{}|~¡¿]+$/u.test(v))
		return 'Usá solo letras, números y signos comunes';
	return null;
}

export function validarDescripcionProyecto(
	s: string,
	opts: { min?: number; max?: number } = {}
): string | null {
	const { min = 50, max = 2000 } = opts;
	if (s == null) return 'Este campo es obligatorio';
	const v = s.normalize('NFC').trim().replace(/\s+/g, ' ');
	if (!v) return 'Este campo es obligatorio';
	if (v.length < min) return `Por favor, brinde mas detalles sobre el proyecto (mínimo ${min} caracteres).`;
	if (v.length > max) return `Maximo ${max} caracteres. Por favor, sea más breve`;
	if (/^\d/.test(v)) return 'No puede comenzar con un numero';
	if (!/\p{L}/u.test(v)) return 'Debe incluir letras';
	if (/^\d+$/u.test(v)) return 'No puede ser solo numeros';
	return null;
}

export function esFechaDemasiadoLejana(fecha?: Date | string, maxAnios: number = 2): boolean {
	if (!fecha) return false;

	try {
		const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
		if (isNaN(fechaObj.getTime())) return false;

		const hoy = new Date();
		const fechaMaxima = new Date(hoy);
		fechaMaxima.setFullYear(hoy.getFullYear() + maxAnios);

		return fechaObj > fechaMaxima;
	} catch {
		return false;
	}
}

export function validarUrlImagen(url: string): string | null {
	if (!url) return null; // Campo opcional
	const v = url.trim();
	
	// Validar longitud máxima
	if (v.length > 255) return 'La URL es demasiado extensa. Por favor proporcione una mas breve';
	
	const isDataImage = /^data:image\//i.test(v);
	if (isDataImage) return null;
	
	// Detectar si parece una URL pero no tiene protocolo
	if (!v.startsWith('http://') && !v.startsWith('https://')) {
		// Si parece una URL (tiene www. o tiene punto y barra)
		if (v.startsWith('www.') || /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(\/|$)/.test(v)) {
			return 'La URL debe comenzar con http:// o https://.';
		}
	}
	
	// Validar que sea una URL válida
	let urlObj: URL;
	try {
		urlObj = new URL(v);
	} catch {
		return 'El formato de la URL no es válido.';
	}
	
	// Validar que tenga protocolo http o https
	if (!['http:', 'https:'].includes(urlObj.protocol)) {
		return 'La URL debe comenzar con http:// o https://.';
	}
	
	// Luego validar la extensión de imagen
	const path = urlObj.pathname.toLowerCase();
	const hasValidExt = /(\.jpg|\.jpeg|\.png|\.webp|\.gif)$/.test(path);
	if (!hasValidExt) return 'La URL debe apuntar a una imagen (.jpg, .jpeg, .png, .webp, .gif)';
	
	return null;
}

// --- Normalizadores y validadores reutilizables ---

export function toKey(s: string): string {
	return (s ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ');
}

export function normalizarUnidadLibre(texto: string, preserveCase = false): string {
	const t = (texto ?? '')
		.normalize('NFC')
		.trim()
		.replace(/\s+/g, ' ');
	return preserveCase ? t : t.toLocaleLowerCase('es-AR');
}

export function validarUnidadLibre(
	texto: string,
	opciones?: { esRepetida?: (t: string) => boolean; allowUpperCase?: boolean }
): string | null {
	if (texto == null) return 'Este campo es obligatorio';
	const v = normalizarUnidadLibre(texto, opciones?.allowUpperCase);
	if (!v) return 'Este campo es obligatorio';
	if (v.length < 2) return 'Debe tener al menos 2 caracteres';
	if (v.length > 40) return 'Máximo 40 caracteres';
	if (!/^\p{L}/u.test(v)) return 'Debe comenzar con una letra';
	if (!/\p{L}/u.test(v)) return 'Debe incluir al menos una letra';
	if (/^\d+$/u.test(v)) return 'No puede ser solo números';
	if (!/^[\p{L}\p{N} .,'/%()-]+$/u.test(v)) return 'Usá letras, números y signos comunes';
	if (opciones?.esRepetida && opciones.esRepetida(v))
		return 'Esa unidad ya existe. Elegíla de la lista.';
	return null;
}

export function normalizarEspecie(texto: string): string {
	return (texto ?? '')
		.normalize('NFC')
		.trim()
		.replace(/\s+/g, ' ')
		.toLocaleLowerCase('es-AR');
}

export function validarEspecie(texto: string): string | null {
	if (texto == null) return 'Este campo es obligatorio';
	const v = normalizarEspecie(texto);
	if (!v) return 'Este campo es obligatorio';
	if (v.length < 3) return 'Debe tener al menos 3 caracteres';
	if (v.length > 60) return 'Máximo 60 caracteres';
	if (!/^\p{L}/u.test(v)) return 'Debe comenzar con una letra';
	if (!/\p{L}/u.test(v)) return 'Debe incluir letras';
	if (/^\d+$/u.test(v)) return 'No puede ser solo números';
	const ban = ['n/a', 'na', '-', 'ninguna', 'ninguno', 'no se', 'nose'];
	if (ban.includes(v)) return 'Por favor, especificá un ítem válido';
	if (!/^[\p{L}\p{N} .,'/%()-]+$/u.test(v)) return 'Usá solo letras, números y signos comunes';
	return null;
}

export function validarReferencia(referencia: string): string | null {
	if (!referencia || !referencia.trim()) return null; // Campo opcional
	const v = referencia.trim();
	if (v.length > 200) {
		return 'La referencia no puede superar los 200 caracteres.';
	}
	return null;
}
