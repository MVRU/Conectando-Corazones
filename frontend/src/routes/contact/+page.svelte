<!--
* Página: Contacto
	-*- Descripción: Formulario para consultas y contacto
	-*- Funcionalidad: Formulario de contacto

TODO:
	- [ ] Conectar formulario con backend
	- [ ] Agregar validación de campos
	- [ ] Implementar envío de emails
	- [ ] Agregar reCAPTCHA para seguridad
-->

<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Select from '$lib/components/ui/elements/Select.svelte';

	let formularioEnviado = false;
	let enviandoFormulario = false;
	let validationErrors: string[] = [];
	let asunto = '';
	let intentoEnvio = false;

	// Opciones para el select de asunto
	const opcionesAsunto = [
		{ value: 'consulta-general', label: 'Consulta general' },
		{ value: 'soporte-tecnico', label: 'Soporte técnico' },
		{ value: 'colaboracion', label: 'Propuesta de colaboración' },
		{ value: 'institucion', label: 'Soy una institución' },
		{ value: 'feedback', label: 'Feedback del sistema' },
		{ value: 'otro', label: 'Otro' }
	];

	// Función para manejar el cambio del select
	function handleAsuntoChange(event: CustomEvent) {
		asunto = event.detail.value;
	}

	// Función para enviar formulario
	async function enviarFormulario(event: Event) {
		event.preventDefault();
		intentoEnvio = true;

		const formData = new FormData(event.target as HTMLFormElement);
		const datos = {
			nombre: (formData.get('nombre') || '').toString().trim(),
			email: (formData.get('email') || '').toString().trim(),
			asunto: asunto,
			mensaje: (formData.get('mensaje') || '').toString().trim()
		};

		// Validar campos
		validationErrors = [];
		if (!datos.nombre) validationErrors.push('El nombre es requerido');
		if (!datos.email) validationErrors.push('El email es requerido');
		if (!datos.asunto) validationErrors.push('El asunto es requerido');
		if (!datos.mensaje) validationErrors.push('El mensaje es requerido');

		if (validationErrors.length > 0) {
			return;
		}

		enviandoFormulario = true;

		// TODO: Enviar datos al backend
		console.log('Datos del formulario:', datos);
		setTimeout(() => {
			enviandoFormulario = false;
			formularioEnviado = true;

			// Resetear después de 5 segundos
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
		content="Contacta con el equipo de Conectando Corazones. Envía tus consultas, sugerencias o propuestas de colaboración."
	/>
</svelte:head>

<main class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-8">
		<!-- Header de la página -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-[rgb(var(--base-color))]">Contacto</h1>
			<p class="mx-auto max-w-3xl text-lg text-gray-600">
				Ponte en contacto con nosotros para consultas, sugerencias o colaboraciones.
			</p>
		</div>

		<!-- Formulario de contacto -->
		<div class="mx-auto max-w-2xl">
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--base-color))]">
					📩 Envianos un Mensaje
				</h2>

				{#if validationErrors.length > 0}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4">
						<p class="mb-2 font-medium text-red-700">Por favor corrige los siguientes errores:</p>
						<ul class="list-inside list-disc text-sm text-red-600">
							{#each validationErrors as error}
								<li>{error}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if formularioEnviado}
					<div class="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
						<p class="font-medium text-green-700">
							✅ ¡Mensaje enviado correctamente! Te responderemos a la brevedad.
						</p>
					</div>
				{:else}
					<form on:submit={enviarFormulario} class="space-y-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label
									for="nombre"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Nombre completo {#if intentoEnvio}*{/if}
								</label>
								<input
									id="nombre"
									name="nombre"
									type="text"
									required
									class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="Tu nombre completo"
								/>
							</div>

							<div>
								<label
									for="email"
									class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
								>
									Email {#if intentoEnvio}*{/if}
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
									placeholder="tu.email@ejemplo.com"
								/>
							</div>
						</div>

						<div>
							<Select
								label="Asunto"
								options={opcionesAsunto}
								bind:value={asunto}
								placeholder="Seleccionar asunto"
								required={intentoEnvio}
								id="asunto"
								name="asunto"
								on:change={handleAsuntoChange}
							/>
						</div>

						<div>
							<label
								for="mensaje"
								class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
							>
								Mensaje {#if intentoEnvio}*{/if}
							</label>
							<textarea
								id="mensaje"
								name="mensaje"
								required
								rows="6"
								class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
								placeholder="Escribí tu mensaje aquí..."
							></textarea>
						</div>

						<button
							type="submit"
							disabled={enviandoFormulario}
							class="w-full rounded-lg bg-[rgb(var(--color-primary))] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if enviandoFormulario}
								Enviando mensaje...
							{:else}
								Enviar mensaje
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Call to action -->
		<div class="mt-12 text-center">
			<div class="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
				<h2 class="mb-4 text-2xl font-semibold text-[rgb(var(--base-color))]">
					¿Tenés una idea o sugerencia?
				</h2>
				<p class="mx-auto mb-6 max-w-2xl text-gray-600">
					Conectando Corazones está en constante evolución. Tu feedback es fundamental para mejorar
					la plataforma y crear un impacto positivo más grande en nuestra comunidad.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<Button label="Ver proyectos abiertos" href="/projects" disabled={false} />
				</div>
			</div>
		</div>
	</div>
</main>
