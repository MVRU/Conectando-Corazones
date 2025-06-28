<!--
* Página: Detalle del Proyecto
  -*- Descripción: Muestra información completa de un proyecto específico
  -*- Funcionalidad: Detalle completo, progreso, solicitudes de colaboración y evidencia
-->

<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { projects } from '$lib/data/projects';
	import { page } from '$app/stores';
	import ProjectHeader from '$lib/components/projects/ProjectHeader.svelte';
	import ProjectContact from '$lib/components/projects/ProjectContact.svelte';
	import SidebarCard from '$lib/components/projects/SidebarCard.svelte';
	import ProgressBar from '$lib/components/ui/elements/ProgressBar.svelte';
	import ProjectDetails from '$lib/components/projects/ProjectDetails.svelte';

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
		if (proyecto) {
			setBreadcrumbs([
				BREADCRUMB_ROUTES.home,
				BREADCRUMB_ROUTES.projects,
				{ label: proyecto.titulo }
			]);
		}
	}

	function formatearFecha(fecha: string) {
		return new Date(fecha).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function calcularPorcentajeProgreso() {
		if (!proyecto) return 0;
		return Math.min((proyecto.actual / proyecto.objetivo) * 100, 100);
	}

	function formatearMonto(cantidad: number) {
		if (!proyecto?.unidad) return cantidad?.toString?.() || '';
		if (proyecto.unidad === 'dinero') return `$${cantidad.toLocaleString()}`;
		return cantidad.toString();
	}

	function getColorProgreso(tipo: string) {
		switch (tipo) {
			case 'dinero':
				return 'green';
			case 'voluntarios':
				return 'purple';
			case 'materiales':
				return 'blue';
			default:
				return 'green';
		}
	}

	function getColorUrgencia(urgencia: string) {
		return (
			{
				Alta: 'text-red-600 bg-red-100',
				Media: 'text-yellow-600 bg-yellow-100',
				Baja: 'text-green-600 bg-green-100'
			}[urgencia] || 'text-gray-600 bg-gray-100'
		);
	}

	function getColorEstado(estado: string) {
		return (
			{
				Activo: 'text-green-600 bg-green-100',
				'Próximo a cerrar': 'text-orange-600 bg-orange-100',
				Cerrado: 'text-gray-600 bg-gray-100',
				Completado: 'text-blue-600 bg-blue-100'
			}[estado] || 'text-gray-600 bg-gray-100'
		);
	}

	function mostrarFormulario() {
		mostrarFormularioColaboracion = true;
	}

	function enviarSolicitud(event: Event) {
		event.preventDefault();
		solicitudEnviada = true;
		mostrarFormularioColaboracion = false;
		setTimeout(() => (solicitudEnviada = false), 5000);
	}
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-white">
		<!-- Encabezado destacado a pantalla completa -->
		<div class="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
			<ProjectHeader {proyecto} {getColorUrgencia} {getColorEstado} />
		</div>

		<!-- Contenido -->
		<div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			{#if solicitudEnviada}
				<div class="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 shadow">
					<p class="text-sm font-medium text-green-800">
						✅ Tu solicitud fue enviada correctamente. Pronto recibirás novedades.
					</p>
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
				<!-- Contenido principal -->
				<div class="space-y-3 lg:col-span-2">
					<div class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
						<!-- Progreso -->
						<section class="space-y-3">
							<h3 class="text-lg font-semibold text-[rgb(var(--base-color))]">Progreso</h3>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-700">
									{formatearMonto(proyecto.actual)} / {proyecto.objetivo}
								</span>
								<span class="text-sm text-gray-500">
									{calcularPorcentajeProgreso().toFixed(1)}%
								</span>
							</div>
							<ProgressBar
								percent={calcularPorcentajeProgreso()}
								color={getColorProgreso(proyecto.unidad)}
							/>
							{#if proyecto.actual < proyecto.objetivo}
								<p class="text-sm text-gray-600">
									<span class="font-bold">
										{formatearMonto(proyecto.objetivo - proyecto.actual)}
									</span>
									faltan para alcanzar el objetivo.
								</p>
							{:else}
								<p class="text-sm font-medium text-green-600">¡Objetivo alcanzado!</p>
							{/if}
						</section>

						<!-- Detalles -->
						<div class="mt-10">
							<ProjectDetails {proyecto} {formatearFecha} />
						</div>

						<!-- Actualizaciones -->
						{#if proyecto.actualizaciones?.length}
							<section class="mt-6">
								<h3 class="mb-4 text-lg font-semibold text-[rgb(var(--base-color))]">
									Actualizaciones
								</h3>
								<ul class="space-y-4">
									{#each proyecto.actualizaciones as a}
										<li
											class="rounded-md border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-4"
										>
											<div
												class="flex justify-between text-sm font-medium text-[rgb(var(--base-color))]"
											>
												<span>{a.titulo}</span>
												<span class="text-gray-500">{formatearFecha(a.fecha)}</span>
											</div>
											<p class="mt-1 text-sm text-gray-700">{a.descripcion}</p>
										</li>
									{/each}
								</ul>
							</section>
						{/if}

						<!-- Evidencia -->
						{#if proyecto.evidencia?.length}
							<section class="mt-6">
								<h3 class="mb-4 text-lg font-semibold text-[rgb(var(--base-color))]">
									Evidencia del Proyecto
								</h3>
								<ul class="space-y-4">
									{#each proyecto.evidencia as evidencia}
										<li
											class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
										>
											<div class="flex items-start gap-3">
												<span class="text-2xl">{evidencia.tipo === 'Imagen' ? '🖼️' : '📄'}</span>
												<div>
													<h4 class="font-semibold text-[rgb(var(--base-color))]">
														{evidencia.titulo}
													</h4>
													<p class="text-sm text-gray-600">{evidencia.descripcion}</p>
													<span class="text-xs text-gray-500"
														>{formatearFecha(evidencia.fecha)}</span
													>
												</div>
											</div>
											<div>
												<button
													class="text-sm font-medium text-[rgb(var(--color-primary))] hover:underline"
													>Ver archivo</button
												>
											</div>
										</li>
									{/each}
								</ul>
							</section>
						{:else}
							<section class="mt-6">
								<h3 class="mb-2 text-lg font-semibold text-[rgb(var(--base-color))]">
									Evidencia del Proyecto
								</h3>
								<div class="rounded-xl bg-gray-50 px-4 py-8 text-center">
									<p class="text-sm text-gray-500">
										La institución aún no ha subido evidencia para este proyecto.
									</p>
									<p class="mt-2 text-sm text-gray-400">
										Los archivos de evidencia aparecerán aquí una vez que sean publicados.
									</p>
								</div>
							</section>
						{/if}
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<SidebarCard {proyecto} {mostrarFormulario} />
					{#if proyecto.contacto}
						<ProjectContact contacto={proyecto.contacto} />
					{/if}
				</div>
			</div>
		</div>

		<slot name="formulario" />
	</main>
{:else}
	<main class="min-h-screen bg-gray-50 py-10 text-center">
		<div class="mx-auto max-w-xl px-4">
			<h1 class="mb-3 text-2xl font-semibold text-[rgb(var(--base-color))]">
				Proyecto no encontrado
			</h1>
			<p class="mb-6 text-gray-500">
				Verificá que la URL sea correcta o volvé a la lista de proyectos.
			</p>
			<Button label="Volver a proyectos" href="/projects" />
		</div>
	</main>
{/if}
