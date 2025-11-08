<script lang="ts">
	export let current = 1;
	export let total = 4;
	export let labels: string[] = [
		'Tipo de cuenta',
		'Datos de cuenta',
		'Identidad',
		'Contacto',
		'Ubicación'
	];

	$: normalizedTotal = Math.max(total, 0);
	const COMPLETED_LABEL = 'Completado';
	$: effectiveLabels = Array.from(
		{ length: normalizedTotal },
		(_, index) => labels[index] ?? `Paso ${index + 1}`
	);
	$: currentLabel =
		current > 0 && current <= normalizedTotal ? effectiveLabels[current - 1] : COMPLETED_LABEL;
	$: lastStepLabel = normalizedTotal > 0 ? effectiveLabels[normalizedTotal - 1] : COMPLETED_LABEL;
</script>

<div class="mb-8 w-full px-4 sm:px-6 md:px-8">
	<!-- Vista completa en sm y superior -->
	<ol
		class="hidden flex-wrap items-center justify-center gap-x-4 gap-y-4 text-sm text-gray-500 sm:flex"
	>
		{#each effectiveLabels as stepLabel, i (i)}
			<li class="flex flex-col items-center">
				<div class="flex items-center">
					<div
						class={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
							current > i + 1
								? 'border-green-500 bg-green-500 text-white'
								: current === i + 1
									? 'border-blue-500 bg-blue-500 text-white'
									: 'border-gray-300 bg-white text-gray-400'
						}`}
					>
						{i + 1}
					</div>

					{#if i < normalizedTotal}
						<div class="mx-2 hidden h-1 w-10 bg-gray-300 sm:block md:w-16 lg:w-24"></div>
					{/if}
				</div>

				<!-- Label -->
				<div class="mt-2 w-28 text-center text-xs font-medium text-gray-600 sm:w-32 md:w-36">
					{stepLabel}
				</div>
			</li>
		{/each}

		<!-- Círculo final -->
		<li class="flex flex-col items-center">
			<div class="flex items-center">
				<div
					class={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
						current > normalizedTotal
							? 'border-green-500 bg-green-500 text-white'
							: 'border-gray-300 bg-white text-gray-400'
					}`}
				>
					{#if current > normalizedTotal}
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
					current === normalizedTotal + 1
						? 'border-green-500 bg-green-500 text-white'
						: 'border-blue-500 bg-blue-500 text-white'
				}`}
			>
				{#if current <= normalizedTotal}
					{current}
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
				{currentLabel}
			</div>
		</div>

		<!-- Puntos suspensivos -->
		<span class="text-xl font-semibold text-gray-400">...</span>

		<!-- Paso final -->
		<div class="flex flex-col items-center">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400"
			>
				{normalizedTotal}
			</div>
			<div class="mt-1 w-24 text-center text-xs font-medium text-gray-400">
				{lastStepLabel}
			</div>
		</div>
	</div>
</div>
