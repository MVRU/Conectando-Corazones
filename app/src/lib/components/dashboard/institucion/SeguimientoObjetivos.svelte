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
			especie?: string;
		}[];
	}[] = [];

	let revealed = false;

	function obtenerColorProgreso(progreso: number): string {
		if (progreso >= 75) return 'bg-emerald-500';
		if (progreso >= 50) return 'bg-yellow-500';
		if (progreso >= 25) return 'bg-orange-500';
		return 'bg-red-500';
	}

	function obtenerSombraProgreso(progreso: number): string {
		if (progreso >= 75) return 'shadow-[0_0_10px_rgba(16,185,129,0.4)]';
		if (progreso >= 50) return 'shadow-[0_0_10px_rgba(234,179,8,0.4)]';
		if (progreso >= 25) return 'shadow-[0_0_10px_rgba(249,115,22,0.4)]';
		return 'shadow-[0_0_10px_rgba(239,68,68,0.4)]';
	}

	function obtenerEtiquetaObjetivo(obj: {
		tipo: 'monetaria' | 'voluntariado' | 'especie';
		descripcion: string;
		especie?: string;
		unidad: string;
	}): string {
		if (obj.tipo === 'especie' && obj.especie) {
			return `${obj.especie}`;
		}
		return obj.descripcion;
	}

	function obtenerUnidadDisplay(obj: {
		tipo: 'monetaria' | 'voluntariado' | 'especie';
		unidad: string;
		especie?: string;
	}): string {
		if (obj.tipo === 'especie' && obj.unidad) {
			return obj.unidad;
		}
		return obj.unidad;
	}
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
				<div class="mb-4 flex items-center justify-between">
					<a
						href="/proyectos/{proyecto.id}"
						class="text-base font-medium text-white transition-colors hover:text-emerald-400 hover:underline"
					>
						{proyecto.nombre}
					</a>
					<span class="text-xs font-medium tracking-wide text-slate-500 uppercase"
						>Cierre: {new Date(proyecto.fechaFin).toLocaleDateString()}</span
					>
				</div>

				<div class="space-y-5">
					{#each proyecto.objetivos as obj}
						<div>
							<div class="mb-2 flex items-end justify-between text-sm">
								<span class="text-slate-400">{obtenerEtiquetaObjetivo(obj)}</span>
								<div class="text-right">
									<span class="mr-2 font-bold text-white">{obj.progreso}%</span>
									<span class="text-xs text-slate-500"
										>{obj.actual} / {obj.meta}
										{obtenerUnidadDisplay(obj)}</span
									>
								</div>
							</div>
							<div class="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
								<div
									class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out {obtenerColorProgreso(
										obj.progreso
									)} {obtenerSombraProgreso(obj.progreso)}"
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
