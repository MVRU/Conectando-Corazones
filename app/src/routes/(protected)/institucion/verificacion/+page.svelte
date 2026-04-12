<script lang="ts">
	import ValidacionInstitucion from '$lib/validation/components/ValidacionInstitucion.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	const verificacionActual = $derived(data.verificacionActual);
	const motivoRechazo = $derived(data.motivoRechazo);
	const yaVerificada = $derived(verificacionActual?.estado === 'aprobada');

	onMount(() => {
		setBreadcrumbs([
			{ label: 'Institución', href: '/institucion/mi-panel' },
			{ label: 'Verificación' }
		]);
	});

	async function manejarSubida(detail: { files: File[] }) {
		try {
			const formData = new FormData();
			detail.files.forEach((f) => formData.append('files', f));
			const res = await fetch('/api/registro/verificacion', {
				method: 'POST',
				body: formData
			});
			const body = await res.json();
			if (!res.ok) {
				throw new Error(body.error || 'No se pudieron subir los archivos');
			}
			toastStore.show({
				variant: 'success',
				title: 'Documentación recibida',
				message: 'Tu verificación quedó en proceso de revisión.'
			});
			goto('/institucion/mi-panel');
		} catch (e) {
			console.error(e);
			toastStore.show({
				variant: 'error',
				title: 'Error al subir',
				message: e instanceof Error ? e.message : 'Intentá de nuevo en unos minutos.'
			});
		}
	}
</script>

<svelte:head>
	<title>Verificación de identidad - Conectando Corazones</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Verificación de la institución</h1>
		<p class="mt-2 text-slate-600">
			Completá o reenviá la documentación que respalda a tu organización. Nuestro equipo la revisará
			de forma confidencial.
		</p>
	</div>

	{#if verificacionActual?.estado === 'rechazada'}
		<div class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
			<h2 class="text-sm font-semibold">Tu verificación fue rechazada</h2>
			<p class="mt-1 text-sm">
				Podés corregir la documentación y volver a presentarla desde este formulario.
			</p>
			{#if motivoRechazo}
				<p class="mt-2 rounded-xl border border-amber-300/70 bg-white/70 px-3 py-2 text-sm">
					<strong>Motivo informado por administración:</strong> {motivoRechazo}
				</p>
			{/if}
		</div>
	{:else if verificacionActual?.estado === 'pendiente'}
		<div class="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900">
			<h2 class="text-sm font-semibold">Tu verificación está pendiente de revisión</h2>
			<p class="mt-1 text-sm">
				Si querés agregar o reemplazar documentación, podés hacerlo desde esta sección.
			</p>
		</div>
	{/if}

	{#if yaVerificada}
		<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
			<h2 class="text-sm font-semibold">Tu cuenta ya está verificada</h2>
			<p class="mt-1 text-sm">No necesitás enviar más documentación por ahora.</p>
			<div class="mt-4">
				<button
					type="button"
					class="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
					onclick={() => goto('/institucion/mi-panel')}
				>
					Volver al panel
				</button>
			</div>
		</div>
	{:else}
		<ValidacionInstitucion
			permitirOmitir={false}
			onsubmit={manejarSubida}
			oncancel={() => goto('/institucion/mi-panel')}
		/>
	{/if}
</div>
