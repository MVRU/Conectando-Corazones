<script lang="ts">
	import { Sparkles, BrainCircuit, Lightbulb, ArrowRight, BookOpen } from 'lucide-svelte';
	import { slide, fade } from 'svelte/transition';

	export let aspectos: {
		id: string;
		proyecto: string;
		sugerencias: string[];
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
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="relative flex items-center justify-center">
					<div
						class="absolute h-8 w-8 animate-pulse rounded-full bg-violet-500/20 blur-lg filter"
					></div>
					<Sparkles size={18} class="text-cyan-400" />
				</div>
				<div>
					<h2 class="text-xl font-semibold tracking-tight text-white">Aspectos a mejorar</h2>
					<p class="text-[10px] font-medium tracking-wider text-cyan-400/80 uppercase">
						Sugerencias generadas con Inteligencia Artificial
					</p>
				</div>
			</div>
			<div class="rounded-full bg-white/5 p-2 text-slate-400 transition-colors hover:text-white">
				<BrainCircuit size={18} />
			</div>
		</div>

		{#if aspectos.length === 0}
			<div
				class="flex flex-1 flex-col items-center justify-center"
				in:fade={{ duration: 400, delay: 100 }}
			>
				<div class="relative mb-6">
					<div
						class="absolute inset-0 animate-pulse rounded-full bg-violet-500/20 blur-2xl filter"
					></div>
					<div
						class="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 backdrop-blur-sm"
					>
						<BookOpen size={32} class="text-violet-400" />
					</div>
				</div>

				<h3 class="mb-2 text-lg font-semibold text-white">Aún no hay aprendizajes registrados</h3>
				<p class="max-w-md text-center text-sm text-slate-400">
					Los aprendizajes de proyectos completados aparecerán aquí para ayudarte a mejorar tus
					futuras iniciativas
				</p>

				<div class="mt-6 flex items-center gap-2 text-xs text-slate-500">
					<div class="h-1 w-1 rounded-full bg-violet-500/50"></div>
					<span>Completa proyectos y registra tus aprendizajes</span>
					<div class="h-1 w-1 rounded-full bg-violet-500/50"></div>
				</div>
			</div>
		{:else}
			<div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
				{#each aspectos as aspecto}
					<div
						class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-900/20"
					>
						<div
							class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-[40px] transition-opacity duration-300 group-hover:opacity-70"
						></div>

						<div class="relative z-10 mb-4 flex items-center justify-between">
							<h4
								class="font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-300"
							>
								{aspecto.proyecto}
							</h4>
							<div
								class="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-400"
							>
								<Lightbulb size={12} />
							</div>
						</div>

						<ul class="relative z-10 space-y-3">
							{#each aspecto.sugerencias as sugerencia}
								<li
									class="flex items-start gap-3 text-sm text-slate-400 transition-colors group-hover:text-slate-300"
								>
									<span class="mt-1.5 flex h-1.5 w-1.5 items-center justify-center">
										<span
											class="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-colors group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]"
										></span>
									</span>
									<span class="leading-relaxed">{sugerencia}</span>
								</li>
							{/each}
						</ul>

						<div
							class="mt-4 flex translate-x-2 transform justify-end opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
						>
							<ArrowRight size={14} class="text-cyan-400/70" />
						</div>
					</div>
				{/each}
			</div>
		{/if}
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
		background: rgba(139, 92, 246, 0.2);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(139, 92, 246, 0.4);
	}
</style>
