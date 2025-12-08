<script lang="ts">
	import { MapPin, Globe } from 'lucide-svelte';
	import type { Proyecto } from '$lib/types/Proyecto';
	import { getUbicacionTexto } from '$lib/utils/util-proyectos';

	export let proyecto: Proyecto;
	export let showIcon = true;
	export let className = '';

	$: ubicacionTexto = getUbicacionTexto(proyecto);
	$: isVirtual = ubicacionTexto === 'Virtual';
</script>

<div class="flex items-center gap-1.5 text-sm text-gray-600 {className}">
	{#if showIcon}
		{#if isVirtual}
			<Globe class="w-4 h-4 text-blue-500" />
		{:else}
			<MapPin class="w-4 h-4 text-red-500" />
		{/if}
	{/if}
	<span class="truncate">{ubicacionTexto}</span>
</div>
