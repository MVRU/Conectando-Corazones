<script lang="ts">
	import { createEventDispatcher, onDestroy, tick } from 'svelte';
	import { clsx } from 'clsx';

	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	export let id = '';
	export let name = '';
	export let label = 'Foto de perfil';
	export let optionalLabel = '(opcional)';
	export let placeholder = 'https://...';
	export let helperText =
		'Podés pegar un enlace o arrastrar una imagen en formato JPG, PNG o WebP.';
	export let accept = 'image/*';
	export let error: string = '';
	export let url = '';
	export let file: File | null = null;

	const dispatch = createEventDispatcher<{
		url: string;
		file: File | null;
	}>();

	const MENSAJE_ARCHIVO_INVALIDO = 'El archivo debe ser una imagen compatible (JPG, PNG o WebP).';

	let fileInput: HTMLInputElement | null = null;
	let urlInputRef: HTMLInputElement | null = null;
	let objectUrl: string | null = null;
	let modoActivo: 'url' | 'archivo' = file ? 'archivo' : 'url';
	let arrastrandoArchivo = false;
	let errorInterno = '';

	const botonesModo: Array<{ id: 'url' | 'archivo'; etiqueta: string }> = [
		{ id: 'url', etiqueta: 'Usar enlace' },
		{ id: 'archivo', etiqueta: 'Subir archivo' }
	];

	$: if (file && modoActivo !== 'archivo') {
		modoActivo = 'archivo';
	}

	$: vistaPrevia = url.trim();
	$: errorParaInput = modoActivo === 'url' ? error : '';
	$: mensajeErrorGlobal = modoActivo === 'archivo' ? errorInterno || error : errorInterno;
	$: mensajeEstado = file?.name
		? `Imagen cargada: ${file.name}`
		: url.trim()
			? 'Vista previa aplicada desde el enlace proporcionado.'
			: '';

	function emitirUrl(nuevaUrl: string) {
		url = nuevaUrl;
		dispatch('url', url);
	}

	function emitirArchivo(nuevoArchivo: File | null) {
		file = nuevoArchivo;
		dispatch('file', file);
	}

	function limpiarObjectUrl() {
		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
			objectUrl = null;
		}
	}

	function limpiarArchivoSeleccionado(preservarModo = false) {
		limpiarObjectUrl();
		if (fileInput) {
			fileInput.value = '';
		}
		emitirArchivo(null);
		if (!preservarModo) {
			modoActivo = 'url';
		}
	}

	async function seleccionarModo(nuevoModo: 'url' | 'archivo') {
		if (modoActivo === nuevoModo) return;
		modoActivo = nuevoModo;
		errorInterno = '';

		if (nuevoModo === 'url') {
			limpiarArchivoSeleccionado(true);
			emitirArchivo(null);
			await tick();
			urlInputRef?.focus();
			return;
		}

		emitirUrl('');
		await tick();
		fileInput?.click();
	}

	function validarArchivo(archivo: File) {
		if (!archivo.type.startsWith('image/')) {
			errorInterno = MENSAJE_ARCHIVO_INVALIDO;
			return false;
		}
		errorInterno = '';
		return true;
	}

	function procesarArchivo(archivo: File) {
		if (!validarArchivo(archivo)) {
			limpiarArchivoSeleccionado(true);
			return;
		}

		limpiarObjectUrl();
		objectUrl = URL.createObjectURL(archivo);
		emitirArchivo(archivo);
		emitirUrl(objectUrl);
	}

	function handleUrlInput(event: Event) {
		const nuevaUrl = (event.target as HTMLInputElement).value;
		modoActivo = 'url';
		errorInterno = '';
		emitirUrl(nuevaUrl);
		if (file) {
			limpiarArchivoSeleccionado(true);
		}
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const archivoSeleccionado = input.files?.[0] ?? null;
		if (!archivoSeleccionado) {
			limpiarArchivoSeleccionado(true);
			emitirUrl('');
			return;
		}

		modoActivo = 'archivo';
		procesarArchivo(archivoSeleccionado);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		arrastrandoArchivo = false;
		const archivoArrastrado = event.dataTransfer?.files?.[0];
		if (!archivoArrastrado) return;
		modoActivo = 'archivo';
		procesarArchivo(archivoArrastrado);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		arrastrandoArchivo = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		arrastrandoArchivo = false;
	}

	function limpiarSeleccionManual() {
		limpiarArchivoSeleccionado();
		emitirUrl('');
	}

	function abrirSelectorDeArchivos() {
		fileInput?.click();
	}

	onDestroy(() => {
		limpiarObjectUrl();
	});
