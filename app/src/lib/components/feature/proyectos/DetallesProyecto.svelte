<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import { Users, Tag, CalendarDays, Clock } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let proyecto: Proyecto;
	export let formatearFecha: (fecha: Date | string | undefined | null) => string;

	const nf = new Intl.NumberFormat('es-AR');

	function normalizarBeneficiarios(valor: unknown): number {
		if (valor == null) return 0;
		if (typeof valor === 'number')
			return Number.isFinite(valor) ? Math.max(0, Math.floor(valor)) : 0;
		if (typeof valor === 'string') {
			const limpio = valor.trim().replace(/\./g, '').replace(/,/g, '.');
			const parsed = Number(limpio);
			return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
		}
		return 0;
	}

	function obtenerCategorias(lista?: Proyecto['categorias']): string[] {
		if (!lista || !lista.length) return [];
		return lista.map((c) => c?.descripcion).filter((x): x is string => Boolean(x?.trim()));
	}

	let beneficiarios = 0;
	$: beneficiarios = normalizarBeneficiarios(proyecto?.beneficiarios);

	let textoBeneficiarios = '';
	$: textoBeneficiarios =
		beneficiarios > 0
			? `${nf.format(beneficiarios)} persona${beneficiarios === 1 ? '' : 's'} alcanzada${beneficiarios === 1 ? '' : 's'}`
			: '';

	const categorias = obtenerCategorias(proyecto?.categorias);

	const claseCard =
		'animate-fade-up rounded-xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-transparent transition-all hover:shadow-md hover:ring-gray-100 min-h-[96px] sm:p-5';
	const claseHeader = 'mb-2 flex items-center gap-3';
	const claseIcono =
		'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100';
	const claseTitulo = 'text-sm font-medium leading-5 text-gray-900';
	const claseValor = 'text-[13px] leading-5 text-gray-700';
</script>

<section class="animate-fade-up mb-6" aria-labelledby="desc-proyecto">
	<h2 id="desc-proyecto" class="mb-1 text-2xl font-semibold text-gray-900 sm:text-xl">
		Descripción del proyecto
	</h2>
	<p class="text-sm leading-relaxed text-gray-700 sm:text-base">
		{proyecto.descripcion}
	</p>
</section>

<div class="grid gap-5 md:grid-cols-2">
	<!-- Personas alcanzadas -->
	<div
		class={claseCard}
		style="animation-delay:80ms"
		role="group"
		aria-labelledby="card-personas-titulo"
	>
		<div class={claseHeader}>
			<span class={claseIcono} aria-hidden="true">
				<Icon src={Users} class="h-5 w-5 text-sky-600" aria-hidden="true" />
			</span>
			<h4 id="card-personas-titulo" class={claseTitulo}>Personas alcanzadas</h4>
		</div>

		{#if beneficiarios > 0}
			<p class={claseValor} aria-live="polite">{textoBeneficiarios}</p>
			<p class="text-xs text-gray-500">Valor informado por la institución</p>
		{:else}
			<p class={claseValor}>Detrás de este proyecto, hay muchos corazones por iluminar.</p>
			<p class="text-xs text-gray-500">La institución no especificó una cantidad</p>
		{/if}
	</div>

	<!-- Categorías -->
	<div
		class={claseCard}
		style="animation-delay:140ms"
		role="group"
		aria-labelledby="card-categorias-titulo"
	>
		<div class={claseHeader}>
			<span class={claseIcono} aria-hidden="true">
				<Icon src={Tag} class="h-5 w-5 text-sky-600" aria-hidden="true" />
			</span>
			<h4 id="card-categorias-titulo" class={claseTitulo}>Categorías</h4>
		</div>

		{#if categorias.length}
			<div class="mt-1 flex flex-wrap gap-2" aria-label="Lista de categorías">
				{#each categorias as categoria}
					<a
						href="/proyectos?tab=todos&categoria={encodeURIComponent(categoria)}"
						class="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
					>
						{categoria}
					</a>
				{/each}
			</div>
		{:else}
			<p class={claseValor}>Sin especificar</p>
		{/if}
	</div>

	<!-- Fecha de inicio -->
	<div
		class={claseCard}
		style="animation-delay:320ms"
		role="group"
		aria-labelledby="card-inicio-titulo"
	>
		<div class={claseHeader}>
			<span class={claseIcono} aria-hidden="true">
				<Icon src={CalendarDays} class="h-5 w-5 text-sky-600" aria-hidden="true" />
			</span>
			<h4 id="card-inicio-titulo" class={claseTitulo}>Fecha de inicio</h4>
		</div>

		<p class={claseValor} aria-label="Fecha de inicio">
			{formatearFecha(proyecto?.created_at ?? undefined) || '—'}
		</p>
	</div>

	<!-- Fecha de cierre tentativa -->
	<div
		class={claseCard}
		style="animation-delay:380ms"
		role="group"
		aria-labelledby="card-cierre-titulo"
	>
		<div class={claseHeader}>
			<span class={claseIcono} aria-hidden="true">
				<Icon src={Clock} class="h-5 w-5 text-sky-600" aria-hidden="true" />
			</span>
			<h4 id="card-cierre-titulo" class={claseTitulo}>Fecha de cierre tentativa</h4>
		</div>

		<p class={claseValor} aria-label="Fecha de cierre tentativa">
			{formatearFecha(proyecto?.fecha_fin_tentativa ?? undefined) || '—'}
		</p>
	</div>
</div>

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-up {
		animation: fade-up 0.4s ease-out both;
	}
</style>
