<script lang="ts">
	import { Target } from 'lucide-svelte';

	let { participacion_permitida = [] } = $props<{ 
		participacion_permitida?: any[] 
	}>();

	function formatoNumero(valor: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(valor);
	}
</script>

<section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden sticky top-6">
	<div class="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
		<div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
			<Target size={20} />
		</div>
		<h3 class="text-sm font-bold uppercase tracking-wider text-slate-500">
			Objetivos del proyecto
		</h3>
	</div>

	<div class="space-y-6">
		{#each participacion_permitida as meta}
			{@const actual = meta.actual || 0}
			{@const objetivo = meta.objetivo || 1}
			{@const porcentaje = Math.min(Math.round((actual / objetivo) * 100), 100)}
			
			<div class="group">
				<div class="flex justify-between items-start mb-2">
					<h4 class="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
						{meta.tipo_participacion?.descripcion}
						{#if meta.especie}
							<span class="text-slate-500 font-medium block text-xs mt-0.5">{meta.especie}</span>
						{/if}
					</h4>
					<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 uppercase tracking-wider border border-slate-100">
						{meta.unidad_medida}
					</span>
				</div>
				
				<div class="flex items-end gap-1.5 mb-2">
					<span class="text-xl font-black text-slate-900 leading-none">{formatoNumero(actual)}</span>
					<span class="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wider">/ {formatoNumero(objetivo)}</span>
				</div>

				<div class="relative pt-1">
					<div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-80">
						<span>Progreso</span>
						<span>{porcentaje}%</span>
					</div>
					<div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
						<div 
							class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
							style="width: {porcentaje}%;"
							class:bg-blue-500={porcentaje < 100}
							class:bg-emerald-500={porcentaje === 100}
						>
							{#if porcentaje < 100}
								<div class="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
