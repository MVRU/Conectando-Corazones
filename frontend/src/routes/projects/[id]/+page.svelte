<!-- src/routes/projects/[id]/+page.svelte -->
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
	let proyecto: any = null;
	let mostrarFormularioColaboracion = false;
	let solicitudEnviada = false;

	$: {
		const id = $page.params.id;
		proyectoId = parseInt(id);
		cargarProyecto();
	}

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
				Abierto: 'text-green-600 bg-green-100',
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
		setTimeout(() => (solicitudEnviada = false), 5000);
	}
</script>

<svelte:head>
	<title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
	<meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
	<main class="min-h-screen bg-gray-50 pb-20 pt-8 text-gray-800">
		<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
			<ProjectHeader {proyecto} {getColorUrgencia} {getColorEstado} />

			<div class="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<section
						class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
					>
						<h3 class="mb-6 text-2xl font-semibold">Progreso del Proyecto</h3>
						<div class="mb-8">
							<ProjectProgress {proyecto} />
						</div>

						<h4 class="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
							<span class="flex items-center gap-2">
								{proyecto.objetivos.length === 1 ? 'Objetivo' : 'Objetivos'}
								<span
									class="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
								>
									{diasRestantes(proyecto.fechaCierre)} días restantes
								</span>
							</span>
							<span class="text-sm font-normal text-gray-500">
								<span class="font-bold">Finaliza:</span>
								{formatearFecha(proyecto.fechaCierre)}
							</span>
						</h4>

						{#if proyecto.objetivos?.length}
							<ul class="space-y-4">
								{#each proyecto.objetivos as o}
									{@const porcentaje = Math.round((o.cantidadRecaudada / o.objetivo) * 100)}
									<li
										class="flex flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow"
									>
										<div class="flex items-start justify-between">
											<div class="flex items-start gap-3">
												<!-- Ícono según estado -->
												{#if calcularEstadoObjetivo(o.cantidadRecaudada, o.objetivo) === 'completo'}
													<svg
														class="h-6 w-6 shrink-0 text-green-600"
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
														class="h-6 w-6 shrink-0 text-yellow-600"
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
														class="h-6 w-6 shrink-0 text-gray-400"
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

												<div class="flex w-full flex-col">
													<p class="font-medium text-gray-800">
														{o.unidad === 'dinero'
															? `$${o.cantidadRecaudada.toLocaleString('es-AR')} / $${o.objetivo.toLocaleString('es-AR')} ${o.especie}`
															: `${o.cantidadRecaudada} / ${o.objetivo}${o.unidad === 'voluntarios' ? ' voluntarios' : ` ${o.especie}`}`}
													</p>
													<div class="mt-1 flex items-center justify-between text-xs text-gray-500">
														<span>{porcentaje}% alcanzado</span>
														{#if o.cantidadEstimada > o.cantidadRecaudada}
															<span>
																Promesas pendientes:
																<strong>
																	{o.unidad === 'dinero'
																		? `$${(o.cantidadEstimada - o.cantidadRecaudada).toLocaleString('es-AR')}`
																		: `${o.cantidadEstimada - o.cantidadRecaudada} ${o.especie}`}
																</strong>
															</span>
														{/if}
													</div>
												</div>
											</div>
										</div>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-sm text-gray-500">No hay objetivos definidos.</p>
						{/if}
					</section>
					<section
						class="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
					>
						<ProjectDetails {proyecto} {formatearFecha} />
					</section>

					{#if proyecto.actualizaciones?.length}
						<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
							<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--color-primary))]">
								Actualizaciones
							</h3>
							<ul class="space-y-4">
								{#each proyecto.actualizaciones as a}
									<li
										class="rounded-md border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-4 transition hover:bg-blue-100"
									>
										<div class="flex flex-wrap justify-between text-sm font-medium text-gray-800">
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
	<main class="min-h-screen bg-gray-50 py-20 text-center">
		<div class="mx-auto max-w-xl px-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mx-auto mb-4 h-16 w-16 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<h1 class="mb-4 text-2xl font-bold text-gray-800">Proyecto no encontrado</h1>
			<p class="mb-6 text-gray-600">
				Verificá que la URL sea correcta o volvé a la lista de proyectos.
			</p>
			<div class="flex justify-center">
				<Button label="Volver a proyectos" href="/projects" variant="primary" size="md" />
			</div>
		</div>
	</main>
{/if}
