<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import {
		CheckCircle,
		XCircle,
		AlertTriangle,
		FileText,
		Calendar,
		Users,
		Quote,
		ChevronLeft,
		ClipboardCheck
	} from 'lucide-svelte';
	import ObjetivoEvidencias from '$lib/components/feature/institucion/ObjetivoEvidencias.svelte';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { agruparEvidenciasPorObjetivo } from '$lib/utils/util-evidencias';
	import { formatearFecha } from '$lib/utils/validaciones';

	export let data: PageData;

	$: proyecto = data.proyecto;
	$: solicitud = data.solicitud;
	$: evaluacion = data.evaluacion;
	$: yaVote = data.yaVote;

	let showReportModal = false;

	let showRejectModal = false;
	let loading = false;
	let declarationChecked = false;
	let objetivosExpandidos: Record<number, boolean> = {};

	function handleReportSuccess() {
		toastStore.show({
			message: 'Reporte enviado correctamente. El equipo de administración lo revisará.',
			variant: 'success'
		});
		showReportModal = false;
	}

	// Agrupar evidencias por objetivo
	$: evidenciasPorObjetivo = agruparEvidenciasPorObjetivo(
		data.proyecto.participacion_permitida ?? [],
		data.solicitud?.evidencias ?? []
	);
</script>

