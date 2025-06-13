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
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Badge from '$lib/components/ui/elements/Badge.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { projects } from '$lib/data/projects';
	import { page } from '$app/stores';
	import ProjectHeader from '$lib/components/projects/ProjectHeader.svelte';
	import ProjectContact from '$lib/components/projects/ProjectContact.svelte';
	import SidebarCard from '$lib/components/projects/SidebarCard.svelte';

	let proyectoId: number;

	$: {
		const id = $page.params.id;
		proyectoId = parseInt(id);
		cargarProyecto();
	}

	let proyecto: any = null;
	let mostrarFormularioColaboracion = false;
	let solicitudEnviada = false;

	function cargarProyecto() {
		proyecto = projects.find((p) => p.id === proyectoId);

		// Establecer breadcrumbs con el nombre del proyecto
		if (proyecto) {
			setBreadcrumbs([
				BREADCRUMB_ROUTES.home,
				BREADCRUMB_ROUTES.projects,
				{ label: proyecto.titulo }
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
		return Math.min((proyecto.actual / proyecto.objetivo) * 100, 100);
	}

	// Función para formatear montos
	function formatearMonto(cantidad: number) {
		if (!proyecto || !proyecto.unidad) return cantidad?.toString?.() || '';
		if (proyecto.unidad === 'dinero') {
			return `$${cantidad.toLocaleString()}`;
		}
		return cantidad.toString();
	}

	// Función para obtener color de progreso
	function getColorProgreso(tipo: string) {
		switch (tipo) {
			case 'dinero':
				return 'bg-[rgb(var(--color-primary))]';
			case 'voluntarios':
				return 'bg-purple-500';
			case 'materiales':
				return 'bg-green-500';
			default:
				return 'bg-gray-400';
		}
	}

	// Función para obtener color del badge
	function getColorUrgencia(urgencia: string) {
		switch (urgencia) {
			case 'Alta':
				return 'text-red-600 bg-red-100';
			case 'Media':
				return 'text-yellow-600 bg-yellow-100';
			case 'Baja':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	}

	// Función para obtener color del estado
	function getColorEstado(estado: string) {
		switch (estado) {
			case 'Activo':
				return 'text-green-600 bg-green-100';
			case 'Próximo a cerrar':
				return 'text-orange-600 bg-orange-100';
			case 'Cerrado':
				return 'text-gray-600 bg-gray-100';
			case 'Completado':
				return 'text-blue-600 bg-blue-100';
			default:
				return 'text-gray-600 bg-gray-100';
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
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-gray-50 py-8">
		<div class="mx-auto max-w-7xl px-8">
			<!-- Notificación de solicitud enviada -->
			{#if solicitudEnviada}
				<div class="mb-8 rounded-lg border border-green-200 bg-green-100 p-4">
					<p class="font-medium text-green-700">
						✅ Tu solicitud de colaboración fue enviada correctamente. La institución la revisará y
						te contactará pronto.
					</p>
				</div>
			{/if}

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Contenido principal -->
				<div class="space-y-8 lg:col-span-2">
					<!-- Header del proyecto -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<ProjectHeader {proyecto} {getColorUrgencia} {getColorEstado} />

						<!-- Progreso del proyecto -->
						<div class="mb-8">
							<div class="mb-3 flex items-center justify-between">
								<h3 class="text-xl font-semibold text-[rgb(var(--base-color))]">
									Progreso del Objetivo
								</h3>
								<span class="text-2xl font-bold text-[rgb(var(--color-primary))]">
									{formatearMonto(proyecto.actual)} / {proyecto.objetivo}
								</span>
							</div>
							<div class="mb-2 h-4 w-full rounded-full bg-gray-200">
								<div
									class="h-4 rounded-full transition-all duration-300 {getColorProgreso(
										proyecto.unidad
									)}"
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
							<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">
								Descripción del Proyecto
							</h3>
							<p class="text-lg leading-relaxed text-gray-700">
								{proyecto.descripcion}
							</p>
						</div>

						<!-- Información del proyecto -->
						<div class="mb-8 grid gap-6 md:grid-cols-2">
							<div class="rounded-lg bg-gray-50 p-4">
								<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Institución</h4>
								<p class="text-gray-700">{proyecto.institucion}</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-4">
								<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Beneficiarios</h4>
								<p class="text-gray-700">{proyecto.beneficiarios} personas</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-4">
								<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Fecha de inicio</h4>
								<p class="text-gray-700">{formatearFecha(proyecto.fechaInicio)}</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-4">
								<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Fecha de cierre</h4>
								<p class="text-gray-700">{formatearFecha(proyecto.fechaCierre)}</p>
							</div>
						</div>

						<!-- Actualizaciones del proyecto -->
						{#if proyecto.actualizaciones && proyecto.actualizaciones.length > 0}
							<div class="mb-8">
								<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">
									Actualizaciones del Proyecto
								</h3>
								<div class="space-y-4">
									{#each proyecto.actualizaciones as actualizacion}
										<div
											class="rounded-r-lg border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-4"
										>
											<div class="mb-2 flex items-start justify-between">
												<h4 class="font-semibold text-[rgb(var(--base-color))]">
													{actualizacion.titulo}
												</h4>
												<span class="text-sm text-gray-500"
													>{formatearFecha(actualizacion.fecha)}</span
												>
											</div>
											<p class="text-gray-700">{actualizacion.descripcion}</p>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Sección de Evidencia (preparada para roles futuros) -->
						<div class="mb-8">
							<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">
								Evidencia del Proyecto
							</h3>
							{#if proyecto.evidencia && proyecto.evidencia.length > 0}
								<div class="space-y-3">
									{#each proyecto.evidencia as evidencia}
										<div class="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
											<div class="flex items-center gap-3">
												<span class="text-2xl">
													{evidencia.tipo === 'Imagen' ? '🖼️' : '📄'}
												</span>
												<div>
													<h5 class="font-medium text-[rgb(var(--base-color))]">
														{evidencia.titulo}
													</h5>
													<p class="text-sm text-gray-600">{evidencia.descripcion}</p>
													<span class="text-xs text-gray-500"
														>{formatearFecha(evidencia.fecha)}</span
													>
												</div>
											</div>
											<button
												class="text-sm font-medium text-[rgb(var(--color-primary))] hover:underline"
											>
												Ver archivo
											</button>
										</div>
									{/each}
								</div>
							{:else}
								<div class="rounded-lg bg-gray-50 py-8 text-center">
									<p class="text-gray-500">
										La institución aún no ha subido evidencia para este proyecto.
									</p>
									<p class="mt-2 text-sm text-gray-400">
										Los archivos de evidencia aparecerán aquí una vez que sean publicados.
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Card de acción -->
					<SidebarCard {proyecto} {mostrarFormulario} />

					<!-- Información de contacto -->
					{#if proyecto.contacto}
						<ProjectContact contacto={proyecto.contacto} />
					{/if}
				</div>
			</div>
		</div>

		<!-- Modal de formulario de colaboración -->
		{#if mostrarFormularioColaboracion}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
				<div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
					<div class="p-6">
						<div class="mb-6 flex items-center justify-between">
							<h3 class="text-xl font-semibold text-[rgb(var(--base-color))]">
								Solicitud de Colaboración
							</h3>
							<button
								on:click={() => (mostrarFormularioColaboracion = false)}
								class="text-2xl text-gray-400 hover:text-gray-600"
							>
								×
							</button>
						</div>

						<form on:submit={enviarSolicitud} class="space-y-4">
							<div>
								<label
									for="nombre"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Nombre completo
								</label>
								<input
									id="nombre"
									type="text"
									required
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="Tu nombre completo"
								/>
							</div>

							<div>
								<label
									for="email"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									required
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="tu.email@ejemplo.com"
								/>
							</div>

							<div>
								<label
									for="telefono"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Teléfono
								</label>
								<input
									id="telefono"
									type="tel"
									required
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="+54 9 11 1234-5678"
								/>
							</div>

							{#if proyecto.unidad === 'dinero'}
								<div>
									<label
										for="monto"
										class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
									>
										Monto a donar
									</label>
									<input
										id="monto"
										type="number"
										required
										min="1"
										class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
										placeholder="10000"
									/>
								</div>
							{:else if proyecto.unidad === 'materiales'}
								<div>
									<label
										for="materiales"
										class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
									>
										¿Qué podés donar?
									</label>
									<textarea
										id="materiales"
										required
										rows="3"
										class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
										placeholder="Describe lo que podés donar (cantidad, estado, etc.)"
									></textarea>
								</div>
							{:else if proyecto.unidad === 'voluntarios'}
								<div>
									<label
										for="disponibilidad"
										class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
									>
										Disponibilidad horaria
									</label>
									<select
										id="disponibilidad"
										required
										class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
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
								<label
									for="mensaje"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Mensaje adicional
								</label>
								<textarea
									id="mensaje"
									rows="4"
									class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="Contanos por qué querés colaborar con este proyecto o cualquier información adicional..."
								></textarea>
							</div>

							<div class="flex gap-3 pt-4">
								<button
									type="submit"
									class="flex-1 rounded-lg bg-[rgb(var(--color-primary))] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(var(--color-primary-hover))]"
								>
									Enviar solicitud
								</button>
								<button
									type="button"
									on:click={() => (mostrarFormularioColaboracion = false)}
									class="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
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
		<div class="mx-auto max-w-4xl px-8 text-center">
			<h1 class="mb-4 text-3xl font-bold text-[rgb(var(--base-color))]">Proyecto no encontrado</h1>
			<p class="mb-8 text-gray-600">El proyecto que buscás no existe o ha sido eliminado.</p>
			<div class="flex items-center justify-center">
				<Button label="Volver a proyectos" href="/projects" disabled={false} />
			</div>
		</div>
	</main>
{/if}
