<!--
TODO:
	- [ ] Conectar con backend de autenticación
	- [ ] Implementar validación robusta de email
	- [ ] Agregar rate limiting en el frontend
	- [ ] Implementar timer de reenvío
-->

<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { validarCorreo } from '$lib/utils/validaciones';

	let email = '';
	let cargando = false;
	let validacionErrores: string[] = [];
	let mensajeExito = '';
	let mensajeError = '';
	let emailEnviado = false;

	async function procesarEnvio(event: Event) {
		event.preventDefault();

		// Limpiar estados previos
		validacionErrores = [];
		mensajeError = '';
		mensajeExito = '';

		if (!email.trim()) {
			validacionErrores.push('El email es requerido');
			return;
		}

		if (!validarCorreo(email)) {
			validacionErrores.push('Por favor ingresa un email válido');
			return;
		}

		cargando = true;

		try {
			// TODO: Implementar llamada al backend
			// Simulamos una llamada a la API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simulamos éxito (en la implementación real, aquí iría la llamada al backend)
			emailEnviado = true;
			mensajeExito = `Te enviamos un email a ${email} con las instrucciones para recuperar tu contraseña.`;
		} catch (error) {
			mensajeError = 'Hubo un problema al enviar el email. Por favor intenta nuevamente.';
			console.error('Error al enviar email de recuperación:', error);
		} finally {
			cargando = false;
		}
	}

	async function reenviarEmail() {
		await procesarEnvio(new Event('submit'));
	}
</script>

<svelte:head>
	<title>Recuperar Contraseña - Conectando Corazones</title>
	<meta
		name="description"
		content="Recupera tu contraseña de Conectando Corazones. Te ayudamos a volver a acceder a tu cuenta."
	/>
</svelte:head>

<main class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-8">
		<!-- Header de la página -->
		<div class="mb-12 text-center">
			<div class="mx-auto mb-6 w-20">
				<Image
					src="/logo-1.png"
					alt="Logo de Conectando Corazones"
					width="80px"
					animate="heartbeat"
				/>
			</div>
			<h1 class="mb-4 text-4xl font-bold text-[rgb(var(--base-color))]">Recuperar Contraseña</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				Ingresa tu email y te enviaremos las instrucciones para crear una nueva contraseña
			</p>
		</div>

		<!-- Formulario o mensaje de éxito -->
		<div class="mx-auto max-w-md">
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				{#if !emailEnviado}
					<!-- Formulario para ingresar email -->
					<h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--base-color))]">
						🔑 Restablecer contraseña
					</h2>

					{#if validacionErrores.length > 0}
						<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4">
							<p class="mb-2 font-medium text-red-700">Por favor corrige los siguientes errores:</p>
							<ul class="list-inside list-disc text-sm text-red-600">
								{#each validacionErrores as error (error)}
									<li>{error}</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if mensajeError}
						<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4">
							<p class="font-medium text-red-700">{mensajeError}</p>
						</div>
					{/if}

					<form on:submit={procesarEnvio} class="space-y-6">
						<div>
							<label
								for="email"
								class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
							>
								Email *
							</label>
							<Input
								id="email"
								type="email"
								bind:value={email}
								required
								placeholder="tu.email@ejemplo.com"
								disabled={cargando}
								customClass="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
							/>
							<p class="mt-2 text-sm text-gray-500">
								Te enviaremos un enlace para que puedas crear una nueva contraseña
							</p>
						</div>

						<Button
							type="submit"
							label="Enviar instrucciones"
							loading={cargando}
							loadingLabel="Enviando..."
							customClass="w-full"
						/>
					</form>
				{:else}
					<!-- Mensaje de éxito -->
					<div class="text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
						>
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>

						<h2 class="mb-4 text-2xl font-semibold text-[rgb(var(--base-color))]">
							¡Email enviado!
						</h2>

						{#if mensajeExito}
							<p class="mb-6 text-gray-600">{mensajeExito}</p>
						{/if}

						<div class="space-y-4">
							<p class="text-sm text-gray-500">
								Si no recibís el email en los próximos minutos, revisá tu carpeta de spam o correo
								no deseado.
							</p>

							<button
								type="button"
								on:click={reenviarEmail}
								disabled={cargando}
								class="text-sm text-[rgb(var(--color-primary))] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if cargando}
									Reenviando...
								{:else}
									Reenviar email
								{/if}
							</button>
						</div>
					</div>
				{/if}

				<!-- Separador -->
				<div class="my-6 flex items-center">
					<div class="flex-1 border-t border-gray-300"></div>
					<span class="px-4 text-sm text-gray-500">o</span>
					<div class="flex-1 border-t border-gray-300"></div>
				</div>

				<!-- Enlaces de navegación -->
				<div class="space-y-4 text-center">
					<p class="text-gray-600">
						¿Recordaste tu contraseña?
						<a
							href="/iniciar-sesion"
							class="font-medium text-[rgb(var(--color-primary))] hover:underline"
						>
							Volver al inicio de sesión
						</a>
					</p>

					<p class="text-gray-600">
						¿No tenés una cuenta?
						<a
							href="/registrarse"
							class="font-medium text-[rgb(var(--color-primary))] hover:underline"
						>
							Registrate aquí
						</a>
					</p>
				</div>
			</div>
		</div>

		<!-- Información adicional -->
		<div class="mt-12 text-center">
			<div class="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
				<h2 class="mb-4 text-2xl font-semibold text-[rgb(var(--base-color))]">¿Necesitás ayuda?</h2>
				<p class="mx-auto mb-6 max-w-2xl text-gray-600">
					Si seguís teniendo problemas para acceder a tu cuenta, no dudes en contactarnos. Nuestro
					equipo está aquí para ayudarte.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<Button label="Contactar soporte" href="/contacto" disabled={false} />
					<Button label="Preguntas frecuentes" href="/faq" variant="secondary" disabled={false} />
				</div>
			</div>
		</div>
	</div>
</main>
