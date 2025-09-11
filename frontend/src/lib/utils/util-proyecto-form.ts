/*
 * Utilidades de formulario de proyectos.
 -*- Centraliza validaciones y helpers para reducir duplicación en componentes de formularios
 ! Voy a ver si lo dejo acá o cómo lo ordeno con validators y otras utils para que quede mejor
 */

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

export function obtenerIconoCategoria(descripcion: string): string {
	const iconos: Record<string, string> = {
		Medioambiente: '🌱',
		Educación: '📚',
		Salud: '🏥',
		'Desarrollo económico': '💼',
		'Promoción de la paz': '🕊️',
		Seguridad: '🛡️',
		Entretenimiento: '🎭',
		Liderazgo: '👑',
		'Personas con discapacidad': '♿',
		Tecnología: '💻',
		Política: '🏛️',
		Religión: '⛪',
		'LGBTIQ+': '🏳️‍🌈',
		'Apoyo ante una crisis': '🆘',
		Empleo: '👷',
		'Inmigrantes y refugiados': '🤝',
		'Protección animal': '🐾',
		'Alimentación y nutrición': '🍽️',
		'Cultura y arte': '🎨',
		Otra: '📋'
	};
	return iconos[descripcion] || '📋';
}

export function obtenerClasesColor(color: string, seleccionado: boolean) {
	const colores = {
		blue: {
			border: seleccionado ? 'border-blue-500' : 'border-gray-200',
			bg: seleccionado ? 'bg-blue-50' : 'bg-white',
			hover: !seleccionado ? 'hover:border-blue-300' : ''
		},
		green: {
			border: seleccionado ? 'border-green-500' : 'border-gray-200',
			bg: seleccionado ? 'bg-green-50' : 'bg-white',
			hover: !seleccionado ? 'hover:border-green-300' : ''
		},
		orange: {
			border: seleccionado ? 'border-orange-500' : 'border-gray-200',
			bg: seleccionado ? 'bg-orange-50' : 'bg-white',
			hover: !seleccionado ? 'hover:border-orange-300' : ''
		}
	} as const;
	return colores[color as keyof typeof colores] || colores.blue;
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

export function obtenerPlaceholderQueSehace(tipo: string): string {
	switch (tipo) {
		case 'principal':
			return 'Ejemplo: aquí se realiza el voluntariado';
		case 'alternativa':
			return 'Ejemplo: aquí se juntan los juguetes desde las 16h hasta las 18h';
		case 'virtual':
			return 'Ejemplo: se realizan las reuniones virtuales los días martes a las 19h';
		default:
			return 'Describí las actividades que se realizan en esta ubicación...';
	}
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
  // Debe contener al menos una letra y solo caracteres comunes
  if (!/\p{L}/u.test(v)) return 'Debe incluir letras';
  if (!/^[\p{L}\p{N} .,'!?:;\-()\/&]+$/u.test(v))
    return 'Usá solo letras, números y signos comunes';
  return null;
}

export function validarDescripcionProyecto(
  s: string,
  opts: { min?: number; max?: number } = {}
): string | null {
  const { min = 20, max = 1500 } = opts;
  if (s == null) return 'Este campo es obligatorio';
  const v = s.normalize('NFC').trim().replace(/\s+/g, ' ');
  if (!v) return 'Este campo es obligatorio';
  if (v.length < min) return `Debe tener al menos ${min} caracteres`;
  if (v.length > max) return `Maximo ${max} caracteres`;
  if (/^\d/.test(v)) return 'No puede comenzar con un numero';
  if (!/\p{L}/u.test(v)) return 'Debe incluir letras';
  if (/^\d+$/u.test(v)) return 'No puede ser solo numeros';
  return null;
}

export function validarUrlImagen(url: string): string | null {
  if (!url) return null; // Campo opcional
  const v = url.trim();
  const isDataImage = /^data:image\//i.test(v);
  if (isDataImage) return null;
  const extOk = (() => {
    try {
      const u = new URL(v, 'http://example.com');
      const path = (u.pathname || '').toLowerCase();
      return /(\.jpg|\.jpeg|\.png|\.webp|\.gif)$/.test(path);
    } catch {
      return /(\.jpg|\.jpeg|\.png|\.webp|\.gif)(\?.*)?(#.*)?$/i.test(v);
    }
  })();
  if (!extOk) return 'La URL debe apuntar a una imagen (.jpg, .jpeg, .png, .webp, .gif)';
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

export function normalizarUnidadLibre(texto: string): string {
  return (texto ?? '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es-AR');
}

export function validarUnidadLibre(
  texto: string,
  opciones?: { esRepetida?: (t: string) => boolean }
): string | null {
  if (texto == null) return 'Este campo es obligatorio';
  const v = normalizarUnidadLibre(texto);
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

export function validarUnidadMedidaOtra(texto: string): string | null {
  if (texto == null) return 'Este campo es obligatorio';
  const v = texto.normalize('NFC').trim().replace(/\s+/g, ' ');
  if (v.length < 2) return 'Debe tener al menos 2 caracteres';
  if (v.length > 40) return 'Máximo 40 caracteres';
  if (!/[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/u.test(v)) return 'Debe incluir al menos una letra';
  if (/^\d+$/u.test(v)) return 'No puede ser solo números';
  if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9 .,'’/%()-]+$/u.test(v))
    return 'Usá letras, números y signos comunes';
  return null;
}