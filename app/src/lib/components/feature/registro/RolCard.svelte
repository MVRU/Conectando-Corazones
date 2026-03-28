<script lang="ts">
	import { clsx } from 'clsx';

	export let seleccionado: boolean = false;
	export let icono: 'institucion' | 'colaborador' | 'usuario' = 'usuario';
	export let titulo: string = '';
	export let descripcion: string = '';
	export let onSelect: () => void;
</script>

<div
	role="button"
	tabindex="0"
	aria-pressed={seleccionado}
	onclick={onSelect}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect();
		}
	}}
	class={clsx(
		'group relative flex w-full flex-col items-center overflow-hidden rounded-[2rem] border p-10 transition-all duration-700 hover:-translate-y-2',
		seleccionado
			? 'border-[rgb(var(--color-primary))] bg-blue-50/10 ring-1 ring-[rgb(var(--color-primary))]/30 shadow-2xl shadow-blue-500/10'
			: 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50'
	)}
>
	<!-- Círculo del Icono / Número -->
	<div
		class={clsx(
			'mb-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:rotate-3',
			seleccionado 
				? 'bg-[rgb(var(--color-primary))] text-white shadow-blue-500/30' 
				: 'bg-white border border-slate-100 text-slate-400 group-hover:border-[rgb(var(--color-primary))]/20 group-hover:text-[rgb(var(--color-primary))]'
		)}
	>
		{#if icono === 'institucion'}
			<svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
			</svg>
		{:else}
			<svg class="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
			</svg>
		{/if}
	</div>

	<div class="space-y-4 text-center">
		<h3
			class={clsx(
				'text-2xl font-black tracking-tight transition-colors duration-300',
				seleccionado ? 'text-slate-900' : 'text-slate-800'
			)}
		>
			{titulo}
		</h3>
		<p class="text-base leading-relaxed text-slate-500 line-clamp-3">
			{descripcion}
		</p>
	</div>

	<!-- Indicador de Selección sutil -->
	<div class="mt-10 flex items-center gap-2">
		<span class={clsx(
			'text-xs font-bold uppercase tracking-widest transition-all duration-300',
			seleccionado ? 'text-[rgb(var(--color-primary))] scale-110' : 'text-slate-400 opacity-0 group-hover:opacity-100'
		)}>
			{seleccionado ? 'Seleccionado' : 'Seleccionar'}
		</span>
		<div class={clsx(
			'h-1.5 w-1.5 rounded-full transition-all duration-300',
			seleccionado ? 'bg-[rgb(var(--color-primary))] scale-150' : 'bg-slate-300 group-hover:bg-[rgb(var(--color-primary))]/40'
		)}></div>
	</div>
</div>
