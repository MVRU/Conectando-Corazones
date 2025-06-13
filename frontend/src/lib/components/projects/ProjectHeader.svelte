<script lang="ts">
	import Badge from '$lib/components/ui/elements/Badge.svelte';

	export let proyecto;
	export let getColorUrgencia;
	export let getColorEstado;
</script>

<div class="mb-6 flex flex-wrap items-start justify-between">
	<div>
		<h1 class="mb-2 text-3xl font-bold text-[rgb(var(--base-color))]">{proyecto.titulo}</h1>
		<p class="mb-4 text-lg text-gray-600">📍 {proyecto.ciudad}, {proyecto.provincia}</p>
		<div class="flex items-center gap-3">
			<Badge text={proyecto.unidad} shape="square" />
			<span class="rounded-full px-2 py-1 text-xs font-medium {getColorUrgencia(proyecto.urgencia)}"
				>{proyecto.urgencia}</span
			>
			<span class="rounded-full px-2 py-1 text-xs font-medium {getColorEstado(proyecto.estado)}"
				>{proyecto.estado}</span
			>
		</div>
	</div>
</div>
