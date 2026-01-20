<script lang="ts">
	import { formatearFecha } from '$lib/utils/validaciones';
	import { obtenerNombreUsuario } from '$lib/utils/util-usuarios';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import type { Evidencia } from '$lib/types/Evidencia';
	import ArchivoPreview from './ArchivoPreview.svelte';

	export let objetivo: ParticipacionPermitida;
	export let evidencias: Evidencia[];
	export let evidenciasEntrada: Evidencia[];
	export let evidenciasSalida: Evidencia[];
	export let totalArchivos: number;
	export let expandido: boolean = false;

	function toggleExpansion() {
		expandido = !expandido;
	}
</script>

<div class="rounded-lg border border-gray-200 bg-gray-50">
	<!-- Header del objetivo -->
	<button
		on:click={toggleExpansion}
		class="flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-100"
	>
		<div class="flex-1">
			<div class="flex items-center gap-2">
				<svg
					class="h-5 w-5 text-gray-500"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
					/>
				</svg>
				<h3 class="font-semibold text-gray-900">
					Objetivo: {objetivo.objetivo}
					{objetivo.unidad_medida}{objetivo.especie ? ` de ${objetivo.especie}` : ''}
				</h3>
			</div>

			<div class="mt-2 flex flex-wrap gap-3 text-sm">
				<!-- Progreso -->
				<div class="flex items-center gap-1.5">
					<span class="text-gray-500">Progreso:</span>
					<span class="font-medium text-gray-900">
						{objetivo.actual || 0} / {objetivo.objetivo}
						{objetivo.unidad_medida}
					</span>
				</div>

				<!-- Badge de evidencias -->
				{#if evidencias.length === 0}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
							/>
						</svg>
						Sin evidencias
					</span>
				{:else}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{evidencias.length}
						{evidencias.length === 1 ? 'evidencia' : 'evidencias'} ({totalArchivos}
						{totalArchivos === 1 ? 'archivo' : 'archivos'})
					</span>
				{/if}
			</div>
		</div>

		<!-- Ícono de expansión -->
		<svg
			class="h-5 w-5 text-gray-400 transition-transform {expandido ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
	</button>

	<!-- Contenido expandible -->
	{#if expandido}
		<div class="border-t border-gray-200 bg-white p-4">
			{#if evidencias.length === 0}
				<div class="py-4 text-center">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
						/>
					</svg>
					<p class="mt-2 text-sm font-medium text-gray-900">No hay evidencias cargadas</p>
					<p class="mt-1 text-xs text-gray-500">
						Es necesario cargar al menos una evidencia para este objetivo
					</p>
				</div>
			{:else}
				<!-- Grid de evidencias: Entrada | Salida -->
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Columna: ENTRADA -->
					<div>
						<div class="mb-3 flex items-center gap-2">
							<svg
								class="h-5 w-5 text-blue-500"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
								/>
							</svg>
							<h4 class="font-medium text-gray-900">Entrada</h4>
							<span class="text-sm text-gray-500">
								({evidenciasEntrada.length})
							</span>
						</div>

						{#if evidenciasEntrada.length === 0}
							<p class="text-sm text-gray-400 italic">Sin evidencias de entrada</p>
						{:else}
							<div class="space-y-3">
								{#each evidenciasEntrada as evidencia}
									<div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
										<div class="mb-2 flex items-start justify-between">
											<span class="text-xs font-medium text-gray-500">
												{formatearFecha(evidencia.created_at)}
											</span>
										</div>

										{#if evidencia.archivos && evidencia.archivos.length > 0}
											<div class="space-y-2">
												{#each evidencia.archivos as archivo}
													<ArchivoPreview {archivo} />
												{/each}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Columna: SALIDA -->
					<div>
						<div class="mb-3 flex items-center gap-2">
							<svg
								class="h-5 w-5 text-green-500"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
								/>
							</svg>
							<h4 class="font-medium text-gray-900">Salida</h4>
							<span class="text-sm text-gray-500">
								({evidenciasSalida.length})
							</span>
						</div>

						{#if evidenciasSalida.length === 0}
							<p class="text-sm text-gray-400 italic">Sin evidencias de salida</p>
						{:else}
							<div class="space-y-3">
								{#each evidenciasSalida as evidencia}
									<div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
										<div class="mb-2 flex items-start justify-between">
											<span class="text-xs font-medium text-gray-500">
												{formatearFecha(evidencia.created_at)}
											</span>
										</div>

										{#if evidencia.archivos && evidencia.archivos.length > 0}
											<div class="space-y-2">
												{#each evidencia.archivos as archivo}
													<ArchivoPreview {archivo} />
												{/each}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
