<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	export let objetivos: {
		id: string;
		nombre: string;
		fechaFin: string;
		objetivos: {
			id: string;
			descripcion: string;
			tipo: 'monetaria' | 'voluntariado' | 'especie';
			progreso: number;
			actual: number;
			meta: number;
			unidad: string;
		}[];
	}[] = [];

	let revealed = false;

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

	// Formateador moneda
	const formatMoney = (val: number) => {
		return '$' + formatCompactNumber(val);
	};
</script>

<div
	use:reveal
	on:reveal={() => (revealed = true)}
	class="reveal-hidden h-full rounded-[2rem] border border-emerald-500/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
>
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-xl font-semibold tracking-tight text-white">Seguimiento de objetivos</h2>
		<a
			href="/proyectos?tab=mis-proyectos"
			class="group text-primary flex items-center gap-1 text-sm font-medium transition-all hover:text-white"
		>
			Ver todo <ChevronRight size={16} class="transition-transform group-hover:translate-x-1" />
		</a>
	</div>

	<div class="space-y-8">
		{#each objetivos as proyecto}
			<div class="border-b border-white/5 pb-6 last:border-0 last:pb-0">
				<!-- Encabezado del Proyecto -->
				<div class="mb-4 flex items-center justify-between">
					<h4 class="text-base font-medium text-white">
						{proyecto.nombre}
					</h4>
					<span class="text-xs font-medium tracking-wide text-slate-500 uppercase"
						>Cierre: {new Date(proyecto.fechaFin).toLocaleDateString()}</span
					>
				</div>

				<!-- Lista de Objetivos -->
				<div class="space-y-5">
					{#each proyecto.objetivos as obj}
						<div>
							<div class="mb-2 flex items-end justify-between text-sm">
								<span class="text-slate-400">{obj.descripcion}</span>
								<div class="text-right">
									<span class="mr-2 font-bold text-white">{obj.progreso}%</span>
									<span class="text-xs text-slate-500">
										{#if obj.tipo === 'monetaria'}
											{formatMoney(obj.actual)} / {formatMoney(obj.meta)} {obj.unidad}
										{:else}
											{formatCompactNumber(obj.actual)} / {formatCompactNumber(obj.meta)}
											{obj.unidad}
										{/if}
									</span>
								</div>
							</div>
							<!-- Barra de Progreso -->
							<div class="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
								<div
									class="absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out
                                    {obj.tipo === 'monetaria'
										? 'bg-emerald-500'
										: obj.tipo === 'voluntariado'
											? 'bg-blue-500'
											: 'bg-amber-500'}"
									style="width: {revealed ? obj.progreso : 0}%"
								>
									<div
										class="animate-progress-shine absolute top-0 right-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
									></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	@keyframes progress-shine {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	.animate-progress-shine {
		animation: progress-shine 2s infinite linear;
	}
</style>
