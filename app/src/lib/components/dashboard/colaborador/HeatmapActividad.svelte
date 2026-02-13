<script lang="ts">
	import { Flame, Info } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	export let data: { fecha: string; intensidad: number }[] = [];

	const weeksToShow = 26;
	const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

	function getColor(intensity: number) {
		if (intensity === 0) return 'bg-white/5';
		if (intensity === 1) return 'bg-emerald-900/40';
		if (intensity === 2) return 'bg-emerald-700/60';
		if (intensity === 3) return 'bg-emerald-500/80';
		return 'bg-emerald-400';
	}

	function generateGrid() {
		const grid = [];
		const today = new Date();
		for (let w = 0; w < weeksToShow; w++) {
			const week = [];
			for (let d = 0; d < 7; d++) {
				const date = new Date();
				date.setDate(today.getDate() - ((weeksToShow - 1 - w) * 7 + (6 - d)));
				const dateStr = date.toISOString().split('T')[0];

				const found = data.find((d) => d.fecha === dateStr);
				week.push({
					date: dateStr,
					intensity: found ? found.intensidad : 0
				});
			}
			grid.push(week);
		}
		return grid;
	}

	$: grid = generateGrid();
</script>

<div
	use:reveal
	class="reveal-hidden h-full rounded-[2rem] border border-emerald-500/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
>
	<div class="mb-8 flex items-center justify-between gap-2">
		<div class="flex items-center gap-2">
			<h2 class="text-xl font-semibold tracking-tight text-white">Actividad</h2>
			<Flame size={18} class="text-emerald-400" />
		</div>
		<div class="flex items-center gap-1 text-[10px] text-slate-500">
			<span>Menos</span>
			<div class="h-2 w-2 rounded-sm bg-white/5"></div>
			<div class="h-2 w-2 rounded-sm bg-emerald-900/40"></div>
			<div class="h-2 w-2 rounded-sm bg-emerald-500/80"></div>
			<div class="h-2 w-2 rounded-sm bg-emerald-400"></div>
			<span>Más</span>
		</div>
	</div>

	<div class="flex w-full overflow-x-auto pb-2">
		<div class="flex gap-1">
			{#each grid as week}
				<div class="flex flex-col gap-1">
					{#each week as day}
						<div
							title={`${day.date}: ${day.intensity} actividades`}
							class="h-3 w-3 rounded-sm transition-colors hover:border hover:border-white/20 {getColor(
								day.intensity
							)}"
						></div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-4 flex items-center gap-2 rounded-lg bg-white/5 p-3 text-xs text-slate-400">
		<Info size={14} class="text-blue-400" />
		<!-- TODO: implementar historial de cambios -->
		<p>Tu actividad impulsa proyectos. ¡Seguí así!</p>
	</div>
</div>
