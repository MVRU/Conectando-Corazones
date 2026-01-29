<script lang="ts">
	import { page } from '$app/stores';
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import ObjetivoEvidencias from '$lib/components/feature/institucion/ObjetivoEvidencias.svelte';
	import ChecklistVerificacion from '$lib/components/feature/institucion/ChecklistVerificacion.svelte';
	import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
	import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';
	import { mockVerificaciones } from '$lib/infrastructure/mocks/mock-verificaciones';
	import { mockSolicitudesFinalizacion } from '$lib/infrastructure/mocks/mock-solicitudes-finalizacion';
	import { usuario, isAuthenticated, isLoading, isInstitucion } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { AlertTriangle, CheckCircle, FileText, Info, ShieldAlert } from 'lucide-svelte';

	// Estado derivado de la URL
	$: proyectoSeleccionado = $page.url.searchParams.get('proyecto') || '';

	let enviandoSolicitud = false;
	let solicitudEnviada = false;
	let mounted = false;
	let objetivosExpandidos: Record<number, boolean> = {};

	// Estado de acceso
	let accesoDenegado = false;
	let mensajeErrorAcceso = '';

	onMount(() => {
		mounted = true;
	});

	// Protección de ruta y validación de usuario
	$: if (browser && mounted && !$isLoading) {
		// Resetear estados de error en cada evaluación para evitar falsos positivos persistentes
		accesoDenegado = false;
		mensajeErrorAcceso = '';

		if (!$isAuthenticated || !$usuario) {
			goto('/login');
		} else if (!$isInstitucion) {
			accesoDenegado = true;
			mensajeErrorAcceso = 'Acceso exclusivo para instituciones.';
		} else {
			const verificacion = mockVerificaciones.find((v) => v.usuario_id == $usuario!.id_usuario);

			if (!verificacion) {
				accesoDenegado = true;
				mensajeErrorAcceso = 'No se encontró la información de verificación de tu institución.';
			} else if (verificacion.estado !== 'aprobada') {
				accesoDenegado = true;
				mensajeErrorAcceso = `Tu institución debe estar verificada (estado "aprobada") para realizar esta acción. Estado actual: ${verificacion.estado}`;
			} else if (proyectoSeleccionado && proyectoActual && !proyectoPerteneceAInstitucion) {
				// Validación de institucion creadora usando variable derivada
				accesoDenegado = true;
				mensajeErrorAcceso =
					'Este proyecto no pertenece a tu institución. Solo podés solicitar el cierre de tus propios proyectos.';
			}
		}
	}

	// Checklist items
	let checks = {
		evidenciasSuficientes: false,
		archivosLegibles: false,
		evidenciasRespaldadas: false,
		noRequiereMasEvidencias: false,
		conformidadRevision: false
	};

	// Proyectos PENDIENTES DE CIERRE de la institución actual y VERIFICADA
	$: proyectosDisponibles =
		$usuario && !accesoDenegado
			? mockProyectos
					.filter(
						(p) =>
							p.institucion_id == $usuario!.id_usuario && p.estado === 'pendiente_solicitud_cierre'
					)
					.map((p) => ({
						value: String(p.id_proyecto),
						label: p.titulo
					}))
			: [];

	// Validar si tiene proyectos disponibles para mostrar alerta específica
	$: sinProyectosPendientes =
		mounted && !accesoDenegado && $usuario && proyectosDisponibles.length === 0;

	// Obtener proyecto completo seleccionado
	$: proyectoActual = proyectoSeleccionado
		? mockProyectos.find((p) => p.id_proyecto === Number(proyectoSeleccionado))
		: null;

	// Verificar si ya existe una solicitud de finalización pendiente para el proyecto seleccionado
	$: solicitudPendienteExistente = proyectoSeleccionado
		? mockSolicitudesFinalizacion.find(
				(s) => s.proyecto_id === Number(proyectoSeleccionado) && s.estado === 'pendiente'
			)
		: null;

	// Variable booleana derivada para validaciones
	$: tieneSolicitudPendiente = !!solicitudPendienteExistente;

	//  Validar si es el dueño del proyecto
	$: proyectoPerteneceAInstitucion = proyectoActual
		? proyectoActual.institucion_id === $usuario?.id_usuario
		: false;

	// Contar solicitudes rechazadas del proyecto seleccionado
	$: solicitudesRechazadas = proyectoSeleccionado
		? mockSolicitudesFinalizacion.filter(
				(s) => s.proyecto_id === Number(proyectoSeleccionado) && s.estado === 'rechazada'
			)
		: [];

	// Validar si tiene 3 o más solicitudes rechazadas
	$: tieneTresSolicitudesRechazadas = solicitudesRechazadas.length >= 3;

	// Evidencias del proyecto seleccionado agrupadas por objetivo
	$: evidenciasPorObjetivo = proyectoActual
		? proyectoActual.participacion_permitida?.map((objetivo) => {
				const evidenciasObjetivo = mockEvidencias.filter(
					(e) => e.id_participacion_permitida === objetivo.id_participacion_permitida
				);
				// Separar evidencias de entrada y salida
				const evidenciasEntrada = evidenciasObjetivo.filter((e) => e.tipo_evidencia === 'entrada');
				const evidenciasSalida = evidenciasObjetivo.filter((e) => e.tipo_evidencia === 'salida');

				return {
					objetivo,
					evidencias: evidenciasObjetivo,
					evidenciasEntrada,
					evidenciasSalida,
					totalArchivos: evidenciasObjetivo.reduce((sum, ev) => sum + (ev.archivos?.length || 0), 0)
				};
			}) || []
		: [];

	// Validar que todos los objetivos tengan al menos una evidencia
	$: todosLosObjetivosTienenEvidencias = evidenciasPorObjetivo.every(
		(item) => item.evidencias.length > 0
	);

	// Validar que todos los checks estén marcados
	$: todosLosChecksCompletos = Object.values(checks).every((check) => check === true);

	function handleProyectoChange(event: CustomEvent) {
		const nuevoId = event.detail.value;
		const url = new URL(window.location.href);
		if (nuevoId) {
			url.searchParams.set('proyecto', nuevoId);
		} else {
			url.searchParams.delete('proyecto');
		}
		goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: false });
	}

	async function enviarSolicitud(event: Event) {
		event.preventDefault();

		// Validación antes de enviar usando variable derivada
		if (!proyectoPerteneceAInstitucion) {
			console.error('[SEGURIDAD] Intento de solicitar cierre de proyecto ajeno');
			return;
		}

		// Validación: verificar límite de 3 solicitudes rechazadas
		if (tieneTresSolicitudesRechazadas) {
			console.error('[VALIDACIÓN] Proyecto con 3 solicitudes rechazadas');
			return;
		}

		// Validación previa: no continuar si falta algún requisito o ya existe solicitud pendiente
		if (
			!proyectoSeleccionado ||
			!todosLosChecksCompletos ||
			!todosLosObjetivosTienenEvidencias ||
			tieneSolicitudPendiente
		) {
			return;
		}

		enviandoSolicitud = true;

		// Simulación de envío al backend
		setTimeout(() => {
			enviandoSolicitud = false;
			solicitudEnviada = true;

			// Resetear form y limpiar URL
			const url = new URL(window.location.href);
			url.searchParams.delete('proyecto');
			goto(url.toString(), { replaceState: true });

			checks = {
				evidenciasSuficientes: false,
				archivosLegibles: false,
				evidenciasRespaldadas: false,
				noRequiereMasEvidencias: false,
				conformidadRevision: false
			};

			// Ocultar mensaje de éxito después de 5 segundos
			setTimeout(() => {
				solicitudEnviada = false;
			}, 5000);
		}, 2000);
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
		<!-- Encabezado -->
		<header class="text-center">
			<h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
				Solicitar cierre de proyecto
			</h1>
			<div class="mx-auto mt-4 max-w-2xl">
				<p class="text-lg text-slate-600">
					Solo podrás avanzar si <strong>todos los puntos están completos</strong>. Asegurate de
					haber cargado todas las evidencias necesarias.
				</p>
			</div>
		</header>

		{#if accesoDenegado}
			<!-- Alerta de Acceso Denegado -->
			<div class="rounded-2xl border border-red-200 bg-white p-12 text-center shadow-sm" in:fade>
				<div class="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-3">
					<ShieldAlert class="h-8 w-8 text-red-600" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-slate-900">Acceso restringido</h3>
				<p class="text-slate-600">{mensajeErrorAcceso}</p>
				<button
					on:click={() => goto('/')}
					class="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
				>
					Volver al inicio
				</button>
			</div>
		{:else if sinProyectosPendientes}
			<!-- Mensaje: Sin proyectos pendientes -->
			<div class="rounded-2xl border border-blue-200 bg-white p-12 text-center shadow-sm" in:fade>
				<div class="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
					<CheckCircle class="h-8 w-8 text-blue-600" />
				</div>
				<h3 class="mb-2 text-xl font-bold text-slate-900">Todo al día</h3>
				<p class="text-slate-600">
					No tenés ningún proyecto pendiente de solicitud de cierre en este momento.
				</p>
				<button
					on:click={() => goto('/proyectos')}
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
			<!-- Grid Layout -->
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Main Content: Selection and Evidences -->
				<div class="space-y-6 lg:col-span-2">
					<!-- Project Selection -->
					<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<label for="proyecto" class="mb-2 block text-sm font-semibold text-slate-700">
							Seleccioná el proyecto <span class="text-red-500">*</span>
						</label>
						{#if browser && mounted}
							<div class="w-full">
								<Select
									id="proyecto"
									name="proyecto"
									options={proyectosDisponibles}
									value={proyectoSeleccionado}
									placeholder="Elegí un proyecto para solicitar cierre"
									on:change={handleProyectoChange}
									required
								/>
							</div>
						{/if}

						<!-- Alerts inside Selection Card -->
						{#if tieneTresSolicitudesRechazadas}
							<div class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
								<div class="flex gap-3">
									<AlertTriangle class="h-5 w-5 flex-shrink-0 text-red-600" />
									<div>
										<h3 class="text-sm font-bold text-red-800">Límite de rechazos alcanzado</h3>
										<p class="mt-1 text-sm text-red-700">
											Este proyecto ha sido rechazado 3 veces. Por favor, ponete en contacto con
											soporte.
										</p>
										<div class="mt-2 text-xs text-red-700">
											<p class="font-medium">Fechas de rechazo:</p>
											<ul class="mt-1 list-inside list-disc space-y-1">
												{#each solicitudesRechazadas as solicitud}
													<li>
														{solicitud.created_at?.toLocaleDateString('es-AR', {
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

					<!-- Evidences List -->
					{#if proyectoSeleccionado && evidenciasPorObjetivo.length > 0}
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

								{#if !todosLosObjetivosTienenEvidencias}
									<div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
										<div class="flex gap-3">
											<AlertTriangle class="h-5 w-5 flex-shrink-0 text-amber-600" />
											<div>
												<h3 class="text-sm font-bold text-amber-800">
													Atención: Faltan evidencias
												</h3>
												<p class="mt-1 text-sm text-amber-700">
													Algunos objetivos no tienen evidencias cargadas. Tenés que cargar al menos
													una evidencia para cada objetivo antes de solicitar el cierre.
												</p>
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{:else if proyectoSeleccionado && evidenciasPorObjetivo.length === 0}
						<div
							class="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500"
						>
							<p>No se encontraron objetivos para este proyecto.</p>
						</div>
					{/if}
				</div>

				<!-- Sidebar: Checklist -->
				<aside class="space-y-6 lg:col-span-1">
					{#if proyectoSeleccionado}
						<div class="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<h3 class="mb-6 flex items-center text-lg font-bold text-slate-800">
								<CheckCircle class="mr-2 h-5 w-5 text-blue-600" />
								Lista de verificación
							</h3>

							<ChecklistVerificacion
								bind:checks
								disabled={tieneSolicitudPendiente || tieneTresSolicitudesRechazadas}
							/>

							<button
								on:click={enviarSolicitud}
								disabled={enviandoSolicitud ||
									!todosLosChecksCompletos ||
									!todosLosObjetivosTienenEvidencias ||
									tieneSolicitudPendiente ||
									tieneTresSolicitudesRechazadas}
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

							{#if !todosLosChecksCompletos}
								<p class="mt-4 text-center text-xs text-slate-400">
									Completá todos los puntos para habilitar el envío.
								</p>
							{/if}

							<!-- Botón Reportar Irregularidad -->
							<div class="mt-8 border-t border-slate-100 pt-6">
								<button
									type="button"
									class="flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
									on:click={() =>
										alert(
											'Irregularidad reportada. El equipo de auditoría revisará este proyecto.'
										)}
								>
									<AlertTriangle class="mr-2 h-4 w-4" />
									Reportar irregularidad
								</button>
							</div>
						</div>

						{#if !tieneTresSolicitudesRechazadas && !tieneSolicitudPendiente}
							<div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
								<div class="flex gap-3">
									<Info class="h-5 w-5 flex-shrink-0 text-blue-600" />
									<div class="text-sm text-blue-800">
										<p class="font-medium">Información importante</p>
										<p class="mt-1 text-xs leading-relaxed text-blue-700">
											Al enviar, los colaboradores recibirán una notificación para validar
											evidencias. Al aprobarse, el proyecto pasará a "Completado".
										</p>
									</div>
								</div>
							</div>
						{/if}
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
