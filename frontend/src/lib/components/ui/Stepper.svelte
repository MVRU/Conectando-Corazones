<script lang="ts">
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
	$: etiquetaActual =
		pasoActual > 0 && pasoActual <= totalNormalizado
			? etiquetasEfectivas[pasoActual - 1]
			: ETIQUETA_COMPLETADO;
	$: etiquetaUltimoPaso =
		totalNormalizado > 0 ? etiquetasEfectivas[totalNormalizado - 1] : ETIQUETA_COMPLETADO;
</script>

<div class="mb-8 w-full px-4 sm:px-6 md:px-8">
	<!-- Vista completa en sm y superior -->
	<ol
		class="hidden flex-wrap items-center justify-center gap-x-4 gap-y-4 text-sm text-gray-500 sm:flex"
	>
		{#each etiquetasEfectivas as etiqueta, i (i)}
			<li class="flex flex-col items-center">
				<div class="flex items-center">
					<div
						class={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
							pasoActual > i + 1
								? 'border-green-500 bg-green-500 text-white'
								: pasoActual === i + 1
									? 'border-blue-500 bg-blue-500 text-white'
									: 'border-gray-300 bg-white text-gray-400'
						}`}
					>
						{i + 1}
					</div>

					{#if i < totalNormalizado}
						<div class="mx-2 hidden h-1 w-10 bg-gray-300 sm:block md:w-16 lg:w-24"></div>
					{/if}
				</div>

				<!-- Label -->
				<div class="mt-2 w-28 text-center text-xs font-medium text-gray-600 sm:w-32 md:w-36">
					{etiqueta}
				</div>
			</li>
		{/each}

		<!-- Círculo final -->
		<li class="flex flex-col items-center">
			<div class="flex items-center">
				<div
					class={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
						pasoActual > totalNormalizado
							? 'border-green-500 bg-green-500 text-white'
							: 'border-gray-300 bg-white text-gray-400'
					}`}
				>
					{#if pasoActual > totalNormalizado}
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						<div class="h-2 w-2 rounded-full bg-gray-300"></div>
					{/if}
				</div>
			</div>
			<div class="mt-2 h-4 sm:h-5"></div>
		</li>
	</ol>

	<!-- Vista reducida en mobile -->
	<div class="flex items-center justify-center gap-4 text-gray-500 sm:hidden">
		<!-- Paso actual -->
		<div class="flex flex-col items-center">
			<div
				class={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
					pasoActual === totalNormalizado + 1
						? 'border-green-500 bg-green-500 text-white'
						: 'border-blue-500 bg-blue-500 text-white'
				}`}
			>
				{#if pasoActual <= totalNormalizado}
					{pasoActual}
				{:else}
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				{/if}
			</div>
			<div class="mt-1 w-24 text-center text-xs font-medium text-gray-600">
				{etiquetaActual}
			</div>
		</div>

		<!-- Puntos suspensivos -->
		<span class="text-xl font-semibold text-gray-400">...</span>

		<!-- Paso final -->
		<div class="flex flex-col items-center">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400"
			>
				{totalNormalizado}
			</div>
			<div class="mt-1 w-24 text-center text-xs font-medium text-gray-400">
				{etiquetaUltimoPaso}
			</div>
		</div>
	</div>
</div>
