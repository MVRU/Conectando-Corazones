<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/feedback/Loader.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let estado = 'cargando'; // posibles valores: 'cargando', 'exito', 'error'

	onMount(async () => {
		estado = 'cargando';
		try {
			const respuesta = await validarConArca();
			if (respuesta.valido) {
				estado = 'exito';
			} else {
				estado = 'error';
			}
		} catch (err) {
			estado = 'error';
		}
	});

	type RespuestaArca = { valido: boolean };

	async function validarConArca(): Promise<RespuestaArca> {
		return new Promise((resolve) => {
			setTimeout(() => resolve({ valido: true }), 3000); // Simulación
		});
	}
</script>

<!-- Fondo principal -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

<!-- Reflejo en la parte inferior -->
<div
	class="absolute bottom-0 left-0 right-0 top-[80%] -z-10 bg-gradient-to-t from-blue-50 via-white to-transparent"
	style="background-size: 100% 400px; background-repeat: repeat-y;"
></div>

<!-- Estado: Cargando -->
{#if estado === 'cargando'}
	<div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
		<div></div>
		<Loader loading={true} size={80} message="" />
		<p class="animate-fade-in mt-8 max-w-md text-lg text-gray-700 delay-300">
			Estamos conectándonos con ARCA para validar tus datos.
		</p>
	</div>
{/if}

<!-- Estado: Éxito -->
{#if estado === 'exito'}
	<div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
		<div
			class="transform rounded-full bg-green-100 p-4 shadow-xl transition-transform duration-300 hover:scale-105"
		>
			<svg class="h-20 w-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</div>
		<h2 class="mt-8 text-4xl font-extrabold text-gray-800">¡Identidad verificada!</h2>
		<p class="max-w-xs text-base text-gray-600">
			Tu identidad ha sido validada correctamente. Podés continuar ahora.
		</p>
		<div class="mt-12">
			<Button label="Continuar" variant="primary" href="/address" />
		</div>
	</div>
{/if}

<!-- Estado: Error -->
{#if estado === 'error'}
	<div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
		<div class="rounded-full bg-red-100 p-8 shadow-lg">
			<svg class="h-20 w-20 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
			</svg>
		</div>
		<h2 class="mt-8 text-4xl font-extrabold text-gray-800">Hubo un problema</h2>
		<p class="mt-4 max-w-xs text-base text-gray-600">
			No pudimos verificar tu identidad. Por favor, volvé a intentarlo más tarde o contactanos si
			persiste el problema.
		</p>
		<div class="mt-8 flex gap-4">
			<Button label="Volver al formulario" href="/signin" />
			<Button label="Ayuda" variant="secondary" href="/contact" />
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
	}
</style>
