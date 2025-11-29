<script lang="ts">
	import { MapPin, GlobeAlt } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
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
			<Icon src={GlobeAlt} class="h-4 w-4 text-blue-500" />
		{:else}
			<Icon src={MapPin} class="h-4 w-4 text-red-500" />
		{/if}
	{/if}
	<span class="truncate">{ubicacionTexto}</span>
</div>
