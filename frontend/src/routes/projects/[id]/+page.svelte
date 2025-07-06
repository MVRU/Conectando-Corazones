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
	import ProjectDetails from '$lib/components/projects/ProjectDetails.svelte';
	import ProjectProgress from '$lib/components/projects/ProjectProgress.svelte';

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

	function calcularEstadoObjetivo(
		actual: number,
		objetivo: number
	): 'completo' | 'parcial' | 'pendiente' {
		if (actual >= objetivo) return 'completo';
		if (actual > 0) return 'parcial';
		return 'pendiente';
	}

	function diasRestantes(fechaFin: string): number {
		const hoy = new Date();
		const fin = new Date(fechaFin);
		const diferencia = fin.getTime() - hoy.getTime();
		return Math.max(Math.ceil(diferencia / (1000 * 60 * 60 * 24)), 0);
	}

	function formatearFecha(fecha: string | undefined) {
		if (!fecha) return 'Fecha no disponible';
		return new Date(fecha).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
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
		<div class="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
			<ProjectHeader {proyecto} {getColorUrgencia} {getColorEstado} />
		</div>

		<div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			{#if solicitudEnviada}
				<div class="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 shadow">
					<p class="text-sm font-medium text-green-800">
						✅ Tu solicitud fue enviada correctamente. Pronto recibirás novedades.
					</p>
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
				<div class="space-y-3 lg:col-span-2">
					<div class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
						<section class="space-y-3">
							<h3 class="text-lg font-semibold text-[rgb(var(--base-color))]">Progreso</h3>
							<ProjectProgress {proyecto} />
							<h4
								class="mt-12 flex flex-wrap items-center gap-3 text-base font-semibold text-[rgb(var(--base-color))]"
							>
								{proyecto.objetivos.length === 1
									? 'Objetivo del proyecto'
									: 'Objetivos del proyecto'}
								<span class="text-sm font-medium text-gray-500">
									{diasRestantes(proyecto.fechaCierre)} días restantes
								</span>
								<span class="text-sm font-medium text-gray-500"
									>• Cierra: {formatearFecha(proyecto.fechaCierre)}</span
								>
							</h4>

							{#if proyecto.objetivos?.length}
								<ul class="mt-4 space-y-4">
									{#each proyecto.objetivos as o}
										{@const porcentaje = Math.round((o.cantidadRecaudada / o.objetivo) * 100)}
										<li
											class="flex flex-col gap-1 rounded-lg border border-gray-200 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4"
										>
											<div class="shrink-0">
												{#if calcularEstadoObjetivo(o.cantidadRecaudada, o.objetivo) === 'completo'}
													<svg
														class="h-6 w-6 text-blue-600"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<rect
															x="4"
															y="4"
															width="16"
															height="16"
															rx="4"
															ry="4"
															stroke-width="2"
														/>
														<path
															d="M9 12l2 2 4-4"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
												{:else if calcularEstadoObjetivo(o.cantidadRecaudada, o.objetivo) === 'parcial'}
													<svg
														class="h-6 w-6 text-yellow-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<rect
															x="4"
															y="4"
															width="16"
															height="16"
															rx="4"
															ry="4"
															stroke-width="2"
														/>
														<line
															x1="8"
															y1="12"
															x2="16"
															y2="12"
															stroke-width="2"
															stroke-linecap="round"
														/>
													</svg>
												{:else}
													<svg
														class="h-6 w-6 text-gray-300"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<rect
															x="4"
															y="4"
															width="16"
															height="16"
															rx="4"
															ry="4"
															stroke-width="2"
														/>
													</svg>
												{/if}
											</div>
											<div class="flex flex-wrap items-center gap-2 text-sm text-gray-700">
												<span class="font-medium">
													{o.unidad === 'dinero'
														? `$${o.cantidadRecaudada} / $${o.objetivo} ${o.especie}`
														: `${o.cantidadRecaudada} / ${o.objetivo}${o.unidad === 'voluntarios' ? ' voluntarios' : ` ${o.especie}`}`}
												</span>
												<span class="text-xs text-gray-500">• {porcentaje}% alcanzado</span>
											</div>
										</li>
									{/each}
								</ul>
							{/if}
						</section>

						<div class="mt-10">
							<ProjectDetails {proyecto} {formatearFecha} />
						</div>

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
					</div>
				</div>

				<div class="space-y-6">
					<SidebarCard {proyecto} {mostrarFormulario} />
					{#if proyecto.contacto}
						<ProjectContact contacto={proyecto.contacto} />
					{/if}
				</div>
			</div>
		</div>
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
