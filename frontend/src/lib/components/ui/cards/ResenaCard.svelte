<script lang="ts">
	import type { Resena } from '$lib/types/Resena';

	export let resena: Resena;
	export let mostrarAutor: boolean = true;
	export let variante: 'default' | 'compacta' = 'default';
</script>

<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm {variante === 'compacta' ? 'p-4' : ''}">
	<div class="mb-3 flex items-center gap-1">
		{#each Array(5).keys() as i}
			<svg class="h-4 w-4 {i < resena.puntaje ? 'text-amber-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z" />
			</svg>
		{/each}
	</div>
	<p class="text-gray-700 {variante === 'compacta' ? 'text-sm' : ''}">{resena.contenido}</p>
	{#if mostrarAutor && resena.username}
		<p class="mt-3 text-sm text-gray-500">— {resena.username}{resena.rol ? ` · ${resena.rol}` : ''}</p>
	{/if}
</div>
