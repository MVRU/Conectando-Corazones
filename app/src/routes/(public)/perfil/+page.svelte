<script lang="ts">
	import { usuario as usuarioStore, isAuthenticated } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$isAuthenticated || !$usuarioStore) {
			goto('/iniciar-sesion');
		} else {
			// Redirigir al perfil del usuario autenticado usando su username
			goto(`/perfil/${$usuarioStore.username}`);
		}
	});
</script>

<svelte:head>
	<title>Mi Perfil - Conectando Corazones</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="text-center">
		<h2 class="text-xl font-semibold text-gray-900">Redirigiendo a tu perfil...</h2>
		<p class="mt-2 text-gray-600">Por favor espera...</p>
	</div>
</div>
