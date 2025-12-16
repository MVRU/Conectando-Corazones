<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { Usuario } from '$lib/types/Usuario';

	const usuariosArray = Object.values(mockUsuarios as MockUsuarios) as Usuario[];

	let usuarioDetalle: Usuario | undefined;

	$: {
		const id = Number($page.params.id);
		usuarioDetalle = usuariosArray.find((u) => u.id_usuario === id);
	}
</script>

<svelte:head>
	<title>Detalle de usuario - Panel admin</title>
</svelte:head>

{#if !usuarioDetalle}
	<p class="text-sm text-gray-600">Usuario no encontrado.</p>
{:else}
	<div class="space-y-6">
		<div class="flex items-center justify-between gap-4">
			<div>
				<Badge text="Usuario" />
				<h1 class="mt-3 text-2xl font-bold text-gray-900">{usuarioDetalle.nombre} {usuarioDetalle.apellido}</h1>
				<p class="mt-1 text-sm text-gray-600">Rol: {usuarioDetalle.rol}</p>
			</div>
			<Button label="Volver" variant="secondary" size="sm" type="button" on:click={() => history.back()} />
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700">
			<p><span class="font-semibold">Username:</span> {usuarioDetalle.username}</p>
			<p><span class="font-semibold">Estado:</span> {usuarioDetalle.estado}</p>
			{#if usuarioDetalle.direccion}
				<p class="mt-2">
					<span class="font-semibold">Dirección:</span>
					{usuarioDetalle.direccion.calle} {usuarioDetalle.direccion.numero}
				</p>
			{/if}
		</div>
	</div>
{/if}
