<!-- TODO: corregir esta ruta -->

<script lang="ts">
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import ObjetivoEvidencias from '$lib/components/feature/institucion/ObjetivoEvidencias.svelte';
	import ChecklistVerificacion from '$lib/components/feature/institucion/ChecklistVerificacion.svelte';
	import ModalReportarIrregularidad from '$lib/components/ui/ModalReportarIrregularidad.svelte';
	import { usuario, isAuthenticated, isLoading, isInstitucion } from '$lib/stores/auth';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { AlertTriangle, CheckCircle, FileText, Info, ShieldAlert } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let mounted = $state(false);
	let proyectoSeleccionado = $state<string>('');
	let enviandoSolicitud = $state(false);
	let solicitudEnviada = $state(false);
	let objetivosExpandidos = $state<Record<number, boolean>>({});
	let modalReporteAbierto = $state(false);
	let errorSolicitud = $state<string | null>(null);
	let checks = $state({
		evidenciasSuficientes: false,
		archivosLegibles: false,
		evidenciasRespaldadas: false,
		noRequiereMasEvidencias: false,
		conformidadRevision: false
	});

	$effect(() => {
		mounted = true;
	});

	$effect(() => {
		if (mounted && !$isLoading && (!$isAuthenticated || !$usuario)) {
			// Navigation handled by the auth guard in the layout/middleware
			window.location.href = '/iniciar-sesion';
		}
	});

	// Sync URL param with local state on mount and after navigation
	$effect.pre(() => {
		if (mounted && typeof window !== 'undefined') {
			const params = new URL(window.location.href).searchParams;
			proyectoSeleccionado = params.get('proyecto') || '';
		}
	});

	// Derived state - order matters: define data dependencies first
	let proyectoActual = $derived(data.proyectoActual);
	let solicitudPendienteExistente = $derived(data.solicitudPendiente);
	let solicitudesRechazadas = $derived(data.solicitudesRechazadas || []);
	let proyectosDisponibles = $derived(
		(data.proyectos || []).map((p: { id_proyecto: number; titulo: string }) => ({
			value: String(p.id_proyecto),
			label: p.titulo
		}))
	);

	let tieneSolicitudPendiente = $derived(!!solicitudPendienteExistente);
	let proyectoPerteneceAInstitucion = $derived(
		proyectoActual
			? proyectoActual.institucion_id === $usuario?.id_usuario
			: false
	);
	let muchosRechazos = $derived((solicitudesRechazadas?.length || 0) >= 3);
	let formularioBloqueadoPorAuditoria = $derived(muchosRechazos && proyectoActual?.estado === 'en_auditoria');

	// Refactor Acceso Denegado a lógica reactiva Svelte 5 ($derived)
	let accesoEstado = $derived.by(() => {
		// Durante carga, no mostrar mensajes de error
		if (!mounted || $isLoading) return { denegado: false, mensaje: '' };

		// Verificar autenticación básica
		if (!$isAuthenticated || !$usuario) return { denegado: true, mensaje: 'Redirigiendo...' };
		if (!$isInstitucion) return { denegado: true, mensaje: 'Acceso exclusivo para instituciones.' };

		// Verificar estado de aprobación de la institución
		const verificacion = data.verificacion;
		if (verificacion && verificacion.estado !== 'aprobada') {
			return { denegado: true, mensaje: `Tu institución debe estar aprobada para realizar esta acción. Estado: ${verificacion.estado}` };
		}

		// Verificar que el proyecto seleccionado pertenece a la institución del usuario
		if (proyectoSeleccionado && proyectoActual && proyectoActual.institucion_id !== $usuario?.id_usuario) {
			return { denegado: true, mensaje: 'Este proyecto no pertenece a tu institución.' };
		}

		return { denegado: false, mensaje: '' };
	});

	let sinProyectosPendientes = $derived(
		mounted && !accesoEstado.denegado && $usuario && (proyectosDisponibles?.length || 0) === 0
	);

	let objetivosDelProyecto = $derived.by(() => {
		// Priorizar proyectoActual.participacion_permitida como fuente de verdad
		// Fallback a data.objetivos si participacion_permitida no está disponible
		let items = [];
		if (proyectoActual?.participacion_permitida && proyectoActual.participacion_permitida.length > 0) {
			items = proyectoActual.participacion_permitida;
		} else {
			items = data.objetivos || [];
		}
		
		console.log('[DEBUG:Objetivos]', {
			count: items.length,
			source: proyectoActual?.participacion_permitida ? 'proyectoActual' : 'data.objetivos',
			ids: items.map((o: any) => o.id_participacion_permitida)
		});
		
		return items;
	});

	let evidenciasPorObjetivo = $derived.by(() => {
		if (!objetivosDelProyecto || objetivosDelProyecto.length === 0) {
			console.log('[DEBUG:Evidencias] No hay objetivos cargados');
			return [];
		}
		
		const evidencias = data.evidencias || [];
		
		const result = (objetivosDelProyecto || []).map((obj: any) => {
			const objId = Number(obj.id_participacion_permitida);
			const evsParaEsteObjetivo = evidencias.filter((ev: any) => 
				Number(ev.id_participacion_permitida) === objId
			);

			const entrada = evsParaEsteObjetivo.filter((ev: any) => ev.tipo_evidencia === 'entrada');
			const salida = evsParaEsteObjetivo.filter((ev: any) => ev.tipo_evidencia === 'salida');

			const totalArch = evsParaEsteObjetivo.reduce(
				(sum: number, ev: any) => sum + (ev.archivos?.length || 0),
				0
			);

			if (evsParaEsteObjetivo.length > 0) {
				console.log(`[DEBUG:Evidencias:ObjID=${objId}]`, {
					total: evsParaEsteObjetivo.length,
					entrada: entrada.length,
					salida: salida.length,
					archivos: totalArch,
					primerUsuario: evsParaEsteObjetivo[0]?.archivos?.[0]?.usuario?.username || 'N/A'
				});
			}

			return {
				objetivo: obj,
				evidencias: evsParaEsteObjetivo,
				evidenciasEntrada: entrada,
				evidenciasSalida: salida,
				totalArchivos: totalArch
			};
		});
		
		console.log('[DEBUG:Evidencias] Mapeadas por objetivo:', result.length);
		return result;
	});

	let todosLosObjetivosTienenEvidenciasCompletas = $derived.by(() => {
		if (!evidenciasPorObjetivo || evidenciasPorObjetivo.length === 0) return false;
		return (evidenciasPorObjetivo || []).every((item: {
			evidenciasEntrada: unknown[];
			evidenciasSalida: unknown[];
		}) =>
			item.evidenciasEntrada.length > 0 && item.evidenciasSalida.length > 0
		);
	});

	let todosLosChecksCompletos = $derived(Object.values(checks).every((check) => check === true));

	async function handleProyectoChange(option: { value: string; label: string }) {
		const nuevoId = option.value;
		const url = new URL(window.location.href);
		if (nuevoId) {
			url.searchParams.set('proyecto', nuevoId);
		} else {
			url.searchParams.delete('proyecto');
		}
		// Use window.location to navigate and trigger server-side data load
		// The new URL will cause +page.server.ts to run with the new proyecto parameter
		window.location.href = url.toString();
	}

	async function enviarSolicitud(event: Event) {
		event.preventDefault();

		if (!proyectoPerteneceAInstitucion) {
			console.error('[SEGURIDAD] Intento de solicitar cierre de proyecto ajeno');
			return;
		}

		if (formularioBloqueadoPorAuditoria) {
			console.error('[VALIDACIÓN] Proyecto en auditoría con límite de rechazos');
			return;
		}

		if (
			!proyectoSeleccionado ||
			!todosLosChecksCompletos ||
			!todosLosObjetivosTienenEvidenciasCompletas ||
			tieneSolicitudPendiente
		) {
			return;
		}

		enviandoSolicitud = true;

		try {
			const formData = new FormData();
			formData.set('proyecto_id', proyectoSeleccionado);

			// Por ahora usamos todas las evidencias del proyecto como respaldo
			const evidenciasProyecto = (data.evidencias || []) as any[];
			for (const ev of evidenciasProyecto) {
				if (ev.id_evidencia != null) {
					formData.append('evidencia_ids', String(ev.id_evidencia));
				}
			}

			const response = await fetch('?/solicitarCierre', {
				method: 'POST',
				body: formData
			});

			let resultado: any = null;
			try {
				resultado = await response.json();
			} catch {
				errorSolicitud = 'Error al procesar la respuesta del servidor.';
				enviandoSolicitud = false;
				return;
			}

			// SvelteKit serializa fail() como { type: 'failure', data: { message: '...' } }
			if (resultado?.type === 'failure' || !response.ok) {
				errorSolicitud = resultado?.data?.message ?? resultado?.message ?? 'Error al enviar la solicitud.';
				enviandoSolicitud = false;
				return;
			}

			errorSolicitud = null;

			// Si todo salió bien, mostramos mensaje de éxito y reseteamos estados locales
			enviandoSolicitud = false;
			solicitudEnviada = true;

			const url = new URL(window.location.href);
			url.searchParams.delete('proyecto');
			window.location.href = url.toString();

			checks = {
				evidenciasSuficientes: false,
				archivosLegibles: false,
				evidenciasRespaldadas: false,
				noRequiereMasEvidencias: false,
				conformidadRevision: false
			};

			setTimeout(() => {
				solicitudEnviada = false;
			}, 5000);
		} catch (err) {
			console.error('Error inesperado al enviar la solicitud de cierre', err);
			enviandoSolicitud = false;
		}
	}
