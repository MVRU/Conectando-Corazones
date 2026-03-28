<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Check } from 'lucide-svelte';

	export let pasoActual = 1;
	export let pasosTotales = 4;
	export let etiquetas: string[] = [
		'Tipo de cuenta',
		'Datos de cuenta',
		'Identidad',
		'Contacto',
		'Ubicación'
	];

	$: totalNormalizado = Math.max(pasosTotales, 0);
	const ETIQUETA_COMPLETADO = 'Completado';

	$: etiquetasEfectivas = Array.from(
		{ length: totalNormalizado },
		(_, index) => etiquetas[index] ?? `Paso ${index + 1}`
	);

	$: porcentajeProgreso = Math.min((pasoActual / totalNormalizado) * 100, 100);

	$: etiquetaActual =
		pasoActual > 0 && pasoActual <= totalNormalizado
			? etiquetasEfectivas[pasoActual - 1]
			: ETIQUETA_COMPLETADO;
</script>

<div class="w-full">
	<!-- Vista de desktop-->
	<div class="hidden md:block">
		<ol class="relative flex w-full items-center justify-between">
			<div
				class="absolute top-1/2 left-0 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200"
			></div>

			<div
				class="absolute top-1/2 left-0 -z-10 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-in-out"
				style="width: {((Math.min(pasoActual, totalNormalizado) - 1) / (totalNormalizado - 1)) *
					100}%"
			></div>

			{#each etiquetasEfectivas as etiqueta, i (i)}
				{@const isCompleted = pasoActual > i + 1}
				{@const isCurrent = pasoActual === i + 1}
				{@const isUpcoming = pasoActual < i + 1}

				<li class="group relative flex cursor-default flex-col items-center">
					<div
						class={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ring-offset-2 transition-all duration-300 
						${
							isCompleted
								? 'overflow-hidden border-green-500 bg-green-500 text-white shadow-lg'
								: isCurrent
									? 'scale-110 border-blue-500 bg-white text-blue-600 shadow-md ring-2 ring-blue-200'
									: 'border-gray-300 bg-white text-gray-400'
						}`}
					>
						{#if isCompleted}
							<span in:fade={{ duration: 200 }}>
								<Check class="h-6 w-6" />
							</span>
						{:else}
							<span>{i + 1}</span>
						{/if}
					</div>

					<!-- Label -->
					<div
						class={`absolute -bottom-8 w-32 text-center text-xs font-medium transition-colors duration-300
						${isCompleted ? 'text-green-600' : isCurrent ? 'font-bold text-blue-600' : 'text-gray-500'}`}
					>
						{etiqueta}
					</div>
				</li>
			{/each}
		</ol>
	</div>

	<!-- Vista de móvil -->
	<div class="md:hidden">
		<div class="flex flex-col gap-2">
			<div class="mb-1 flex items-end justify-between">
				<div>
					<span class="text-xs font-semibold tracking-wider text-blue-600 uppercase">
						Paso {Math.min(pasoActual, totalNormalizado)} de {totalNormalizado}
					</span>
					<h3 class="text-lg leading-tight font-bold text-gray-900">
						{etiquetaActual}
					</h3>
				</div>
				<span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500">
					{Math.round(porcentajeProgreso)}%
				</span>
			</div>

			<!-- Progress Bar -->
			<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500 ease-out"
					style="width: {porcentajeProgreso}%"
				></div>
			</div>
		</div>
	</div>
</div>
