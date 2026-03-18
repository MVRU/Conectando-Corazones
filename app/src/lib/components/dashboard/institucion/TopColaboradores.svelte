<script lang="ts">
	import { Trophy } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	export let colaboradores: {
		id: string;
		nombre: string;
		username: string;
		avatarUrl?: string;
		aportes: number;
		rol: string;
	}[] = [];

	let revealed = false;
</script>

<div
	use:reveal
	on:reveal={() => (revealed = true)}
	class="reveal-hidden h-full rounded-[2rem] border border-emerald-500/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
>
	<div class="mb-8 flex items-center gap-2">
		<h2 class="text-xl font-semibold tracking-tight text-white">Top de colaboradores</h2>
		<Trophy size={18} class="text-amber-400" />
	</div>

	<div class="space-y-3">
		{#each colaboradores as colab, index}
			<div
				class="reveal-hidden group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-white/5 hover:bg-white/5 {revealed
					? 'reveal-visible'
					: ''} delay-{Math.min((index + 1) * 100, 500)}"
			>
				<div class="relative">
					<div
						class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 bg-slate-700 shadow-md {index ===
						0
							? 'border-amber-400 shadow-amber-500/20'
							: 'border-transparent'}"
					>
						{#if colab.avatarUrl}
							<img src={colab.avatarUrl} alt={colab.nombre} class="h-full w-full object-cover" />
						{:else}
							<span class="text-lg font-bold text-slate-300">{colab.nombre.charAt(0)}</span>
						{/if}
					</div>
					{#if index < 3}
						<div
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg ring-2 ring-[#0F1029]
                            {index === 0
								? 'bg-gradient-to-br from-amber-300 to-amber-500'
								: index === 1
									? 'bg-gradient-to-br from-slate-300 to-slate-500'
									: 'bg-gradient-to-br from-amber-600 to-amber-800'}"
						>
							{index + 1}
						</div>
					{/if}
				</div>

				<div class="min-w-0 flex-1">
					<a
						href="/perfil/{colab.username}"
						class="group-hover:text-primary block truncate text-base font-medium text-white transition-colors hover:underline"
					>
						{colab.nombre}
					</a>
					<p class="truncate text-xs font-medium tracking-wide text-slate-500 uppercase">
						{colab.rol}
					</p>
				</div>

				<div class="text-right">
					<span class="text-primary block text-lg font-bold">{colab.aportes}</span>
					<span class="text-[10px] font-bold text-slate-500 uppercase">aportes</span>
				</div>
			</div>
		{/each}
	</div>
</div>
