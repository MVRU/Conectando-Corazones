<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import type { ComponentType } from 'svelte';
	import { clsx } from 'clsx';
	import { UserRoundPlus } from 'lucide-svelte';

	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	interface Props {
		id?: string;
		nombre?: string;
		etiqueta?: string;
		etiquetaOpcional?: string;
		placeholder?: string;
		textoAyuda?: string;
		descripcion?: string;
		accept?: string;
		error?: string;
		enlace?: string;
		archivo?: File | null;
		icono?: ComponentType;
		claseIcono?: string;
		onenlace?: (val: string) => void;
		onarchivo?: (val: File | null) => void;
	}

	let {
		id = '',
		nombre = '',
		etiqueta = 'Foto de perfil',
		etiquetaOpcional = '(opcional)',
		placeholder = 'https://...',
		textoAyuda = 'Podés pegar un enlace o arrastrar una imagen en formato JPG, PNG o WebP.',
		descripcion = 'Subí una imagen o logo para personalizar tu perfil.',
		accept = 'image/*',
		error = '',
		enlace = $bindable(''),
		archivo = $bindable(null),
		icono = UserRoundPlus,
		claseIcono = 'text-sky-600',
		onenlace,
		onarchivo
	}: Props = $props();

	const MENSAJE_ARCHIVO_INVALIDO = 'El archivo debe ser una imagen compatible (JPG, PNG o WebP).';

	let inputArchivoRef = $state<HTMLInputElement | null>(null);
	let inputEnlaceRef = $state<HTMLInputElement | null>(null);
	let urlObjeto = $state<string | null>(null);
	let modoActivo = $state<'enlace' | 'archivo'>(archivo ? 'archivo' : 'enlace');
	let arrastrandoArchivo = $state(false);
	let errorInterno = $state('');
	let errorVistaPrevia = $state(false);
	let vistaPreviaInterna = $state('');

	const botonesModo: Array<{ id: 'enlace' | 'archivo'; etiqueta: string }> = [
		{ id: 'enlace', etiqueta: 'Usar enlace' },
		{ id: 'archivo', etiqueta: 'Subir archivo' }
	];

	$effect(() => {
		if (archivo && modoActivo !== 'archivo') {
			modoActivo = 'archivo';
		}
	});

	let vistaPrevia = $derived(enlace.trim());
	let vistaPreviaNormalizada = $derived(normalizarUrlVistaPrevia(vistaPrevia));

	$effect(() => {
		if (vistaPrevia) {
			errorVistaPrevia = false;
			if (modoActivo === 'enlace') {
				prepararVistaPreviaDesdeUrl(vistaPrevia);
			}
		}
	});

	let errorParaInput = $derived(modoActivo === 'enlace' ? error : '');
	let mensajeErrorGlobal = $derived(
		modoActivo === 'archivo' ? errorInterno || error : errorInterno
	);
	let mensajeEstado = $derived(
		archivo?.name
			? `Imagen cargada: ${archivo.name}`
			: enlace.trim()
				? 'Vista previa aplicada desde el enlace proporcionado.'
				: ''
	);

	function emitirEnlace(nuevoEnlace: string) {
		enlace = nuevoEnlace;
		onenlace?.(enlace);
	}

	function emitirArchivo(nuevoArchivo: File | null) {
		archivo = nuevoArchivo;
		onarchivo?.(archivo);
	}

	function limpiarUrlObjeto() {
		if (urlObjeto) {
			URL.revokeObjectURL(urlObjeto);
			urlObjeto = null;
		}
	}

	function limpiarArchivoSeleccionado(preservarModo = false) {
		limpiarUrlObjeto();
		if (inputArchivoRef) {
			inputArchivoRef.value = '';
		}
		emitirArchivo(null);
		vistaPreviaInterna = '';
		if (!preservarModo) {
			modoActivo = 'enlace';
		}
	}

	async function seleccionarModo(nuevoModo: 'enlace' | 'archivo') {
		if (modoActivo === nuevoModo) return;
		modoActivo = nuevoModo;
		errorInterno = '';

		if (nuevoModo === 'enlace') {
			limpiarArchivoSeleccionado(true);
			emitirArchivo(null);
			await tick();
			inputEnlaceRef?.focus();
			return;
		}

		emitirEnlace('');
		await tick();
		inputArchivoRef?.click();
	}

	function validarArchivo(archivoAValidar: File) {
		if (!archivoAValidar.type.startsWith('image/')) {
			errorInterno = MENSAJE_ARCHIVO_INVALIDO;
			return false;
		}

		const MAX_SIZE_MB = 2;
		const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
		if (archivoAValidar.size > MAX_SIZE_BYTES) {
			errorInterno = `El archivo es demasiado grande. El tamaño máximo permitido es ${MAX_SIZE_MB} MB.`;
			return false;
		}

		errorInterno = '';
		return true;
	}

	function procesarArchivo(archivoAProcesar: File) {
		if (!validarArchivo(archivoAProcesar)) {
			limpiarArchivoSeleccionado(true);
			return;
		}

		limpiarUrlObjeto();
		urlObjeto = URL.createObjectURL(archivoAProcesar);
		emitirArchivo(archivoAProcesar);
		emitirEnlace(urlObjeto);
		vistaPreviaInterna = urlObjeto;
		errorVistaPrevia = false;
	}

	function manejarEntradaEnlace(evento: Event & { currentTarget: HTMLInputElement }) {
		const nuevoEnlace = evento.currentTarget.value;
		modoActivo = 'enlace';
		errorInterno = '';
		emitirEnlace(nuevoEnlace);
		if (archivo) {
			limpiarArchivoSeleccionado(true);
		}
	}

	function prepararVistaPreviaDesdeUrl(valor: string) {
		const normalizada = normalizarUrlVistaPrevia(valor);
		if (!normalizada) {
			vistaPreviaInterna = '';
			errorVistaPrevia = false;
			return;
		}

		vistaPreviaInterna = normalizada;
		errorVistaPrevia = false;
	}

	function normalizarUrlVistaPrevia(cruda: string): string {
		const recortada = cruda.trim();
		if (/^(?:data|blob):/i.test(recortada)) {
			return recortada;
		}
		if (!/^[a-zA-Z]+:\/\//.test(recortada)) {
			return `https://${recortada}`;
		}
		try {
			return encodeURI(recortada);
		} catch {
			return recortada;
		}
	}

	function manejarErrorVistaPrevia() {
		if (!vistaPrevia) return;
		errorVistaPrevia = true;
	}

	function manejarCargaVistaPrevia() {
		errorVistaPrevia = false;
	}

	function manejarCambioArchivo(evento: Event & { currentTarget: HTMLInputElement }) {
		const input = evento.currentTarget;
		const archivoSeleccionado = input.files?.[0] ?? null;
		if (!archivoSeleccionado) {
			limpiarArchivoSeleccionado(true);
			emitirEnlace('');
			return;
		}

		modoActivo = 'archivo';
		procesarArchivo(archivoSeleccionado);
	}

	function manejarSoltar(evento: DragEvent) {
		evento.preventDefault();
		arrastrandoArchivo = false;
		const archivoArrastrado = evento.dataTransfer?.files?.[0];
		if (!archivoArrastrado) return;
		modoActivo = 'archivo';
		procesarArchivo(archivoArrastrado);
	}

	function manejarArrastreSobre(evento: DragEvent) {
		evento.preventDefault();
		arrastrandoArchivo = true;
	}

	function manejarSalidaArrastre(evento: DragEvent) {
		evento.preventDefault();
		arrastrandoArchivo = false;
	}

	function limpiarSeleccionManual() {
		limpiarArchivoSeleccionado();
		emitirEnlace('');
	}

	function abrirSelectorDeArchivos() {
		inputArchivoRef?.click();
	}

	onDestroy(() => {
		limpiarUrlObjeto();
	});
