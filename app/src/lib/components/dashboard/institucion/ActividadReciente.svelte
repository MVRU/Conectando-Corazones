<script lang="ts">
	import { History, Share2, PlusCircle, Settings } from 'lucide-svelte';

	export let actividad: {
		id: string;
		titulo: string;
		descripcion: string;
		fecha: string;
		tipo: 'proyecto' | 'colaboracion' | 'evidencia';
	}[] = [];

	const TIPO_LABELS = {
		proyecto: 'Proyecto',
		colaboracion: 'Colaboración',
		evidencia: 'Evidencia'
	};

	function getIcon(tipo: string) {
		switch (tipo) {
			case 'proyecto':
				return PlusCircle;
			case 'colaboracion':
				return Share2;
			default:
				return Settings;
		}
	}

	function getColor(tipo: string) {
		switch (tipo) {
			case 'proyecto':
				return 'text-emerald-400 bg-emerald-400/10';
			case 'colaboracion':
				return 'text-blue-400 bg-blue-400/10';
			default:
				return 'text-slate-400 bg-slate-400/10';
		}
	}
</script>

<div
	class="h-full rounded-[2rem] border border-blue-500/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
>
	<div class="mb-6 flex items-center gap-2">
		<h2 class="text-xl font-semibold tracking-tight text-white">Actividades recientes</h2>
		<!-- TODO: implementar módulo de historial de cambios -->
		<History size={18} class="text-slate-400" />
	</div>

	<div class="relative ml-3 space-y-8 border-l border-white/10 pt-2 pl-8">
		{#each actividad as item}
			<div class="relative">
				<!-- Dot on timeline -->
				<div
					class="absolute top-1.5 -left-[37px] h-3 w-3 rounded-full border-2 border-[#0F1029] bg-slate-400 ring-2 ring-white/10"
				></div>

				<div class="flex flex-col gap-1">
					<div class="flex items-center gap-2">
						<span class="text-xs font-semibold tracking-wider text-slate-500 uppercase"
							>{item.fecha}</span
						>
						<span class="h-1 w-1 rounded-full bg-slate-600"></span>
						<span class="text-xs font-medium tracking-wider text-slate-500 uppercase"
							>{TIPO_LABELS[item.tipo]}</span
						>
					</div>
					<h4 class="text-base font-medium text-white">{item.titulo}</h4>
					<p class="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-400">
						{item.descripcion}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
