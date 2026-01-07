<script lang="ts">
	import { page } from '$app/stores';
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import ObjetivoEvidencias from '$lib/components/institucion/ObjetivoEvidencias.svelte';
	import ChecklistVerificacion from '$lib/components/institucion/ChecklistVerificacion.svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockEvidencias } from '$lib/mocks/mock-evidencias';
	import { mockVerificaciones } from '$lib/mocks/mock-verificaciones';
	import { mockSolicitudesFinalizacion } from '$lib/mocks/mock-solicitudes-finalizacion';
	import { usuario, isAuthenticated, isLoading, isInstitucion } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

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

	// Evidencias del proyecto seleccionado agrupadas por objetivo
	$: evidenciasPorObjetivo = proyectoActual
		? proyectoActual.participacion_permitida?.map((objetivo) => {
				const evidenciasObjetivo = mockEvidencias.filter(
					(e) => e.id_participacion_permitida === objetivo.id_participacion_permitida
				);
				// Separar evidencias de entrada y salida
				const evidenciasEntrada = evidenciasObjetivo.filter(
					(e) => !e.evidencias_entradas_ids || e.evidencias_entradas_ids.length === 0
				);
				const evidenciasSalida = evidenciasObjetivo.filter(
					(e) => e.evidencias_entradas_ids && e.evidencias_entradas_ids.length > 0
				);

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

<main class="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-12 text-center">
		<h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
			Solicitar cierre de proyecto
		</h1>
		<div class="mx-auto mt-4 max-w-2xl">
			<p class="mt-2 text-sm text-gray-500">
				Solo podrás avanzar si <strong>todos los puntos están completos</strong>.
			</p>
		</div>
	</div>

	<!-- Contenedor del formulario o Mensajes de Error -->
	<section class="animate-fade-in-up mx-auto w-full max-w-7xl">
		{#if accesoDenegado}
			<!-- Alerta de Acceso Denegado -->
			<div
				class="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg ring-1 ring-red-100"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
				>
					<svg
						class="h-8 w-8 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Acceso restringido</h3>
				<p class="text-gray-600">{mensajeErrorAcceso}</p>
				<button
					on:click={() => goto('/')}
					class="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				>
					Volver al inicio
				</button>
			</div>
		{:else if sinProyectosPendientes}
			<!-- Mensaje: Sin proyectos pendientes -->
			<div
				class="mx-auto max-w-2xl rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-lg ring-1 ring-blue-100"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50"
				>
					<svg
						class="h-8 w-8 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Todo al día</h3>
				<p class="text-gray-600">
					No tenés ningún proyecto pendiente de solicitud de cierre en este momento.
				</p>
				<button
					on:click={() => goto('/proyectos')}
					class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Ver mis proyectos
				</button>
			</div>
		{:else if solicitudEnviada}
			<div
				class="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800 shadow-sm"
			>
				<svg
					class="h-6 w-6 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
				<div>
					<p class="font-semibold">¡Solicitud de cierre enviada exitosamente!</p>
					<p class="mt-1 text-sm text-green-700">
						Tu solicitud de cierre de proyecto ha sido enviada. Los colaboradores serán notificados
						para revisar y validar las evidencias cargadas.
					</p>
				</div>
			</div>
		{:else}
			<form on:submit={enviarSolicitud} class="w-full">
				<!-- Selección de proyecto -->
				<div class="mb-8 rounded-2xl">
					<label for="proyecto" class="mb-2 block text-sm font-medium text-gray-700">
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
				</div>

				{#if proyectoSeleccionado && proyectoActual}				<!-- Alerta: Solicitud pendiente existente -->
				{#if solicitudPendienteExistente}
					<div
						class="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm"
					>
						<div class="flex gap-4">
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-orange-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-base font-semibold text-orange-900">Solicitud ya enviada</h3>
								<p class="mt-2 text-sm text-orange-800">
									Este proyecto ya tiene una solicitud de cierre <strong>pendiente</strong> de revisión.
									No podés enviar otra solicitud hasta que los colaboradores revisen la actual.
								</p>
								<p class="mt-2 text-xs text-orange-700">
									Fecha de solicitud:
									{solicitudPendienteExistente.created_at?.toLocaleDateString('es-AR', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</p>
							</div>
						</div>
					</div>
				{/if}
					<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
						<!-- Columna Izquierda: Evidencias (Principal) -->
						<div class="space-y-6 lg:col-span-8">
							<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
								<div class="border-b border-gray-100 bg-gray-50/50 p-6">
									<div class="flex items-center gap-2">
										<div class="rounded-lg bg-blue-50 p-2">
											<svg
												class="h-5 w-5 text-blue-600"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
												/>
											</svg>
										</div>
										<div>
											<h2 class="text-lg font-semibold text-gray-900">Resumen de Evidencias</h2>
											<p class="text-sm text-gray-500">Revisá el progreso de cada objetivo</p>
										</div>
									</div>
								</div>

								<div class="p-6">
									{#if evidenciasPorObjetivo.length === 0}
										<div class="py-12 text-center">
											<p class="text-gray-500">No se encontraron objetivos para este proyecto.</p>
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

										<!-- Alerta si falta cargar evidencias -->
										{#if !todosLosObjetivosTienenEvidencias}
											<div class="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
												<div class="flex gap-3">
													<svg
														class="h-5 w-5 flex-shrink-0 text-yellow-600"
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
													<div class="text-sm text-yellow-800">
														<p class="font-medium">Atención: Faltan evidencias</p>
														<p class="mt-1 text-yellow-700">
															Algunos objetivos no tienen evidencias cargadas. Debes cargar al menos
															una evidencia para cada objetivo antes de solicitar el cierre.
														</p>
													</div>
												</div>
											</div>
										{/if}
									{/if}
								</div>
							</div>
						</div>

						<!-- Columna Derecha: Checklist y acciones (Sticky) -->
						<div class="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
							<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
								<div class="p-6">
									<ChecklistVerificacion bind:checks disabled={tieneSolicitudPendiente} />

									<div class="mt-6 space-y-4">
										<!-- Nota informativa -->
										<div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
											<div class="flex gap-3">
												<svg
													class="h-5 w-5 flex-shrink-0 text-blue-600"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
													/>
												</svg>
												<div class="text-sm text-blue-800">
													<p class="font-medium">Información importante</p>
													<p class="mt-1 text-xs leading-relaxed text-blue-700">
														Al enviar, los colaboradores recibirán una notificación para validar
														evidencias. Al aprobarse, el proyecto pasará a "Completado".
													</p>
												</div>
											</div>
										</div>

										<!-- Botón de envío -->
										<button
											type="submit"
											disabled={!todosLosChecksCompletos ||
												!todosLosObjetivosTienenEvidencias ||
												enviandoSolicitud ||
												tieneSolicitudPendiente}
											class="w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none {todosLosChecksCompletos &&
										todosLosObjetivosTienenEvidencias &&
								!tieneSolicitudPendiente
												? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:ring-blue-500'
												: 'bg-gray-300 text-gray-500'}"
										>
											{#if enviandoSolicitud}
												<span class="flex items-center justify-center gap-2">
													<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
														<circle
															class="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															stroke-width="4"
															fill="none"
														></circle>
														<path
															class="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Enviando...
											</span>
											{:else if tieneSolicitudPendiente}
												Solicitud ya enviada
											{:else if !todosLosObjetivosTienenEvidencias}
												Faltan evidencias
											{:else if !todosLosChecksCompletos}
												Completar checklist
											{:else}
												Solicitar cierre
											{/if}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</form>
		{/if}
	</section>
</main>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>
