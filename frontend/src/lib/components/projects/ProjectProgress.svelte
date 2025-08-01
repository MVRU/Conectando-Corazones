<script lang="ts">
	import type { Project } from '$lib/types/Project';
	import Button from '../ui/elements/Button.svelte';

	export let proyecto!: Project;
	export let mostrarBotones = false;

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
	const totalCantidad = objetivos.reduce((sum, o) => sum + (o.cantidad ?? 0), 0);
	const totalObjetivo = objetivos.reduce((sum, o) => sum + (o.objetivo ?? 0), 0);

	const porcentajeCantidad =
		totalObjetivo > 0 ? Math.round((totalCantidad / totalObjetivo) * 100) : 0;
</script>

{#if objetivos.length > 0}
	<div class="animate-fade-up mb-4">
		<div class="flex justify-end text-xs font-medium text-gray-700">
			{#if porcentajeCantidad < 100}
				<span>{porcentajeCantidad}% alcanzado</span>
			{:else if estadoTemporizador !== 'Finalizado' && cierre && hoy < cierre}
				<span class="font-semibold text-emerald-600">Proyecto pendiente de finalizar</span>
			{:else}
				<span class="text-gray-500">Objetivo alcanzado</span>
			{/if}
		</div>
		<div class="relative mt-1 h-3 w-full rounded-full bg-gray-200 shadow-inner">
			<!-- Cantidad recaudada -->
			<button
				type="button"
				class="absolute inset-y-0 left-0 h-full cursor-pointer focus:outline-none"
				style={`width: ${Math.min(porcentajeCantidad, 100)}%`}
				aria-label="Ver detalles del progreso recaudado"
			>
				<div
					class={`h-full rounded-full bg-gradient-to-r ${getGradientClass('blue')} pointer-events-none`}
				></div>
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

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 0.4s ease-out both;
	}
</style>
