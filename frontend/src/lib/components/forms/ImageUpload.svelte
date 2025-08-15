<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let label = 'Imagen';
	export let error: string | undefined = undefined;

	function isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
	}
</script>

<div class="space-y-2">
	<label for="image-upload" class="block text-base font-semibold text-gray-700">
		{label}
	</label>
	
	<div class="space-y-3">
		<!-- Input URL -->
		<input
			id="image-upload"
			name="image-upload"
			type="url"
			bind:value
			on:input={handleInput}
			{placeholder}
			class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] {error ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}"
		/>
		
		<!-- Preview de la imagen -->
		{#if value && isValidUrl(value)}
			<div class="relative">
				<img
					src={value}
					alt="Vista previa"
					class="w-full h-48 object-cover rounded-lg border border-gray-200"
					on:error={() => {
						error = 'No se pudo cargar la imagen desde esta URL';
					}}
					on:load={() => {
						if (error === 'No se pudo cargar la imagen desde esta URL') {
							error = undefined;
						}
					}}
				/>
				<button
					type="button"
					on:click={() => { value = ''; }}
					class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
				>
					×
				</button>
			</div>
		{/if}
		
		<!-- Información adicional -->
		<p class="text-sm text-gray-500">
			Pega la URL de una imagen desde Internet (formato JPG, PNG, GIF, WebP)
		</p>
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>
