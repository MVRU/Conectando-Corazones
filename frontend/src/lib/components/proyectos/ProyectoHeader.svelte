<script lang="ts">
	import type { EstadoDescripcion } from '$lib/types/Estado';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { getUbicacionTexto } from '$lib/utils/util-proyectos';
	import type { Proyecto } from '$lib/types/Proyecto';

	export let proyecto: Proyecto;
	export let getColorEstado: (estado: EstadoDescripcion) => string;

	// -*- Ubicación principal
	const ubicacionTexto = getUbicacionTexto(proyecto);

	const estadoCodigo = getEstadoCodigo(proyecto.estado, proyecto.estado_id);
	const estadoEtiqueta = estadoLabel(estadoCodigo);
</script>

{#if proyecto.url_portada}
	<div
		class="animate-fade-down relative overflow-hidden rounded-3xl border border-gray-200 shadow-lg"
	>
		<img
			src={proyecto.url_portada}
			alt="Imagen del proyecto"
			class="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
			loading="lazy"
		/>

		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

		<div class="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 text-white sm:px-8 lg:px-10">
			<h1
				class="max-w-4xl text-2xl font-extrabold leading-snug drop-shadow-md sm:text-3xl lg:text-4xl"
			>
				{proyecto.titulo}
			</h1>

			<div
				class="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium drop-shadow sm:text-base"
			>
				<span class="flex items-center gap-1 text-pink-200">
					📍 {ubicacionTexto}
				</span>

				<span
					class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${getColorEstado(estadoCodigo)} bg-white/80`}
				>
					📌 {estadoEtiqueta}
				</span>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-down {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-down {
		animation: fade-down 0.5s ease-out both;
	}
</style>
