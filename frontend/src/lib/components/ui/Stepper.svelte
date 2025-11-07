<script lang="ts">
	export let current = 1;
	export let total = 4;

	const stepsLabels = [
		'Tipo de cuenta',
		'Datos de cuenta',
		'Identidad',
		// 'Verificación de email',
		'Dirección y contacto'
	];
</script>

<div class="mb-8 w-full px-4 sm:px-6 md:px-8">
	<!-- Vista completa en sm y superior -->
	<ol
		class="hidden flex-wrap items-center justify-center gap-x-4 gap-y-4 text-sm text-gray-500 sm:flex"
	>
		{#each Array(total), i (i)}
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

					{#if i < total}
						<div class="mx-2 hidden h-1 w-10 bg-gray-300 sm:block md:w-16 lg:w-24"></div>
					{/if}
				</div>

				<!-- Label -->
				<div class="mt-2 w-28 text-center text-xs font-medium text-gray-600 sm:w-32 md:w-36">
					{stepsLabels[i]}
				</div>
			</li>
		{/each}

		<!-- Círculo final -->
		<li class="flex flex-col items-center">
			<div class="flex items-center">
				<div
					class={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
						current > total
							? 'border-green-500 bg-green-500 text-white'
							: 'border-gray-300 bg-white text-gray-400'
					}`}
				>
					{#if current > total}
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
					current === total + 1
						? 'border-green-500 bg-green-500 text-white'
						: 'border-blue-500 bg-blue-500 text-white'
				}`}
			>
				{#if current <= total}
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
				{current <= total ? stepsLabels[current - 1] : 'Completado'}
			</div>
		</div>

		<!-- Puntos suspensivos -->
		<span class="text-xl font-semibold text-gray-400">...</span>

		<!-- Paso final -->
		<div class="flex flex-col items-center">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400"
			>
				{total}
			</div>
			<div class="mt-1 w-24 text-center text-xs font-medium text-gray-400">
				{stepsLabels[total - 1]}
			</div>
		</div>
	</div>
</div>
