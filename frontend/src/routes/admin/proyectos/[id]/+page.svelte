<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { Proyecto } from '$lib/types/Proyecto';

	let proyectoDetalle: Proyecto | undefined;

	$: {
		const id = Number($page.params.id);
		proyectoDetalle = (mockProyectos as Proyecto[]).find((p) => p.id_proyecto === id);
	}
</script>

<svelte:head>
	<title>Detalle de proyecto - Panel admin</title>
</svelte:head>

{#if !proyectoDetalle}
	<p class="text-sm text-gray-600">Proyecto no encontrado.</p>
{:else}
	<div class="space-y-6">
		<div class="flex items-center justify-between gap-4">
			<div>
				<Badge text="Proyecto" />
				<h1 class="mt-3 text-2xl font-bold text-gray-900">{proyectoDetalle.titulo}</h1>
				<p class="mt-1 text-sm text-gray-600">
					Institución: {proyectoDetalle.institucion?.nombre_legal || 'Sin institución'}
				</p>
			</div>
			<Button label="Volver" variant="secondary" size="sm" type="button" on:click={() => history.back()} />
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-sm text-gray-700">
			<p class="mb-2">
				<span class="font-semibold">Descripción:</span>
				{proyectoDetalle.descripcion}
			</p>
			<p>
				<span class="font-semibold">Estado:</span>
				{proyectoDetalle.estado}
			</p>
		</div>
	</div>
{/if}
