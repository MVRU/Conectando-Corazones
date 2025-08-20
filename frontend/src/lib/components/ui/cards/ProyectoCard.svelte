<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { calcularProgresoTotal } from '$lib/utils/util-progreso';
	import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
	import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
	import { getParticipacionVisual } from '$lib/utils/util-proyectos';
	import type { EstadoDescripcion } from '$lib/types/Estado';

	export let proyecto!: Proyecto;
	export let mostrarBotones: boolean = false;

	// Variables reactivas para valores dependientes de "proyecto"
	let percentCantidad: number = 0;
	let color: 'green' | 'blue' | 'purple' = 'blue';

	$: if (proyecto.participacion_permitida && proyecto.participacion_permitida.length > 0) {
		const participaciones = proyecto.participacion_permitida;
		const totalObjetivo = participaciones.reduce((acc, p) => acc + (p.objetivo || 0), 0);
		const totalActual = participaciones.reduce((acc, p) => acc + (p.actual || 0), 0);
		const primerParticipacion = participaciones[0];

		percentCantidad = calcularProgresoTotal(proyecto);
	}

	const formatearFechaCorta = (fecha?: string) => {
		if (!fecha) return '—';
		const f = new Date(fecha);
		return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear().toString().slice(-2)}`;
	};

	const estadoCodigo: EstadoDescripcion = getEstadoCodigo(proyecto.estado, proyecto.id_estado);
	const estadoTemporizador = estadoLabel(estadoCodigo);
	const emojiPorEstado: Record<EstadoDescripcion, string> = {
		en_curso: '🟢',
		pendiente_solicitud_cierre: '⏳',
		en_revision: '🔍',
		en_auditoria: '🔎',
		completado: '✅',
		cancelado: '❌'
	};
	const emojiTemporizador = emojiPorEstado[estadoCodigo] || '⌛';

	type MaybeUbicacion = any;

	const ubicaciones = (proyecto.ubicaciones ?? []) as MaybeUbicacion[];

	$: ubicacionPrincipal =
		ubicaciones.find((u) => u?.tipo_ubicacion === 'principal') ?? ubicaciones[0];

	// Es virtual si no hay ubicaciones
	$: esVirtual = ubicaciones.length === 0;

	$: ubicacionTexto = esVirtual
		? 'Virtual'
		: `${ubicacionPrincipal?.direccion?.localidad?.nombre || 'Ciudad'}${
				ubicacionPrincipal?.direccion?.localidad?.provincia?.nombre
					? `, ${ubicacionPrincipal.direccion.localidad.provincia.nombre}`
					: ''
			}`;

	$: ubicacionTooltip = ubicacionTexto;
</script>

<a
	href={`/proyectos/${proyecto.id_proyecto}`}
	class="animate-fade-in-up group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
>
	<!-- Imagen destacada -->
	<div class="relative aspect-[4/3] w-full overflow-hidden">
		<img
			src={proyecto.url_portada || '/img/proyecto-default.jpg'}
			alt={proyecto.titulo}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		<!-- Estado y Fechas -->
		<div
			class="absolute bottom-3 left-3 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-lg backdrop-blur-md"
		>
			<span class="text-sm">{emojiTemporizador}</span>
			<span class="font-medium">{estadoTemporizador}</span>
			<span class="mx-1 text-gray-300">|</span>
			<span class="text-gray-500">
				{formatearFechaCorta(proyecto.created_at?.toString())} - {formatearFechaCorta(
					proyecto.fecha_fin_tentativa?.toString()
				)}
			</span>
		</div>

		<!-- Gradiente oscuro sutil -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent">
			<!-- TODO: Implementar cuando la propiedad 'urgencia' esté disponible en el tipo Proyecto -->
			<!-- {#if proyecto.urgencia}
				<div class="absolute right-4 top-4">
					<span class={getBadgeClasses(proyecto.urgencia)}>
						<span>Urgencia {proyecto.urgencia}</span>
					</span>
				</div>
			{/if} -->
		</div>
	</div>

	<!-- Contenido textual -->
	<div class="flex flex-1 flex-col justify-between gap-6 p-6">
		<div class="space-y-2">
			<div class="flex flex-wrap items-center justify-between text-xs text-gray-500">
				<span class="font-semibold text-[rgb(var(--color-primary))]"
					>{proyecto.institucion?.nombre_legal || 'Institución'}</span
				>

				<!-- Ubicación (principal / virtual) con truncate + tooltip -->
				<div class="flex min-w-0 items-center gap-1 text-xs text-gray-500">
					<svg class="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11.8a2.8 2.8 0 100-5.6 2.8 2.8 0 000 5.6z"
						/>
					</svg>
					<span
						class="max-w-[140px] truncate sm:max-w-[180px] md:max-w-[220px]"
						title={ubicacionTooltip}
						aria-label={ubicacionTooltip}
					>
						{ubicacionTexto}
					</span>
				</div>
			</div>

			<h3 class="line-clamp-2 text-lg font-semibold text-gray-900">
				{proyecto.titulo}
			</h3>
			<p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
				{proyecto.descripcion}
			</p>
		</div>

		<!-- Progreso visual -->
		<div class="mt-2 flex flex-col gap-2">
			<ProyectoProgreso {proyecto} variant="compact" />

			{#if mostrarBotones}
				<div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
					<Button
						label="Ver detalles"
						href={`/proyectos/${proyecto.id_proyecto}`}
						variant="secondary"
						size="sm"
						customClass="flex-1"
					/>
					<Button
						label="Colaborar ahora"
						href={`/proyectos/${proyecto.id_proyecto}#colaborar`}
						size="sm"
						customClass="flex-1"
					/>
				</div>
			{/if}
		</div>
	</div>
</a>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@keyframes fade-in-up {
		0% {
			opacity: 0;
			transform: translateY(16px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.6s ease-out forwards;
	}
</style>