</script>

<fieldset class="rounded-2xl border border-slate-100 bg-white p-5">
	<legend class="sr-only">{etiqueta}</legend>

	<div class="space-y-5">
		<div class="flex items-center gap-3">
			<span
				class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50"
				aria-hidden="true"
			>
				{#if icono}
					{@const IconoRender = icono}
					<IconoRender class={clsx('h-5 w-5', claseIcono)} stroke-width={1.7} />
				{/if}
			</span>
			<div class="flex items-baseline gap-2">
				<p class="text-base font-semibold text-slate-900">{etiqueta}</p>
				{#if etiquetaOpcional}
					<span class="text-sm font-normal text-slate-400">{etiquetaOpcional}</span>
				{/if}
			</div>
		</div>

		{#if descripcion}
			<p class="text-sm text-slate-500">{descripcion}</p>
		{/if}

		<div
			class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50/70 px-4 py-3"
		>
			<p class="text-sm text-slate-600">{textoAyuda}</p>
			<div class="inline-flex rounded-full bg-white/90 p-1 text-sm font-medium shadow-inner">
				{#each botonesModo as boton (boton.id)}
					<button
						type="button"
						class={clsx(
							'rounded-full px-4 py-1 transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))]',
							modoActivo === boton.id
								? 'bg-[rgb(var(--color-primary))] text-white shadow'
								: 'text-gray-600 hover:text-gray-900'
						)}
						aria-pressed={modoActivo === boton.id}
						onclick={() => seleccionarModo(boton.id)}
					>
						{boton.etiqueta}
					</button>
				{/each}
			</div>
		</div>

		{#if modoActivo === 'enlace'}
			<div class="space-y-2">
				<label for={id} class="sr-only">Ingresá la URL de la foto de perfil</label>
				<Input
					{id}
					name={nombre}
					type="url"
					bind:value={enlace}
					{placeholder}
					error={errorParaInput}
					oninput={manejarEntradaEnlace}
					bind:inputRef={inputEnlaceRef}
					aria-describedby={mensajeErrorGlobal ? `${id}-error` : undefined}
				/>
			</div>
		{:else if modoActivo === 'archivo' && !archivo}
			<div class="space-y-2">
				<label class="sr-only" for={`${id}-archivo`} id={`${id}-archivo-label`}>
					Subí una imagen desde tu dispositivo
				</label>
				<div
					role="button"
					tabindex="0"
					class={clsx(
						'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]',
						arrastrandoArchivo
							? 'border-[rgb(var(--color-primary))] bg-[rgba(var(--color-primary),0.08)]'
							: 'border-gray-300 bg-gray-50 hover:border-[rgb(var(--color-primary))] hover:bg-white'
					)}
					aria-label="Elegí un archivo para la foto de perfil"
					aria-describedby={mensajeErrorGlobal ? `${id}-error` : undefined}
					onclick={abrirSelectorDeArchivos}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							abrirSelectorDeArchivos();
						}
					}}
					ondragover={manejarArrastreSobre}
					ondragleave={manejarSalidaArrastre}
					ondrop={manejarSoltar}
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
					<div class="pointer-events-none">
						<Button label="Buscar archivo" type="button" variant="primary" size="sm"></Button>
					</div>
				</div>
				<input
					id={`${id}-archivo`}
					bind:this={inputArchivoRef}
					class="sr-only"
					type="file"
					{accept}
					aria-labelledby={`${id}-archivo-label`}
					onchange={manejarCambioArchivo}
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
						{#if (vistaPreviaInterna || vistaPreviaNormalizada) && !errorVistaPrevia}
							<img
								src={vistaPreviaInterna || vistaPreviaNormalizada}
								alt="Vista previa de la foto seleccionada"
								class="h-full w-full object-cover"
								loading="lazy"
								referrerpolicy="no-referrer"
								onerror={manejarErrorVistaPrevia}
								onload={manejarCargaVistaPrevia}
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-slate-50 text-xs text-slate-500"
							>
								Sin vista previa
							</div>
						{/if}
					</div>
					<figcaption class="space-y-1 text-sm">
						<p class="font-semibold text-gray-800">
							{archivo?.name ?? 'Vista previa desde URL externa'}
						</p>
						<p class="text-xs text-gray-600">
							{archivo ? 'Origen: archivo cargado manualmente.' : 'Origen: enlace proporcionado.'}
						</p>
					</figcaption>
				</figure>
				<div class="flex flex-1 flex-col items-end">
					{#if errorVistaPrevia && vistaPrevia}
						<p class="mb-2 text-xs text-red-600">
							No pudimos cargar la vista previa. Verificá que el enlace sea público y directo a una
							imagen.
						</p>
					{/if}
					<button
						type="button"
						class="rounded-full border border-transparent bg-white px-4 py-2 text-sm font-semibold text-[rgb(var(--color-primary))] shadow-sm transition hover:border-[rgb(var(--color-primary))] hover:bg-[rgba(var(--color-primary),0.08)]"
						onclick={limpiarSeleccionManual}
					>
						Quitar imagen
					</button>
				</div>
			</div>
		{/if}

		{#if mensajeErrorGlobal}
			<p id="{id}-error" role="alert" class="text-sm text-red-600">
				{mensajeErrorGlobal}
			</p>
		{/if}

		{#if mensajeEstado}
			<p aria-live="polite" class="text-sm text-gray-500">{mensajeEstado}</p>
		{/if}
	</div>
</fieldset>