</script>

<fieldset
	class="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-[rgb(var(--color-primary))]"
>
	<legend class="px-5 pt-5 text-sm font-semibold text-gray-800">
		{label}
		{#if optionalLabel}
			<span class="ml-2 text-gray-500">{optionalLabel}</span>
		{/if}
	</legend>
	<div class="space-y-5 p-5">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm text-gray-600">{helperText}</p>
			<div class="inline-flex rounded-full bg-gray-100 p-1 text-sm font-medium shadow-inner">
				{#each botonesModo as boton}
					<button
						type="button"
						class={clsx(
							'rounded-full px-4 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))]',
							modoActivo === boton.id
								? 'bg-[rgb(var(--color-primary))] text-white shadow'
								: 'text-gray-600 hover:text-gray-900'
						)}
						aria-pressed={modoActivo === boton.id}
						on:click={() => seleccionarModo(boton.id)}
					>
						{boton.etiqueta}
					</button>
				{/each}
			</div>
		</div>

		{#if modoActivo === 'url'}
			<div class="space-y-2">
				<label for={id} class="sr-only">Ingresá la URL de la foto de perfil</label>
				<Input
					{id}
					{name}
					type="url"
					bind:value={url}
					{placeholder}
					error={errorParaInput}
					on:input={handleUrlInput}
					inputRef={urlInputRef}
					aria-describedby={mensajeErrorGlobal ? `${id}-error` : undefined}
				/>
			</div>
		{:else}
			<div class="space-y-2">
				<label class="sr-only" for={`${id}-archivo`} id={`${id}-archivo-label`}>
					Subí una imagen desde tu dispositivo
				</label>
				<button
					type="button"
					class={clsx(
						'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition',
						arrastrandoArchivo
							? 'border-[rgb(var(--color-primary))] bg-[rgba(var(--color-primary),0.08)]'
							: 'border-gray-300 bg-gray-50 hover:border-[rgb(var(--color-primary))] hover:bg-white'
					)}
					aria-label="Elegí un archivo para la foto de perfil"
					aria-describedby={mensajeErrorGlobal ? `${id}-error` : undefined}
					on:click={abrirSelectorDeArchivos}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
						<svg
							class="h-6 w-6 text-[rgb(var(--color-primary))]"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
						</svg>
					</div>
					<div class="space-y-1">
						<p class="text-base font-semibold text-gray-800">Subí una imagen</p>
						<p class="text-sm text-gray-600">
							Arrastrá y soltá tu archivo o hacé clic para buscarlo.
						</p>
					</div>
					<Button label="Buscar archivo" type="button" variant="primary" size="sm"></Button>
				</button>
				<input
					id={`${id}-archivo`}
					bind:this={fileInput}
					class="sr-only"
					type="file"
					{accept}
					aria-labelledby={`${id}-archivo-label`}
					on:change={handleFileChange}
				/>
			</div>
		{/if}

		{#if vistaPrevia}
			<div
				class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center"
			>
				<figure class="flex items-center gap-4">
					<div
						class="h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
					>
						<img
							src={vistaPrevia}
							alt="Vista previa de la foto seleccionada"
							class="h-full w-full object-cover"
						/>
					</div>
					<figcaption class="space-y-1 text-sm">
						<p class="font-semibold text-gray-800">
							{file?.name ?? 'Vista previa desde URL externa'}
						</p>
						<p class="text-xs text-gray-600">
							{file ? 'Origen: archivo cargado manualmente.' : 'Origen: enlace proporcionado.'}
						</p>
					</figcaption>
				</figure>
				<div class="flex flex-1 items-center justify-end">
					<button
						type="button"
						class="rounded-full border border-transparent bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--color-primary))] shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:bg-[rgba(var(--color-primary),0.08)]"
						on:click={limpiarSeleccionManual}
					>
						Quitar imagen
					</button>
				</div>
			</div>
		{/if}

		{#if mensajeErrorGlobal}
			<p id="{id}-error" role="alert" class="text-sm text-red-600">{mensajeErrorGlobal}</p>
		{/if}

		{#if mensajeEstado}
			<p aria-live="polite" class="text-sm text-gray-500">{mensajeEstado}</p>
		{/if}
	</div>
</fieldset>
