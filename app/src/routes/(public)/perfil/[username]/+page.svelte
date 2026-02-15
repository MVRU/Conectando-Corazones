<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { usuario as usuarioStore, isAuthenticated } from '$lib/stores/auth';
	import VistaPerfil from '$lib/components/feature/perfil/VistaPerfil.svelte';
	import type { PageData } from './$types';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	export let data: PageData;

	$: ({ perfilUsuario, proyectos, resenas, categorias, esMiPerfil } = data);

	// Breadcrumbs contextuales
	$: {
		const from = $page.url.searchParams.get('from');
		const nombrePerfil = perfilUsuario
			? perfilUsuario.rol === 'institucion'
				? (perfilUsuario as any).nombre_legal || perfilUsuario.nombre
				: (perfilUsuario as any).razon_social || `${perfilUsuario.nombre} ${perfilUsuario.apellido}`
			: 'Perfil';

		if (from === 'solicitudes') {
			setBreadcrumbs([
				{ label: 'Inicio', href: '/' },
				{ label: 'Mi Panel', href: '/institucion/mi-panel' },
				{ label: 'Solicitudes', href: '/institucion/solicitudes-colaboracion' },
				{ label: nombrePerfil }
			]);
		} else {
			setBreadcrumbs([{ label: 'Inicio', href: '/' }, { label: nombrePerfil }]);
		}
	}

	onMount(() => {
		if (esMiPerfil && !$isAuthenticated) {
			goto('/iniciar-sesion');
		}
	});
</script>

<svelte:head>
	<title>
		{perfilUsuario
			? perfilUsuario.rol === 'institucion'
				? (perfilUsuario as any).nombre_legal || perfilUsuario.nombre
				: `${perfilUsuario.nombre} ${perfilUsuario.apellido}`
			: 'Perfil'} - Conectando Corazones
	</title>
</svelte:head>

{#if perfilUsuario}
	<VistaPerfil {perfilUsuario} {esMiPerfil} {proyectos} {resenas} {categorias} />
{:else}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<h2 class="text-xl font-semibold text-gray-900">Cargando perfil...</h2>
		</div>
	</div>
{/if}
