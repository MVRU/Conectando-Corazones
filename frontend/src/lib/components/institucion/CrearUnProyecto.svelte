<!--
* Componente: CrearProyecto
* Descripción: Formulario para que las instituciones creen nuevos proyectos
-->

<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import { PRIORIDAD_TIPO } from '$lib/types/Proyecto_direccion';
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
		esFechaFutura,
	} from '$lib/utils/validaciones';
	

	// Form data
	let titulo = '';
	let descripcion = '';
	let urlPortada = '';
	let fechaFinTentativa = '';
	let beneficiarios: number | undefined = undefined;

	// Categorías seleccionadas
	let categoriasSeleccionadas: number[] = [];

	// Direcciones del proyecto
	interface DireccionFormulario {
		// Campos de ProyectoUbicacion
		tipo_ubicacion: string;
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
	let participacionesPermitidas: Partial<ParticipacionPermitida>[] = [];

	// Validaciones
	let errores: Record<string, string> = {};

	// Fecha mínima para la fecha de fin (hoy)
	$: fechaMinima = new Date().toISOString().split('T')[0];

	// Función helper para obtener localidades de una provincia por nombre
	function obtenerLocalidadesPorProvincia(nombreProvincia: string) {
		const provincia = provincias.find(p => p.nombre === nombreProvincia);
		if (!provincia) return [];
		return mockLocalidades.filter(l => l.id_provincia === provincia.id_provincia);
	}

	function agregarDireccion() {
		direcciones = [...direcciones, {
			tipo_ubicacion: '',
			que_sehace: '',
			calle: '',
			numero: '',
			referencia: '',
			localidad_id: undefined,
			provincia: '',
			localidad_nombre: ''
		}];
	}

	function eliminarDireccion(index: number) {
		if (direcciones.length > 1) {
			direcciones = direcciones.filter((_, i) => i !== index);
		}
	}

	function actualizarDireccion(index: number, campo: keyof DireccionFormulario, valor: any) {
		direcciones[index] = { ...direcciones[index], [campo]: valor };
		
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

	function obtenerPlaceholderQueSehace(tipo: string): string {
		switch (tipo) {
			case 'principal':
				return 'Ejemplo: Aquí se realiza el voluntariado';
			case 'alternativa':
				return 'Ejemplo: Aquí se juntan los juguetes desde las 16hs hasta las 18hs';
			case 'virtual':
				return 'Ejemplo: Se realizan las reuniones virtuales los días martes a las 19hs';
			case 'voluntariado':
				return 'Ejemplo: Lugar donde se desarrollan las actividades de voluntariado';
			default:
				return 'Describe las actividades que se realizan en esta dirección...';
		}
	}

	function obtenerDescripcionTipo(tipo: string): string {
		
		return tipo.charAt(0).toUpperCase() + tipo.slice(1);
	}

	function obtenerIconoCategoria(descripcion: string): string {
		const iconos: Record<string, string> = {
			'Medioambiente': '🌱',
			'Educación': '📚',
			'Salud': '🏥',
			'Desarrollo económico': '💼',
			'Promoción de la paz': '🕊️',
			'Seguridad': '🛡️',
			'Entretenimiento': '🎭',
			'Liderazgo': '👑',
			'Personas con discapacidades': '♿',
			'Tecnología': '💻',
			'Política': '🏛️',
			'Religión': '⛪',
			'LGTBQ+': '🏳️‍🌈',
			'Apoyo ante una crisis': '🆘',
			'Empleo': '👷',
			'Inmigrantes y refugiados': '🤝',
			'Otro': '📋'
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

	// Funciones de categorías
	function toggleCategoria(categoriaId: number) {
		if (categoriasSeleccionadas.includes(categoriaId)) {
			categoriasSeleccionadas = categoriasSeleccionadas.filter(id => id !== categoriaId);
		} else {
			categoriasSeleccionadas = [...categoriasSeleccionadas, categoriaId];
		}
	}

	// Funciones de participación
	function toggleTipoParticipacion(tipo: TipoParticipacionDescripcion) {
		if (tiposParticipacionSeleccionados.includes(tipo)) {
			// Remover tipo
			tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter(t => t !== tipo);
			// Remover todas las participaciones asociadas
			participacionesPermitidas = participacionesPermitidas.filter(p => 
				p.tipo_participacion?.descripcion !== tipo
			);
		} else {
			// Agregar tipo
			tiposParticipacionSeleccionados = [...tiposParticipacionSeleccionados, tipo];
			// Agregar participación base
			participacionesPermitidas = [...participacionesPermitidas, {
				tipo_participacion: { descripcion: tipo },
				objetivo: 0,
				actual: 0,
				unidad_medida: tipo === 'Monetaria' ? 'pesos' : tipo === 'Voluntariado' ? 'personas' : 'unidades',
				especie: tipo === 'Especie' ? '' : undefined
			}];
		}
	}

	function updateParticipacion(index: number, field: keyof ParticipacionPermitida, value: any) {
		participacionesPermitidas[index] = {
			...participacionesPermitidas[index],
			[field]: value
		};
	}

	function agregarItemEspecie() {
		participacionesPermitidas = [...participacionesPermitidas, {
			tipo_participacion: { descripcion: 'Especie' },
			objetivo: 0,
			unidad_medida: 'unidades',
			especie: ''
		}];
	}

	function eliminarParticipacion(index: number) {
		const participacion = participacionesPermitidas[index];
		const tipo = participacion.tipo_participacion?.descripcion;
		
		// Eliminar la participación
		participacionesPermitidas = participacionesPermitidas.filter((_, i) => i !== index);
		
		// Si era el último item de este tipo y no es "Especie", remover el tipo de seleccionados
		if (tipo && tipo !== 'Especie') {
			const tieneOtrosDelMismoTipo = participacionesPermitidas.some(p => p.tipo_participacion?.descripcion === tipo);
			if (!tieneOtrosDelMismoTipo) {
				tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter(t => t !== tipo);
			}
		}
		
		// Para "Especie", si no quedan items, remover el tipo
		if (tipo === 'Especie') {
			const tieneEspecies = participacionesPermitidas.some(p => p.tipo_participacion?.descripcion === 'Especie');
			if (!tieneEspecies) {
				tiposParticipacionSeleccionados = tiposParticipacionSeleccionados.filter(t => t !== 'Especie');
			}
		}
	}

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

		// Validar direcciones múltiples
		if (direcciones.length === 0) {
			errores.direcciones = 'Debe agregar al menos una dirección';
		} else {
			// Validar cada dirección
			direcciones.forEach((direccion, index) => {
				const prefix = `direccion_${index}`;
				
				// Tipo de ubicación obligatorio
				if (!direccion.tipo_ubicacion.trim()) {
					errores[`${prefix}_tipo`] = 'El tipo de ubicación es obligatorio';
				}
				
				// Qué se hace obligatorio
				if (!direccion.que_sehace.trim()) {
					errores[`${prefix}_que_sehace`] = 'Debe especificar qué se hace en esta dirección';
				}
				
				// Solo validar campos físicos si no es virtual
				if (direccion.tipo_ubicacion !== 'virtual') {
					// Provincia obligatoria y válida
					if (!direccion.provincia) {
						errores[`${prefix}_provincia`] = MENSAJES_ERROR.provinciaInvalida;
					} else if (!validarProvincia(direccion.provincia)) {
						errores[`${prefix}_provincia`] = MENSAJES_ERROR.provinciaInvalida;
					}
					
					// Localidad obligatoria
					if (!direccion.localidad_id) {
						errores[`${prefix}_localidad`] = MENSAJES_ERROR.obligatorio;
					}
					
					// Validar que la localidad pertenezca a la provincia
					if (direccion.provincia && direccion.localidad_id) {
						const provincia = provincias.find(p => p.nombre === direccion.provincia);
						if (provincia && !validarCiudadEnProvincia(direccion.localidad_id, provincia.id_provincia)) {
							errores[`${prefix}_localidad`] = MENSAJES_ERROR.ciudadNoPerteneceProvincia;
						}
					}
					
					// Validar dirección - calle y número son obligatorios para ubicaciones no virtuales
					if (direccion.tipo_ubicacion !== 'virtual') {
						// Calle es obligatoria
						if (!direccion.calle || direccion.calle.trim() === '') {
							errores[`${prefix}_calle`] = MENSAJES_ERROR.obligatorio;
						} else if (!validarCalle(direccion.calle)) {
							errores[`${prefix}_calle`] = MENSAJES_ERROR.calleInvalida;
						}
						
						// Número es obligatorio
						if (!direccion.numero || direccion.numero.trim() === '') {
							errores[`${prefix}_numero`] = MENSAJES_ERROR.obligatorio;
						} else if (!validarNumeroCalle(direccion.numero)) {
							errores[`${prefix}_numero`] = MENSAJES_ERROR.numeroCalleInvalido;
						}
					} else {
						// Para ubicaciones virtuales, validar solo si se proporcionan
						if (direccion.calle && !validarCalle(direccion.calle)) {
							errores[`${prefix}_calle`] = MENSAJES_ERROR.calleInvalida;
						}
						if (direccion.numero && !validarNumeroCalle(direccion.numero)) {
							errores[`${prefix}_numero`] = MENSAJES_ERROR.numeroCalleInvalido;
						}
					}
				}
			});
			
			// Validar que haya al menos una dirección principal
			const tienesPrincipal = direcciones.some(d => d.tipo_ubicacion === 'principal');
			if (!tienesPrincipal) {
				errores.direcciones_principal = 'Debe tener al menos una dirección principal';
			}
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
		});

		return Object.keys(errores).length === 0;
	}

	// Función para limpiar errores específicos
	function limpiarError(campo: string) {
		if (errores[campo]) {
			errores = { ...errores };
			delete errores[campo];
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

		const nuevoProyecto: Partial<Proyecto> = {
			titulo,
			descripcion,
			url_portada: urlPortada || undefined,
			fecha_fin_tentativa: new Date(fechaFinTentativa),
			beneficiarios,
			categoria_ids: categoriasSeleccionadas,
			participacion_permitida: participacionesPermitidas as ParticipacionPermitida[]
		};

		console.log('Proyecto a crear:', nuevoProyecto);
		console.log('Direcciones del proyecto:', direcciones);
		// TODO: Enviar al backend tanto 'nuevoProyecto' como 'direcciones'
	}

	// Datos para choice cards de participación
	const tiposParticipacionInfo = {
		'Voluntariado': {
			icon: '🙋‍♀️',
			titulo: 'Voluntariado',
			descripcion: 'Necesitas personas que dediquen su tiempo',
			color: 'blue'
		},
		'Monetaria': {
			icon: '💰',
			titulo: 'Dinero',
			descripcion: 'Necesitas donaciones económicas',
			color: 'green'
		},
		'Especie': {
			icon: '📦',
			titulo: 'En Especie',
			descripcion: 'Necesitas materiales o productos específicos',
			color: 'orange'
		}
	} as const;

	// Unidades comunes por tipo
	const unidadesPorTipo = {
		'Voluntariado': ['personas', 'horas'],
		'Monetaria': ['pesos', 'dólares'],
		'Especie': ['unidades', 'kilogramos', 'litros', 'metros', 'cajas', 'bolsas']
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
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))]">Crear Nuevo Proyecto</h1>
			<p class="mt-2 text-gray-600">Completa la información para crear tu proyecto</p>
		</div>

		<form on:submit|preventDefault={enviarFormulario} class="space-y-8">
			<!-- Información básica -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">Información Básica</h2>
				
				<div class="grid gap-6">
					<!-- Título -->
					<div>
						<label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
							Título del Proyecto *
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
						<label for="descripcion" class="block text-sm font-medium text-gray-700 mb-2">
							Descripción *
						</label>
						<textarea
							id="descripcion"
							bind:value={descripcion}
							rows="4"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
							placeholder="Describe tu proyecto, objetivos y cómo ayudará a la comunidad..."
							class:border-red-300={errores.descripcion}
						></textarea>
						{#if errores.descripcion}
							<p class="mt-1 text-sm text-red-600">{errores.descripcion}</p>
						{/if}
					</div>

					<!-- URL Portada -->
					<div>
						<label for="urlPortada" class="block text-sm font-medium text-gray-700 mb-2">
							URL de Imagen de Portada
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

					<!-- Fecha fin y beneficiarios  -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Fecha fin tentativa -->
						<div>
							<label for="fechaFin" class="block text-sm font-medium text-gray-700 mb-2">
								Fecha de Fin Tentativa *
							</label>
							<input
								id="fechaFin"
								type="date"
								bind:value={fechaFinTentativa}
								min={fechaMinima}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores.fechaFinTentativa}
							/>
							{#if errores.fechaFinTentativa}
								<p class="mt-1 text-sm text-red-600">{errores.fechaFinTentativa}</p>
							{/if}
						</div>

						<!-- Beneficiarios -->
						<div>
							<label for="beneficiarios" class="block text-sm font-medium text-gray-700 mb-2">
								Número de Beneficiarios Estimados
							</label>
							<input
								id="beneficiarios"
								type="number"
								bind:value={beneficiarios}
								min="1"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
								class:border-red-300={errores.beneficiarios}
								placeholder="Ejemplo: 150"
							/>
							{#if errores.beneficiarios}
								<p class="mt-1 text-sm text-red-600">{errores.beneficiarios}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Categorías -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">Seleccione al menos una categoría *</h2>
				
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
					{#each mockCategorias as categoria}
						<button
							type="button"
							on:click={() => toggleCategoria(categoria.id_categoria || 0)}
							class="group relative flex items-center p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:shadow-sm"
							class:border-blue-500={categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
							class:bg-blue-50={categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
							class:border-gray-300={!categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
							class:bg-white={!categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
							class:hover:border-blue-400={!categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
							class:hover:bg-gray-50={!categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
						>
							<!-- Icono de la categoría -->
							<span class="text-lg mr-2 flex-shrink-0">
								{obtenerIconoCategoria(categoria.descripcion)}
							</span>
							
							<!-- Contenido -->
							<div class="flex-1 text-left min-w-0">
								<span class="text-xs font-medium leading-tight block"
									class:text-blue-900={categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
									class:text-gray-700={!categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
								>
									{categoria.descripcion}
								</span>
							</div>
							
							<!-- Indicador de selección -->
							<div class="flex-shrink-0 ml-1">
								{#if categoriasSeleccionadas.includes(categoria.id_categoria || 0)}
									<div class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
										<svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
										</svg>
									</div>
								{:else}
									<div class="w-4 h-4 border-2 border-dashed border-gray-300 rounded-full group-hover:border-blue-300"></div>
								{/if}
							</div>
						</button>
					{/each}
				</div>
				
				{#if errores.categorias}
					<p class="mt-4 text-sm text-red-600 flex items-center">
						<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
						</svg>
						{errores.categorias}
					</p>
				{/if}
			</div>

			<!-- Tipos de Participación -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold text-gray-900">Tipos de Participación *</h2>
				
				<!-- Choice Cards  -->
				{#if Object.entries(tiposParticipacionInfo).filter(([tipo]) => !tiposParticipacionSeleccionados.includes(tipo as TipoParticipacionDescripcion)).length > 0}
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{#each Object.entries(tiposParticipacionInfo) as [tipo, info]}
							{#if !tiposParticipacionSeleccionados.includes(tipo as TipoParticipacionDescripcion)}
								{@const clases = obtenerClasesColor(info.color, false)}
								<button
									type="button"
									on:click={() => toggleTipoParticipacion(tipo as TipoParticipacionDescripcion)}
									class="relative rounded-lg border-2 p-4 text-left transition-all hover:shadow-md {clases.border} {clases.bg} {clases.hover}"
								>
									<div class="text-3xl mb-3">{info.icon}</div>
									<h3 class="font-semibold text-gray-900 mb-1">{info.titulo}</h3>
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
					{@const tipoInfo = tiposParticipacionInfo[participacion.tipo_participacion?.descripcion || 'Voluntariado']}
					{@const clases = obtenerClasesColor(tipoInfo.color, true)}
					<div class="mt-6 rounded-lg border-2 p-4 {clases.border} {clases.bg}">
						<div class="flex items-center justify-between mb-4">
							<h4 class="flex items-center gap-2 font-medium text-gray-900">
								<span class="text-xl">{tipoInfo.icon}</span>
								{participacion.tipo_participacion?.descripcion}
								{#if participacion.tipo_participacion?.descripcion === 'Especie'}
									{@const especieItems = participacionesPermitidas.filter(p => p.tipo_participacion?.descripcion === 'Especie')}
									{#if especieItems.length > 1}
										<span class="text-sm text-gray-500">#{especieItems.findIndex(item => item === participacion) + 1}</span>
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
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
								</svg>
							</button>
						</div>

						<div class="grid gap-4">
							{#if participacion.tipo_participacion?.descripcion === 'Especie'}
								<!-- Campo especie para "En Especie" -->
								<div>
									<label for="especie_{index}" class="block text-sm font-medium text-gray-700 mb-2">
										¿Qué necesitas? *
									</label>
									<input
										id="especie_{index}"
										type="text"
										bind:value={participacion.especie}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
										placeholder="Ejemplo: libros, alimentos, ropa, medicamentos..."
										class:border-red-300={errores[`participacion_${index}_especie`]}
									/>
									{#if errores[`participacion_${index}_especie`]}
										<p class="mt-1 text-sm text-red-600">{errores[`participacion_${index}_especie`]}</p>
									{/if}
								</div>
							{/if}

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<!-- Objetivo -->
								<div>
									<label for="objetivo_{index}" class="block text-sm font-medium text-gray-700 mb-2">
										Objetivo *
									</label>
									<input
										id="objetivo_{index}"
										type="number"
										bind:value={participacion.objetivo}
										min="1"
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
										placeholder="100"
										class:border-red-300={errores[`participacion_${index}_objetivo`]}
									/>
									{#if errores[`participacion_${index}_objetivo`]}
										<p class="mt-1 text-sm text-red-600">{errores[`participacion_${index}_objetivo`]}</p>
									{/if}
								</div>

								<!-- Unidad de medida -->
								<div>
									<label for="unidad_{index}" class="block text-sm font-medium text-gray-700 mb-2">
										Unidad de Medida
									</label>
									<select
										id="unidad_{index}"
										bind:value={participacion.unidad_medida}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									>
										{#each unidadesPorTipo[participacion.tipo_participacion?.descripcion || 'Voluntariado'] as unidad}
											<option value={unidad}>{unidad}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<!-- Botón "+ Agregar" para En Especie -->
				{#if tiposParticipacionSeleccionados.includes('Especie')}
					<div class="mt-4">
						<button
							type="button"
							on:click={agregarItemEspecie}
							class="inline-flex items-center px-3 py-2 border border-dashed border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-colors"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
							Agregar otro item en especie
						</button>
					</div>
				{/if}
			</div>

			<!-- Direcciones del Proyecto -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between mb-3">
					<h2 class="text-xl font-semibold text-gray-900">Direcciones del Proyecto *</h2>
				</div>

				{#if errores.direcciones}
					<p class="mb-4 text-sm text-red-600">{errores.direcciones}</p>
				{/if}
				{#if errores.direcciones_principal}
					<p class="mb-4 text-sm text-red-600">{errores.direcciones_principal}</p>
				{/if}

				<!-- Lista de direcciones -->
				{#each direcciones as direccion, index}
					<div class="rounded-lg border border-gray-100 bg-gray-50 p-4 mb-4">
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-medium text-gray-900">Dirección {index + 1}</h3>
							{#if direcciones.length > 1}
								<button
									type="button"
									on:click={() => eliminarDireccion(index)}
									class="text-red-600 hover:text-red-800 text-sm font-medium"
								>
									Eliminar
								</button>
							{/if}
						</div>

						<div class="grid gap-4">
							<!-- Tipo de ubicación -->
							<div>
								<label for="tipo_{index}" class="block text-sm font-medium text-gray-700 mb-2">
									Tipo de Ubicación *
								</label>
								<select
									id="tipo_{index}"
									value={direccion.tipo_ubicacion}
									on:change={(e) => actualizarDireccion(index, 'tipo_ubicacion', e.currentTarget.value)}
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
									class:border-red-300={errores[`direccion_${index}_tipo`]}
								>
									<option value="">Seleccionar tipo</option>
									{#each PRIORIDAD_TIPO as tipo}
										<option value={tipo}>{obtenerDescripcionTipo(tipo)}</option>
									{/each}
								</select>
								{#if errores[`direccion_${index}_tipo`]}
									<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_tipo`]}</p>
								{/if}
							</div>

							<!-- Qué se hace en esta dirección -->
							<div>
								<label for="que_sehace_{index}" class="block text-sm font-medium text-gray-700 mb-2">
									¿Qué se hace en esta dirección? *
								</label>
								<textarea
									id="que_sehace_{index}"
									value={direccion.que_sehace}
									on:input={(e) => actualizarDireccion(index, 'que_sehace', e.currentTarget.value)}
									rows="3"
									class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 resize-none"
									class:border-red-300={errores[`direccion_${index}_que_sehace`]}
									placeholder={obtenerPlaceholderQueSehace(direccion.tipo_ubicacion)}
								></textarea>
								{#if errores[`direccion_${index}_que_sehace`]}
									<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_que_sehace`]}</p>
								{/if}
							</div>

							{#if direccion.tipo_ubicacion !== 'virtual'}
								<!-- Provincia y Localidad -->
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<!-- Provincia -->
									<div>
										<label for="provincia_{index}" class="block text-sm font-medium text-gray-700 mb-2">
											Provincia *
										</label>
										<select
											id="provincia_{index}"
											value={direccion.provincia}
											on:change={(e) => actualizarDireccion(index, 'provincia', e.currentTarget.value)}
											class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
											class:border-red-300={errores[`direccion_${index}_provincia`]}
										>
											<option value="">Seleccionar provincia</option>
											{#each provincias as provincia}
												<option value={provincia.nombre}>{provincia.nombre}</option>
											{/each}
										</select>
										{#if errores[`direccion_${index}_provincia`]}
											<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_provincia`]}</p>
										{/if}
									</div>

									<!-- Localidad -->
									<div>
										<label for="localidad_{index}" class="block text-sm font-medium text-gray-700 mb-2">
											Localidad *
										</label>
										<select
											id="localidad_{index}"
											value={direccion.localidad_id || ''}
											on:change={(e) => {
												const localidadId = e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined;
												const localidad = obtenerLocalidadesPorProvincia(direccion.provincia).find(l => l.id_localidad === localidadId);
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
											<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_localidad`]}</p>
										{/if}
									</div>
								</div>

								<!-- Calle y Número -->
								<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
									<!-- Calle -->
									<div class="md:col-span-2">
										<label for="calle_{index}" class="block text-sm font-medium text-gray-700 mb-2">
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
										<label for="numero_{index}" class="block text-sm font-medium text-gray-700 mb-2">
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
											<p class="mt-1 text-sm text-red-600">{errores[`direccion_${index}_numero`]}</p>
										{/if}
									</div>
								</div>

								<!-- Referencia -->
								<div>
									<label for="referencia_{index}" class="block text-sm font-medium text-gray-700 mb-2">
										Referencia
									</label>
									<input
										id="referencia_{index}"
										type="text"
										value={direccion.referencia}
										on:input={(e) => actualizarDireccion(index, 'referencia', e.currentTarget.value)}
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
										placeholder="Ejemplo: Frente a la plaza principal"
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
						class="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
					>
						<span class="text-xl">+</span>
						Agregar Dirección
					</button>
				</div>
			</div>

			<!-- Botones -->
			<div class="flex justify-end gap-4">
				<Button
					label="Cancelar"
					variant="secondary"
					size="md"
					type="button"
				/>
				<Button
					label="Crear Proyecto"
					variant="primary"
					size="md"
					type="submit"
				/>
			</div>
		</form>
	</div>
</main>
