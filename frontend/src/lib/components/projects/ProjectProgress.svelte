<script lang="ts">
	import type { Project } from '$lib/models/Project';
	import Button from '../ui/elements/Button.svelte';
	import ProgressDetailsModal from '../ui/cards/ProgressDetailsModal.svelte';

	export let proyecto!: Project;
	export let mostrarBotones = false;

	let showModal = false;
	let tipoModal: 'estimado' | 'recaudado' = 'estimado';

	let mostrarTooltipEstimado = false;
	let mostrarTooltipRecaudado = false;

	function abrirModal(tipo: 'estimado' | 'recaudado') {
		tipoModal = tipo;
		showModal = true;
	}

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

	const objetivos = proyecto.objetivos || [];
	const totalRecaudado = objetivos.reduce((sum, o) => sum + (o.cantidadRecaudada ?? 0), 0);
	const totalEstimado = objetivos.reduce((sum, o) => sum + (o.cantidadEstimada ?? 0), 0);
	const totalObjetivo = objetivos.reduce((sum, o) => sum + (o.objetivo ?? 0), 0);

	const porcentajeEstimado =
		totalObjetivo > 0 ? Math.round((totalEstimado / totalObjetivo) * 100) : 0;

	const porcentajeRecaudado =
		totalObjetivo > 0 ? Math.round((totalRecaudado / totalObjetivo) * 100) : 0;
</script>

{#if objetivos.length > 0}
	<div class="mb-4">
		<div class="flex justify-end text-xs font-medium text-gray-700">
			{#if porcentajeRecaudado < 100}
				<span>{porcentajeRecaudado}% alcanzado</span>
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
				style={`width: ${Math.min(porcentajeEstimado, 100)}%`}
				on:click={() => abrirModal('estimado')}
				on:mouseenter={() => (mostrarTooltipEstimado = true)}
				on:mouseleave={() => (mostrarTooltipEstimado = false)}
				aria-label="Ver detalles del progreso estimado"
			>
				<div
					class="pointer-events-none h-full rounded-full opacity-70"
					style={`background: repeating-linear-gradient(135deg, ${getRgbColor('blue')} 0, ${getRgbColor('blue')} 4px, transparent 4px, transparent 8px)`}
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
				style={`width: ${Math.min(porcentajeRecaudado, 100)}%`}
				on:click={() => abrirModal('recaudado')}
				on:mouseenter={() => (mostrarTooltipRecaudado = true)}
				on:mouseleave={() => (mostrarTooltipRecaudado = false)}
				aria-label="Ver detalles del progreso recaudado"
			>
				<div
					class={`h-full rounded-full bg-gradient-to-r ${getGradientClass('blue')} pointer-events-none`}
				></div>
				{#if mostrarTooltipRecaudado}
					<div
						class="absolute -top-10 left-1/2 z-50 w-max -translate-x-1/2 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200"
					>
						✅ Colaboraciones efectivas
					</div>
				{/if}
			</button>
		</div>
	</div>
{/if}

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
