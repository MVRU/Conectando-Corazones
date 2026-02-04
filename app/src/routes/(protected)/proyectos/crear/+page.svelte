<script lang="ts">
	import CrearProyecto from '$lib/components/feature/institucion/CrearProyecto.svelte';
	import { goto } from '$app/navigation';
	import { usuario, isLoading } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';

	export let data;

	$: if (!$isLoading) {
		if ($usuario?.rol !== 'institucion') {
			toastStore.show({
				title: 'Acceso restringido',
				message: 'Solo las instituciones pueden crear proyectos.',
				variant: 'error'
			});
			goto('/');
		}
	}
</script>

{#if !$isLoading && $usuario?.rol === 'institucion'}
	<CrearProyecto
		limiteProyectosAlcanzado={data.limiteProyectosAlcanzado}
		categorias={data.categorias}
		tiposParticipacion={data.tiposParticipacion}
		estaVerificado={data.estaVerificado}
	/>
{/if}
