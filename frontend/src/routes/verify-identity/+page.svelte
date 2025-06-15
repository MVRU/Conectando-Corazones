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

<!-- Fondo decorativo global -->
<div
	class="absolute inset-0 -z-10 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50"
></div>

{#if estado === 'cargando'}
	<div
		class="animate-fade-in flex min-h-screen flex-col items-center justify-center px-4 text-center"
	>
		<div class=" p-8">
			<Loader loading={true} message="" />
			<p class="mt-30 max-w-sm text-gray-700">
				Estamos conectándonos con ARCA para validar tus datos.
			</p>
		</div>
	</div>
{/if}

{#if estado === 'exito'}
	<div
		class="animate-slide-up flex min-h-screen flex-col items-center justify-center px-4 text-center"
	>
		<svg
			class="mx-auto h-20 w-20 animate-pulse text-green-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
		</svg>
		<h2 class="mt-6 text-3xl font-bold text-green-700">¡Identidad verificada!</h2>
		<p class="mt-3 max-w-xs text-gray-600">Tu identidad ha sido validada correctamente.</p>
		<div class="mt-8">
			<Button label="Continuar" href="address" />
		</div>
	</div>
{/if}

{#if estado === 'error'}
	<div
		class="animate-slide-up flex min-h-screen flex-col items-center justify-center px-4 text-center"
	>
		<svg
			class="mx-auto h-20 w-20 text-red-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
		</svg>
		<h2 class="mt-6 text-3xl font-bold text-red-700">Hubo un problema</h2>
		<p class="mt-3 max-w-xs text-gray-600">
			No pudimos verificar tu identidad. Por favor vuelve a intentarlo más tarde.
		</p>
		<div class="mt-6">
			<Button label="Volver al formulario" href="signin" />
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

	.animate-slide-up {
		animation: slide-up 0.6s ease-out forwards;
	}
</style>
