<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { usuario as usuarioStore, isAuthenticated } from '$lib/stores/auth';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import VistaPerfil from '$lib/components/perfil/VistaPerfil.svelte';
	import type { Usuario, Institucion, Organizacion, Unipersonal, Administrador } from '$lib/types/Usuario';

	type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;

	let perfilUsuario: UsuarioCompleto | undefined = undefined;
	let esMiPerfil = false;

	$: {
		const usernameParam = $page.params.username;
		if (usernameParam) {
			const usuarioEncontrado = Object.values(mockUsuarios).find(
				(u) => u.username.toLowerCase() === usernameParam.toLowerCase()
			);

			if (!usuarioEncontrado) {
				throw error(404, 'Usuario no encontrado');
			}
			const { password: _pw, ...usuarioSinPassword } = usuarioEncontrado;
			perfilUsuario = usuarioSinPassword as UsuarioCompleto;
			esMiPerfil = $usuarioStore?.username.toLowerCase() === usernameParam.toLowerCase();
		}
	}

	onMount(() => {
		// Si no hay usuario autenticado y están viendo un perfil específico, permitir verlo
		// pero si están viendo su propio perfil sin estar autenticado, redirigir
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
	<VistaPerfil {perfilUsuario} {esMiPerfil} />
{:else}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-semibold text-gray-900">Cargando perfil...</h2>
		</div>
	</div>
{/if}
