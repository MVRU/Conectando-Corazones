<script lang="ts">
	import Loader from '$lib/components/feedback/Loader.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let currentStep = 3;
	export let totalSteps = 5;

	let stage: 'verifying' | 'error' = 'verifying';

	function validarConArca() {
		return new Promise((resolve) => {
			setTimeout(() => {
				const success = true; // Siempre válido para pruebas
				resolve({ valido: success });
			}, 2000);
		});
	}

	onMount(() => {
		validarConArca()
			.then((res) => {
				if ((res as { valido: boolean }).valido) {
					dispatch('success');
				} else {
					stage = 'error';
				}
			})
			.catch(() => {
				stage = 'error';
			});
	});
</script>

{#if stage === 'verifying'}
	<div class="mb-20">
		<Stepper current={currentStep} total={totalSteps} />
	</div>
	<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
		<Loader loading={true} size={80} message="" />
		<p class="mt-6 max-w-md text-lg text-gray-700">
			Estamos conectándonos con ARCA para validar tus datos.
		</p>
	</div>
{:else if stage === 'error'}
	<div class="mb-20">
		<Stepper current={currentStep} total={totalSteps} />
	</div>
	<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
		<div class="rounded-full bg-red-100 p-6 shadow-xl">
			<svg class="h-14 w-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="10" stroke-width="2" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
			</svg>
		</div>
		<h2 class="mt-6 text-3xl font-extrabold text-gray-800">No pudimos verificar tu identidad</h2>
		<p class="mt-4 max-w-sm text-base text-gray-600">
			La validación con ARCA no fue exitosa. Podés volver al formulario para revisar los datos o
			intentarlo nuevamente.
		</p>
		<div class="mt-8 flex flex-col gap-4 sm:flex-row">
			<Button label="Reintentar validación" on:click={() => location.reload()} />
			<Button label="Volver al formulario" variant="secondary" on:click={() => dispatch('back')} />
		</div>
	</div>
{/if}
