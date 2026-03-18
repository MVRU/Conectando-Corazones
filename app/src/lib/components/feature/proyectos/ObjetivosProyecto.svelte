<script lang="ts">
	import { Target } from 'lucide-svelte';

	let { participacion_permitida = [] } = $props<{
		participacion_permitida?: any[];
	}>();

	function formatoNumero(valor: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'decimal',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(valor);
	}
</script>

<section
	class="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
>
	<div class="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
		<div class="rounded-lg bg-indigo-50 p-2 text-indigo-600">
			<Target size={20} />
		</div>
		<h3 class="text-sm font-bold tracking-wider text-slate-500 uppercase">
			Objetivos del proyecto
		</h3>
	</div>

	<div class="space-y-6">
		{#each participacion_permitida as meta}
			{@const actual = meta.actual || 0}
			{@const objetivo = meta.objetivo || 1}
			{@const porcentaje = Math.min(Math.round((actual / objetivo) * 100), 100)}

			<div class="group">
				<div class="mb-2 flex items-start justify-between">
					<h4
						class="text-sm leading-tight font-bold text-slate-800 transition-colors group-hover:text-indigo-600"
					>
						{meta.tipo_participacion?.descripcion}
						{#if meta.especie}
							<span class="mt-0.5 block text-xs font-medium text-slate-500">{meta.especie}</span>
						{/if}
					</h4>
					<span
						class="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase"
					>
						{meta.unidad_medida}
					</span>
				</div>

				<div class="mb-2 flex items-end gap-1.5">
					<span class="text-xl leading-none font-black text-slate-900">{formatoNumero(actual)}</span
					>
					<span class="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase"
						>/ {formatoNumero(objetivo)}</span
					>
				</div>

				<div class="relative pt-1">
					<div
						class="mb-1.5 flex justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase opacity-80"
					>
						<span>Progreso</span>
						<span>{porcentaje}%</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							class="relative h-full overflow-hidden rounded-full transition-all duration-1000 ease-out"
							style="width: {porcentaje}%;"
							class:bg-blue-500={porcentaje < 100}
							class:bg-emerald-500={porcentaje === 100}
						>
							{#if porcentaje < 100}
								<div class="absolute inset-0 animate-[shimmer_2s_infinite] bg-white/20"></div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
