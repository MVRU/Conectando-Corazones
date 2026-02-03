<script lang="ts">
	import CrearProyecto from '$lib/components/feature/institucion/CrearProyecto.svelte';
	import { isLoading, usuario } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';

	export let data;

	$: if (!$isLoading) {
		if ($usuario?.rol !== 'institucion' && $usuario?.rol !== 'administrador') {
			toastStore.show({
				title: 'Acceso denegado',
				message: 'No tenés permisos para acceder a esta página.',
				variant: 'error'
			});
			goto('/');
		}
	}
</script>

{#if !$isLoading && data.form}
	<CrearProyecto
		edicion={true}
		proyectoId={data.proyectoId}
		initialData={data.form}
		categorias={data.categorias}
		tiposParticipacion={data.tiposParticipacion}
		esEdicionRestringida={data.esEdicionRestringida}
		esAdmin={data.esAdmin}
	/>
{/if}
