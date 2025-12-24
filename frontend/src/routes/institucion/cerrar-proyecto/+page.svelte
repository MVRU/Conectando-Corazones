
<script lang="ts">
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import ObjetivoEvidencias from '$lib/components/institucion/ObjetivoEvidencias.svelte';
	import ChecklistVerificacion from '$lib/components/institucion/ChecklistVerificacion.svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockEvidencias } from '$lib/mocks/mock-evidencias';
	import { usuario } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let proyectoSeleccionado = '';
	let enviandoSolicitud = false;
	let solicitudEnviada = false;
	let mounted = false;
	let objetivosExpandidos: Record<number, boolean> = {};

	onMount(() => {
		mounted = true;
	});

	// Checklist items
	let checks = {
		evidenciasSuficientes: false,
		archivosLegibles: false,
		evidenciasRespaldadas: false,
		noRequiereMasEvidencias: false,
		conformidadRevision: false
	};

	// Proyectos en curso de la institución actual
	$: proyectosDisponibles = $usuario
		? mockProyectos
				.filter((p) => p.estado === 'en_curso' && p.institucion_id === $usuario.id_usuario)
				.map((p) => ({
					value: String(p.id_proyecto),
					label: p.titulo
				}))
		: [];

	// Obtener proyecto completo seleccionado
	$: proyectoActual = proyectoSeleccionado
		? mockProyectos.find((p) => p.id_proyecto === Number(proyectoSeleccionado))
		: null;

	// Evidencias del proyecto seleccionado agrupadas por objetivo
	$: evidenciasPorObjetivo = proyectoActual
		? proyectoActual.participacion_permitida?.map((objetivo) => {
				const evidenciasObjetivo = mockEvidencias.filter(
					(e) => e.id_participacion_permitida === objetivo.id_participacion_permitida
				);
				// Separar evidencias de entrada y salida
				const evidenciasEntrada = evidenciasObjetivo.filter((e) => !e.evidencias_entradas_ids || e.evidencias_entradas_ids.length === 0);
				const evidenciasSalida = evidenciasObjetivo.filter((e) => e.evidencias_entradas_ids && e.evidencias_entradas_ids.length > 0);
				
				return {
					objetivo,
					evidencias: evidenciasObjetivo,
					evidenciasEntrada,
					evidenciasSalida,
					totalArchivos: evidenciasObjetivo.reduce(
						(sum, ev) => sum + (ev.archivos?.length || 0),
						0
					)
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
		proyectoSeleccionado = event.detail.value;
	}

	async function enviarSolicitud(event: Event) {
		event.preventDefault();

		enviandoSolicitud = true;

		// Simulación de envío al backend
		setTimeout(() => {
			enviandoSolicitud = false;
			solicitudEnviada = true;

			// Resetear formulario
			proyectoSeleccionado = '';
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
	<title>Solicitar Cierre de Proyecto - Conectando Corazones</title>
	<meta
		name="description"
		content="Solicitá el cierre de tu proyecto completando la lista de verificación para enviar a revisión de colaboradores."
	/>
</svelte:head>

<main class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:px-12 lg:px-28">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-16">
		<div class="mb-8 flex items-center justify-center gap-4">
			<div class="rounded-full bg-blue-100 p-3">
				<svg
					class="h-8 w-8 text-blue-600"
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
			</div>
			<h1 class="text-center text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
				Solicitar cierre de proyecto
			</h1>
			<div class="rounded-full bg-blue-100 p-3">
				<svg
					class="h-8 w-8 text-blue-600"
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
			</div>
		</div>
		<div class="mx-auto max-w-3xl">
			<p class="text-center text-lg leading-relaxed text-gray-600">
				Antes de enviar tu solicitud de cierre de proyecto, completá la siguiente lista de verificación.
			</p>
			<p class="mt-3 text-center text-base text-gray-500">
				Solo podrás avanzar si <strong>todos los puntos están completos</strong>.
			</p>
		</div>
	</div>

	<!-- Contenedor del formulario -->
	<section class="animate-fade-in-up mx-auto w-full max-w-3xl">
		<div
			class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg ring-1 ring-gray-100 transition hover:shadow-xl sm:p-10"
		>
			<!-- Mensaje de éxito -->
			{#if solicitudEnviada}
				<div
					class="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800"
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
							Tu solicitud de cierre de proyecto ha sido enviada. Los colaboradores serán notificados para
							revisar y validar las evidencias cargadas.
						</p>
					</div>
				</div>
			{:else}
				<form on:submit={enviarSolicitud} class="space-y-6">
					<!-- Selección de proyecto -->
					<div>
						<label for="proyecto" class="mb-2 block text-sm font-medium text-gray-700">
							Seleccioná el proyecto <span class="text-red-500">*</span>
						</label>
						{#if browser && mounted}
							<Select
								id="proyecto"
								name="proyecto"
								options={proyectosDisponibles}
								bind:value={proyectoSeleccionado}
								placeholder="Elegí un proyecto para solicitar cierre"
								on:change={handleProyectoChange}
								required
							/>
							{#if proyectosDisponibles.length === 0}
								<p class="mt-2 text-sm text-gray-500">No tenés proyectos en curso disponibles.</p>
							{/if}
						{/if}
					</div>

					<!-- Resumen de Evidencias por Objetivo -->
					{#if proyectoSeleccionado && proyectoActual}
						<div class="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
							<div class="mb-4 flex items-center gap-2">
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
								<h2 class="text-lg font-semibold text-gray-900">Resumen de Evidencias</h2>
							</div>

							{#if evidenciasPorObjetivo.length === 0}
								<p class="text-sm text-gray-500">No se encontraron objetivos para este proyecto.</p>
							{:else}
								<div class="space-y-3">
					{#each evidenciasPorObjetivo as { objetivo, evidencias, evidenciasEntrada, evidenciasSalida, totalArchivos }, idx}
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
									<div class="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
										<div class="flex gap-3">
											<svg class="h-5 w-5 flex-shrink-0 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
											</svg>
											<div class="text-sm text-yellow-800">
												<p class="font-medium">Atención: Faltan evidencias</p>
												<p class="mt-1 text-yellow-700">
													Algunos objetivos no tienen evidencias cargadas. Debes cargar al menos una evidencia para cada objetivo antes de solicitar el cierre.
												</p>
											</div>
										</div>
									</div>
								{/if}
							{/if}
						</div>
					{/if}

					<!-- Lista de verificación -->
					<ChecklistVerificacion bind:checks />

					<!-- Nota informativa -->
					<div class="rounded-lg border border-blue-100 bg-blue-50 p-4">
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
								<p class="font-medium">¿Qué sucede al enviar?</p>
								<p class="mt-1 text-blue-700">
									Los colaboradores recibirán una notificación para revisar y validar las evidencias
									cargadas. Una vez aprobado, el proyecto pasará al estado "Completado".
								</p>
							</div>
						</div>
					</div>

					<!-- Botón de envío -->
					<button
						type="submit"
						disabled={!todosLosChecksCompletos || !todosLosObjetivosTienenEvidencias || !proyectoSeleccionado || enviandoSolicitud}
						class="w-full rounded-xl py-3 text-base font-medium text-white shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {todosLosChecksCompletos && todosLosObjetivosTienenEvidencias && proyectoSeleccionado
							? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
							: 'bg-gray-400'}"
					>
						{#if enviandoSolicitud}
							Enviando solicitud...
						{:else if !proyectoSeleccionado}
							Seleccioná un proyecto
						{:else if !todosLosObjetivosTienenEvidencias}
							Cargá evidencias para todos los objetivos
						{:else if !todosLosChecksCompletos}
							Completá todos los puntos ({Object.values(checks).filter((c) => c).length}/5)
						{:else}
							Enviar solicitud de cierre
						{/if}
					</button>
				</form>
			{/if}
		</div>
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
