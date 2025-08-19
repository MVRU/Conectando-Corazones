<!--
TODO:
	- [ ] Conectar con backend de autenticación
	- [ ] Implementar validación de campos
	- [ ] Agregar manejo de errores
	- [ ] Implementar "Recordar sesión"
	- [ ] Agregar autenticación con redes sociales
-->

<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Image from '$lib/components/ui/elements/Image.svelte';
	import { authActions, authError, isLoading } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { validarCorreo, validarUsername } from '$lib/utils/validaciones';

	let identificador = '';
	let password = '';
	let rememberMe = false;
	let showPassword = false;
	let validationErrors: string[] = [];

	// Función para manejar el login
	async function handleLogin(event: Event) {
		event.preventDefault();

		// Validar campos
		validationErrors = [];
		if (!identificador.trim()) validationErrors.push('El usuario o correo es requerido');
		if (!password.trim()) validationErrors.push('La contraseña es requerida');
		if (identificador && !validarCorreo(identificador) && !validarUsername(identificador)) {
			validationErrors.push('Ingresá un correo o usuario válido');
		}

		if (validationErrors.length > 0) {
			return;
		}

		try {
			await authActions.login(identificador, password, rememberMe);

			// Redirigir según el rol del usuario
			// TODO: Implementar redirección basada en el rol
			goto('/');
		} catch (error) {
			// El error ya se maneja en el store
			console.error('Error en login:', error);
		}
	}
</script>

<svelte:head>
	<title>Iniciar Sesión - Conectando Corazones</title>
	<meta
		name="description"
		content="Inicia sesión en Conectando Corazones para acceder a tu cuenta y gestionar tus proyectos."
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
			<h1 class="mb-4 text-4xl font-bold text-[rgb(var(--base-color))]">Iniciar Sesión</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				Accedé a tu cuenta para gestionar tus proyectos y contribuir a causas sociales
			</p>
		</div>

		<!-- Formulario de login -->
		<div class="mx-auto max-w-md">
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold text-[rgb(var(--base-color))]">
					🔐 Acceder a tu cuenta
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

				{#if $authError}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4">
						<p class="font-medium text-red-700">{$authError}</p>
					</div>
				{/if}

				<form on:submit={handleLogin} class="space-y-6">
					<div>
						<label
							for="identificador"
							class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Usuario o correo *
						</label>
						<input
							id="identificador"
							bind:value={identificador}
							type="text"
							required
							class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
							placeholder="admin_conectando"
						/>
						<p class="mt-1 text-xs text-gray-500">
							Prueba con: <code class="rounded bg-gray-100 px-1">admin_conectando</code>,
							<code class="rounded bg-gray-100 px-1">escuela_esperanza</code>,
							<code class="rounded bg-gray-100 px-1">maria_g</code>
						</p>
					</div>

					<div>
						<label
							for="password"
							class="mb-2 block text-sm font-medium text-[rgb(var(--base-color))]"
						>
							Contraseña *
						</label>
						<div class="relative">
							<input
								id="password"
								bind:value={password}
								type={showPassword ? 'text' : 'password'}
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
								placeholder="123456"
							/>
							<button
								type="button"
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								on:click={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
										/>
									</svg>
								{:else}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								{/if}
							</button>
						</div>
						<p class="mt-1 text-xs text-gray-500">
							Todos los usuarios de prueba usan la contraseña: <code
								class="rounded bg-gray-100 px-1">123456</code
							>
						</p>
					</div>

					<div class="flex items-center justify-between">
						<label class="flex items-center">
							<input
								bind:checked={rememberMe}
								type="checkbox"
								class="h-4 w-4 rounded border-gray-300 text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
							/>
							<span class="ml-2 text-sm text-gray-600">Recordar sesión</span>
						</label>
						<a
							href="/forgot-password"
							class="text-sm text-[rgb(var(--color-primary))] hover:underline"
						>
							¿Olvidaste tu contraseña?
						</a>
					</div>

					<button
						type="submit"
						disabled={$isLoading}
						class="w-full rounded-lg bg-[rgb(var(--color-primary))] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if $isLoading}
							<div class="flex items-center justify-center">
								<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Iniciando sesión...
							</div>
						{:else}
							Iniciar Sesión
						{/if}
					</button>
				</form>

				<!-- Separador -->
				<div class="my-6 flex items-center">
					<div class="flex-1 border-t border-gray-300"></div>
					<span class="px-4 text-sm text-gray-500">o</span>
					<div class="flex-1 border-t border-gray-300"></div>
				</div>

				<!-- Enlace al registro -->
				<div class="text-center">
					<p class="text-gray-600">
						¿No tenés una cuenta?
						<a href="/signin" class="font-medium text-[rgb(var(--color-primary))] hover:underline">
							Registrate aquí
						</a>
					</p>
				</div>
			</div>
		</div>

		<!-- Información adicional -->
		<div class="mt-12 text-center">
			<div class="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
				<h2 class="mb-4 text-2xl font-semibold text-[rgb(var(--base-color))]">
					¿Por qué registrarse?
				</h2>

				<!-- FIX: no es una comunidad de donantes-->

				<p class="mx-auto mb-6 max-w-2xl text-gray-600">
					Al crear una cuenta podés hacer seguimiento de tus donaciones, recibir actualizaciones de
					los proyectos que apoyás y formar parte de nuestra comunidad de donantes comprometidos.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<Button label="Ver proyectos abiertos" href="/projects" disabled={false} />
					<Button label="Registrarse" href="/signin" variant="secondary" disabled={false} />
				</div>
			</div>
		</div>
	</div>
</main>
