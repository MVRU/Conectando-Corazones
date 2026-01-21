<script lang="ts">
	import CrearProyecto from '$lib/components/feature/institucion/CrearProyecto.svelte';
	import { goto } from '$app/navigation';
	import { usuario, isLoading } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import { mockVerificaciones } from '$lib/infrastructure/mocks/mock-verificaciones';
	import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';

	let limiteProyectosAlcanzado = false;

	$: if (!$isLoading) {
		const verificacion = mockVerificaciones.find((v) => v.usuario_id === $usuario?.id_usuario);
		const esInstitucion = $usuario?.rol === 'institucion';
		const estaAprobado = verificacion?.estado === 'aprobada';

		if (!esInstitucion || !estaAprobado) {
			toastStore.show({
				title: 'Acceso restringido',
				message:
					'Para crear un proyecto, tenés que verificar la identidad de la institución exitosamente antes de continuar.',
				variant: 'error'
			});
			goto('/');
		}

		if ($usuario) {
			const proyectosEnCurso = mockProyectos.filter(
				(p) => p.institucion_id === $usuario?.id_usuario && p.estado === 'en_curso'
			).length;
			limiteProyectosAlcanzado = proyectosEnCurso >= 5;
		}
	}
</script>

{#if !$isLoading && $usuario?.rol === 'institucion'}
	<CrearProyecto {limiteProyectosAlcanzado} />
{/if}
