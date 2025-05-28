<!--
* Página: Detalle del Proyecto
	-*- Descripción: Muestra información completa de un proyecto específico
	-*- Funcionalidad: Detalle completo, progreso, solicitudes de colaboración y evidencia

* Props:
	-*- params.id (string): ID del proyecto desde la URL

TODO:
	- [ ] Implementar formulario de solicitud de colaboración
	- [ ] Conectar con backend para datos reales
	- [ ] Implementar subida de evidencia (roles futuros)
	- [ ] Agregar sistema de comentarios/actualizaciones
-->

<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ui/ProjectCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	// Obtener ID del proyecto desde la URL
	$: proyectoId = parseInt($page.params.id);
	
	let proyecto: any = null;
	let mostrarFormularioColaboracion = false;
	let solicitudEnviada = false;

	// Datos de ejemplo - en producción vendría del backend
	const proyectos = [
		{
			id: 1,
			nombre: 'Centro de Rehabilitación Infantil',
			descripcion: 'Construcción de un centro especializado para la rehabilitación de niños con discapacidades motoras. El centro contará con equipamiento de última generación para terapias físicas, ocupacionales y del habla. Necesitamos fondos para equipamiento médico y acondicionamiento de las instalaciones.',
			institucion: 'Fundación Sonrisas',
			fechaInicio: '2024-01-15',
			fechaCierre: '2024-06-30',
			provincia: 'Buenos Aires',
			ciudad: 'La Plata',
			tipoParticipacion: 'Monetaria',
			objetivo: '$50.000.000',
			progreso: 32000000,
			objetivoNumerico: 50000000,
			unidadMedida: 'pesos',
			estado: 'Activo',
			urgencia: 'Alta',
			beneficiarios: 150,
			solicitudesColaboracion: 12,
			contacto: {
				responsable: 'María González',
				telefono: '+54 221 456-7890',
				email: 'contacto@fundacionsonrisas.org',
				sitioWeb: 'www.fundacionsonrisas.org'
			},
			evidencia: [
				{
					id: 1,
					titulo: 'Planos del centro',
					descripcion: 'Diseños arquitectónicos aprobados por el municipio',
					fecha: '2024-01-10',
					tipo: 'Documento',
					url: '#'
				},
				{
					id: 2,
					titulo: 'Terreno adquirido',
					descripcion: 'Escritura del terreno donde se construirá el centro',
					fecha: '2024-01-20',
					tipo: 'Documento',
					url: '#'
				}
			],
			actualizaciones: [
				{
					id: 1,
					fecha: '2024-03-15',
					titulo: 'Inicio de obra',
					descripcion: 'Comenzaron los trabajos de excavación y preparación del terreno.'
				},
				{
					id: 2,
					fecha: '2024-02-28',
					titulo: 'Permisos obtenidos',
					descripcion: 'Se obtuvieron todos los permisos municipales necesarios para la construcción.'
				}
			]
		},
		{
			id: 2,
			nombre: 'Colchones para Refugio Temporal',
			descripcion: 'Se necesitan colchones nuevos y en buen estado para el refugio de familias desplazadas por la emergencia climática. Los colchones deben ser de plaza y media o matrimoniales, en condiciones óptimas de higiene.',
			institucion: 'ONG Manos Solidarias',
			fechaInicio: '2024-02-01',
			fechaCierre: '2024-04-30',
			provincia: 'Santa Fe',
			ciudad: 'Rosario',
			tipoParticipacion: 'Materiales',
			objetivo: '25 colchones',
			progreso: 18,
			objetivoNumerico: 25,
			unidadMedida: 'colchones',
			estado: 'Activo',
			urgencia: 'Media',
			beneficiarios: 75,
			solicitudesColaboracion: 8,
			contacto: {
				responsable: 'Carlos Rodríguez',
				telefono: '+54 341 123-4567',
				email: 'voluntarios@manossolidarias.org',
				sitioWeb: 'www.manossolidarias.org'
			},
			evidencia: [
				{
					id: 1,
					titulo: 'Estado del refugio',
					descripcion: 'Fotos del refugio donde se ubicarán los colchones',
					fecha: '2024-02-05',
					tipo: 'Imagen',
					url: '#'
				}
			],
			actualizaciones: [
				{
					id: 1,
					fecha: '2024-03-10',
					titulo: 'Primera entrega',
					descripcion: 'Recibimos 8 colchones en perfectas condiciones, muchas gracias a los donantes.'
				}
			]
		}
	];

	// Función para cargar proyecto
	function cargarProyecto() {
		proyecto = proyectos.find(p => p.id === proyectoId);
		
		// Establecer breadcrumbs con el nombre del proyecto
		if (proyecto) {
			setBreadcrumbs([
				BREADCRUMB_ROUTES.home,
				BREADCRUMB_ROUTES.projects,
				{ label: proyecto.nombre } // Sin href porque es la página actual
			]);
		}
	}

	// Función para formatear fechas
	function formatearFecha(fecha: string) {
		return new Date(fecha).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Función para calcular porcentaje de progreso
	function calcularPorcentajeProgreso() {
		if (!proyecto) return 0;
		return Math.min((proyecto.progreso / proyecto.objetivoNumerico) * 100, 100);
	}

	// Función para formatear montos
	function formatearMonto(cantidad: number) {
		if (proyecto?.tipoParticipacion === 'Monetaria') {
			return `$${cantidad.toLocaleString()}`;
		}
		return cantidad.toString();
	}

	// Función para obtener color de progreso
	function getColorProgreso(tipo: string) {
		switch (tipo) {
			case 'Monetaria': return 'bg-[rgb(var(--color-primary))]';
			case 'Voluntariado': return 'bg-purple-500';
			case 'Materiales': return 'bg-green-500';
			default: return 'bg-gray-400';
		}
	}

	// Función para obtener color del badge
	function getColorUrgencia(urgencia: string) {
		switch (urgencia) {
			case 'Alta': return 'text-red-600 bg-red-100';
			case 'Media': return 'text-yellow-600 bg-yellow-100';
			case 'Baja': return 'text-green-600 bg-green-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	// Función para obtener color del estado
	function getColorEstado(estado: string) {
		switch (estado) {
			case 'Activo': return 'text-green-600 bg-green-100';
			case 'Próximo a cerrar': return 'text-orange-600 bg-orange-100';
			case 'Cerrado': return 'text-gray-600 bg-gray-100';
			case 'Completado': return 'text-blue-600 bg-blue-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	// Función para mostrar formulario de colaboración
	function mostrarFormulario() {
		mostrarFormularioColaboracion = true;
	}

	// Función para enviar solicitud de colaboración
	function enviarSolicitud(event: Event) {
		event.preventDefault();
		// Aquí se enviaría la solicitud al backend
		solicitudEnviada = true;
		mostrarFormularioColaboracion = false;
		
		setTimeout(() => {
			solicitudEnviada = false;
		}, 5000);
	}

	// Cargar proyecto al montar
	onMount(() => {
		cargarProyecto();
	});
</script>

<svelte:head>
	<title>{proyecto?.nombre || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-gray-50 py-8">
		<div class="max-w-7xl mx-auto px-8">
			<!-- Notificación de solicitud enviada -->
			{#if solicitudEnviada}
				<div class="mb-8 p-4 bg-green-100 border border-green-200 rounded-lg">
					<p class="text-green-700 font-medium">✅ Tu solicitud de colaboración fue enviada correctamente. La institución la revisará y te contactará pronto.</p>
				</div>
			{/if}

			<div class="grid lg:grid-cols-3 gap-8">
				<!-- Contenido principal -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Header del proyecto -->
					<div class="bg-white rounded-2xl shadow-lg p-8">
						<div class="flex flex-wrap justify-between items-start mb-6">
							<div>
								<h1 class="text-3xl font-bold text-[rgb(var(--base-color))] mb-2">
									{proyecto.nombre}
								</h1>
								<p class="text-lg text-gray-600 mb-4">
									📍 {proyecto.ciudad}, {proyecto.provincia}
								</p>
								<div class="flex items-center gap-3">
									<Badge text={proyecto.tipoParticipacion} shape="square" />
									<span class="px-2 py-1 rounded-full text-xs font-medium {getColorUrgencia(proyecto.urgencia)}">
										{proyecto.urgencia}
									</span>
									<span class="px-2 py-1 rounded-full text-xs font-medium {getColorEstado(proyecto.estado)}">
										{proyecto.estado}
									</span>
								</div>
							</div>
						</div>

						<!-- Progreso del proyecto -->
						<div class="mb-8">
							<div class="flex justify-between items-center mb-3">
								<h3 class="text-xl font-semibold text-[rgb(var(--base-color))]">Progreso del Objetivo</h3>
								<span class="text-2xl font-bold text-[rgb(var(--color-primary))]">
									{formatearMonto(proyecto.progreso)} / {proyecto.objetivo}
								</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-4 mb-2">
								<div 
									class="h-4 rounded-full transition-all duration-300 {getColorProgreso(proyecto.tipoParticipacion)}" 
									style="width: {calcularPorcentajeProgreso()}%"
								></div>
							</div>
							<div class="flex justify-between text-sm text-gray-600">
								<span>{calcularPorcentajeProgreso().toFixed(1)}% completado</span>
								<span>{proyecto.solicitudesColaboracion} solicitudes pendientes</span>
							</div>
						</div>

						<!-- Descripción completa -->
						<div class="mb-8">
							<h3 class="text-xl font-semibold text-[rgb(var(--base-color))] mb-4">Descripción del Proyecto</h3>
							<p class="text-gray-700 leading-relaxed text-lg">
								{proyecto.descripcion}
							</p>
						</div>

						<!-- Información del proyecto -->
						<div class="grid md:grid-cols-2 gap-6 mb-8">
							<div class="bg-gray-50 rounded-lg p-4">
								<h4 class="font-semibold text-[rgb(var(--base-color))] mb-2">Institución</h4>
								<p class="text-gray-700">{proyecto.institucion}</p>
							</div>
							<div class="bg-gray-50 rounded-lg p-4">
								<h4 class="font-semibold text-[rgb(var(--base-color))] mb-2">Beneficiarios</h4>
								<p class="text-gray-700">{proyecto.beneficiarios} personas</p>
							</div>
							<div class="bg-gray-50 rounded-lg p-4">
								<h4 class="font-semibold text-[rgb(var(--base-color))] mb-2">Fecha de inicio</h4>
								<p class="text-gray-700">{formatearFecha(proyecto.fechaInicio)}</p>
							</div>
							<div class="bg-gray-50 rounded-lg p-4">
								<h4 class="font-semibold text-[rgb(var(--base-color))] mb-2">Fecha de cierre</h4>
								<p class="text-gray-700">{formatearFecha(proyecto.fechaCierre)}</p>
							</div>
						</div>

						<!-- Actualizaciones del proyecto -->
						{#if proyecto.actualizaciones && proyecto.actualizaciones.length > 0}
							<div class="mb-8">
								<h3 class="text-xl font-semibold text-[rgb(var(--base-color))] mb-4">Actualizaciones del Proyecto</h3>
								<div class="space-y-4">
									{#each proyecto.actualizaciones as actualizacion}
										<div class="border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-4 rounded-r-lg">
											<div class="flex justify-between items-start mb-2">
												<h4 class="font-semibold text-[rgb(var(--base-color))]">{actualizacion.titulo}</h4>
												<span class="text-sm text-gray-500">{formatearFecha(actualizacion.fecha)}</span>
											</div>
											<p class="text-gray-700">{actualizacion.descripcion}</p>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Sección de Evidencia (preparada para roles futuros) -->
						<div class="mb-8">
							<h3 class="text-xl font-semibold text-[rgb(var(--base-color))] mb-4">Evidencia del Proyecto</h3>
							{#if proyecto.evidencia && proyecto.evidencia.length > 0}
								<div class="space-y-3">
									{#each proyecto.evidencia as evidencia}
										<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
											<div class="flex items-center gap-3">
												<span class="text-2xl">
													{evidencia.tipo === 'Imagen' ? '🖼️' : '📄'}
												</span>
												<div>
													<h5 class="font-medium text-[rgb(var(--base-color))]">{evidencia.titulo}</h5>
													<p class="text-sm text-gray-600">{evidencia.descripcion}</p>
													<span class="text-xs text-gray-500">{formatearFecha(evidencia.fecha)}</span>
												</div>
											</div>
											<button class="text-[rgb(var(--color-primary))] hover:underline text-sm font-medium">
												Ver archivo
											</button>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-center py-8 bg-gray-50 rounded-lg">
									<p class="text-gray-500">La institución aún no ha subido evidencia para este proyecto.</p>
									<p class="text-sm text-gray-400 mt-2">Los archivos de evidencia aparecerán aquí una vez que sean publicados.</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Card de acción -->
					<div class="bg-white rounded-2xl shadow-lg p-6">
						<h3 class="text-xl font-semibold text-[rgb(var(--base-color))] mb-4">¿Querés colaborar?</h3>
						
						{#if proyecto.tipoParticipacion === 'Monetaria'}
							<div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
								<p class="text-sm text-blue-700">
									💰 Este proyecto necesita <strong>donaciones monetarias</strong>. Tu contribución ayudará a alcanzar el objetivo.
								</p>
							</div>
						{:else if proyecto.tipoParticipacion === 'Materiales'}
							<div class="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
								<p class="text-sm text-green-700">
									📦 Este proyecto necesita <strong>donaciones específicas</strong>: {proyecto.objetivo}.
								</p>
							</div>
						{:else if proyecto.tipoParticipacion === 'Voluntariado'}
							<div class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
								<p class="text-sm text-purple-700">
									🙋‍♀️ Este proyecto necesita <strong>{proyecto.objetivo}</strong> para actividades específicas.
								</p>
							</div>
						{/if}

						{#if proyecto.estado === 'Activo'}
							<button 
								on:click={mostrarFormulario}
								class="w-full bg-[rgb(var(--color-primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--color-primary-hover))] transition-colors duration-200 font-medium mb-3"
							>
								{#if proyecto.tipoParticipacion === 'Monetaria'}
									Enviar donación
								{:else if proyecto.tipoParticipacion === 'Materiales'}
									Donar materiales
								{:else if proyecto.tipoParticipacion === 'Voluntariado'}
									Postularme como voluntario
								{:else}
									Colaborar
								{/if}
							</button>
						{:else}
							<div class="text-center py-4 bg-gray-100 rounded-lg">
								<p class="text-gray-600">Este proyecto ya no está activo</p>
							</div>
						{/if}

						<Button 
							label="Compartir proyecto" 
							href="#"
							disabled={false}
						/>
					</div>

					<!-- Información de contacto -->
					<div class="bg-white rounded-2xl shadow-lg p-6">
						<h3 class="text-xl font-semibold text-[rgb(var(--base-color))] mb-4">Información de Contacto</h3>
						<div class="space-y-3 text-sm">
							<div>
								<span class="font-medium text-[rgb(var(--base-color))]">Responsable:</span>
								<p class="text-gray-700">{proyecto.contacto.responsable}</p>
							</div>
							<div>
								<span class="font-medium text-[rgb(var(--base-color))]">Teléfono:</span>
								<p class="text-gray-700">{proyecto.contacto.telefono}</p>
							</div>
							<div>
								<span class="font-medium text-[rgb(var(--base-color))]">Email:</span>
								<p class="text-gray-700">
									<a href="mailto:{proyecto.contacto.email}" class="text-[rgb(var(--color-primary))] hover:underline">
										{proyecto.contacto.email}
									</a>
								</p>
							</div>
							<div>
								<span class="font-medium text-[rgb(var(--base-color))]">Sitio web:</span>
								<p class="text-gray-700">
									<a href="https://{proyecto.contacto.sitioWeb}" target="_blank" class="text-[rgb(var(--color-primary))] hover:underline">
										{proyecto.contacto.sitioWeb}
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal de formulario de colaboración -->
		{#if mostrarFormularioColaboracion}
			<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
					<div class="p-6">
						<div class="flex justify-between items-center mb-6">
							<h3 class="text-xl font-semibold text-[rgb(var(--base-color))]">
								Solicitud de Colaboración
							</h3>
							<button 
								on:click={() => mostrarFormularioColaboracion = false}
								class="text-gray-400 hover:text-gray-600 text-2xl"
							>
								×
							</button>
						</div>

						<form on:submit={enviarSolicitud} class="space-y-4">
							<div>
								<label for="nombre" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
									Nombre completo
								</label>
								<input 
									id="nombre"
									type="text" 
									required 
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									placeholder="Tu nombre completo"
								/>
							</div>

							<div>
								<label for="email" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
									Email
								</label>
								<input 
									id="email"
									type="email" 
									required 
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									placeholder="tu.email@ejemplo.com"
								/>
							</div>

							<div>
								<label for="telefono" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
									Teléfono
								</label>
								<input 
									id="telefono"
									type="tel" 
									required 
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									placeholder="+54 9 11 1234-5678"
								/>
							</div>

							{#if proyecto.tipoParticipacion === 'Monetaria'}
								<div>
									<label for="monto" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
										Monto a donar
									</label>
									<input 
										id="monto"
										type="number" 
										required 
										min="1"
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
										placeholder="10000"
									/>
								</div>
							{:else if proyecto.tipoParticipacion === 'Materiales'}
								<div>
									<label for="materiales" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
										¿Qué podés donar?
									</label>
									<textarea 
										id="materiales"
										required 
										rows="3"
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
										placeholder="Describe lo que podés donar (cantidad, estado, etc.)"
									></textarea>
								</div>
							{:else if proyecto.tipoParticipacion === 'Voluntariado'}
								<div>
									<label for="disponibilidad" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
										Disponibilidad horaria
									</label>
									<select 
										id="disponibilidad"
										required 
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									>
										<option value="">Seleccionar disponibilidad</option>
										<option value="mañana">Mañana (8:00 - 12:00)</option>
										<option value="tarde">Tarde (14:00 - 18:00)</option>
										<option value="noche">Noche (19:00 - 22:00)</option>
										<option value="fines-semana">Fines de semana</option>
									</select>
								</div>
							{/if}

							<div>
								<label for="mensaje" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
									Mensaje adicional
								</label>
								<textarea 
									id="mensaje"
									rows="4"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									placeholder="Contanos por qué querés colaborar con este proyecto o cualquier información adicional..."
								></textarea>
							</div>

							<div class="flex gap-3 pt-4">
								<button 
									type="submit"
									class="flex-1 bg-[rgb(var(--color-primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--color-primary-hover))] transition-colors duration-200 font-medium"
								>
									Enviar solicitud
								</button>
								<button 
									type="button"
									on:click={() => mostrarFormularioColaboracion = false}
									class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		{/if}
	</main>
{:else}
	<main class="min-h-screen bg-gray-50 py-8">
		<div class="max-w-4xl mx-auto px-8 text-center">
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))] mb-4">Proyecto no encontrado</h1>
			<p class="text-gray-600 mb-8">El proyecto que buscás no existe o ha sido eliminado.</p>
			<Button 
				label="Volver a proyectos" 
				href="/projects"
				disabled={false}
			/>
		</div>
	</main>
{/if} 