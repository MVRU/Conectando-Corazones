<!--
TODO:
	- [ ] Conectar formulario con backend
	- [ ] Agregar validación de campos
	- [ ] Implementar envío de emails
	- [ ] Agregar reCAPTCHA para seguridad
-->

<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Select from '$lib/components/ui/elements/Select.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let formularioEnviado = false;
	let enviandoFormulario = false;
	let validationErrors: string[] = [];
	let intentoEnvio = false;
	let asunto = data.preselectedAsunto || '';

	const opcionesAsunto = [
		{ value: 'consulta-general', label: 'Consulta general' },
		{ value: 'soporte-tecnico', label: 'Soporte técnico' },
		{ value: 'colaboracion', label: 'Propuesta de colaboración' },
		{ value: 'institucion', label: 'Soy una institución' },
		{ value: 'feedback', label: 'Feedback del sistema' },
		{ value: 'denuncia', label: 'Denuncia o reporte' },
		{ value: 'otro', label: 'Otro' }
	];

	function handleAsuntoChange(event: CustomEvent) {
		asunto = event.detail.value;
	}

	async function enviarFormulario(event: Event) {
		event.preventDefault();
		intentoEnvio = true;

		const formData = new FormData(event.target as HTMLFormElement);
		const datos = {
			nombre: (formData.get('nombre') || '').toString().trim(),
			email: (formData.get('email') || '').toString().trim(),
			asunto,
			mensaje: (formData.get('mensaje') || '').toString().trim()
		};

		validationErrors = [];
		if (!datos.nombre) validationErrors.push('El nombre es requerido');
		if (!datos.email) validationErrors.push('El email es requerido');
		if (!datos.asunto) validationErrors.push('El asunto es requerido');
		if (!datos.mensaje) validationErrors.push('El mensaje es requerido');

		if (validationErrors.length > 0) return;

		enviandoFormulario = true;

		// Simulación de envío
		setTimeout(() => {
			enviandoFormulario = false;
			formularioEnviado = true;

			setTimeout(() => {
				formularioEnviado = false;
			}, 5000);
		}, 2000);
	}
</script>

<svelte:head>
	<title>Contacto - Conectando Corazones</title>
	<meta
		name="description"
		content="Contactá con el equipo de Conectando Corazones. Enviá tus consultas, sugerencias o propuestas de colaboración."
	/>
</svelte:head>

<main class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:px-12 lg:px-28">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-16 text-center">
		<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Contacto</h1>
		<p class="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
			¿Querés sumarte, tenés dudas o sugerencias? <strong>¡Escribinos!</strong>
		</p>
	</div>

	<!-- Contenedor del formulario -->
	<section class="animate-fade-in-up mx-auto w-full max-w-3xl">
		<div
			class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg ring-1 ring-gray-100 transition hover:shadow-xl sm:p-10"
		>
			<!-- Título -->
			<div class="mb-8 flex items-center justify-center gap-3">
				<svg
					class="h-6 w-6 text-blue-500"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				<h2 class="text-xl font-medium text-gray-800">Envianos un mensaje</h2>
			</div>

			<!-- Errores -->
			{#if validationErrors.length > 0}
				<div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
					<p class="mb-2 text-sm font-semibold text-red-600">Faltan datos:</p>
					<ul class="list-inside list-disc text-sm text-red-500">
						{#each validationErrors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Éxito -->
			{#if formularioEnviado}
				<div
					class="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					Tu mensaje fue enviado. ¡Gracias por contactarte!
				</div>
			{:else}
				<form on:submit={enviarFormulario} class="space-y-6">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label for="nombre" class="block text-sm font-medium text-gray-700">
								Nombre completo {#if intentoEnvio}<span class="text-red-500">*</span>{/if}
							</label>
							<input
								id="nombre"
								name="nombre"
								type="text"
								placeholder="Tu nombre completo"
								required
								class="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700">
								Email {#if intentoEnvio}<span class="text-red-500">*</span>{/if}
							</label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="tu.email@ejemplo.com"
								required
								class="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
						</div>
					</div>

					<div>
						<label for="asunto" class="block text-sm font-medium text-gray-700">
							Asunto {#if intentoEnvio}<span class="text-red-500">*</span>{/if}
						</label>
						<Select
							id="asunto"
							name="asunto"
							searchable={false}
							options={opcionesAsunto}
							bind:value={asunto}
							placeholder="Seleccioná un asunto"
							on:change={handleAsuntoChange}
						/>
					</div>

					<div>
						<label for="mensaje" class="block text-sm font-medium text-gray-700">
							Mensaje {#if intentoEnvio}<span class="text-red-500">*</span>{/if}
						</label>
						<textarea
							id="mensaje"
							name="mensaje"
							rows="5"
							required
							placeholder="Escribí tu mensaje aquí..."
							class="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						></textarea>
					</div>

					<Button
						label={enviandoFormulario ? 'Enviando...' : 'Enviar mensaje'}
						disabled={enviandoFormulario}
						customClass="w-full rounded-xl bg-blue-600 py-3 text-base font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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
