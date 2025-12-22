
<script lang="ts">
	import Select from '$lib/components/ui/elementos/Select.svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { usuario } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let proyectoSeleccionado = '';
	let enviandoSolicitud = false;
	let solicitudEnviada = false;
	let mounted = false;

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

	// Validar que todos los checks estén marcados
	$: todosLosChecksCompletos = Object.values(checks).every((check) => check === true);

	function handleProyectoChange(event: CustomEvent) {
		proyectoSeleccionado = event.detail.value;
	}

	async function enviarSolicitud(event: Event) {
		event.preventDefault();

		if (!proyectoSeleccionado) {
			alert('Por favor, seleccioná un proyecto');
			return;
		}

		if (!todosLosChecksCompletos) {
			alert('Debés completar todos los puntos de la lista de verificación');
			return;
		}

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

					<!-- Lista de verificación -->
					<div class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
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
									d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
								/>
							</svg>
							<h2 class="text-lg font-semibold text-gray-900">Lista de verificación</h2>
						</div>

						<!-- Checkbox 1 -->
						<label class="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-4 transition hover:bg-gray-50">
							<input
								type="checkbox"
								bind:checked={checks.evidenciasSuficientes}
								class="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<span class="text-sm leading-relaxed text-gray-700">
								Para cada objetivo del proyecto, se cargaron evidencias suficientes (ej.: fotos,
								comprobantes, facturas, documentos).
							</span>
						</label>

						<!-- Checkbox 2 -->
						<label class="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-4 transition hover:bg-gray-50">
							<input
								type="checkbox"
								bind:checked={checks.archivosLegibles}
								class="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<span class="text-sm leading-relaxed text-gray-700">
								Todos los archivos son legibles, correctos y pertinentes.
							</span>
						</label>

						<!-- Checkbox 3 -->
						<label class="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-4 transition hover:bg-gray-50">
							<input
								type="checkbox"
								bind:checked={checks.evidenciasRespaldadas}
								class="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<span class="text-sm leading-relaxed text-gray-700">
								Se revisó que las evidencias respaldan adecuadamente los aportes recibidos de los
								colaboradores.
							</span>
						</label>

						<!-- Checkbox 4 -->
						<label class="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-4 transition hover:bg-gray-50">
							<input
								type="checkbox"
								bind:checked={checks.noRequiereMasEvidencias}
								class="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<span class="text-sm leading-relaxed text-gray-700">
								Se confirma que el proyecto ya no requiere más carga de evidencias.
							</span>
						</label>

						<!-- Checkbox 5 -->
						<label class="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-4 transition hover:bg-gray-50">
							<input
								type="checkbox"
								bind:checked={checks.conformidadRevision}
								class="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<span class="text-sm leading-relaxed text-gray-700">
								Se da conformidad para que el sistema lo envíe a revisión de los colaboradores.
							</span>
						</label>

						<!-- Indicador de progreso -->
						<div class="mt-4 pt-4 border-t border-gray-200">
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-600">
									Completado: {Object.values(checks).filter((c) => c).length} / 5
								</span>
								<span
									class="font-medium"
									class:text-green-600={todosLosChecksCompletos}
									class:text-gray-500={!todosLosChecksCompletos}
								>
									{todosLosChecksCompletos ? '✓ Listo para enviar' : 'Pendiente'}
								</span>
							</div>
						</div>
					</div>

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
						disabled={!todosLosChecksCompletos || !proyectoSeleccionado || enviandoSolicitud}
						class="w-full rounded-xl py-3 text-base font-medium text-white shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {todosLosChecksCompletos && proyectoSeleccionado
							? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
							: 'bg-gray-400'}"
					>
						{#if enviandoSolicitud}
							Enviando solicitud...
						{:else if !proyectoSeleccionado}
							Seleccioná un proyecto
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
