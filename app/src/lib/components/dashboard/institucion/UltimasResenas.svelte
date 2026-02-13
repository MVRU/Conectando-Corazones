<!-- TODO: implementar módulo de reseñas -->
<script lang="ts">
	import { Star } from 'lucide-svelte';

	export let resenas: {
		id: string;
		usuario: string;
		avatarUrl?: string;
		calificacion: number;
		comentario: string;
		fecha: string;
	}[] = [];
</script>

<div
	class="h-full rounded-[2rem] border border-amber-500/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
>
	<h2 class="mb-8 text-xl font-semibold tracking-tight text-white">Últimas reseñas</h2>

	<div class="space-y-4">
		{#each resenas as resena}
			<div
				class="rounded-2xl border border-white/5 bg-white/[0.05] p-5 backdrop-blur-md transition-all hover:bg-white/10"
			>
				<div class="mb-3 flex items-start justify-between">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-700 shadow-sm"
						>
							{#if resena.avatarUrl}
								<img
									src={resena.avatarUrl}
									alt={resena.usuario}
									class="h-full w-full object-cover"
								/>
							{:else}
								<span class="text-sm font-bold text-slate-300">{resena.usuario.charAt(0)}</span>
							{/if}
						</div>
						<div>
							<p class="text-sm font-bold text-white">{resena.usuario}</p>
							<div class="mt-0.5 flex text-amber-400">
								{#each Array.from({ length: 5 }) as _, i}
									<Star
										size={12}
										class={i < resena.calificacion ? 'fill-current' : 'fill-none text-slate-600'}
									/>
								{/each}
							</div>
						</div>
					</div>
					<span class="text-[10px] font-medium tracking-wider text-slate-500 uppercase"
						>{new Date(resena.fecha).toLocaleDateString()}</span
					>
				</div>
				<p class="border-l-2 border-white/10 pl-1 text-sm leading-relaxed text-slate-300 italic">
					"{resena.comentario}"
				</p>
			</div>
		{/each}
		{#if resenas.length === 0}
			<p class="py-4 text-center text-sm text-slate-500">No hay reseñas aún.</p>
		{/if}
	</div>
</div>
