<script lang="ts">
	import CrearProyecto from '$lib/components/feature/institucion/CrearProyecto.svelte';
	import { goto } from '$app/navigation';
	import { usuario, isLoading } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';

	export let data;

	$: if (!$isLoading) {
		if ($usuario?.rol !== 'institucion' || !data.estaVerificado) {
			toastStore.show({
				title: 'Acceso restringido',
				message:
					'Para crear un proyecto, tenés que verificar la identidad de la institución exitosamente antes de continuar.',
				variant: 'error'
			});
			goto('/');
		}
	}
</script>

{#if !$isLoading && $usuario?.rol === 'institucion' && data.estaVerificado}
	<CrearProyecto
		limiteProyectosAlcanzado={data.limiteProyectosAlcanzado}
		categorias={data.categorias}
		tiposParticipacion={data.tiposParticipacion}
	/>
{/if}
