<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { fade, slide } from 'svelte/transition';

	let {
		show = $bindable(),
		progresoCantidad,
		progresoTiempo,
		progresoTotal
	} = $props<{
		show: boolean;
		progresoCantidad: number;
		progresoTiempo: number;
		progresoTotal: number;
	}>();

	let step = $state(0);
	const steps = 4;

	function close() {
		show = false;
		step = 0;
	}
</script>

{#if show}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
		onclick={close}
		onkeydown={(e) => e.key === 'Escape' && close()}
		aria-hidden="true"
		transition:fade={{ duration: 200 }}
	></div>

	<!-- Modal wrapper -->
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-md scale-100 rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') close();
			}}
			transition:slide={{ duration: 300 }}
		>
			<!-- Encabezado -->
			<div class="flex items-center justify-between border-b border-gray-100 px-5 pt-5 pb-4">
				<h2 id="modal-title" class="text-base leading-tight font-semibold text-gray-800">
					{step === 0
						? 'Cálculo del progreso'
						: step === 1
							? 'Objetivos cumplidos'
							: step === 2
								? 'Tiempo transcurrido'
								: 'Progreso total'}
				</h2>
				<button
					type="button"
					class="rounded-full p-1 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
					onclick={close}
					aria-label="Cerrar modal"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Contenido -->
			<div class="space-y-4 px-5 pt-4 pb-5 text-sm text-gray-700">
				{#if step === 0}
					<p class="text-gray-800">El progreso combina dos métricas:</p>
					<ul class="space-y-2 text-sm">
						<li class="flex items-start gap-3">
							<div class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-500"></div>
							<span><strong>Objetivos cumplidos:</strong> progreso real de los resultados.</span>
						</li>
						<li class="flex items-start gap-3">
							<div class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>
							<span><strong>Tiempo transcurrido:</strong> avance cronológico del proyecto.</span>
						</li>
					</ul>
					<p class="mt-2 text-xs text-gray-500">
						Toque "Siguiente" para ver cómo se calcula cada parte.
					</p>
				{:else if step === 1}
					<p>
						Se calcula el porcentaje total alcanzado sobre el total necesario, sumando todas las
						cantidades recaudadas y dividiéndolas por la suma de los objetivos.
					</p>
					<div
						class="rounded-lg border border-sky-100 bg-sky-50 p-3 font-mono text-xs leading-snug text-sky-900"
					>
						<div class="mb-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-sky-400"></div>
							<span class="font-medium text-sky-700">Fórmula:</span>
						</div>
						<span>progreso = (recaudado_i) / (objetivo_i) × 100</span>
					</div>
					<p class="mt-2">
						<strong
							>En este proyecto: <span class="text-sky-700">{progresoCantidad.toFixed(2)}%</span
							></strong
						>
					</p>
				{:else if step === 2}
					<p>Se mide el porcentaje del tiempo ya transcurrido.</p>
					<div
						class="rounded-lg border border-emerald-100 bg-emerald-50 p-3 font-mono text-xs leading-snug text-emerald-900"
					>
						<div class="mb-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-emerald-400"></div>
							<span class="font-medium text-emerald-700">Fórmula:</span>
						</div>
						<span>progreso = ((hoy - inicio) / (fin - inicio)) × 100</span>
					</div>
					<p class="mt-2">
						<strong
							>En este proyecto: <span class="text-emerald-700">{progresoTiempo.toFixed(2)}%</span
							></strong
						>
					</p>
				{:else if step === 3}
					<p>Se combina con un peso del 60% a objetivos y 40% al tiempo.</p>
					<div
						class="rounded-lg border border-purple-100 bg-purple-50 p-3 font-mono text-xs leading-snug text-purple-900"
					>
						<div class="mb-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-purple-400"></div>
							<span class="font-medium text-purple-700">Fórmula:</span>
						</div>
						<span>total = 0.6 × objetivos + 0.4 × tiempo</span>
					</div>
					<p class="mt-2">
						<strong>Progreso total: <span class="text-purple-700">{progresoTotal}%</span></strong>
					</p>
				{/if}
			</div>

			<!-- Navegación -->
			<div class="flex items-center justify-between border-t border-gray-100 px-5 pt-2 pb-5">
				{#if step > 0}
					<button
						type="button"
						class="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-800 focus:ring-2 focus:ring-gray-200 focus:outline-none"
						onclick={() => step--}
					>
						<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Atrás
					</button>
				{:else}
					<div></div>
				{/if}

				{#if step < steps - 1}
					<Button
						label="Siguiente"
						variant="primary"
						size="sm"
						customClass="px-4 py-1.5 text-sm"
						onclick={() => step++}
					/>
				{:else}
					<Button
						label="Cerrar"
						variant="secondary"
						size="sm"
						customClass="px-4 py-1.5 text-sm"
						onclick={close}
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}
