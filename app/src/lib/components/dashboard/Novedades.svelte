<script lang="ts">
	import { Bell, Newspaper, ArrowUpRight } from 'lucide-svelte';

	export let novedades: {
		id: string;
		titulo: string;
		fecha: string;
		contenido: string;
		imagen?: string;
	}[] = [];
</script>

<div
	class="relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-sm sm:p-8"
>
	<div
		class="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-rose-500/10 blur-[80px]"
	></div>

	<div class="relative z-10 w-full">
		<!-- Header -->
		<div class="mb-5 flex items-center justify-between sm:mb-6">
			<div class="flex items-center gap-3">
				<div class="relative flex items-center justify-center">
					<div
						class="absolute h-8 w-8 animate-pulse rounded-full bg-violet-500/20 blur-lg filter"
					></div>
					<Bell size={18} class="text-rose-400" />
				</div>
				<div>
					<h2 class="text-lg font-semibold tracking-tight text-white sm:text-xl">Novedades</h2>
					<p
						class="text-[9px] font-medium tracking-wider text-rose-400/80 uppercase sm:text-[10px]"
					>
						Lo último en Conectando Corazones
					</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3 sm:gap-4">
			{#each novedades as novedad}
				<div
					class="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg outline-1 outline-white/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:outline-white/20 sm:aspect-[2.5/1]"
				>
					{#if novedad.imagen}
						<img
							src={novedad.imagen}
							alt={novedad.titulo}
							class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
						/>
					{:else}
						<div class="absolute inset-0 flex items-center justify-center bg-slate-800">
							<Newspaper size={40} class="text-slate-700" />
						</div>
					{/if}

					<div
						class="absolute inset-0 bg-gradient-to-t from-[#0F1029] via-[#0F1029]/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"
					></div>

					<div class="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
						<div
							class="group-hover:blur-0 absolute top-3 right-3 translate-x-2 rounded-full bg-white/10 p-1.5 text-white opacity-0 blur-sm backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:top-4 sm:right-4 sm:p-2"
						>
							<ArrowUpRight size={16} class="sm:h-[18px] sm:w-[18px]" />
						</div>

						<div class="transform transition-transform duration-300 group-hover:-translate-y-1">
							<span
								class="mb-2 inline-flex items-center rounded-lg bg-rose-500/90 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase shadow-lg shadow-rose-900/20 backdrop-blur-md sm:mb-3 sm:px-2.5 sm:py-1 sm:text-[10px]"
							>
								{new Date(novedad.fecha).toLocaleDateString('es-AR', {
									day: '2-digit',
									month: 'short'
								})}
							</span>

							<h3
								class="mb-1 text-base leading-tight font-bold text-white drop-shadow-sm sm:mb-2 sm:text-lg"
							>
								{novedad.titulo}
							</h3>

							<p
								class="line-clamp-2 text-xs leading-relaxed text-slate-300 opacity-90 group-hover:opacity-100 sm:text-sm"
							>
								{novedad.contenido}
							</p>
						</div>
					</div>
				</div>
			{/each}

			{#if novedades.length === 0}
				<div class="flex flex-col items-center justify-center py-10 text-slate-500">
					<Newspaper size={32} class="mb-3 opacity-20" />
					<p class="text-sm">No hay novedades recientes.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
