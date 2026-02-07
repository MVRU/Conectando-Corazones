<script lang="ts">
	import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-svelte';

	export let proyectos: {
		id: string;
		titulo: string;
		institucion: string;
		categoria: string;
		imagen?: string;
		coincidencia: number;
		ubicacion: string;
	}[] = [];
</script>

<div
	class="relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm"
>
	<div
		class="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-50"
	></div>
	<div
		class="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px]"
	></div>

	<div class="relative z-10 flex h-full flex-col">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="relative flex items-center justify-center">
					<div
						class="absolute h-8 w-8 animate-pulse rounded-full bg-violet-500/20 blur-lg filter"
					></div>
					<Sparkles size={18} class="text-cyan-400" />
				</div>
				<div>
					<h2 class="text-xl font-semibold tracking-tight text-white">Proyectos para vos</h2>
					<p class="text-[10px] font-medium tracking-wider text-cyan-400/80 uppercase">
						Sugerencias basadas en tus intereses
					</p>
				</div>
			</div>
			<div class="rounded-full bg-white/5 p-2 text-slate-400 transition-colors hover:text-white">
				<HeartHandshake size={18} />
			</div>
		</div>

		<!-- Cards Container -->
		<div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
			{#each proyectos as proyecto}
				<a
					href="/proyectos/{proyecto.id}"
					class="group relative block overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-2 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-900/20"
				>
					<div class="flex gap-4 p-2">
						<!-- Image -->
						<div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800">
							{#if proyecto.imagen}
								<img
									src={proyecto.imagen}
									alt={proyecto.titulo}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							{:else}
								<div class="flex h-full items-center justify-center text-slate-600">
									<HeartHandshake size={24} />
								</div>
							{/if}
						</div>

						<div class="flex min-w-0 flex-1 flex-col justify-center">
							<!-- Match Badge -->
							<div class="mb-1 flex items-center justify-between">
								<span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase"
									>{proyecto.categoria}</span
								>
								<span
									class="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400"
								>
									{proyecto.coincidencia}% Match
								</span>
							</div>

							<h4
								class="truncate font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-300"
							>
								{proyecto.titulo}
							</h4>
							<p class="truncate text-xs text-slate-400">{proyecto.institucion}</p>

							<div class="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
								<span class="truncate">{proyecto.ubicacion}</span>
							</div>
						</div>

						<!-- Action Hint -->
						<div
							class="flex items-center self-center px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<ArrowRight size={16} class="text-cyan-400" />
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for Webkit browsers */
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.02);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(34, 211, 238, 0.2); /* Cyan-400/20 */
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(34, 211, 238, 0.4);
	}
</style>
