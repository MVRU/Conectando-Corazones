<script lang="ts">
	import { Sparkles, ArrowUpRight } from 'lucide-svelte';

	export let aspectos: {
		id: string;
		proyecto: string;
		sugerencias: string[];
	}[] = [];
</script>

<div
	class="relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm"
>
	<!-- Decorative background -->
	<div
		class="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]"
	></div>

	<div class="relative z-10">
		<div class="mb-6 flex items-center gap-2">
			<h2 class="text-xl font-semibold tracking-tight text-white">Sugerencias de la IA</h2>
			<Sparkles size={16} class="animate-pulse text-blue-400" />
		</div>

		<div class="space-y-4">
			{#each aspectos as aspecto}
				<div
					class="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10"
				>
					<div class="mb-3 flex items-center justify-between">
						<h4 class="font-medium text-white">{aspecto.proyecto}</h4>
					</div>
					<ul class="space-y-2">
						{#each aspecto.sugerencias as sugerencia}
							<li class="flex items-start gap-2 text-sm text-slate-400">
								<span class="mt-1.5 h-1 w-1 min-w-[4px] rounded-full bg-blue-400/50"></span>
								<span>{sugerencia}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</div>
