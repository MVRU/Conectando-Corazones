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
	class="relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-sm sm:p-8"
>
	<div
		class="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-50"
	></div>
	<div
		class="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px]"
	></div>

	<div class="relative z-10 flex h-full flex-col">
		<!-- Header -->
		<div class="mb-5 flex items-center justify-between sm:mb-6">
			<div class="flex items-center gap-3">
				<div class="relative flex items-center justify-center">
					<div
						class="absolute h-8 w-8 animate-pulse rounded-full bg-violet-500/20 blur-lg filter"
					></div>
					<Sparkles size={18} class="text-cyan-400" />
				</div>
				<div>
					<h2 class="text-lg font-semibold tracking-tight text-white sm:text-xl">
						Proyectos para vos
					</h2>
					<p
						class="text-[9px] font-medium tracking-wider text-cyan-400/80 uppercase sm:text-[10px]"
					>
						Sugerencias basadas en tus intereses
					</p>
				</div>
			</div>
			<div
				class="hidden rounded-full bg-white/5 p-2 text-slate-400 transition-colors hover:text-white sm:block"
			>
				<HeartHandshake size={18} />
			</div>
		</div>

		<div class="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1 sm:space-y-4 sm:pr-2">
			{#each proyectos as proyecto}
				<a
					href="/proyectos/{proyecto.id}"
					class="group relative block overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-1.5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-900/20 sm:p-2"
				>
					<div class="flex gap-3 p-1.5 sm:gap-4 sm:p-2">
						<div
							class="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-20 sm:w-20"
						>
							{#if proyecto.imagen}
								<img
									src={proyecto.imagen}
									alt={proyecto.titulo}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							{:else}
								<div class="flex h-full items-center justify-center text-slate-600">
									<HeartHandshake size={20} class="sm:hidden" />
									<HeartHandshake size={24} class="hidden sm:block" />
								</div>
							{/if}
						</div>

						<div class="flex min-w-0 flex-1 flex-col justify-center">
							<div class="mb-1 flex items-start justify-between gap-2">
								<span
									class="truncate text-[9px] font-bold tracking-wider text-slate-500 uppercase sm:text-[10px]"
								>
									{proyecto.categoria}
								</span>

								<div class="absolute top-2 right-2 z-20 sm:top-3 sm:right-3">
									<div
										class="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:border-cyan-400 group-hover:bg-cyan-900/50 sm:px-3 sm:py-1"
									>
										<div class="relative flex h-1.5 w-1.5">
											<span
												class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"
											></span>
											<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400"
											></span>
										</div>
										<span
											class="truncate text-[9px] font-bold tracking-tight text-cyan-50 shadow-inner sm:text-[10px]"
										>
											{proyecto.coincidencia}% <span class="hidden sm:inline">de afinidad</span>
										</span>
									</div>
								</div>
							</div>

							<h4
								class="truncate pr-14 text-sm font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-300 sm:pr-24 sm:text-base"
							>
								{proyecto.titulo}
							</h4>
							<p class="truncate text-[10px] text-slate-400 sm:text-xs">{proyecto.institucion}</p>

							<div
								class="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500 sm:text-[10px]"
							>
								<span class="truncate">{proyecto.ubicacion}</span>
							</div>
						</div>

						<div
							class="hidden items-center self-center px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex"
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
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.02);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(34, 211, 238, 0.2);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(34, 211, 238, 0.4);
	}
</style>
