<!--
TODO:
	- [ ] Conectar con backend de autenticación
	- [ ] Implementar validación de campos
	- [ ] Agregar manejo de errores
	- [ ] Implementar "Recordar sesión"
	- [ ] Agregar autenticación con redes sociales
-->

<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { authActions, authError, isLoading } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { validarCorreo, validarUsername } from '$lib/utils/validaciones';
	import { LockClosed, Eye, EyeSlash } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	let identificador = '';
	let password = '';
	let recordarme = false;
	let mostrarPassword = false;
	let erroresValidacion: string[] = [];

	// Función para manejar el login
	async function handleLogin(event: Event) {
		event.preventDefault();

		// Validar campos
		erroresValidacion = [];
		if (!identificador.trim()) erroresValidacion.push('El usuario o correo es requerido');
		if (!password.trim()) erroresValidacion.push('La contraseña es requerida');
		if (identificador && !validarCorreo(identificador) && !validarUsername(identificador)) {
			erroresValidacion.push('Ingresá un correo o usuario válido');
		}

		if (erroresValidacion.length > 0) {
			return;
		}

		try {
			await authActions.login(identificador, password, recordarme);

			toastStore.show({
				variant: 'success',
				title: '¡Hola de nuevo!',
				message: 'Iniciaste sesión correctamente.'
			});

			// Redirigir según el rol del usuario
			// TODO: Implementar redirección basada en el rol
			goto('/');
		} catch (error) {
			// El error ya se maneja en el store, pero mostramos toast también
			console.error('Error en login:', error);
			toastStore.show({
				variant: 'error',
				title: 'Error de acceso',
				message:
					error instanceof Error ? error.message : 'Verificá tus credenciales e intentá nuevamente.'
			});
		}
	}
</script>

<svelte:head>
	<title>Iniciar sesión - Conectando Corazones</title>
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
			<h1 class="mb-4 text-4xl font-bold text-[rgb(var(--base-color))]">Iniciar sesión</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				Accedé a tu cuenta para gestionar tus proyectos y contribuir a causas sociales
			</p>
		</div>

		<!-- Formulario de login -->
		<div class="mx-auto max-w-md">
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				<h2
					class="mb-6 flex items-center gap-2 text-2xl font-semibold text-[rgb(var(--base-color))]"
				>
					<Icon src={LockClosed} class="h-6 w-6" /> Acceder a tu cuenta
				</h2>

				{#if erroresValidacion.length > 0}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-100 p-4">
						<p class="mb-2 font-medium text-red-700">Por favor corrige los siguientes errores:</p>
						<ul class="list-inside list-disc text-sm text-red-600">
							{#each erroresValidacion as error (error)}
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
						<Input
							id="identificador"
							type="text"
							bind:value={identificador}
							required
							placeholder="admin_conectando"
							customClass="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
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
							<Input
								id="password"
								bind:value={password}
								type={mostrarPassword ? 'text' : 'password'}
								required
								placeholder="123456"
								customClass="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
							/>
							<button
								type="button"
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								on:click={() => (mostrarPassword = !mostrarPassword)}
							>
								{#if mostrarPassword}
									<Icon src={EyeSlash} class="h-5 w-5" />
								{:else}
									<Icon src={Eye} class="h-5 w-5" />
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
								bind:checked={recordarme}
								type="checkbox"
								class="h-4 w-4 rounded border-gray-300 text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
							/>
							<span class="ml-2 text-sm text-gray-600">Recordar sesión</span>
						</label>
						<a
							href="/recuperar-contrasena"
							class="text-sm text-[rgb(var(--color-primary))] hover:underline"
						>
							¿Olvidaste tu contraseña?
						</a>
					</div>

					<Button
						type="submit"
						label="Iniciar sesión"
						loading={$isLoading}
						loadingLabel="Iniciando sesión..."
						customClass="w-full"
					/>
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
				<h2 class="mb-4 text-2xl font-semibold text-[rgb(var(--base-color))]">
					¿Por qué registrarse?
				</h2>

				<p class="mx-auto mb-6 max-w-2xl text-gray-600">
					Al crear una cuenta vas a poder seguir el avance de los proyectos en los que participás,
					recibir novedades importantes y acceder a funcionalidades exclusivas para usuarios
					registrados.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<Button label="Ver proyectos abiertos" href="/proyectos" disabled={false} />
					<Button label="Registrarse" href="/registrarse" variant="secondary" disabled={false} />
				</div>
			</div>
		</div>
	</div>
</main>
