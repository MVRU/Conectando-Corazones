<script lang="ts">
	import type { Project } from '$lib/models/Project';
	import Button from '../ui/elements/Button.svelte';
	import ProgressDetailsModal from '../ui/cards/ProgressDetailsModal.svelte';

	export let proyecto!: Project;
	export let mostrarBotones = false;

	let showModal = false;
	let tipoModal: 'estimado' | 'recaudado' = 'estimado';

	function abrirModal(tipo: 'estimado' | 'recaudado') {
		tipoModal = tipo;
		showModal = true;
	}

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

	let mostrarTooltipEstimado = false;
	let mostrarTooltipRecaudado = false;

	let unidad = proyecto.unidad;
	let especie = proyecto.especie?.trim() || '';
	let estimado = Number(proyecto.cantidadEstimada);
	let recaudado = Number(proyecto.cantidadRecaudada);
	let objetivo = Number(proyecto.objetivo);

	let percentEstimado = objetivo > 0 ? Math.min((estimado / objetivo) * 100, 100) : 0;
	let percentRecaudado = objetivo > 0 ? Math.min((recaudado / objetivo) * 100, 100) : 0;

	let actualLabel =
		unidad === 'dinero'
			? `$${recaudado.toLocaleString('es-AR')}`
			: unidad === 'voluntarios'
				? `${recaudado} voluntarios`
				: `${recaudado} ${especie || 'unidades'}`;

	let objetivoLabel =
		unidad === 'dinero'
			? `$${objetivo.toLocaleString('es-AR')}`
			: unidad === 'voluntarios'
				? `${objetivo} voluntarios`
				: `${objetivo} ${especie || 'unidades'}`;

	let color: 'green' | 'blue' | 'purple' =
		unidad === 'dinero' ? 'green' : unidad === 'voluntarios' ? 'purple' : 'blue';
	let icono =
		unidad === 'materiales'
			? getEmojiEspecie(especie)
			: unidad === 'dinero'
				? '💰'
				: unidad === 'voluntarios'
					? '🙋‍♀️'
					: '🤝';

	const hoy = new Date();
	const inicio = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : null;
	const cierre = proyecto.fechaCierre ? new Date(proyecto.fechaCierre) : null;

	let estadoTemporizador = '—';
	if (inicio && cierre) {
		if (hoy > cierre) estadoTemporizador = 'Finalizado';
		else if (hoy >= inicio && hoy <= cierre) estadoTemporizador = 'En ejecución';
		else estadoTemporizador = 'Pendiente';
	}

	const getRgbColor = (color: 'green' | 'blue' | 'purple') =>
		({
			green: 'rgb(110,231,183)',
			blue: 'rgb(125,211,252)',
			purple: 'rgb(196,181,253)'
		})[color];

	const getGradientClass = (color: 'green' | 'blue' | 'purple') =>
		({
			green: 'from-emerald-300 via-emerald-400 to-emerald-500',
			blue: 'from-sky-300 via-sky-400 to-sky-500',
			purple: 'from-violet-300 via-violet-400 to-violet-500'
		})[color];

	const disabled = estadoTemporizador === 'Finalizado';
</script>

<div class="flex justify-between text-xs font-medium text-gray-700">
	<span>{icono} Objetivo</span>
	{#if percentRecaudado < 100}
		<span>{percentRecaudado.toFixed(0)}% alcanzado</span>
	{:else if estadoTemporizador !== 'Finalizado' && cierre && hoy < cierre}
		<span class="font-semibold text-emerald-600">Proyecto pendiente de finalizar</span>
	{:else}
		<span class="text-gray-500">Objetivo alcanzado</span>
	{/if}
</div>
<div class="relative mt-1 h-3 w-full rounded-full bg-gray-200 shadow-inner">
	<!-- Estimado -->
	<button
		type="button"
		class="absolute left-0 top-0 h-full cursor-pointer focus:outline-none"
		style={`width: ${percentEstimado}%`}
		on:mouseenter={() => (mostrarTooltipEstimado = true)}
		on:mouseleave={() => (mostrarTooltipEstimado = false)}
		on:click={() => abrirModal('estimado')}
	>
		<div
			class="pointer-events-none h-full rounded-full opacity-70"
			style={`background: repeating-linear-gradient(135deg, ${getRgbColor(color)} 0, ${getRgbColor(color)} 4px, transparent 4px, transparent 8px)`}
		></div>
		{#if mostrarTooltipEstimado}
			<div
				class="absolute -top-10 left-[95%] z-50 w-max -translate-x-1/2 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200"
			>
				🤝 Compromisos de ayuda
			</div>
		{/if}
	</button>

	<!-- Recaudado -->
	<button
		type="button"
		class="absolute inset-y-0 left-0 h-full cursor-pointer focus:outline-none"
		style={`width: ${percentRecaudado}%`}
		on:mouseenter={() => (mostrarTooltipRecaudado = true)}
		on:mouseleave={() => (mostrarTooltipRecaudado = false)}
		on:click={() => abrirModal('recaudado')}
	>
		<div
			class={`h-full rounded-full bg-gradient-to-r ${getGradientClass(color)} pointer-events-none`}
		></div>
		{#if mostrarTooltipRecaudado}
			<div
				class="absolute -top-10 left-1/2 z-50 w-max -translate-x-1/2 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200"
			>
				✅ Donaciones efectivas
			</div>
		{/if}
	</button>
</div>

{#if mostrarBotones}
	<div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
		<Button
			label="Ver detalles"
			href={`/projects/${proyecto.id}`}
			variant="secondary"
			size="sm"
			customClass="flex-1"
		/>
		<Button
			label="Colaborar ahora"
			href={`/projects/${proyecto.id}#colaborar`}
			size="sm"
			{disabled}
			customClass="flex-1"
		/>
	</div>
{/if}

<ProgressDetailsModal open={showModal} tipo={tipoModal} on:close={() => (showModal = false)} />
