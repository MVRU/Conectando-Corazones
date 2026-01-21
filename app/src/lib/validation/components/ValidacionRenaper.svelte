<script lang="ts">
	import Loader from '\$lib/components/ui/feedback/Loader.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let pasoActual = 3;
	export let pasosTotales = 5;

	let etapa: 'verificando' | 'error' = 'verificando';

	function validarConRenaper() {
		return new Promise((resolve) => {
			setTimeout(() => {
				const success = true; // Siempre válido para pruebas
				resolve({ valido: success });
			}, 2000);
		});
	}

	onMount(() => {
		validarConRenaper()
			.then((res) => {
				if ((res as { valido: boolean }).valido) {
					dispatch('success');
				} else {
					etapa = 'error';
				}
			})
			.catch(() => {
				etapa = 'error';
			});
	});
</script>

<!-- Contenedor principal -->
<div class="flex min-h-screen flex-col bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<!-- Stepper -->
	<div class="mb-20">
		<Stepper {pasoActual} {pasosTotales} />
	</div>

	{#if etapa === 'verificando'}
		<div class="flex flex-1 flex-col items-center justify-center text-center">
			<div class=" rounded-2xl bg-white p-8 transition-all duration-300 ease-in-out">
				<Loader loading={true} size={80} message="" />
				<h2 class="mt-6 text-2xl font-semibold text-gray-950">Verificando tu identidad</h2>
				<p class="mt-3 max-w-md text-sm text-gray-800">
					Conectando con el sistema de RENAPER para validar tus datos personales.
				</p>
			</div>
			<p class="mt-10 max-w-md text-center text-xs text-gray-700">
				Este proceso puede tardar unos segundos. Por favor no cierres la ventana.
			</p>
		</div>
	{:else if etapa === 'error'}
		<div class="flex flex-1 flex-col items-center justify-center gap-8 text-center">
			<div
				class="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
			>
				<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
					<svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="10" stroke-width="2" />
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01"
						/>
					</svg>
				</div>

				<h2 class="mt-6 text-2xl font-bold text-gray-800">No pudimos verificar tu identidad</h2>
				<p class="mt-3 max-w-md text-sm text-gray-500">
					La validación con RENAPER no fue exitosa. Podés revisar los datos o intentarlo nuevamente.
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						customClass="w-full sm:w-auto"
						label="Reintentar validación"
						on:click={() => location.reload()}
					/>
					<Button
						customClass="w-full sm:w-auto"
						label="Volver al formulario"
						variant="secondary"
						on:click={() => dispatch('back')}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