<svelte:head>
	<title>Evaluación de cierre - {data.proyecto.titulo} | Conectando Corazones</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-6 lg:px-8">
	<div class="mx-auto max-w-5xl space-y-8">
		<!-- Header -->
		<nav class="mb-4 flex items-center text-sm text-slate-500">
			<a
				href="/proyectos/{data.proyecto.id_proyecto}"
				class="flex items-center transition-colors hover:text-blue-600"
			>
				<ChevronLeft class="mr-1 h-4 w-4" />
				Volver al proyecto
			</a>
		</nav>

		{#if !data.isEnRevision || !data.solicitud}
			<!-- Estado Informativo: No hay evaluación pendiente -->
			<div class="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm" in:fade>
				<div
					class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
				>
					<FileText class="h-8 w-8 text-slate-400" />
				</div>
				<h1 class="mb-2 text-2xl font-bold text-slate-800">No hay solicitud pendiente</h1>
				<p class="mx-auto max-w-lg text-slate-600">
					Actualmente no hay una solicitud de cierre activa para evaluar en este proyecto o el
					proyecto ya no se encuentra en estado de revisión.
				</p>
				<div class="mt-8">
					<a
						href="/proyectos/{data.proyecto.id_proyecto}"
						class="inline-flex items-center rounded-xl border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
					>
						Volver al panel
					</a>
				</div>
			</div>
		{:else}
			{@const solicitud = data.solicitud}

			<header class="mb-10 space-y-4 text-center">
				<h1 class="text-3xl font-bold tracking-tight text-slate-900">Evaluación de cierre</h1>
				<p class="mx-auto max-w-2xl text-lg text-slate-600">
					Revisá las evidencias y confirmá que el proyecto se ha completado satisfactoriamente. Solo
					podrás aprobar si verificás el cumplimiento de objetivos.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<div
						class="inline-flex items-center space-x-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700"
					>
						<AlertTriangle class="h-4 w-4" />
						<span>Solicitud pendiente de aprobación</span>
					</div>

					{#if data.totalColaboradores > 0}
						<div
							class="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
							title="Votos de colaboradores aprobados"
						>
							<Users class="h-4 w-4" />
							<span>Votos registrados: {data.votosRealizados} / {data.totalColaboradores}</span>
						</div>
					{/if}
				</div>
			</header>

			<main class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Columna Principal: Reporte de impacto -->
				<div class="space-y-6 lg:col-span-2">
					<!-- Tarjeta del Proyecto Resumen -->
					<section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div class="space-y-6 p-6 sm:p-8">
							<div class="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
								<div class="flex items-center rounded-xl bg-blue-50 p-4">
									<div class="mr-4 rounded-lg bg-white p-3 text-blue-600 shadow-sm">
										<Users class="h-6 w-6" />
									</div>
									<div>
										<p class="text-sm font-medium text-slate-500">Beneficiarios directos</p>
										<p class="text-xl font-bold text-slate-900">
											{data.proyecto.beneficiarios ?? 'Sin datos'}
										</p>
									</div>
								</div>

								<div class="flex items-center rounded-xl bg-emerald-50 p-4">
									<div class="mr-4 rounded-lg bg-white p-3 text-emerald-600 shadow-sm">
										<Calendar class="h-6 w-6" />
									</div>
									<div>
										<p class="text-sm font-medium text-slate-500">Fecha de solicitud</p>
										<p class="text-xl font-bold text-slate-900">
											{formatearFecha(solicitud.created_at, 'long')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- Evidencias -->
					<section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
						<div class="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
							<h3 class="flex items-center font-semibold text-slate-800">
								<FileText class="mr-2 h-5 w-5 text-blue-500" />
								Evidencias adjuntas
								<span
									class="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700"
								>
									{solicitud.evidencias?.length ?? 0}
								</span>
							</h3>
						</div>

						<div class="p-6">
							{#if evidenciasPorObjetivo.length === 0}
								<div class="py-12 text-center text-slate-500">
									<p>No se encontraron objetivos para este proyecto.</p>
								</div>
							{:else}
								<div class="space-y-4">
									{#each evidenciasPorObjetivo as { objetivo, evidencias, evidenciasEntrada, evidenciasSalida, totalArchivos }}
										<ObjetivoEvidencias
											{objetivo}
											{evidencias}
											{evidenciasEntrada}
											{evidenciasSalida}
											{totalArchivos}
											bind:expandido={objetivosExpandidos[objetivo.id_participacion_permitida!]}
										/>
									{/each}
								</div>
							{/if}
						</div>
					</section>
				</div>

				<!-- Columna Lateral: Lista de Verificación -->
				<aside class="space-y-6">
					<div class="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<h3 class="mb-6 flex items-center text-lg font-bold text-slate-800">
							<ClipboardCheck class="mr-2 h-5 w-5 text-blue-600" />
							Lista de verificación
						</h3>

						{#if data.yaVote}
							<div
								class="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center"
								in:fade
							>
								<div class="mb-2 flex justify-center text-blue-600">
									<CheckCircle class="h-8 w-8" />
								</div>
								<h4 class="font-bold text-blue-900">Ya enviaste tu evaluación</h4>
								<p class="text-xs text-blue-700">
									Tu voto ha sido registrado correctamente para esta solicitud.
								</p>
							</div>
						{:else}
							<div class="mb-8 space-y-4">
								<label
									class="flex cursor-pointer items-start rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
								>
									<div class="flex h-6 items-center">
										<input
											type="checkbox"
											bind:checked={declarationChecked}
											class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
										/>
									</div>
									<div class="ml-3 text-sm leading-6">
										<span class="font-medium text-slate-900"
											>Declaro que la evidencia asociada a cada objetivo es legítima y cumple con
											los objetivos del proyecto.</span
										>
									</div>
								</label>
							</div>

							<div class="space-y-4">
								<form
									method="POST"
									action="?/aprobar"
									use:enhance={() => {
										loading = true;
										return async ({ result, update }) => {
											if (result.type === 'success' && result.data?.message) {
												toastStore.show({
													message: String(result.data.message),
													variant: 'success'
												});
											} else if (result.type === 'failure' && result.data?.error) {
												toastStore.show({
													message: String(result.data.error),
													variant: 'error'
												});
											}
											await update();
											loading = false;
										};
									}}
								>
									<input type="hidden" name="solicitud_id" value={solicitud.id_solicitud} />
									<button
										type="submit"
										disabled={loading || !declarationChecked}
										class="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-blue-600"
									>
										{#if loading}
											<div
												class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
											></div>
											Procesando...
										{:else}
											<CheckCircle class="mr-2 h-5 w-5" />
											Aprobar cierre
										{/if}
									</button>
								</form>

								<button
									type="button"
									disabled={loading}
									on:click={() => (showRejectModal = true)}
									class="flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:ring-4 focus:ring-red-50"
								>
									<XCircle class="mr-2 h-5 w-5" />
									Rechazar solicitud
								</button>
							</div>
						{/if}

						<!-- Botón Reportar (siempre visible o según lógica) -->
						<div class="mt-4 border-t border-slate-100 pt-4">
							<button
								type="button"
								class="flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-red-600"
								on:click={() => (showReportModal = true)}
							>
								<AlertTriangle class="mr-2 h-4 w-4" />
								Reportar irregularidad
							</button>
						</div>

						<p class="mt-6 text-center text-xs text-slate-400">
							Esta acción es irreversible y notificará a la institución.
						</p>
					</div>
				</aside>
			</main>

			<!-- Modal de Rechazo -->
			{#if showRejectModal}
				<div
					class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
					transition:fade={{ duration: 200 }}
				>
					<div
						class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
						transition:fly={{ y: 20, duration: 300 }}
					>
						<form
							method="POST"
							action="?/rechazar"
							use:enhance={() => {
								loading = true;
								return async ({ result, update }) => {
									if (result.type === 'success' && result.data?.message) {
										toastStore.show({
											message: String(result.data.message),
											variant: 'success'
										});
									} else if (result.type === 'failure' && result.data?.error) {
										toastStore.show({
											message: String(result.data.error),
											variant: 'error'
										});
									}
									await update();
									loading = false;
									showRejectModal = false;
								};
							}}
						>
							<div class="border-b border-slate-100 bg-slate-50 px-6 py-6">
								<h3 class="flex items-center text-xl font-bold text-slate-800">
									<AlertTriangle class="mr-2 h-6 w-6 text-red-500" />
									Rechazar solicitud
								</h3>
							</div>

							<div class="space-y-4 p-6">
								<p class="text-sm text-slate-600">
									Indicá el motivo por el cual estás rechazando el cierre del proyecto. Esto ayudará
									a la institución a corregir lo necesario.
								</p>

								<input type="hidden" name="solicitud_id" value={solicitud.id_solicitud} />

								<div>
									<label for="justificacion" class="mb-1 block text-sm font-medium text-slate-700"
										>Justificación del rechazo</label
									>
									<textarea
										id="justificacion"
										name="justificacion"
										rows="4"
										required
										class="w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Ej: Faltan evidencias de la entrega de donaciones..."
									></textarea>
								</div>
							</div>

							<div class="flex justify-end gap-3 rounded-b-2xl bg-slate-50 px-6 py-4">
								<button
									type="button"
									class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
									on:click={() => (showRejectModal = false)}
								>
									Cancelar
								</button>
								<button
									type="submit"
									class="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-red-700"
								>
									Confirmar rechazo
								</button>
							</div>
						</form>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Modal de Reporte -->
	<ModalReportarIrregularidad
		bind:open={showReportModal}
		tipo_objeto="Proyecto"
		id_objeto={proyecto.id_proyecto || 0}
		nombre_objeto={proyecto.titulo}
		onsuccess={handleReportSuccess}
	/>
</div>
