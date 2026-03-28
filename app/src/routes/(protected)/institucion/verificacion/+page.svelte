<script lang="ts">
	import ValidacionInstitucion from '$lib/validation/components/ValidacionInstitucion.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import { onMount } from 'svelte';

	onMount(() => {
		setBreadcrumbs([
			BREADCRUMB_ROUTES.home,
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
			Subí la documentación que respalda a tu organización. Nuestro equipo la revisará de forma
			confidencial.
		</p>
	</div>

	<ValidacionInstitucion
		permitirOmitir={false}
		onsubmit={manejarSubida}
		oncancel={() => goto('/institucion/mi-panel')}
	/>
</div>
