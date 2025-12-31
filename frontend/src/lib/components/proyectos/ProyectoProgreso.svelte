<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import {
		calcularProgresoCantidad,
		calcularProgresoTiempo,
		ordenarPorProgreso
	} from '$lib/utils/util-progreso';
	import { getEstadoCodigo } from '$lib/utils/util-estados';
	import type { EstadoDescripcion } from '$lib/types/Estado';

	export let proyecto!: Proyecto;
	export let mostrarBotones = false;
	export let variant: 'compact' | 'extended' = 'compact';
	export let ocultarEtiquetaObjetivo = false;

	const especieEmoji: Record<string, string> = {
		libros: '📚',
		colchones: '🛏️',
		alimentos: '🍽️',
		juguetes: '🧸',
		computadoras: '💻',
		prendas: '👕',
		medicamentos: '💊',
		herramientas: '🔧',
		utiles: '✏️'
	};

	const getEmojiEspecie = (especie?: string) => especieEmoji[especie?.toLowerCase() || ''] || '📦';

	let step = 0;
	const steps = 4;
	let icono = '🤝';

	const hoy = new Date();
	/**
	 * ! REVISAR: no estamos usando la fecha de inicio o creación del proyecto en ningún lado. ¿Tendríamos que mostrarla en algún lado?
	 */
	// const inicio = proyecto.created_at ? new Date(proyecto.created_at) : null;
	const cierre = proyecto.fecha_fin_tentativa ? new Date(proyecto.fecha_fin_tentativa) : null;

	const estadoCodigo: EstadoDescripcion = getEstadoCodigo(proyecto.estado, proyecto.estado_id);

	const getGradientClass = (color: 'green' | 'blue' | 'purple') =>
		({
			green: 'from-emerald-300 via-emerald-400 to-emerald-500',
			blue: 'from-sky-300 via-sky-400 to-sky-500',
			purple: 'from-violet-300 via-violet-400 to-violet-500'
		})[color] || 'from-slate-300 via-slate-400 to-slate-500';

	let color: 'green' | 'blue' | 'purple' = 'blue';

	const visualMap: Record<
		string,
		{ color: 'green' | 'blue' | 'purple'; emoji: (u?: string) => string }
	> = {
		Monetaria: { color: 'green', emoji: () => '💰' },
		Voluntariado: { color: 'purple', emoji: () => '🙋‍♀️' },
		Materiales: { color: 'blue', emoji: (u?: string) => getEmojiEspecie(u) }
	};

	const defaultVisual = { color: 'blue' as const, emoji: () => '🤝' };

	let participaciones: ParticipacionPermitida[] = [];

	$: participaciones = ordenarPorProgreso(proyecto.participacion_permitida ?? []);

	$: if (participaciones.length > 0) {
		const { unidad_medida, tipo_participacion } = participaciones[0] || {};
		const visual = visualMap[tipo_participacion?.descripcion || ''] || defaultVisual;
		color = visual.color;
		icono = visual.emoji(unidad_medida);
	}

	const botonColaborarDeshabilitado = estadoCodigo !== 'en_curso';

	let progresoCantidad = 0;
	let progresoTiempo = 0;
	let progresoTotal = 0;

	$: progresoCantidad = calcularProgresoCantidad(participaciones);
	$: progresoTiempo = calcularProgresoTiempo(proyecto.created_at, proyecto.fecha_fin_tentativa);
	$: progresoTotal = Math.round(0.6 * progresoCantidad + 0.4 * progresoTiempo);

	let showModal = false;

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
		<!-- ! Etiqueta de progreso -->
		{#if variant === 'extended'}
			<div class="mb-2 flex justify-end text-xs font-medium text-gray-600 transition-colors">
				<span class={getMensajeProgreso().clase}>{getMensajeProgreso().texto}</span>
			</div>
		{/if}
		{#if variant === 'compact'}
			<div class="flex justify-between text-xs font-medium text-gray-700">
				<span>
					{#if !ocultarEtiquetaObjetivo}
						{icono}
						Objetivo
					{/if}
				</span>
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
					class="inline-flex cursor-pointer items-center rounded px-1.5 py-0.5 text-xs text-sky-600 transition-colors hover:text-sky-800 focus:underline focus:outline-none focus:ring-2 focus:ring-sky-200"
					on:click={() => (showModal = true)}
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

{#if showModal}
	<!-- Overlay que cubre toda la página con blur -->
	<div
		class="fixed inset-0 z-40 backdrop-blur-sm transition-all duration-300"
		on:click={() => {
			showModal = false;
			step = 0;
		}}
		aria-hidden="true"
	></div>

	<!-- Modal (por encima del overlay) -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-md scale-100 rounded-2xl bg-white opacity-100 shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown={(e) => {
				if (e.key === 'Escape') showModal = false;
			}}
		>
			<!-- Encabezado -->
			<div class="flex items-center justify-between border-b border-gray-100 px-5 pb-4 pt-5">
				<h2 id="modal-title" class="text-base font-semibold leading-tight text-gray-800">
					{step === 0
						? 'Cálculo del progreso'
						: step === 1
							? 'Objetivos cumplidos'
							: step === 2
								? 'Tiempo transcurrido'
								: 'Progreso total'}
				</h2>
				<button
					type="button"
					class="rounded-full p-1 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
					on:click={() => {
						showModal = false;
						step = 0;
					}}
					aria-label="Cerrar modal"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Contenido -->
			<div class="space-y-4 px-5 pb-5 pt-4 text-sm text-gray-700">
				{#if step === 0}
					<p class="text-gray-800">El progreso combina dos métricas:</p>
					<ul class="space-y-2 text-sm">
						<li class="flex items-start gap-3">
							<div class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-500"></div>
							<span><strong>Objetivos cumplidos:</strong> progreso real de los resultados.</span>
						</li>
						<li class="flex items-start gap-3">
							<div class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>
							<span><strong>Tiempo transcurrido:</strong> avance cronológico del proyecto.</span>
						</li>
					</ul>
					<p class="mt-2 text-xs text-gray-500">
						Toque "Siguiente" para ver cómo se calcula cada parte.
					</p>
				{:else if step === 1}
					<p>
						Se calcula el porcentaje total alcanzado sobre el total necesario, sumando todas las
						cantidades recaudadas y dividiéndolas por la suma de los objetivos.
					</p>
					<div
						class="rounded-lg border border-sky-100 bg-sky-50 p-3 font-mono text-xs leading-snug text-sky-900"
					>
						<div class="mb-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-sky-400"></div>
							<span class="font-medium text-sky-700">Fórmula:</span>
						</div>
						<span>progreso = (∑ recaudadado_i) / (∑ objetivo_i) × 100</span>
					</div>
					<p class="mt-2">
						<strong
							>En este proyecto: <span class="text-sky-700">{progresoCantidad.toFixed(2)}%</span
							></strong
						>
					</p>
				{:else if step === 2}
					<p>Se mide el porcentaje del tiempo ya transcurrido.</p>
					<div
						class="rounded-lg border border-emerald-100 bg-emerald-50 p-3 font-mono text-xs leading-snug text-emerald-900"
					>
						<div class="mb-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-emerald-400"></div>
							<span class="font-medium text-emerald-700">Fórmula:</span>
						</div>
						<span>progreso = ((hoy - inicio) / (fin - inicio)) × 100</span>
					</div>
					<p class="mt-2">
						<strong
							>En este proyecto: <span class="text-emerald-700">{progresoTiempo.toFixed(2)}%</span
							></strong
						>
					</p>
				{:else if step === 3}
					<p>Se combina con un peso del 60% a objetivos y 40% al tiempo.</p>
					<div
						class="rounded-lg border border-purple-100 bg-purple-50 p-3 font-mono text-xs leading-snug text-purple-900"
					>
						<div class="mb-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-purple-400"></div>
							<span class="font-medium text-purple-700">Fórmula:</span>
						</div>
						<span>total = 0.6 × objetivos + 0.4 × tiempo</span>
					</div>
					<p class="mt-2">
						<strong>Progreso total: <span class="text-purple-700">{progresoTotal}%</span></strong>
					</p>
				{/if}
			</div>

			<!-- Navegación -->
			<div class="flex items-center justify-between border-t border-gray-100 px-5 pb-5 pt-2">
				{#if step > 0}
					<button
						type="button"
						class="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200"
						on:click={() => step--}
					>
						<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Atrás
					</button>
				{:else}
					<div></div>
				{/if}

				{#if step < steps - 1}
					<Button
						label="Siguiente"
						variant="primary"
						size="sm"
						customClass="px-4 py-1.5 text-sm"
						on:click={() => step++}
					/>
				{:else}
					<Button
						label="Cerrar"
						variant="secondary"
						size="sm"
						customClass="px-4 py-1.5 text-sm"
						on:click={() => {
							showModal = false;
							step = 0;
						}}
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}

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
			customClass="flex-1 py-2.5 text-sm font-medium transition-all"
		/>
	</div>
{/if}

<!-- Animación -->
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
