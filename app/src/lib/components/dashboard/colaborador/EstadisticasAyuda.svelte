<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let estadisticas: {
		voluntariado: number;
		unidadVoluntariado: string;
		monetaria: number;
		especie: number;
		totalProyectos: number;
		distribucion: {
			voluntariado: number;
			monetaria: number;
			especie: number;
		};
	};

	// Formateador compacto de números
	const formatCompactNumber = (val: number): string => {
		if (val >= 1_000_000_000) {
			return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
		}
		if (val >= 1_000_000) {
			return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
		}
		if (val >= 1_000) {
			return (val / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return val.toString();
	};

	// Formateador compacto de moneda
	const formatCompactCurrency = (val: number): string => {
		return '$' + formatCompactNumber(val);
	};

	// Calculate target percentages for the donut chart based on PROJECT COUNT (distribucion)
	$: totalDistribucion =
		estadisticas.distribucion.voluntariado +
		estadisticas.distribucion.monetaria +
		estadisticas.distribucion.especie;

	$: targetVol = totalDistribucion
		? (estadisticas.distribucion.voluntariado / totalDistribucion) * 100
		: 0;
	$: targetMon = totalDistribucion
		? (estadisticas.distribucion.monetaria / totalDistribucion) * 100
		: 0;
	$: targetEsp = totalDistribucion
		? (estadisticas.distribucion.especie / totalDistribucion) * 100
		: 0;

	// Tweened stores
	const tVol = tweened(0, { duration: 1500, easing: cubicOut });
	const tMon = tweened(0, { duration: 1500, easing: cubicOut });
	const tEsp = tweened(0, { duration: 1500, easing: cubicOut });
	const tTotal = tweened(0, { duration: 2000, easing: cubicOut });

	function handleReveal() {
		tVol.set(targetVol);
		tMon.set(targetMon);
		tEsp.set(targetEsp);
		tTotal.set(estadisticas.totalProyectos);
	}

	// Dynamic gradient based on tweened values
	$: gradient = `conic-gradient(
        #3b82f6 0% ${$tVol}%, 
        #10b981 ${$tVol}% ${$tVol + $tMon}%, 
        #fbbf24 ${$tVol + $tMon}% 100%
    )`;
</script>

<div
	use:reveal
	on:reveal={handleReveal}
	class="reveal-hidden flex h-full flex-col rounded-[2rem] border border-amber-500/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
>
	<h2 class="mb-6 w-full text-center text-xl font-semibold tracking-tight text-white md:text-left">
		Mis tipos de ayuda
	</h2>

	<div
		class="flex w-full flex-1 flex-col items-center justify-center gap-6 md:flex-row md:justify-around lg:flex-col lg:justify-center xl:flex-row xl:justify-around"
	>
		<!-- Donut Chart -->
		<div
			class="relative flex aspect-square h-64 w-64 shrink-0 items-center justify-center transition-transform hover:scale-105"
		>
			<!-- Chart Ring -->
			<div class="absolute inset-0 rounded-full" style="background: {gradient};"></div>

			<!-- Inner Circle (Mask) -->
			<div
				class="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-[#0F1129]"
			>
				<span class="text-4xl font-bold tracking-tighter text-white">{Math.floor($tTotal)}</span>
				<span class="mt-1 w-full px-4 text-center text-xs leading-tight font-medium text-slate-400"
					>Proyectos apoyados</span
				>
			</div>
		</div>

		<!-- Legend -->
		<div class="flex w-full max-w-[200px] flex-col gap-6 md:max-w-none lg:max-w-[240px]">
			<!-- Item 1: Voluntariado -->
			<div class="group flex flex-col gap-1">
				<div class="flex items-center gap-3">
					<div
						class="h-3 w-3 flex-shrink-0 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
					></div>
					<span class="text-sm font-medium text-slate-200 transition-colors group-hover:text-white"
						>Voluntariado</span
					>
				</div>
				<div class="flex flex-wrap items-baseline gap-2 pl-6">
					<span class="text-2xl font-bold tracking-tight text-white"
						>{formatCompactNumber(estadisticas.voluntariado)}</span
					>
					<span class="text-xs font-medium text-slate-500 uppercase">
						{#if estadisticas.unidadVoluntariado === 'horas'}
							hs
						{:else if estadisticas.unidadVoluntariado === 'dias'}
							días
						{:else}
							veces
						{/if}
					</span>
				</div>
			</div>

			<!-- Item 2: Monetaria -->
			<div class="group flex flex-col gap-1">
				<div class="flex items-center gap-3">
					<div
						class="h-3 w-3 flex-shrink-0 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
					></div>
					<span class="text-sm font-medium text-slate-200 transition-colors group-hover:text-white"
						>Monetaria</span
					>
				</div>
				<div class="flex flex-wrap items-baseline gap-2 pl-6">
					<span class="text-2xl font-bold tracking-tight text-white"
						>{formatCompactCurrency(estadisticas.monetaria)}</span
					>
					<span class="text-xs font-medium text-slate-500 uppercase">ARS</span>
				</div>
			</div>

			<!-- Item 3: En especie -->
			<div class="group flex flex-col gap-1">
				<div class="flex items-center gap-3">
					<div
						class="h-3 w-3 flex-shrink-0 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
					></div>
					<span class="text-sm font-medium text-slate-200 transition-colors group-hover:text-white"
						>En especie</span
					>
				</div>
				<div class="flex flex-wrap items-baseline gap-2 pl-6">
					<span class="text-2xl font-bold tracking-tight text-white"
						>{formatCompactNumber(estadisticas.especie)}</span
					>
					<span class="text-xs font-medium text-slate-500 uppercase">unid.</span>
				</div>
			</div>
		</div>
	</div>
</div>
