<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { Package, Calendar, FileText } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { evidenciasPorProyecto, totalEvidencias } = data;

	function formatearFecha(fecha: string | Date): string {
		const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
		return new Intl.DateTimeFormat('es-AR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Mis Aportes - Conectando Corazones</title>
</svelte:head>

<div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>

<main class="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8">
		<div class="mb-4 flex items-center gap-3">
			<Button label="Volver" size="sm" onclick={() => goto('/colaborador/mi-panel')} />
		</div>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<div class="mb-3 flex items-center gap-3">
					<Badge text="Mis aportes" />
				</div>
				<h1 class="mb-2 text-4xl font-bold text-gray-900">
					Evidencias de <span class="text-purple-600">Entrada</span>
				</h1>
				<p class="text-gray-600">
					{totalEvidencias} aporte{totalEvidencias !== 1 ? 's' : ''} realizado{totalEvidencias !== 1
						? 's'
						: ''}
				</p>
			</div>
		</div>
	</div>

	<!-- Contenido -->
	{#if evidenciasPorProyecto.length > 0}
		<div class="space-y-8">
			{#each evidenciasPorProyecto as { proyecto, evidencias, compromisos }}
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<!-- Header del proyecto -->
					<div class="mb-6">
						<button
							onclick={() => goto(`/proyectos/${proyecto.id_proyecto}`)}
							class="group mb-2 inline-flex items-center gap-2 transition-colors hover:text-blue-600"
						>
							<h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
								{proyecto.titulo}
							</h2>
							<svg
								class="h-5 w-5 transition-transform group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
							>
								{compromisos.length} compromiso{compromisos.length !== 1 ? 's' : ''}
							</span>
							<span
								class="inline-flex items-center rounded-full {proyecto?.estado?.descripcion ===
								'en_curso'
									? 'bg-green-100 text-green-700'
									: 'bg-blue-100 text-blue-700'} px-3 py-1 text-xs font-medium"
							>
								{proyecto?.estado?.descripcion === 'en_curso' ? 'En curso' : 'Otro'}
							</span>
						</div>
					</div>

					<!-- Compromisos -->
					{#if compromisos && compromisos.length > 0}
						<div class="mb-8">
							<h3 class="mb-4 text-sm font-bold tracking-wider text-gray-500 uppercase">
								Mis Compromisos
							</h3>
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{#each compromisos as compromiso}
									<div
										class="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm"
									>
										<p class="text-xs font-semibold text-blue-600">
											{compromiso.participacion_permitida?.tipo_participacion?.descripcion ||
												'Tipo desconocido'}
										</p>
										<div class="mt-1 flex items-baseline gap-1">
											<span class="text-2xl font-bold text-blue-900">
												{compromiso.cantidad}
											</span>
											{#if compromiso.participacion_permitida.unidad_medida}
												<span class="text-sm font-medium text-blue-700">
													{compromiso.participacion_permitida.unidad_medida}
												</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Listado de evidencias -->
					{#if evidencias && evidencias.length > 0}
						<div class="space-y-4">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-bold tracking-wider text-gray-500 uppercase">
									Evidencias de entrada
								</h3>
								<div class="h-px flex-1 bg-gray-100"></div>
							</div>
							{#each evidencias as evidencia}
								<div
									class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
								>
									<div class="mb-3 flex items-start justify-between">
										<div class="flex items-start gap-3">
											<div class="rounded-lg bg-purple-100 p-2 text-purple-600">
												<Package class="h-5 w-5" />
											</div>
											<div>
												<h3 class="font-semibold text-gray-900">
													{evidencia.participacion_permitida?.tipo_participacion?.descripcion ||
														'Evidencia'}
												</h3>
												{#if evidencia.participacion_permitida?.unidad_medida}
													<p class="text-sm text-gray-600">
														{evidencia.participacion_permitida.unidad_medida}
													</p>
												{/if}
											</div>
										</div>
										<div class="flex items-center gap-2 text-sm text-gray-500">
											<Calendar class="h-4 w-4" />
											<span>{formatearFecha(evidencia.created_at)}</span>
										</div>
									</div>

									<!-- Archivos adjuntos -->
									{#if evidencia.archivos && evidencia.archivos.length > 0}
										<div class="mt-4 rounded-lg bg-gray-50 p-4">
											<div
												class="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase"
											>
												<FileText class="h-4 w-4" />
												<span>Archivos ({evidencia.archivos.length})</span>
											</div>
											<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
												{#each evidencia.archivos as archivo}
													<a
														href={archivo.url}
														target="_blank"
														rel="noopener noreferrer"
														class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-300 hover:ring-2 hover:ring-blue-50"
													>
														<div class="rounded bg-gray-100 p-2 text-gray-500">
															<FileText class="h-4 w-4" />
														</div>
														<div class="min-w-0 flex-1">
															<p class="truncate text-sm font-medium text-gray-900">
																{archivo.nombre_original || 'Archivo'}
															</p>
														</div>
														<svg
															class="h-4 w-4 text-gray-400"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
															/>
														</svg>
													</a>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div
							class="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center"
						>
							<p class="text-sm text-gray-500 italic">
								Registrado como colaborador pero aún no has cargado evidencias de entrada para este
								proyecto.
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Estado vacío -->
		<div class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
				<Package class="h-8 w-8 text-gray-400" />
			</div>
			<h3 class="mb-2 text-xl font-semibold text-gray-900">Aún no has realizado aportes</h3>
			<p class="mb-6 text-gray-600">
				Cuando cargués evidencias de entrada en proyectos, aparecerán acá
			</p>
			<Button
				label="Ver Proyectos"
				variant="primary"
				size="md"
				onclick={() => goto('/proyectos/mis-proyectos')}
			/>
		</div>
	{/if}
</main>
