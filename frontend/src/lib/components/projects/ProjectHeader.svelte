<script lang="ts">
	import Badge from '$lib/components/ui/elements/Badge.svelte';

	export let proyecto;
	export let getColorUrgencia;
	export let getColorEstado;
</script>

{#if proyecto.imagen}
	<div class="relative overflow-hidden rounded-2xl shadow-lg">
		<img
			src={proyecto.imagen}
			alt="Imagen del proyecto"
			class="h-64 w-full object-cover sm:h-80 lg:h-96"
			loading="lazy"
		/>

		<!-- Overlay con degradado para contraste -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

		<!-- Contenido superpuesto -->
		<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
			<h1 class="text-2xl font-bold drop-shadow-md sm:text-3xl">{proyecto.titulo}</h1>

			<div class="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium">
				<span class="flex items-center gap-1 text-pink-200 drop-shadow-sm">
					📍 {proyecto.ciudad}, {proyecto.provincia}
				</span>
				<span
					class={`rounded-full bg-white/80 px-2 py-0.5 text-xs ${getColorUrgencia(proyecto.urgencia)}`}
				>
					{proyecto.urgencia}
				</span>
				<span
					class={`rounded-full bg-white/80 px-2 py-0.5 text-xs ${getColorEstado(proyecto.estado)}`}
				>
					{proyecto.estado}
				</span>
			</div>
		</div>
	</div>
{/if}
