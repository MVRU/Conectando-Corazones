<script lang="ts">
	import { ESTADO_LABELS, type EstadoDescripcion } from '$lib/types/Estado';
	import { getProvinciaFromLocalidad } from '$lib/utils/util-ubicaciones';
	import type { Proyecto } from '$lib/types/Proyecto';

	export let proyecto: Proyecto;
	export let getColorUrgencia: (u: string) => string;
	export let getColorEstado: (label: string) => string;

	const provinciaNombre =
		getProvinciaFromLocalidad(proyecto.direccion?.localidad)?.nombre ?? 'Provincia';

	function getEstadoLabel(estado: EstadoDescripcion | undefined): string {
		if (!estado) return 'En curso';
		return ESTADO_LABELS[estado] ?? 'En curso';
	}

	// Cálculo del estado temporal basado en fechas
	function getEstadoTemporal(p: Proyecto): string {
		const hoy = new Date();
		const inicio = p.created_at ? new Date(p.created_at) : null;
		const cierre = p.fecha_fin_tentativa ? new Date(p.fecha_fin_tentativa) : null;

		if (inicio && cierre) {
			if (hoy > cierre) return 'Completado';
			if (hoy >= inicio && hoy <= cierre) return 'En curso';

			const diff = inicio.getTime() - hoy.getTime();
			const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
			if (dias <= 0) return 'Hoy comienza';
			if (dias === 1) return 'Comienza mañana';
			if (dias < 7) return `En ${dias} días`;
			const semanas = Math.floor(dias / 7);
			return semanas === 1 ? 'En 1 semana' : `En ${semanas} semanas`;
		}

		return getEstadoLabel(p.estado);
	}
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
					📍 {proyecto.direccion?.localidad?.nombre || 'Ciudad'}, {provinciaNombre}
				</span>

				{#if proyecto.estado}
					{@const estadoTemporal = getEstadoTemporal(proyecto)}
					<span
						class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${getColorEstado(estadoTemporal)} bg-white/80`}
					>
						📌 {estadoTemporal}
					</span>
				{/if}
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
