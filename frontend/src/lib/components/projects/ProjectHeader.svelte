<!-- TODOs:
 	- [x] Corregir atributos de ubicación (✅ Completado: ciudad/provincia → direccion.localidad)
 	- [x] Corregir badge de estado (✅ Completado: [object Object] → estado temporal calculado)
 	- [x] Sincronizar estado con ProjectCard (✅ Completado: ahora ambos usan cálculo temporal)
 	- [ ] Corregir badge de urgencia cuando esté disponible en el tipo -->

<script lang="ts">
	import { ESTADO_LABELS, type EstadoDescripcion } from '$lib/types/Estado';
	
	export let proyecto;
	export let getColorUrgencia;
	export let getColorEstado;
	
	function getEstadoLabel(estado: any): string {
		if (!estado?.descripcion) return 'Falla estado';
		const desc = estado.descripcion as EstadoDescripcion;
		return ESTADO_LABELS[desc] || 'Falla estado';
	}
	
	// Cálculo del estado temporal basado en fechas 
	function getEstadoTemporal(proyecto: any): string {
		const hoy = new Date();
		const inicio = proyecto.created_at ? new Date(proyecto.created_at) : null;
		const cierre = proyecto.fecha_fin_tentativa ? new Date(proyecto.fecha_fin_tentativa) : null;
		
		if (inicio && cierre) {
			if (hoy > cierre) {
				return 'Finalizado';
			} else if (hoy >= inicio && hoy <= cierre) {
				return 'En ejecución';
			} else {
				const diff = inicio.getTime() - hoy.getTime();
				const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
				if (dias <= 0) {
					return 'Hoy comienza';
				} else if (dias === 1) {
					return 'Comienza mañana';
				} else if (dias < 7) {
					return `En ${dias} días`;
				} else {
					const semanas = Math.floor(dias / 7);
					return semanas === 1 ? 'En 1 semana' : `En ${semanas} semanas`;
				}
			}
		}
		
		return getEstadoLabel(proyecto.estado);
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

		<!-- Degradado para contraste -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

		<!-- Contenido superpuesto -->
		<div class="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 text-white sm:px-8 lg:px-10">
			<h1
				class="max-w-4xl text-2xl font-extrabold leading-snug drop-shadow-md sm:text-3xl lg:text-4xl"
			>
				{proyecto.titulo}
			</h1>

			<div
				class="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium drop-shadow sm:text-base"
			>
				<!-- Ubicación -->
				<span class="flex items-center gap-1 text-pink-200">
					📍 {proyecto.direccion?.localidad?.nombre || 'Ciudad'}, {proyecto.direccion?.localidad?.provincia?.nombre || 'Provincia'}
				</span>

				<!-- Badges -->
				{#if proyecto.urgencia}
					<span
						class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${getColorUrgencia(proyecto.urgencia)} bg-white/80`}
					>
						⚠️ {proyecto.urgencia}
					</span>
				{/if}

				{#if proyecto.estado}
					<span
						class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${getColorEstado(proyecto.estado.descripcion || 'en_curso')} bg-white/80`}
					>
						📌 {getEstadoTemporal(proyecto)}
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
