<script lang="ts">
	import { onMount } from 'svelte';
	import { clsx } from 'clsx';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { Check } from 'lucide-svelte';

	interface Props {
		categorias?: { id_categoria: number; descripcion: string }[];
		tiposParticipacion?: { id_tipo_participacion: number; descripcion: string }[];
		procesando?: boolean;
		onsubmit: (data: { categorias: number[]; tiposParticipacion: number[] }) => void;
		onskip?: () => void;
	}

	let {
		categorias = [],
		tiposParticipacion = [],
		procesando = false,
		onsubmit,
		onskip
	}: Props = $props();

	let categoriasSeleccionadas: number[] = $state([]);
	let tiposSeleccionados: number[] = $state([]);
	let animarEntrada = $state(false);

	onMount(() => {
		setTimeout(() => (animarEntrada = true), 100);
	});

	function toggleCategoria(id: number) {
		if (categoriasSeleccionadas.includes(id)) {
			categoriasSeleccionadas = categoriasSeleccionadas.filter((c) => c !== id);
		} else {
			categoriasSeleccionadas = [...categoriasSeleccionadas, id];
		}
	}

	function toggleTipo(id: number) {
		if (tiposSeleccionados.includes(id)) {
			tiposSeleccionados = tiposSeleccionados.filter((t) => t !== id);
		} else {
			tiposSeleccionados = [...tiposSeleccionados, id];
		}
	}

	function finalizar() {
		onsubmit({
			categorias: categoriasSeleccionadas,
			tiposParticipacion: tiposSeleccionados
		});
	}

	function omitir() {
		onskip?.();
	}
</script>

<div
	class={clsx(
		'mx-auto w-full max-w-4xl transition-all duration-700 ease-out',
		animarEntrada ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
	)}
>
	<div class="space-y-8 rounded-3xl bg-white p-6 shadow-sm border border-slate-100 md:p-10">
		<section class="space-y-6">
			<header>
				<h3 class="text-lg font-semibold text-slate-800">Causas que te mueven</h3>
				<p class="text-xs text-slate-500">Seleccioná una o más categorías de interés.</p>
			</header>
			<div class="flex flex-wrap gap-3">
				{#each categorias as categoria (categoria.id_categoria)}
					<button
						type="button"
						onclick={() => toggleCategoria(categoria.id_categoria)}
						class={clsx(
							'group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))]',
							categoriasSeleccionadas.includes(categoria.id_categoria)
								? 'border-[rgb(var(--color-primary))] bg-[rgba(var(--color-primary),0.08)] text-[rgb(var(--color-primary))] ring-1 ring-[rgb(var(--color-primary))]'
								: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
						)}
						aria-pressed={categoriasSeleccionadas.includes(categoria.id_categoria)}
					>
						{categoria.descripcion}
						{#if categoriasSeleccionadas.includes(categoria.id_categoria)}
							<Check class="h-4 w-4" />
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<hr class="border-slate-100" />

		<section class="space-y-6">
			<header>
				<h3 class="text-lg font-semibold text-slate-800 text-left">¿Cómo te gustaría ayudar?</h3>
				<p class="text-xs text-slate-500 text-left">Indicanos tus preferencias de participación.</p>
			</header>
			<div class="flex flex-wrap gap-3">
				{#each tiposParticipacion as tipo (tipo.id_tipo_participacion)}
					<button
						type="button"
						onclick={() => toggleTipo(tipo.id_tipo_participacion)}
						class={clsx(
							'group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))]',
							tiposSeleccionados.includes(tipo.id_tipo_participacion)
								? 'border-[rgb(var(--color-primary))] bg-[rgba(var(--color-primary),0.08)] text-[rgb(var(--color-primary))] ring-1 ring-[rgb(var(--color-primary))]'
								: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
						)}
						aria-pressed={tiposSeleccionados.includes(tipo.id_tipo_participacion)}
					>
						{tipo.descripcion}
						{#if tiposSeleccionados.includes(tipo.id_tipo_participacion)}
							<Check class="h-4 w-4" />
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<div class="mt-8 flex flex-col-reverse items-center gap-4 pt-4 sm:flex-row sm:justify-end">
			<Button
				variant="ghost"
				label="Omitir por ahora"
				onclick={omitir}
				disabled={procesando}
				customClass="text-slate-500 hover:text-slate-800"
			/>
			<Button
				variant="primary"
				label={procesando ? 'Guardando...' : 'Finalizar registro'}
				onclick={finalizar}
				disabled={procesando}
				customClass="w-full sm:w-auto min-w-[120px]"
			/>
		</div>
	</div>
</div>
