<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { projects } from '$lib/mocks/mock-projects';
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
	<main class="min-h-screen bg-gray-50 pb-24 pt-10 text-gray-800">
		<div class="animate-fade-up mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
			<ProjectHeader {proyecto} {getColorUrgencia} {getColorEstado} />

			<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
				<!-- Columna principal -->
				<div class="animate-fade-up space-y-10 lg:col-span-2">
					<section
						class="rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg"
					>
						<h2 class="mb-4 text-2xl font-semibold">Progreso del Proyecto</h2>
						<ProjectProgress {proyecto} />

						<div class="mt-8">
							<h3
								class="mb-4 flex flex-wrap items-center justify-between text-lg font-medium text-gray-900"
							>
								<span>
									{proyecto.objetivos.length === 1 ? 'Objetivo' : 'Objetivos'}
								</span>
								<div class="flex items-center gap-3 text-sm">
									<span
										class="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"
									>
										{diasRestantes(proyecto.fechaCierre)} días restantes
									</span>
									<span class="text-gray-500">
										<strong class="font-medium">Finaliza:</strong>
										{formatearFecha(proyecto.fechaCierre)}
									</span>
								</div>
							</h3>

							{#if proyecto.objetivos?.length}
								<ul class="space-y-4">
									{#each proyecto.objetivos as o}
										{@const porcentaje = Math.round((o.cantidadRecaudada / o.objetivo) * 100)}
										<li
											class="flex items-start gap-4 rounded-xl border border-gray-100 p-5 shadow-sm transition hover:border-gray-200"
										>
											<!-- Ícono -->
											<div class="flex-shrink-0">
												{#if calcularEstadoObjetivo(o.cantidadRecaudada, o.objetivo) === 'completo'}
													<div
														class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700"
													>
														✅
													</div>
												{:else if calcularEstadoObjetivo(o.cantidadRecaudada, o.objetivo) === 'parcial'}
													<div
														class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700"
													>
														⏳
													</div>
												{:else}
													<div
														class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500"
													>
														📦
													</div>
												{/if}
											</div>

											<!-- Contenido -->
											<div class="flex w-full flex-col">
												<p class="font-medium text-gray-800">
													{o.unidad === 'dinero'
														? `$${o.cantidadRecaudada.toLocaleString('es-AR')} / $${o.objetivo.toLocaleString('es-AR')} ${o.especie}`
														: `${o.cantidadRecaudada} / ${o.objetivo}${o.unidad === 'voluntarios' ? ' voluntarios' : ` ${o.especie}`}`}
												</p>
												<div class="mt-1 flex justify-between text-xs text-gray-500">
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
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm text-gray-500">No hay objetivos definidos para este proyecto.</p>
							{/if}
						</div>
					</section>

					<!-- Detalles del proyecto -->
					<section
						class="rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg"
					>
						<ProjectDetails {proyecto} {formatearFecha} />
					</section>

					<!-- Actualizaciones -->
					{#if proyecto.actualizaciones?.length}
						<section class="rounded-xl border border-gray-200 bg-white p-6 shadow">
							<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--color-primary))]">
								Actualizaciones del Proyecto
							</h3>
							<ul class="space-y-4">
								{#each proyecto.actualizaciones as a}
									<li
										class="rounded border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-4 transition hover:bg-blue-100"
									>
										<div class="flex justify-between text-sm font-medium text-gray-800">
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

				<!-- Columna lateral -->
				<div class="animate-fade-up space-y-6" style="animation-delay: 100ms">
					<SidebarCard {proyecto} {mostrarFormulario} />

					{#if proyecto.contacto}
						<ProjectContact contacto={proyecto.contacto} />
					{/if}
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 0.5s ease-out both;
	}
</style>
