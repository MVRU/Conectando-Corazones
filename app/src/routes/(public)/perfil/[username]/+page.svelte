<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { usuario as usuarioStore, isAuthenticated, isLoading } from '$lib/stores/auth';
	import VistaPerfil from '$lib/components/feature/perfil/VistaPerfil.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ perfilUsuario, proyectos, resenas, categorias, esMiPerfil } = data);

	$: if (esMiPerfil && !$isLoading && !$isAuthenticated) {
		goto('/iniciar-sesion');
	}
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
