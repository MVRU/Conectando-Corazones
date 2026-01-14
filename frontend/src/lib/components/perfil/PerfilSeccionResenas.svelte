<script lang="ts">
	import type { Resena } from '$lib/types/Resena';
	import ResenaCard from '$lib/components/ui/cards/ResenaCard.svelte';

	export let resenas: Resena[];
	export let esMiPerfil: boolean;
	export let puedeAgregarResena: boolean;
	export let yaResenoUsuario: boolean;
	export let onAgregarResenaClick: () => void;
	export let limiteMostrar: number = 4;

	$: resenasMostradas = resenas.slice(0, limiteMostrar);
	$: tieneResenas = resenas.length > 0;
	$: mostrarBotonAgregar = !esMiPerfil && puedeAgregarResena && !yaResenoUsuario;
	$: mostrarMensajeNoPermitido = !esMiPerfil && !yaResenoUsuario && !puedeAgregarResena;
</script>

<section class="mb-8">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-xl font-semibold text-gray-900">Reseñas</h3>
		
		{#if mostrarBotonAgregar}
			<button
				on:click={onAgregarResenaClick}
				class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Añadir Reseña
			</button>
		{:else if mostrarMensajeNoPermitido}
			<div class="flex items-center gap-2 text-sm text-gray-500">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>Colaborá con este usuario para poder dejar una reseña</span>
			</div>
		{/if}
	</div>
	
	{#if tieneResenas}
		<div class="grid gap-6 md:grid-cols-2">
			{#each resenasMostradas as resena (resena.id_resena || resena.contenido)}
				<ResenaCard {resena} />
			{/each}
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="mx-auto h-12 w-12 text-gray-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>
			<h3 class="mt-4 text-lg font-medium text-gray-900">No hay reseñas</h3>
			<p class="mt-2 text-gray-500">Las reseñas aparecerán aquí cuando otros usuarios las dejen.</p>
		</div>
	{/if}
</section>
