<script lang="ts">
	import { Mail, AlertCircle } from 'lucide-svelte';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Loader from '$lib/components/ui/feedback/Loader.svelte';

	let {
		pasoActual = 4,
		pasosTotales = 5,
		emailDestino = '',
		oncontinue,
		onback
	} = $props<{
		pasoActual?: number;
		pasosTotales?: number;
		emailDestino?: string;
		oncontinue?: () => void;
		onback?: () => void;
	}>();

	let etapa = $state<'sending' | 'waiting' | 'verified' | 'error'>('sending');
	let codigo = $state('');
	let codigoError = $state('');

	function enviarEmail() {
		return new Promise((resolve) => {
			setTimeout(() => resolve(true), 1500);
		});
	}

	$effect(() => {
		enviarEmail()
			.then(() => {
				etapa = 'waiting';
			})
			.catch(() => {
				etapa = 'error';
			});
	});

	function verificarCodigoManual() {
		if (codigo === '123456') {
			oncontinue?.();
		} else {
			codigoError = 'El código ingresado no es válido';
		}
	}
</script>

<!-- Etapa: Enviando -->
{#if etapa === 'sending'}
	<div class="mb-20">
		<Stepper {pasoActual} {pasosTotales} />
	</div>
	<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
		<Loader loading={true} size={80} message="Enviando correo de verificación..." />
		<p class="mt-6 max-w-md text-lg text-gray-700">
			Estamos enviando un código de verificación a {emailDestino || 'tu correo electrónico'}.
		</p>
	</div>

	<!-- Etapa: Esperando código -->
{:else if etapa === 'waiting'}
	<div class="mb-20">
		<Stepper {pasoActual} {pasosTotales} />
	</div>
	<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
		<div class="rounded-full bg-blue-100 p-5 shadow-md">
			<Mail class="h-16 w-16 text-blue-500" />
		</div>
		<h2 class="mt-6 text-3xl font-bold text-gray-800">Revisá tu correo</h2>
		<p class="mt-4 max-w-md text-base text-gray-600">
			Te enviamos un código de verificación a {emailDestino || 'tu correo electrónico'}. Ingresalo a
			continuación para continuar.
		</p>

		<input
			class="mt-8 w-full max-w-xs rounded-lg border px-4 py-3 text-center text-2xl tracking-widest text-gray-800 focus:border-blue-500 focus:outline-none"
			bind:value={codigo}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				codigo = target.value;
			}}
			inputmode="numeric"
			maxlength="6"
			placeholder="••••••"
		/>

		{#if codigoError}
			<p class="mt-4 text-sm text-red-500">{codigoError}</p>
		{/if}

		<Button
			customClass="mt-6 w-full max-w-xs"
			label="Verificar código"
			onclick={verificarCodigoManual}
		/>
	</div>

	<!-- Etapa: Error -->
{:else if etapa === 'error'}
	<div class="mb-20">
		<Stepper {pasoActual} {pasosTotales} />
	</div>
	<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
		<div class="rounded-full bg-red-100 p-6 shadow-xl">
			<AlertCircle class="h-14 w-14 text-red-600" />
		</div>
		<h2 class="mt-6 text-3xl font-extrabold text-gray-800">No pudimos enviar el email</h2>
		<p class="mt-4 max-w-sm text-base text-gray-600">
			Hubo un problema al enviar el correo. Podés reintentarlo o volver atrás.
		</p>
		<div class="mt-8 flex flex-col gap-4 sm:flex-row">
			<Button label="Reintentar" onclick={() => (etapa = 'sending')} />
			<Button label="Volver" variant="secondary" onclick={() => onback?.()} />
		</div>
	</div>
{/if}
