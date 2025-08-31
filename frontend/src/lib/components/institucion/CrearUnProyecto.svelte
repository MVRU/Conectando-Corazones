<!--
! Quedó demasiado largo y asqueroso el código, perdón, corrigí varias cosas y agregué bastantes validaciones
! en cuanto pueda lo voy a dividir en componentes reutilizables y más atómicos
	-!- Introduje algunos DTOs para la implementación futura del backend, voy a ver cómo los organizo, ignorar por ahora

* Componente: CrearProyecto
* Descripción: Formulario para que las instituciones creen nuevos proyectos

TODOs:
	- [ ] Pasar funciones a utils
	- [ ] Quitar interfaces creadas y usar Interfaces ya definidas o crear DTOs (no acá)
	- [ ] Cambiar "que_sehace" por "que_se_hace"
	- [ ] ¿Corregir interfaces según Issue #34?

-->

<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import type { PrioridadTipo } from '$lib/types/ProyectoUbicacion';
	import { PRIORIDAD_TIPO } from '$lib/types/ProyectoUbicacion';
	import { mockCategorias } from '$lib/mocks/mock-categorias';
	import { provincias } from '$lib/data/provincias';
	import { mockLocalidades } from '$lib/mocks/mock-localidades';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import {
		MENSAJES_ERROR,
		validarUrl,
		validarCalle,
		validarNumeroCalle,
		validarCiudadEnProvincia,
		validarProvincia,
		esFechaFutura
	} from '$lib/utils/validaciones';

	type ParticipacionForm = Partial<ParticipacionPermitida> & { unidad_medida_otra?: string };

	// DTOs para payload de creación (IGNORAR)
	import type { ProyectoCreate } from '$lib/types/dto/ProyectoCreate';
	import type { ParticipacionPermitidaCreate } from '$lib/types/dto/ParticipacionPermitidaCreate';

	// TODO: crear parámetro para panel admin
	const MAX_BENEFICIARIOS = 100_000;

	function validarBeneficiariosValor(
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

	// Quita decimales y aplica límites al salir del campo
	function normalizarBeneficiarios() {
		if (beneficiarios == null || Number.isNaN(beneficiarios)) return;
		beneficiarios = Math.trunc(beneficiarios);
		if (beneficiarios < 1) beneficiarios = 1;
		if (beneficiarios > MAX_BENEFICIARIOS) beneficiarios = MAX_BENEFICIARIOS;
	}

	// Form data
	let titulo = '';
	let descripcion = '';
	let urlPortada = '';
	// Fecha interna en ISO (yyyy-mm-dd) para validaciones y payload
	let fechaFinTentativa: string = '';

	let beneficiarios: number | undefined = undefined;

	// Categorías seleccionadas
	let categoriasSeleccionadas: number[] = [];

	// Direcciones del proyecto
	interface DireccionFormulario {
		// Campos de ProyectoUbicacion
		tipo_ubicacion: PrioridadTipo | '';
		que_sehace: string;

		// Campos de Direccion
		calle: string;
		numero: string;
		referencia: string;

		// Campo para la relación con Localidad
		localidad_id: number | undefined;

		// Campos auxiliares para el formulario (no van al backend)
		provincia: string; // Solo para UI - permite seleccionar localidad
		localidad_nombre: string; // Solo para UI - nombre de la localidad seleccionada
	}

	let direcciones: DireccionFormulario[] = [
		{
			tipo_ubicacion: 'principal',
			que_sehace: '',
			calle: '',
			numero: '',
			referencia: '',
			localidad_id: undefined,
			provincia: '',
			localidad_nombre: ''
		}
	];

	// Tipos de participación
	let tiposParticipacionSeleccionados: TipoParticipacionDescripcion[] = [];
	let participacionesPermitidas: ParticipacionForm[] = [];

	// Validaciones
	let errores: Record<string, string> = {};

	// Fecha mínima para la fecha de fin (hoy)
	$: fechaMinima = new Date().toISOString().split('T')[0];

	// Función helper para obtener localidades de una provincia por nombre
	function obtenerLocalidadesPorProvincia(nombreProvincia: string) {
		const provincia = provincias.find((p) => p.nombre === nombreProvincia);
		if (!provincia) return [];
		return mockLocalidades.filter((l) => l.id_provincia === provincia.id_provincia);
	}

	function agregarDireccion() {
		direcciones = [
			...direcciones,
			{
				tipo_ubicacion: '',
				que_sehace: '',
				calle: '',
				numero: '',
				referencia: '',
				localidad_id: undefined,
				provincia: '',
				localidad_nombre: ''
			}
		];
	}

	// --- Reglas de ubicaciones ---
	const TIPOS_PRIMERA_UBICACION = ['principal', 'virtual'] as const;

	function getIndicePrincipal(): number {
		return direcciones.findIndex((d) => (d.tipo_ubicacion || '').trim() === 'principal');
	}

	function esTipoPermitidoPrimeraUbicacion(tipo: string): boolean {
		return TIPOS_PRIMERA_UBICACION.includes(tipo as any);
	}

	function tiposPermitidosPara(index: number): ReadonlyArray<PrioridadTipo> {
		const base = PRIORIDAD_TIPO as ReadonlyArray<PrioridadTipo>;

		// En la ubicación 1 sólo 'principal' o 'virtual'
		if (index === 0) {
			return base.filter((t) =>
				esTipoPermitidoPrimeraUbicacion(t as any)
			) as ReadonlyArray<PrioridadTipo>;
		}

		const indicePrincipal = getIndicePrincipal();
		const seleccionado = (direcciones[index]?.tipo_ubicacion || '') as PrioridadTipo | '';

		// Si ya hay una principal en otra ubicación, ocultar 'principal' en este select
		if (indicePrincipal !== -1 && indicePrincipal !== index) {
			return seleccionado === 'principal'
				? base
				: (base.filter((t) => t !== 'principal') as ReadonlyArray<PrioridadTipo>);
		}

		return base;
	}

	function eliminarDireccion(index: number) {
		if (index === 0) {
			console.warn('La Ubicación 1 no se puede eliminar.');
			return;
		}
		if (direcciones.length > 1) {
			direcciones = direcciones.filter((_, i) => i !== index);
		}
	}

	function actualizarDireccion(
		index: number,
		campo: keyof DireccionFormulario,
		valor: string | number | undefined
	) {
		// Evitar duplicar 'principal' en otra ubicación
		if (campo === 'tipo_ubicacion' && typeof valor === 'string' && valor.trim() === 'principal') {
			const indicePrincipal = getIndicePrincipal();
			if (indicePrincipal !== -1 && indicePrincipal !== index) {
				errores[`direccion_${index}_tipo`] = 'Ya existe una ubicación de tipo "Principal".';
				console.warn('Solo puede haber una ubicación "Principal".');
				return;
			} else {
				limpiarError(`direccion_${index}_tipo`);
			}
		}

		// Evitar tipos no permitidos en la primera ubicación
		if (campo === 'tipo_ubicacion' && index === 0 && typeof valor === 'string') {
			const v = valor.trim();
			if (!esTipoPermitidoPrimeraUbicacion(v)) {
				console.warn('La Ubicación 1 solo puede ser "Principal" o "Virtual".');
				return;
			}
		}

		direcciones[index] = { ...direcciones[index], [campo]: valor };

		// Forzar reactividad tras la actualización
		direcciones = direcciones;

		// Si cambió la provincia, limpiar la localidad
		if (campo === 'provincia') {
			direcciones[index].localidad_nombre = '';
			direcciones[index].localidad_id = undefined;
		}

		// Si cambió a virtual, limpiar campos físicos
		if (campo === 'tipo_ubicacion' && valor === 'virtual') {
			direcciones[index].provincia = '';
			direcciones[index].localidad_nombre = '';
			direcciones[index].localidad_id = undefined;
			direcciones[index].calle = '';
			direcciones[index].numero = '';
			direcciones[index].referencia = '';
		}
	}

	function validarUnidadMedidaOtra(s: string, tipo?: TipoParticipacionDescripcion): string | null {
		if (s == null) return 'Este campo es obligatorio';
		const v = s.normalize('NFC').trim().replace(/\s+/g, ' ');
		if (v.length < 2) return 'Debe tener al menos 2 caracteres';
		if (v.length > 40) return 'Máximo 40 caracteres';
		if (!/[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/u.test(v)) return 'Debe incluir al menos una letra';
		if (/^\d+$/u.test(v)) return 'No puede ser solo números';
		if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9 .,'’/%()\-]+$/u.test(v))
			return 'Usá letras, números y signos comunes';

		// Chequeo de duplicado contra las unidades ya listadas para el tipo
		if (esUnidadRepetida(tipo, v)) {
			return 'Esa unidad ya existe. Elegíla de la lista.';
		}
		return null;
	}

	function formatearFechaLarga(iso?: string, estilo: 'de' | 'del' = 'de'): string {
		if (!iso) return '';
		const [y, m, d] = iso.split('-').map(Number);
		if (!y || !m || !d) return '';
		// Forzamos UTC para que no se corra un día por huso horario
		const dt = new Date(Date.UTC(y, m - 1, d));
		const base = new Intl.DateTimeFormat('es-AR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		}).format(dt); // ej: "2 de septiembre de 2025"
		return estilo === 'del' ? base.replace(/\sde\s(\d{4})$/, ' del $1') : base;
	}

	function obtenerPlaceholderQueSehace(tipo: string): string {
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

	function obtenerDescripcionTipo(tipo: string): string {
		return tipo.charAt(0).toUpperCase() + tipo.slice(1);
	}

	function obtenerIconoCategoria(descripcion: string): string {
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

	function obtenerClasesColor(color: string, seleccionado: boolean) {
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
		};
		return colores[color as keyof typeof colores] || colores.blue;
	}

	function toKey(s: string): string {
		return (s ?? '')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, ' ');
	}

	// Catálogo (normalizado) de categorías existentes
	const categoriasKeys = mockCategorias.map((c) => toKey(c.descripcion || '')).filter(Boolean);

	function esCategoriaRepetida(s: string): boolean {
		const key = toKey(s);
		return categoriasKeys.includes(key); // coincide con alguna ya cargada
	}

	function esUnidadRepetida(
		tipo: TipoParticipacionDescripcion | undefined,
		texto: string
	): boolean {
		const key = toKey(texto);
		const lista = unidadesPorTipo[(tipo ?? 'Voluntariado') as keyof typeof unidadesPorTipo] ?? [];
		return lista.map(toKey).includes(key);
	}

	function fmtNum(n: number | undefined) {
		return new Intl.NumberFormat('es-AR').format(Number(n) || 0);
	}

	function unidadEfectiva(p: ParticipacionForm): string {
		const base = (p.unidad_medida === 'Otra' ? p.unidad_medida_otra : p.unidad_medida) || '';
		return base.toString().trim();
	}

	function objetivoListo(p: ParticipacionForm): boolean {
		const obj = Number(p.objetivo);
		if (!(obj > 0)) return false;

		const tipo = p.tipo_participacion?.descripcion;
		const unidad = unidadEfectiva(p);

		// Requiere unidad siempre
		if (!unidad) return false;

		// Para especie, también requiere "especie"
		if (tipo === 'Especie' && !p.especie?.trim()) return false;

		return true;
	}

	function objetivoTexto(p: ParticipacionForm): string {
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

		// Fallback genérico
		return `Objetivo: alcanzar ${num} ${unidad}`;
	}

	// Funciones de categorías
	function toggleCategoria(categoriaId?: number) {
		if (categoriaId == null) return;

		if (categoriasSeleccionadas.includes(categoriaId)) {
			categoriasSeleccionadas = categoriasSeleccionadas.filter((id) => id !== categoriaId);
			// Si deseleccionan "Otra", limpiamos
			if (idCategoriaOtra != null && categoriaId === idCategoriaOtra) {
				categoriaOtraDescripcion = '';
				limpiarError('categoria_otra');
			}
		} else {
			categoriasSeleccionadas = [...categoriasSeleccionadas, categoriaId];
		}
	}

	// --- "Otra (especificar)" ---
	let categoriaOtraDescripcion = '';

	/** Id de la categoría "Otro/Otra" si existe en el catálogo */
	$: idCategoriaOtra = mockCategorias.find(
		(c) => c.descripcion?.toLowerCase() === 'otro' || c.descripcion?.toLowerCase() === 'otra'
	)?.id_categoria;

	/** ¿El usuario seleccionó "Otro/Otra"? */
	$: seleccionoOtra =
		idCategoriaOtra != null && categoriasSeleccionadas.includes(idCategoriaOtra ?? -1);

	/** Valida el texto de "Otra (especificar)" */
	function validarCategoriaOtraDescripcion(s: string): string | null {
		if (s == null) return 'Este campo es obligatorio';
		const v = s.normalize('NFC').trim().replace(/\s+/g, ' ');
		if (v.length < 3) return 'Debe tener al menos 3 caracteres';
		if (v.length > 60) return 'Máximo 60 caracteres';

		// No palabras “vacías”
		const ban = ['n/a', 'na', '-', 'otro', 'otra', 'ninguna', 'ninguno', 'no sé', 'nose'];
		if (ban.includes(v.toLowerCase())) return 'Por favor, especificá una categoría válida';

		// Debe incluir al menos una letra (con acentos) y no ser solo números
		if (!/[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/u.test(v)) return 'Debe incluir al menos una letra';
		if (/^\d+$/u.test(v)) return 'No puede ser solo números';

		// Carácteres permitidos razonables (letras, números, espacios y signos comunes)
		if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9 .,'’/&()\-]+$/u.test(v))
			return 'Usá solo letras, números y signos comunes';

		if (esCategoriaRepetida(v)) {
			return 'Esa categoría ya existe en el catálogo. Elegíla de la lista.';
		}

		return null;
	}

	function capitalizarPrimera(s: string): string {
		const t = (s ?? '').normalize('NFC').trim().replace(/\s+/g, ' ');
		if (!t) return '';
		const [first, ...rest] = [...t]; // respeta acentos/emoji
		return first.toLocaleUpperCase('es-AR') + rest.join('');
	}
	function normalizarCategoriaOtra() {
		categoriaOtraDescripcion = capitalizarPrimera(categoriaOtraDescripcion);
	}

	// Si deseleccionan "Otra", limpiamos su campo y error
	$: if (
		seleccionoOtra &&
		categoriaOtraDescripcion &&
		!validarCategoriaOtraDescripcion(categoriaOtraDescripcion)
	) {
		limpiarError('categoria_otra');
	}

	// Funciones de participación
	function toggleTipoParticipacion(tipo: TipoParticipacionDescripcion) {
		if (tiposParticipacionSeleccionados.includes(tipo)) {
			// Remover tipo
			tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter((t) => t !== tipo);
			// Remover todas las participaciones asociadas
			participacionesPermitidas = participacionesPermitidas.filter(
				(p) => p.tipo_participacion?.descripcion !== tipo
			);
		} else {
			tiposParticipacionSeleccionados = [...tiposParticipacionSeleccionados, tipo];
			participacionesPermitidas = [
				...participacionesPermitidas,
				{
					tipo_participacion: { descripcion: tipo },
					objetivo: 0,
					actual: 0,
					unidad_medida:
						tipo === 'Monetaria' ? 'ARS' : tipo === 'Voluntariado' ? 'personas' : 'unidades',
					especie: tipo === 'Especie' ? '' : undefined
				}
			];
		}
	}

	function updateParticipacion(
		index: number,
		field: keyof ParticipacionPermitida | 'unidad_medida_otra',
		value: any
	) {
		participacionesPermitidas[index] = { ...participacionesPermitidas[index], [field]: value };
		participacionesPermitidas = participacionesPermitidas;

		// Limpieza de errores
		if (field === 'unidad_medida_otra') {
			const err = validarUnidadMedidaOtra(
				String(value ?? ''),
				participacionesPermitidas[index].tipo_participacion?.descripcion as
					| TipoParticipacionDescripcion
					| undefined
			);
			if (err) {
				errores[`participacion_${index}_unidad_otra`] = err;
			} else {
				limpiarError(`participacion_${index}_unidad_otra`);
			}
		}

		if (field === 'unidad_medida' && value !== 'Otra') {
			participacionesPermitidas[index].unidad_medida_otra = '';
			participacionesPermitidas = participacionesPermitidas;
			limpiarError(`participacion_${index}_unidad_otra`);
		}
	}

	function agregarItemEspecie() {
		participacionesPermitidas = [
			...participacionesPermitidas,
			{
				tipo_participacion: { descripcion: 'Especie' },
				objetivo: 0,
				unidad_medida: 'unidades',
				especie: ''
			}
		];
	}

	function eliminarParticipacion(index: number) {
		const participacion = participacionesPermitidas[index];
		const tipo = participacion.tipo_participacion?.descripcion;

		// Eliminar la participación
		participacionesPermitidas = participacionesPermitidas.filter((_, i) => i !== index);

		// Si era el último item de este tipo y no es "Especie", remover el tipo de seleccionados
		if (tipo && tipo !== 'Especie') {
			const tieneOtrosDelMismoTipo = participacionesPermitidas.some(
				(p) => p.tipo_participacion?.descripcion === tipo
			);
			if (!tieneOtrosDelMismoTipo) {
				tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter((t) => t !== tipo);
			}
		}

		// Para "Especie", si no quedan items, remover el tipo
		if (tipo === 'Especie') {
			const tieneEspecies = participacionesPermitidas.some(
				(p) => p.tipo_participacion?.descripcion === 'Especie'
			);
			if (!tieneEspecies) {
				tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter(
					(t) => t !== 'Especie'
				);
			}
		}
	}

	$: ubicacionesConTipo = direcciones
		.map((d, i) => ({ i, tipo: (d.tipo_ubicacion || '').trim() }))
		.filter((x) => x.tipo);

	$: esUnicaBasica =
		ubicacionesConTipo.length === 1 &&
		(ubicacionesConTipo[0]?.tipo === 'principal' || ubicacionesConTipo[0]?.tipo === 'virtual');

	$: indiceUnicaBasica = esUnicaBasica ? ubicacionesConTipo[0].i : -1;

	// Validaciones
	function validarFormulario(): boolean {
		errores = {};

		// Validaciones básicas
		if (!titulo.trim()) errores.titulo = MENSAJES_ERROR.obligatorio;
		if (!descripcion.trim()) errores.descripcion = MENSAJES_ERROR.obligatorio;

		// Validar URL de portada si se proporciona
		if (urlPortada && !validarUrl(urlPortada)) {
			errores.urlPortada = MENSAJES_ERROR.urlInvalida;
		}

		// Validar fecha
		if (!fechaFinTentativa) {
			errores.fechaFinTentativa = MENSAJES_ERROR.obligatorio;
		} else if (!esFechaFutura(fechaFinTentativa)) {
			errores.fechaFinTentativa = 'La fecha de fin debe ser futura';
		}

		// Validar beneficiarios
		if (beneficiarios !== undefined && beneficiarios <= 0) {
			errores.beneficiarios = 'El número de beneficiarios debe ser mayor a 0';
		}

		// Validar categorías
		if (categoriasSeleccionadas.length === 0) {
			errores.categorias = 'Debe seleccionar al menos una categoría';
		}

		// Si eligió "Otra", validar que especifique qué
		if (seleccionoOtra) {
			const err = validarCategoriaOtraDescripcion(categoriaOtraDescripcion);
			if (err) {
				errores.categoria_otra = err;
			}
		}

		// Validar direcciones múltiples
		if (direcciones.length === 0) {
			errores.direcciones = 'Debe agregar al menos una ubicación';
		} else {
			// Lista de ubicaciones con tipo definido (sin vacíos)
			const conTipo = direcciones
				.map((d, i) => ({ i, tipo: (d.tipo_ubicacion || '').trim() }))
				.filter((x) => x.tipo);

			const principalCount = conTipo.filter((x) => x.tipo === 'principal').length;
			const tienePrincipalOVirtual = conTipo.some(
				(x) => x.tipo === 'principal' || x.tipo === 'virtual'
			);

			// Regla 1: al menos una 'principal' o 'virtual'
			if (!tienePrincipalOVirtual) {
				errores.direcciones_principal_o_virtual =
					'Debe tener al menos una ubicación de tipo "Principal" o "Virtual".';
			}

			// Regla 2: como máximo una 'principal'
			if (principalCount > 1) {
				errores.direcciones_principal_unica = 'Solo puede haber una ubicación de tipo "Principal".';
			}

			// Regla 3: si hay una sola ubicación y es principal o virtual,
			// el campo que_sehace es opcional solo para esa ubicación.
			const esUnicaBasica =
				conTipo.length === 1 && (conTipo[0].tipo === 'principal' || conTipo[0].tipo === 'virtual');
			const indiceUnicaBasica = esUnicaBasica ? conTipo[0].i : -1;

			// Validación por cada dirección
			direcciones.forEach((direccion, index) => {
				const prefix = `direccion_${index}`;
				const tipo = (direccion.tipo_ubicacion || '').trim();

				// Tipo de ubicación obligatorio
				if (!tipo) {
					errores[`${prefix}_tipo`] = 'El tipo de ubicación es obligatorio';
				}

				// 'que_sehace' obligatorio salvo el caso especial de "una sola principal/virtual"
				if (!(esUnicaBasica && index === indiceUnicaBasica)) {
					if (!direccion.que_sehace.trim()) {
						errores[`${prefix}_que_sehace`] = 'Debe especificar qué se hace en esta ubicación';
					}
				}

				// Si no es virtual, valida campos físicos obligatorios
				if (tipo && tipo !== 'virtual') {
					if (!direccion.provincia) {
						errores[`${prefix}_provincia`] = MENSAJES_ERROR.provinciaInvalida;
					} else if (!validarProvincia(direccion.provincia)) {
						errores[`${prefix}_provincia`] = MENSAJES_ERROR.provinciaInvalida;
					}

					if (!direccion.localidad_id) {
						errores[`${prefix}_localidad`] = MENSAJES_ERROR.obligatorio;
					}

					if (direccion.provincia && direccion.localidad_id) {
						const provincia = provincias.find((p) => p.nombre === direccion.provincia);
						if (
							provincia &&
							!validarCiudadEnProvincia(direccion.localidad_id, provincia.id_provincia)
						) {
							errores[`${prefix}_localidad`] = MENSAJES_ERROR.ciudadNoPerteneceProvincia;
						}
					}

					if (!direccion.calle || direccion.calle.trim() === '') {
						errores[`${prefix}_calle`] = MENSAJES_ERROR.obligatorio;
					} else if (!validarCalle(direccion.calle)) {
						errores[`${prefix}_calle`] = MENSAJES_ERROR.calleInvalida;
					}

					if (!direccion.numero || direccion.numero.trim() === '') {
						errores[`${prefix}_numero`] = MENSAJES_ERROR.obligatorio;
					} else if (!validarNumeroCalle(direccion.numero)) {
						errores[`${prefix}_numero`] = MENSAJES_ERROR.numeroCalleInvalido;
					}
				} else {
					// Para 'virtual', validar calle/número solo si los completaron
					if (direccion.calle && !validarCalle(direccion.calle)) {
						errores[`${prefix}_calle`] = MENSAJES_ERROR.calleInvalida;
					}
					if (direccion.numero && !validarNumeroCalle(direccion.numero)) {
						errores[`${prefix}_numero`] = MENSAJES_ERROR.numeroCalleInvalido;
					}
				}
			});
		}

		// Validar tipos de participación
		if (tiposParticipacionSeleccionados.length === 0) {
			errores.participacion = 'Debe seleccionar al menos un tipo de participación';
		}

		// Validar participaciones permitidas
		participacionesPermitidas.forEach((p, index) => {
			if (!p.objetivo || p.objetivo <= 0) {
				errores[`participacion_${index}_objetivo`] = 'El objetivo debe ser mayor a 0';
			}
			if (p.tipo_participacion?.descripcion === 'Especie' && !p.especie?.trim()) {
				errores[`participacion_${index}_especie`] = 'La especie es obligatoria';
			}
			// Nueva regla: si eligió "Otra", validar el string
			if (p.unidad_medida === 'Otra') {
				const errU = validarUnidadMedidaOtra(
					p.unidad_medida_otra || '',
					p.tipo_participacion?.descripcion as TipoParticipacionDescripcion | undefined
				);
				if (errU) errores[`participacion_${index}_unidad_otra`] = errU;
			}
		});

		return Object.keys(errores).length === 0;
	}

	// Función para limpiar errores específicos
	function limpiarError(campo: string) {
		if (errores[campo]) {
			const { [campo]: _omit, ...rest } = errores;
			errores = rest;
		}
	}

	// para limpiar errores cuando se corrigen
	$: if (titulo.trim()) limpiarError('titulo');
	$: if (descripcion.trim()) limpiarError('descripcion');
	$: if (urlPortada && validarUrl(urlPortada)) limpiarError('urlPortada');
	$: if (fechaFinTentativa && esFechaFutura(fechaFinTentativa)) limpiarError('fechaFinTentativa');
	$: if (beneficiarios && beneficiarios > 0) limpiarError('beneficiarios');
	$: if (categoriasSeleccionadas.length > 0) limpiarError('categorias');
	$: if (direcciones.length > 0) limpiarError('direcciones');
	$: if (tiposParticipacionSeleccionados.length > 0) limpiarError('participacion');

	function enviarFormulario() {
		if (!validarFormulario()) {
			console.log('Formulario inválido', errores);
			return;
		}

		const participaciones: ParticipacionPermitidaCreate[] = participacionesPermitidas.map((p) => ({
			tipo_participacion: (p.tipo_participacion?.descripcion ||
				'Voluntariado') as TipoParticipacionDescripcion,
			objetivo: Number(p.objetivo) || 0,
			unidad_medida: p.unidad_medida === 'Otra' ? p.unidad_medida_otra || '' : p.unidad_medida,
			especie: p.tipo_participacion?.descripcion === 'Especie' ? p.especie || '' : undefined
		}));

		const ubicaciones = direcciones
			.filter((d) => d.tipo_ubicacion !== '')
			.map((d) => ({
				tipo_ubicacion: d.tipo_ubicacion as PrioridadTipo,
				que_sehace: d.que_sehace,
				direccion: {
					calle: d.calle,
					numero: d.numero,
					referencia: d.referencia || undefined,
					localidad_id: d.localidad_id as number
				}
			}));

		const payload: ProyectoCreate = {
			titulo,
			descripcion,
			url_portada: urlPortada || undefined,
			fecha_fin_tentativa: new Date(fechaFinTentativa),
			beneficiarios,
			categoria_ids: categoriasSeleccionadas.filter((id) => Number.isFinite(id) && id > 0),
			participaciones,
			ubicaciones
		};

		console.log('Payload de creación de proyecto:', payload);
		// TODO: Enviar al backend 'payload'
	}

	// Datos para choice cards de participación
	const tiposParticipacionInfo = {
		Voluntariado: {
			icon: '🙋‍♀️',
			titulo: 'Voluntariado',
			descripcion: 'Necesitás personas que dediquen su tiempo.',
			color: 'blue'
		},
		Monetaria: {
			icon: '💰',
			titulo: 'Dinero',
			descripcion: 'Necesitás donaciones económicas.',
			color: 'green'
		},
		Especie: {
			icon: '📦',
			titulo: 'Especie',
			descripcion: 'Necesitás materiales o productos específicos.',
			color: 'orange'
		}
	} as const;

	// Unidades comunes por tipo
	const unidadesPorTipo = {
		Voluntariado: ['personas', 'horas'],
		Monetaria: ['ARS', 'USD', 'BRL'],
		Especie: [
			// Conteo
			'unidades',
			'pares',
			'docenas',
			'kits',
			// Masa
			'gramos',
			'kilogramos',
			// Volumen
			'mililitros',
			'litros',
			// Longitud
			'centímetros',
			'metros'
		]
	};
</script>

<svelte:head>
	<title>Crear Proyecto - Conectando Corazones</title>
	<meta name="description" content="Crea un nuevo proyecto para tu institución" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))]">Crear nuevo proyecto</h1>
			<p class="mt-2 text-gray-600">Complete la información para crear su proyecto</p>
		</div>

		<form on:submit|preventDefault={enviarFormulario} class="space-y-8">
			<!-- Información básica -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">Información básica</h2>

				<div class="grid gap-6">
					<!-- Título -->
					<div>
						<label for="titulo" class="mb-2 block text-sm font-medium text-gray-700">
							Título del proyecto *
						</label>
						<input
							id="titulo"
							type="text"
							bind:value={titulo}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							placeholder="Ejemplo: Infancias felices 2025"
							class:border-red-300={errores.titulo}
						/>
						{#if errores.titulo}
							<p class="mt-1 text-sm text-red-600">{errores.titulo}</p>
						{/if}
					</div>

					<!-- Descripción -->
					<div>
						<label for="descripcion" class="mb-2 block text-sm font-medium text-gray-700">
							Descripción *
						</label>
						<textarea
							id="descripcion"
							bind:value={descripcion}
							rows="4"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							placeholder="Describa su proyecto, objetivos y cómo ayudará a la comunidad..."
							class:border-red-300={errores.descripcion}
						></textarea>
						{#if errores.descripcion}
							<p class="mt-1 text-sm text-red-600">{errores.descripcion}</p>
						{/if}
					</div>

					<!-- URL Portada -->
					<div>
						<label for="urlPortada" class="mb-2 block text-sm font-medium text-gray-700">
							URL de imagen de portada
						</label>
						<input
							id="urlPortada"
							type="url"
							bind:value={urlPortada}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							class:border-red-300={errores.urlPortada}
							placeholder="https://ejemplo.com/imagen.jpg"
						/>
						{#if errores.urlPortada}
							<p class="mt-1 text-sm text-red-600">{errores.urlPortada}</p>
						{/if}
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<!-- Fecha de fin tentativa -->
						<div>
							<label for="fechaFin" class="mb-2 block text-sm font-medium text-gray-700">
								Fecha de fin tentativa *
							</label>

							<input
								id="fechaFin"
								type="date"
								lang="es-AR"
								bind:value={fechaFinTentativa}
								min={fechaMinima}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores.fechaFinTentativa}
								aria-invalid={!!errores.fechaFinTentativa}
							/>

							{#if errores.fechaFinTentativa}
								<p class="mt-1 text-sm text-red-600">{errores.fechaFinTentativa}</p>
							{:else if fechaFinTentativa}
								<!-- Texto auxiliar para homogeneizar la percepción del formato -->
								{#if fechaFinTentativa}
									<p class="mt-1 text-xs text-gray-500" aria-live="polite">
										<span class="font-bold">Seleccionaste:</span>
										{formatearFechaLarga(fechaFinTentativa, 'del')}
									</p>
								{/if}
							{/if}
						</div>

						<!-- Beneficiarios -->
						<div>
							<label for="beneficiarios" class="mb-2 block text-sm font-medium text-gray-700">
								Número de beneficiarios estimados
							</label>
							<input
								id="beneficiarios"
								type="number"
								bind:value={beneficiarios}
								min="1"
								step="1"
								inputmode="numeric"
								on:blur={normalizarBeneficiarios}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500
							focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores.beneficiarios}
								aria-invalid={!!errores.beneficiarios}
								aria-describedby="beneficiarios-help"
								placeholder="Ejemplo: 150"
							/>
							<p id="beneficiarios-help" class="mt-1 text-xs text-gray-500">
								Si no está seguro/a, déjelo vacío.
							</p>
							{#if errores.beneficiarios}
								<p class="mt-1 text-sm text-red-600">{errores.beneficiarios}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Categorías -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">
					Seleccione al menos una categoría *
				</h2>

				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
					{#each mockCategorias as categoria}
						<button
							type="button"
							on:click={() => toggleCategoria(categoria.id_categoria)}
							class="group relative flex items-center rounded-lg border-2 border-dashed p-3 transition-all duration-200 hover:shadow-sm"
							class:border-blue-500={categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
							class:bg-blue-50={categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
							class:border-gray-300={!categoriasSeleccionadas.includes(
								categoria.id_categoria ?? -1
							)}
							class:bg-white={!categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
							class:hover:border-blue-400={!categoriasSeleccionadas.includes(
								categoria.id_categoria ?? -1
							)}
							class:hover:bg-gray-50={!categoriasSeleccionadas.includes(
								categoria.id_categoria ?? -1
							)}
						>
							<!-- Icono de la categoría -->
							<span class="mr-2 flex-shrink-0 text-lg">
								{obtenerIconoCategoria(categoria.descripcion)}
							</span>

							<!-- Contenido -->
							<div class="min-w-0 flex-1 text-left">
								<span
									class="block text-xs font-medium leading-tight"
									class:text-blue-900={categoriasSeleccionadas.includes(
										categoria.id_categoria ?? -1
									)}
									class:text-gray-700={!categoriasSeleccionadas.includes(
										categoria.id_categoria ?? -1
									)}
								>
									{categoria.descripcion}
								</span>
							</div>

							<!-- Indicador de selección -->
							<div class="ml-1 flex-shrink-0">
								{#if categoriasSeleccionadas.includes(categoria.id_categoria ?? -1)}
									<div class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
										<svg class="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											></path>
										</svg>
									</div>
								{:else}
									<div
										class="h-4 w-4 rounded-full border-2 border-dashed border-gray-300 group-hover:border-blue-300"
									></div>
								{/if}
							</div>
						</button>
					{/each}
				</div>

				{#if seleccionoOtra}
					<div class="mt-4">
						<label for="categoria_otra" class="mb-2 block text-sm font-medium text-gray-700">
							Especificá la categoría *
						</label>
						<input
							id="categoria_otra"
							type="text"
							bind:value={categoriaOtraDescripcion}
							maxlength="60"
							on:blur={normalizarCategoriaOtra}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							class:border-red-300={errores.categoria_otra}
							placeholder="Ejemplo: Personas mayores, Acceso al agua, Inclusión digital…"
							aria-invalid={!!errores.categoria_otra}
						/>
						{#if errores.categoria_otra}
							<p class="mt-1 text-sm text-red-600">{errores.categoria_otra}</p>
						{/if}
					</div>
				{/if}

				{#if errores.categorias}
					<p class="mt-4 flex items-center text-sm text-red-600">
						<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							></path>
						</svg>
						{errores.categorias}
					</p>
				{/if}
			</div>

			<!-- Tipos de Participación -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-2 text-xl font-semibold text-gray-900">Tipos de participación *</h2>
				<p class="mb-6 text-gray-600">
					Defina los objetivos y cómo los colaboradores pueden ayudarle.
				</p>

				<!-- Choice Cards  -->
				{#if Object.entries(tiposParticipacionInfo).filter(([tipo]) => !tiposParticipacionSeleccionados.includes(tipo as TipoParticipacionDescripcion)).length > 0}
					<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
						{#each Object.entries(tiposParticipacionInfo) as [tipo, info]}
							{#if !tiposParticipacionSeleccionados.includes(tipo as TipoParticipacionDescripcion)}
								{@const clases = obtenerClasesColor(info.color, false)}
								<button
									type="button"
									on:click={() => toggleTipoParticipacion(tipo as TipoParticipacionDescripcion)}
									class="relative rounded-lg border-2 p-4 text-left transition-all hover:shadow-md {clases.border} {clases.bg} {clases.hover}"
								>
									<div class="mb-3 text-3xl">{info.icon}</div>
									<h3 class="mb-1 font-semibold text-gray-900">{info.titulo}</h3>
									<p class="text-sm text-gray-600">{info.descripcion}</p>
								</button>
							{/if}
						{/each}
					</div>
				{/if}

				{#if errores.participacion}
					<p class="mb-4 text-sm text-red-600">{errores.participacion}</p>
				{/if}

				<!-- Bloques dinámicos de participación seleccionada -->
				{#each participacionesPermitidas as participacion, index}
					{@const tipoInfo =
						tiposParticipacionInfo[participacion.tipo_participacion?.descripcion || 'Voluntariado']}
					{@const clases = obtenerClasesColor(tipoInfo.color, true)}
					<div class="mt-6 rounded-lg border-2 p-4 {clases.border} {clases.bg}">
						<div class="mb-4 flex items-center justify-between">
							<h4 class="flex items-center gap-2 font-medium text-gray-900">
								<span class="text-xl">{tipoInfo.icon}</span>
								{participacion.tipo_participacion?.descripcion}
								{#if participacion.tipo_participacion?.descripcion === 'Especie'}
									{@const especieItems = participacionesPermitidas.filter(
										(p) => p.tipo_participacion?.descripcion === 'Especie'
									)}
									{#if especieItems.length > 1}
										<span class="text-sm text-gray-500"
											>#{especieItems.findIndex((item) => item === participacion) + 1}</span
										>
									{/if}
								{/if}
							</h4>
							<button
								type="button"
								on:click={() => eliminarParticipacion(index)}
								class="text-gray-400 hover:text-gray-600"
								title="Eliminar"
								aria-label="Eliminar participación"
							>
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
						</div>

						<div class="grid gap-4">
							{#if participacion.tipo_participacion?.descripcion === 'Especie'}
								<!-- Campo especie para "En Especie" -->
								<div>
									<label for="especie_{index}" class="mb-2 block text-sm font-medium text-gray-700">
										¿Qué necesitás? *
									</label>
									<input
										id="especie_{index}"
										type="text"
										value={participacion.especie || ''}
										on:input={(e) => updateParticipacion(index, 'especie', e.currentTarget.value)}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
										placeholder="Ejemplo: libros, alimentos, ropa, medicamentos..."
										class:border-red-300={errores[`participacion_${index}_especie`]}
									/>
									{#if errores[`participacion_${index}_especie`]}
										<p class="mt-1 text-sm text-red-600">
											{errores[`participacion_${index}_especie`]}
										</p>
									{/if}
								</div>
							{/if}

							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<!-- Objetivo -->
								<div>
									<label
										for="objetivo_{index}"
										class="mb-2 block text-sm font-medium text-gray-700"
									>
										Objetivo *
									</label>
									<input
										id="objetivo_{index}"
										type="number"
										value={participacion.objetivo ?? 0}
										on:input={(e) =>
											updateParticipacion(index, 'objetivo', Number(e.currentTarget.value) || 0)}
										min="1"
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
										placeholder="100"
										class:border-red-300={errores[`participacion_${index}_objetivo`]}
									/>
									{#if errores[`participacion_${index}_objetivo`]}
										<p class="mt-1 text-sm text-red-600">
											{errores[`participacion_${index}_objetivo`]}
										</p>
									{/if}
								</div>

								<!-- Unidad de medida -->
								<div>
									<label for="unidad_{index}" class="mb-2 block text-sm font-medium text-gray-700">
										Unidad de medida
									</label>
									<select
										id="unidad_{index}"
										value={participacion.unidad_medida}
										on:change={(e) =>
											updateParticipacion(index, 'unidad_medida', e.currentTarget.value)}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									>
										{#each [...unidadesPorTipo[participacion.tipo_participacion?.descripcion || 'Voluntariado'], 'Otra'] as unidad}
											<option value={unidad}>{unidad}</option>
										{/each}
									</select>

									{#if participacion.unidad_medida === 'Otra'}
										<div class="mt-2">
											<label for="unidad_otra_{index}" class="mb-2 block text-sm text-gray-700">
												Especificá la unidad *
											</label>
											<input
												id="unidad_otra_{index}"
												type="text"
												value={participacion.unidad_medida_otra || ''}
												on:input={(e) =>
													updateParticipacion(index, 'unidad_medida_otra', e.currentTarget.value)}
												class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
												class:border-red-300={errores[`participacion_${index}_unidad_otra`]}
												aria-invalid={!!errores[`participacion_${index}_unidad_otra`]}
												placeholder="Ejemplo: toneladas, docentes, ARS"
												maxlength="40"
											/>
											{#if errores[`participacion_${index}_unidad_otra`]}
												<p class="mt-1 text-sm text-red-600">
													{errores[`participacion_${index}_unidad_otra`]}
												</p>
											{/if}
										</div>
									{/if}
								</div>
							</div>
							{#if objetivoListo(participacion)}
								<p class="mt-3 rounded-md bg-white/70 px-3 py-2 text-sm text-gray-800">
									{objetivoTexto(participacion)}
								</p>
							{/if}
						</div>
					</div>
				{/each}

				<!-- Botón "+ Agregar" para En Especie -->
				{#if tiposParticipacionSeleccionados.includes('Especie')}
					<div class="mt-4">
						<button
							type="button"
							on:click={agregarItemEspecie}
							class="inline-flex items-center rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:border-orange-400 hover:bg-orange-100"
						>
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								></path>
							</svg>
							Agregar otro item en especie
						</button>
					</div>
				{/if}
			</div>

			<!-- Direcciones del Proyecto -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-gray-900">Ubicaciones del proyecto *</h2>
				</div>

				{#if errores.direcciones}
					<p class="mb-4 text-sm text-red-600">{errores.direcciones}</p>
				{/if}
				{#if errores.direcciones_principal}
					<p class="mb-4 text-sm text-red-600">{errores.direcciones_principal}</p>
				{/if}

				<!-- Lista de direcciones -->
				{#each direcciones as direccion, index}
					<div class="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
						<div class="mb-4 flex items-center justify-between">
							<h3 class="font-medium text-gray-900">Ubicación {index + 1}</h3>
							{#if direcciones.length > 1 && index > 0}
								<button
									type="button"
									on:click={() => eliminarDireccion(index)}
									class="text-sm font-medium text-red-600 hover:text-red-800"
								>
									Eliminar
								</button>
							{/if}
						</div>

						<div class="grid gap-4">
							<!-- Tipo de ubicación -->
							<div>
								<label for="tipo_{index}" class="mb-2 block text-sm font-medium text-gray-700">
									Tipo de ubicación *
								</label>
								<select
									id="tipo_{index}"
									value={direccion.tipo_ubicacion}
									on:change={(e) =>
										actualizarDireccion(index, 'tipo_ubicacion', e.currentTarget.value)}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									class:border-red-300={errores[`direccion_${index}_tipo`]}
								>
									<option value="">Seleccionar tipo</option>
									{#each tiposPermitidosPara(index) as tipo}
										<option value={tipo}>{obtenerDescripcionTipo(tipo)}</option>
									{/each}
								</select>
								{#if errores[`direccion_${index}_tipo`]}
									<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_tipo`]}</p>
								{/if}
							</div>

							<!-- Qué se hace en esta dirección -->
							<div>
								<label
									for="que_sehace_{index}"
									class="mb-2 block text-sm font-medium text-gray-700"
								>
									¿Qué se hace en esta ubicación?{indiceUnicaBasica !== index ? ' *' : ''}
								</label>
								<textarea
									id="que_sehace_{index}"
									value={direccion.que_sehace}
									on:input={(e) => actualizarDireccion(index, 'que_sehace', e.currentTarget.value)}
									rows="3"
									class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									class:border-red-300={errores[`direccion_${index}_que_sehace`]}
									placeholder={obtenerPlaceholderQueSehace(direccion.tipo_ubicacion)}
								></textarea>
								{#if errores[`direccion_${index}_que_sehace`]}
									<p class="mt-1 text-sm text-red-600">
										{errores[`direccion_${index}_que_sehace`]}
									</p>
								{/if}
							</div>

							{#if direccion.tipo_ubicacion !== 'virtual'}
								<!-- Provincia y Localidad -->
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<!-- Provincia -->
									<div>
										<label
											for="provincia_{index}"
											class="mb-2 block text-sm font-medium text-gray-700"
										>
											Provincia *
										</label>
										<select
											id="provincia_{index}"
											value={direccion.provincia}
											on:change={(e) =>
												actualizarDireccion(index, 'provincia', e.currentTarget.value)}
											class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
											class:border-red-300={errores[`direccion_${index}_provincia`]}
										>
											<option value="">Seleccionar provincia</option>
											{#each provincias as provincia}
												<option value={provincia.nombre}>{provincia.nombre}</option>
											{/each}
										</select>
										{#if errores[`direccion_${index}_provincia`]}
											<p class="mt-1 text-sm text-red-600">
												{errores[`direccion_${index}_provincia`]}
											</p>
										{/if}
									</div>

									<!-- Localidad -->
									<div>
										<label
											for="localidad_{index}"
											class="mb-2 block text-sm font-medium text-gray-700"
										>
											Localidad *
										</label>
										<select
											id="localidad_{index}"
											value={direccion.localidad_id || ''}
											on:change={(e) => {
												const localidadId = e.currentTarget.value
													? parseInt(e.currentTarget.value)
													: undefined;
												const localidad = obtenerLocalidadesPorProvincia(direccion.provincia).find(
													(l) => l.id_localidad === localidadId
												);
												// Actualizar manualmente para evitar problemas de tipos
												direcciones[index] = {
													...direcciones[index],
													localidad_id: localidadId,
													localidad_nombre: localidad?.nombre || ''
												};
												direcciones = direcciones; // Trigger reactivity
											}}
											disabled={!direccion.provincia}
											class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:bg-gray-100"
											class:border-red-300={errores[`direccion_${index}_localidad`]}
										>
											<option value="">Seleccionar localidad</option>
											{#each obtenerLocalidadesPorProvincia(direccion.provincia) as localidad}
												<option value={localidad.id_localidad}>{localidad.nombre}</option>
											{/each}
										</select>
										{#if errores[`direccion_${index}_localidad`]}
											<p class="mt-1 text-sm text-red-600">
												{errores[`direccion_${index}_localidad`]}
											</p>
										{/if}
									</div>
								</div>

								<!-- Calle y Número -->
								<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
									<!-- Calle -->
									<div class="md:col-span-2">
										<label for="calle_{index}" class="mb-2 block text-sm font-medium text-gray-700">
											Calle *
										</label>
										<input
											id="calle_{index}"
											type="text"
											value={direccion.calle}
											on:input={(e) => actualizarDireccion(index, 'calle', e.currentTarget.value)}
											class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
											class:border-red-300={errores[`direccion_${index}_calle`]}
											placeholder="Nombre de la calle"
										/>
										{#if errores[`direccion_${index}_calle`]}
											<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_calle`]}</p>
										{/if}
									</div>

									<!-- Número -->
									<div>
										<label
											for="numero_{index}"
											class="mb-2 block text-sm font-medium text-gray-700"
										>
											Número *
										</label>
										<input
											id="numero_{index}"
											type="text"
											value={direccion.numero}
											on:input={(e) => actualizarDireccion(index, 'numero', e.currentTarget.value)}
											class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
											class:border-red-300={errores[`direccion_${index}_numero`]}
											placeholder="1234"
										/>
										{#if errores[`direccion_${index}_numero`]}
											<p class="mt-1 text-sm text-red-600">
												{errores[`direccion_${index}_numero`]}
											</p>
										{/if}
									</div>
								</div>

								<!-- Referencia -->
								<div>
									<label
										for="referencia_{index}"
										class="mb-2 block text-sm font-medium text-gray-700"
									>
										Referencia
									</label>
									<input
										id="referencia_{index}"
										type="text"
										value={direccion.referencia}
										on:input={(e) =>
											actualizarDireccion(index, 'referencia', e.currentTarget.value)}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
										placeholder="Ejemplo: frente a la plaza principal"
									/>
								</div>
							{/if}
						</div>
					</div>
				{/each}

				<!-- Botón para agregar nueva dirección -->
				<div class="flex justify-center">
					<button
						type="button"
						on:click={agregarDireccion}
						class="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
					>
						<span class="text-xl">+</span>
						Agregar ubicación
					</button>
				</div>
			</div>

			<!-- Botones -->
			<div class="flex justify-end gap-4">
				<Button label="Guardar borrador" variant="secondary" size="md" type="button" />
				<Button label="Crear proyecto" variant="primary" size="md" type="submit" />
			</div>
		</form>
	</div>
</main>
