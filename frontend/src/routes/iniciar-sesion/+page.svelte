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

	import { authActions, authError, isLoading, usuario } from '$lib/stores/auth';

	import { goto } from '$app/navigation';

	import { validarCorreo, validarUsername } from '$lib/utils/validaciones';



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

			// TODO: usar respuesta real del backend para determinar el rol y manejar estados de error más finos.

			const user = await authActions.login(identificador, password, recordarme);



			// Redirigir según el rol del usuario

			if (user?.rol === 'administrador') {

				goto('/admin');

			} else {

				goto('/mi-panel');

			}

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

							placeholder="alexis_sklate"

							customClass="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"

						/>

						<p class="mt-1 text-xs text-gray-500">

							Prueba con: <code class="rounded bg-gray-100 px-1">alexis_sklate</code>,

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

								class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"

								on:click={() => (mostrarPassword = !mostrarPassword)}

							>

								{#if mostrarPassword}

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

						label="Iniciar Sesión"

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

