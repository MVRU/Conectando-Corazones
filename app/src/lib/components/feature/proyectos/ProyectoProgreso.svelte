<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import {
		calcularProgresoCantidad,
		calcularProgresoTiempo,
		ordenarPorProgreso
	} from '$lib/utils/util-progreso';
	import { getEstadoCodigo } from '$lib/utils/util-estados';
	import type { EstadoDescripcion } from '$lib/domain/types/Estado';
	import {
		BookOpen,
		Home,
		Cake,
		PuzzlePiece,
		ComputerDesktop,
		ShoppingBag,
		Beaker,
		Wrench,
		Pencil,
		ArchiveBox,
		Users,
		CurrencyDollar,
		HandRaised
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { IconSource } from '@steeze-ui/svelte-icon';
	import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';
	import ModalCalculoAportes from './ModalCalculoAportes.svelte';

	let { proyecto, mostrarBotones = false, variant = 'compact', ocultarEtiquetaObjetivo = false } = $props<{
		proyecto: Proyecto;
		mostrarBotones?: boolean;
		variant?: 'compact' | 'extended';
		ocultarEtiquetaObjetivo?: boolean;
	}>();

	const especieEmoji: Record<string, IconSource> = {
		libros: BookOpen,
		colchones: Home,
		alimentos: Cake,
		juguetes: PuzzlePiece,
		computadoras: ComputerDesktop,
		prendas: ShoppingBag,
		medicamentos: Beaker,
		herramientas: Wrench,
		utiles: Pencil
	};

	const getEmojiEspecie = (especie?: string): IconSource =>
		especieEmoji[especie?.toLowerCase() || ''] || ArchiveBox;

	let showModal = $state(false);

	const hoy = new Date();
	let cierre = $derived(proyecto.fecha_fin_tentativa ? new Date(proyecto.fecha_fin_tentativa) : null);

	let estadoCodigo: EstadoDescripcion = $derived(getEstadoCodigo(proyecto.estado, proyecto.estado_id));

	const getGradientClass = (color: 'green' | 'blue' | 'purple') =>
		({
			green: 'from-emerald-300 via-emerald-400 to-emerald-500',
			blue: 'from-sky-300 via-sky-400 to-sky-500',
			purple: 'from-violet-300 via-violet-400 to-violet-500'
		})[color] || 'from-slate-300 via-slate-400 to-slate-500';

	const visualMap: Record<
		string,
		{ color: 'green' | 'blue' | 'purple'; icon: (u?: string) => IconSource }
	> = {
		Monetaria: { color: 'green', icon: () => CurrencyDollar },
		Voluntariado: { color: 'purple', icon: () => HandRaised },
		Especie: { color: 'blue', icon: (u?: string) => getEmojiEspecie(u) }
	};

	const defaultVisual = { color: 'blue' as const, icon: () => Users };

	let participaciones = $derived(ordenarPorProgreso(proyecto.participacion_permitida ?? []));

	let visualInfo = $derived.by(() => {
		let c: 'green' | 'blue' | 'purple' = 'blue';
		let i: IconSource = Users;
		if (participaciones.length > 0) {
			const p: ParticipacionPermitida = participaciones[0];
			const visual = visualMap[p.tipo_participacion?.descripcion || ''] || defaultVisual;
			c = visual.color;
			i = visual.icon(p.unidad_medida);
		}
		return { color: c, icono: i };
	});

	let color = $derived(visualInfo.color);
	let icono = $derived(visualInfo.icono);

	let botonColaborarDeshabilitado = $derived(estadoCodigo !== 'en_curso');

	let progresoCantidad = $derived(calcularProgresoCantidad(participaciones));
	let progresoTiempo = $derived(calcularProgresoTiempo(proyecto.created_at, proyecto.fecha_fin_tentativa));
	let progresoTotal = $derived(Math.round(0.6 * progresoCantidad + 0.4 * progresoTiempo));

	function getMensajeProgreso() {
		if (progresoCantidad > 100) {
			if (progresoTiempo < 100)
				return { texto: '¡Objetivo superado antes de tiempo!', clase: 'text-purple-600' };
			return { texto: '¡Objetivo superado!', clase: 'text-purple-600' };
		}
		if (progresoTotal < 100)
			return { texto: `${progresoTotal}% alcanzado`, clase: 'text-gray-700' };
		if (estadoCodigo !== 'completado' && cierre && hoy < cierre)
			return { texto: 'Listo para finalizar', clase: 'text-orange-600 font-semibold' };
		return { texto: '¡Objetivo alcanzado!', clase: 'text-emerald-600 font-semibold' };
	}
</script>

{#if participaciones.length > 0}
	<div class="animate-fade-up mb-5 transform transition-all duration-300">
		<!-- Etiqueta de progreso -->
		{#if variant === 'extended'}
			<div class="mb-2 flex justify-end text-xs font-medium text-gray-600 transition-colors">
				<span class={getMensajeProgreso().clase}>{getMensajeProgreso().texto}</span>
			</div>
		{/if}
		{#if variant === 'compact'}
			<div class="flex justify-between text-xs font-medium text-gray-700">
				{#if !ocultarEtiquetaObjetivo}
					<div class="flex items-center gap-1.5">
						<Icon src={icono} class="h-4 w-4" />
						<span>Objetivo</span>
					</div>
				{/if}
				<span class={getMensajeProgreso().clase}>{getMensajeProgreso().texto}</span>
			</div>
		{/if}

		<!-- Barra de progreso -->
		<div
			class={`relative mt-3 ${variant === 'extended' ? 'h-3.5' : 'h-2.5'} w-full rounded-full bg-slate-100 shadow-inner`}
		>
			<div
				class={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getGradientClass(color)} transition-all duration-700 ease-out`}
				style={`width: ${Math.min(progresoTotal, 100)}%`}
				role="progressbar"
				aria-valuenow={progresoTotal}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-label={`Progreso del proyecto: ${progresoTotal}%`}
			></div>
		</div>

		<!-- Enlace al modal -->
		{#if variant === 'extended'}
			<div class="mt-2 text-right">
				<button
					type="button"
					class="inline-flex cursor-pointer items-center rounded px-1.5 py-0.5 text-xs text-sky-600 transition-colors hover:text-sky-800 focus:underline focus:ring-2 focus:ring-sky-200 focus:outline-none"
					onclick={() => (showModal = true)}
					aria-label="Ver cómo se calcula el progreso"
				>
					<svg class="mr-1 h-3.5 w-3.5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
							clip-rule="evenodd"
						/>
					</svg>
					¿Cómo se calcula?
				</button>
			</div>
		{/if}
	</div>
{/if}

<ModalCalculoAportes 
	bind:show={showModal} 
	progresoCantidad={progresoCantidad}
	{progresoTiempo}
	{progresoTotal}
/>

<!-- Botones de acción -->
{#if mostrarBotones}
	<div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:gap-2">
		<Button
			label="Ver detalles"
			href={`/proyectos/${proyecto.id_proyecto}`}
			variant="secondary"
			size="sm"
			customClass="flex-1 py-2.5 text-sm transition-all"
		/>
		<Button
			label="Colaborar ahora"
			href={`/proyectos/${proyecto.id_proyecto}#colaborar`}
			size="sm"
			disabled={botonColaborarDeshabilitado}
			customClass="flex-1 cursor-pointer py-2.5 text-sm font-medium transition-all"
		/>
	</div>
{/if}

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-up {
		animation: fade-up 0.5s ease-out forwards;
	}
</style>
