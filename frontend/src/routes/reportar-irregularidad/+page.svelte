
<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';

	let formularioEnviado = false;
	let enviandoFormulario = false;
	let descripcion = '';
	let intentoEnvio = false;
	let errorDescripcion = '';

	async function enviarReporte(event: Event) {
		event.preventDefault();
		intentoEnvio = true;
		errorDescripcion = '';

		// Validación
		const descripcionTrimmed = descripcion.trim();
		if (!descripcionTrimmed) {
			errorDescripcion = 'La descripción de la irregularidad es obligatoria';
			return;
		}

		if (descripcionTrimmed.length < 20) {
			errorDescripcion = 'Por favor, proporcioná más detalles (mínimo 20 caracteres)';
			return;
		}

		enviandoFormulario = true;

		// Simulación de envío al backend
		setTimeout(() => {
			enviandoFormulario = false;
			formularioEnviado = true;

			// Limpiar formulario
			descripcion = '';
			intentoEnvio = false;

			// Ocultar mensaje de éxito después de 5 segundos
			setTimeout(() => {
				formularioEnviado = false;
			}, 5000);
		}, 2000);
	}
</script>

<svelte:head>
	<title>Reportar Irregularidad - Conectando Corazones</title>
	<meta
		name="description"
		content="Reportá situaciones inadecuadas o irregularidades en proyectos de Conectando Corazones de forma confidencial."
	/>
</svelte:head>

<main class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:px-12 lg:px-28">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-16">
		<div class="mb-8 flex items-center justify-center gap-4">
			<div class="rounded-full bg-red-100 p-3">
				<svg
					class="h-8 w-8 text-red-600"
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
			</div>
			<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
				Reportar irregularidad
			</h1>
			<div class="rounded-full bg-red-100 p-3">
				<svg
					class="h-8 w-8 text-red-600"
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
			</div>
		</div>
		<div class="mx-auto max-w-3xl">
			<p class="text-left text-lg leading-relaxed text-gray-600">
				¿Detectaste alguna situación inadecuada en este proyecto? Por ejemplo: uso indebido de
				fondos, evidencias falsas o comportamientos inapropiados. Podés reportarla aquí.
			</p>
			<p class="mt-3 text-left text-base text-gray-500">
				Tu reporte será enviado al equipo de administración, que analizará el caso de forma
				<strong>confidencial</strong>.
			</p>
		</div>
	</div>

	<!-- Contenedor del formulario -->
	<section class="animate-fade-in-up mx-auto w-full max-w-3xl">
		<div
			class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg ring-1 ring-gray-100 transition hover:shadow-xl sm:p-10"
		>
			<!-- Mensaje de éxito -->
			{#if formularioEnviado}
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
						<p class="font-semibold">Reporte enviado exitosamente</p>
						<p class="mt-1 text-sm text-green-700">
							Gracias por colaborar. El equipo de administración revisará tu reporte a la
							brevedad.
						</p>
					</div>
				</div>
			{:else}
				<form on:submit={enviarReporte} class="space-y-6">
					<!-- Información adicional -->
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
								<p class="font-medium">Contanos qué irregularidad observaste</p>
								<p class="mt-1 text-blue-700">
									Incluí detalles específicos como fechas, nombres, montos o cualquier evidencia que
									ayude a la investigación.
								</p>
							</div>
						</div>
					</div>

					<!-- Campo de descripción -->
					<div>
						<label for="descripcion" class="block text-sm font-medium text-gray-700">
							Descripción de la irregularidad
							{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
						</label>
						<textarea
							id="descripcion"
							name="descripcion"
							bind:value={descripcion}
							rows="8"
							required
							placeholder="Describí detalladamente la situación que considerás irregular. Incluí toda la información relevante que pueda ayudar en la investigación..."
							class="mt-2 w-full resize-none rounded-xl border px-4 py-3 text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 {errorDescripcion
								? 'border-red-300 focus:border-red-500 focus:ring-red-200'
								: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}"
						></textarea>
						{#if errorDescripcion}
							<p class="mt-2 flex items-center gap-1 text-sm text-red-600">
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
										d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
									/>
								</svg>
								{errorDescripcion}
							</p>
						{/if}
						<p class="mt-2 text-xs text-gray-500">
							Mínimo 20 caracteres • Caracteres: {descripcion.length}
						</p>
					</div>

					<!-- Nota de confidencialidad -->
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
						<div class="flex gap-3">
							<svg
								class="h-5 w-5 flex-shrink-0 text-gray-600"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
								/>
							</svg>
							<div class="text-sm text-gray-700">
								<p class="font-medium">Confidencialidad garantizada</p>
								<p class="mt-1">
									Tu identidad será protegida. Los reportes son revisados exclusivamente por el equipo
									de administración.
								</p>
							</div>
						</div>
					</div>

					<!-- Botón de envío -->
					<Button
						type="submit"
						label={enviandoFormulario ? 'Enviando reporte...' : 'Reportar irregularidad'}
						disabled={enviandoFormulario}
						customClass="w-full rounded-xl bg-red-600 py-3 text-base font-medium text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
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