</script>

<svelte:head>
	<title>Solicitar cierre de proyecto - Conectando Corazones</title>
	<meta
		name="description"
		content="Solicitá el cierre de tu proyecto completando la lista de verificación para enviar a revisión de colaboradores."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl space-y-8">
		<header class="text-center">
			<h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
				Solicitar cierre de proyecto
			</h1>
			<div class="mx-auto mt-4 max-w-2xl">
				<p class="text-lg text-slate-600">
					Solo podrás avanzar si <strong>todos los puntos están completos</strong>. Asegurate de
					haber cargado todas las evidencias necesarias.
				</p>
				{#if proyectoSeleccionado}
					<p class="mt-3 text-center">
						<a
							href={`/institucion/proyectos/${proyectoSeleccionado}/solicitudes-cierre`}
							class="text-sm font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
						>
							Ver historial de solicitudes de este proyecto
						</a>
					</p>
				{/if}
			</div>
		</header>

		{#if accesoEstado.denegado}
			<div class="rounded-2xl border border-red-200 bg-white p-12 text-center shadow-sm" in:fade>
				<div class="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-3">
					<ShieldAlert class="h-8 w-8 text-red-600" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-slate-900">Acceso restringido</h3>
				<p class="text-slate-600">{accesoEstado.mensaje}</p>
				<button
					onclick={() => window.location.href = '/'}
					class="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
				>
					Volver al inicio
				</button>
			</div>
		{:else if sinProyectosPendientes}
			<div class="rounded-2xl border border-blue-200 bg-white p-12 text-center shadow-sm" in:fade>
				<div class="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
					<CheckCircle class="h-8 w-8 text-blue-600" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-slate-900">Todo al día</h3>
				<p class="text-slate-600">
					No tenés ningún proyecto pendiente de solicitud de cierre en este momento.
				</p>
				<button
					onclick={() => window.location.href = '/proyectos'}
					class="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
				>
					Ver mis proyectos
				</button>
			</div>
		{:else if solicitudEnviada}
			<div
				class="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm"
				in:fade
			>
				<div class="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-3">
					<CheckCircle class="h-8 w-8 text-green-600" />
				</div>
				<h3 class="mb-2 text-2xl font-bold text-green-800">¡Solicitud enviada!</h3>
				<p class="text-green-700">
					Tu solicitud de cierre ha sido enviada exitosamente para revisión.
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div class="space-y-6 lg:col-span-2">
					<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<label for="proyecto" class="mb-2 block text-sm font-semibold text-slate-700">
							Seleccioná el proyecto <span class="text-red-500">*</span>
						</label>
						{#if mounted}
							<div class="w-full">
								<Select
									id="proyecto"
									name="proyecto"
									options={proyectosDisponibles}
									value={proyectoSeleccionado}
									placeholder="Elegí un proyecto para solicitar cierre"
									onchange={handleProyectoChange}
									required
								/>
							</div>
						{/if}

						<!-- Alerts inside Selection Card -->
						{#if formularioBloqueadoPorAuditoria}
							<div class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
								<div class="flex gap-3">
									<AlertTriangle class="h-5 w-5 flex-shrink-0 text-red-600" />
									<div>
										<h3 class="text-sm font-bold text-red-800">Revisión administrativa</h3>
										<p class="mt-1 text-sm text-red-700">
											Este proyecto acumuló varias solicitudes rechazadas y está en auditoría. No
											podés enviar una nueva solicitud desde acá; contactá a soporte si necesitás
											ayuda.
										</p>
										<div class="mt-2 text-xs text-red-700">
											<p class="font-medium">Fechas de solicitudes rechazadas:</p>
											<ul class="mt-1 list-inside list-disc space-y-1">
												{#each solicitudesRechazadas as solicitud (solicitud.id_solicitud_finalizacion)}
													<li>
														{new Date(solicitud.created_at).toLocaleDateString('es-AR', {
															day: 'numeric',
															month: 'long',
															year: 'numeric'
														})}
													</li>
												{/each}
											</ul>
										</div>
									</div>
								</div>
							</div>
						{:else if muchosRechazos}
							<div class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
								<div class="flex gap-3">
									<Info class="h-5 w-5 flex-shrink-0 text-amber-700" />
									<div>
										<h3 class="text-sm font-bold text-amber-900">Podés volver a intentar</h3>
										<p class="mt-1 text-sm text-amber-800">
											Hubo varias solicitudes rechazadas, pero el proyecto no está en auditoría.
											Revisá el feedback en el historial, actualizá las evidencias si hace falta y
											enviá una nueva solicitud.
										</p>
										{#if proyectoSeleccionado}
											<a
												href="/institucion/proyectos/{proyectoSeleccionado}/solicitudes-cierre"
												class="mt-3 inline-flex text-sm font-semibold text-amber-900 underline hover:text-amber-950"
											>
												Ver historial de solicitudes de cierre
											</a>
										{/if}
									</div>
								</div>
							</div>
						{:else if solicitudPendienteExistente}
							<div class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
								<div class="flex gap-3">
									<Info class="h-5 w-5 flex-shrink-0 text-amber-600" />
									<div>
										<h3 class="text-sm font-bold text-amber-800">Solicitud pendiente</h3>
										<p class="mt-1 text-sm text-amber-700">
											Ya existe una solicitud de cierre pendiente de revisión para este proyecto.
										</p>
									</div>
								</div>
							</div>
						{/if}
					</div>

					{#if proyectoSeleccionado && (evidenciasPorObjetivo?.length || 0) > 0}
						<div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
							<div class="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
								<h3 class="flex items-center text-lg font-bold text-slate-800">
									<FileText class="mr-2 h-5 w-5 text-blue-600" />
									Resumen de Evidencias
								</h3>
								<p class="mt-1 text-sm text-slate-500">
									Revisá el progreso de cada objetivo cargado.
								</p>
							</div>
							<div class="space-y-4 p-6">
								{#each evidenciasPorObjetivo as { objetivo, evidencias, evidenciasEntrada, evidenciasSalida, totalArchivos } (objetivo?.id_participacion_permitida)}
									{#if objetivo}
										<ObjetivoEvidencias
											{objetivo}
											evidencias={evidencias || []}
											evidenciasEntrada={evidenciasEntrada || []}
											evidenciasSalida={evidenciasSalida || []}
											totalArchivos={totalArchivos || 0}
											bind:expandido={objetivosExpandidos[objetivo.id_participacion_permitida || 0]}
										/>
									{/if}
								{/each}

								{#if !todosLosObjetivosTienenEvidenciasCompletas}
									<div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
										<div class="flex gap-3">
											<AlertTriangle class="h-5 w-5 flex-shrink-0 text-amber-600" />
											<div>
												<h3 class="text-sm font-bold text-amber-800">
													Atención: Faltan evidencias
												</h3>
												<p class="mt-1 text-sm text-amber-700">
													Cada objetivo requiere <strong>evidencias de entrada y de salida</strong>.
													Asegurate de haber cargado ambos tipos de evidencias para cada objetivo
													antes de solicitar el cierre.
												</p>
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{:else if proyectoSeleccionado && (evidenciasPorObjetivo?.length || 0) === 0}
						<div
							class="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500"
						>
							<p>No se encontraron objetivos para este proyecto.</p>
						</div>
					{/if}
				</div>

				<aside class="space-y-6 lg:col-span-1">
					{#if proyectoSeleccionado}
						<div class="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<h3 class="mb-6 flex items-center text-lg font-bold text-slate-800">
								<CheckCircle class="mr-2 h-5 w-5 text-blue-600" />
								Lista de verificación
							</h3>

							<ChecklistVerificacion
								bind:checks
								disabled={tieneSolicitudPendiente || formularioBloqueadoPorAuditoria}
							/>

							<button
								onclick={enviarSolicitud}
								disabled={enviandoSolicitud ||
									!todosLosChecksCompletos ||
									!todosLosObjetivosTienenEvidenciasCompletas ||
									tieneSolicitudPendiente ||
									formularioBloqueadoPorAuditoria}
								class="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
							>
								{#if enviandoSolicitud}
									<div
										class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
									></div>
									Enviando...
								{:else}
									Solicitar Cierre
								{/if}
							</button>

							{#if errorSolicitud}
								<div class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
									<p class="text-sm font-medium text-red-700">{errorSolicitud}</p>
								</div>
							{/if}

							{#if !todosLosChecksCompletos}
								<p class="mt-4 text-center text-xs text-slate-400">
									Completá todos los puntos para habilitar el envío.
								</p>
							{/if}

							<div class="mt-8 border-t border-slate-100 pt-6">
								<button
									type="button"
									class="flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
									onclick={() => (modalReporteAbierto = true)}
								>
									<AlertTriangle class="mr-2 h-4 w-4" />
									Reportar irregularidad
								</button>
							</div>

							{#if !formularioBloqueadoPorAuditoria && !tieneSolicitudPendiente}
								<div class="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
									<div class="flex gap-3">
										<Info class="h-5 w-5 flex-shrink-0 text-blue-600" />
										<div class="text-sm text-slate-800">
											<p class="font-semibold text-blue-900">Información importante</p>
											<p class="mt-1 text-sm leading-relaxed text-slate-700">
												Al enviar, los colaboradores recibirán una notificación para validar
												evidencias. Al aprobarse, el proyecto pasará a "Completado".
											</p>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<div
							class="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500"
						>
							<p>Seleccioná un proyecto para ver la lista de verificación.</p>
						</div>
					{/if}
				</aside>
			</div>
		{/if}
	</div>
</main>

<ModalReportarIrregularidad
	bind:open={modalReporteAbierto}
	tipo_objeto="Proyecto"
	id_objeto={proyectoActual?.id_proyecto || 0}
	nombre_objeto={proyectoActual?.titulo || ''}
	onclose={() => (modalReporteAbierto = false)}
/>
