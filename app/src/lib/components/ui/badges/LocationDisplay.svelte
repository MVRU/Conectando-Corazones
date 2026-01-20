<script lang="ts">
	import { MapPin, GlobeAlt } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import { getUbicacionTexto } from '$lib/utils/util-proyectos';

	export let proyecto: Proyecto;
	export let showIcon = true;
	export let className = '';
	export let variant: 'text' | 'badge' = 'text';

	$: ubicacionTexto = getUbicacionTexto(proyecto);
	$: isVirtual = ubicacionTexto === 'Virtual';

	$: badgeClasses =
		variant === 'badge'
			? 'bg-white/95 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm text-xs font-medium text-gray-700'
			: 'text-sm text-gray-600';
</script>

<div class="inline-flex items-center gap-1.5 {badgeClasses} {className}">
	{#if showIcon}
		{#if isVirtual}
			<Icon
				src={GlobeAlt}
				class={variant === 'badge' ? 'h-3.5 w-3.5 text-blue-600' : 'h-4 w-4 text-blue-500'}
			/>
		{:else}
			<Icon
				src={MapPin}
				class={variant === 'badge' ? 'h-3.5 w-3.5 text-red-500' : 'h-4 w-4 text-red-500'}
			/>
		{/if}
	{/if}
	<span class="truncate">{ubicacionTexto}</span>
</div>
