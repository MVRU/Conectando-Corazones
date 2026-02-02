<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto, beforeNavigate } from '$app/navigation';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import {
		FileText,
		Image as ImageIcon,
		Upload,
		X,
		ChevronLeft,
		AlertCircle,
		FileStack
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import type { Archivo } from '$lib/domain/types/Archivo';
	import { toastStore } from '$lib/stores/toast';

	let { data } = $props();

	const projectIdUrl = $page.params.id;

	type EvidenciaEntradaNueva = {
		id_temp: number;
		archivos: (Archivo & { file: File })[];
		cantidad?: number;
		descripcion?: string;
	};

	let selectedParticipacionPermitidaId = $state<number | null>(null);
	let cantidadAporte = $state<number | undefined>(undefined);
	let descripcionAporte = $state<string>('');

	let selectedParticipacion = $derived(
		data.participacionesPermitidas.find(
			(p: any) => p.id_participacion_permitida === selectedParticipacionPermitidaId
		)
	);

	let esMonetaria = $derived(
		selectedParticipacion?.tipo_participacion?.descripcion === 'Monetaria'
	);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let esEspecie = $derived(selectedParticipacion?.tipo_participacion?.descripcion === 'Especie');

	let mostrarModalSubirArchivos = $state(false);
	let archivosTemporales: (Archivo & { file: File })[] = $state([]);
	let evidenciasNuevas: EvidenciaEntradaNueva[] = $state([]);

	let hayaCambios = $derived(
		evidenciasNuevas.length > 0 ||
			archivosTemporales.length > 0 ||
			cantidadAporte !== undefined ||
			descripcionAporte !== ''
	);

	let mostrarModalConfirmacion = $state(false);
	let navegacionPendiente: (() => void) | null = null;
	let estaGuardando = $state(false);

	let isMobile = $state(false);

	onMount(() => {
		const mql = window.matchMedia('(max-width: 640px)');
		isMobile = mql.matches;
		const listener = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mql.addEventListener('change', listener);

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hayaCambios && !estaGuardando) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			mql.removeEventListener('change', listener);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	beforeNavigate((navigation) => {
		if (hayaCambios && !mostrarModalConfirmacion && !estaGuardando) {
			navigation.cancel();
			navegacionPendiente = () => {
				// Limpiar estado al salir
				evidenciasNuevas = [];
				cantidadAporte = undefined;
				descripcionAporte = '';
				goto(navigation.to?.url.pathname || `/colaborador/proyectos/${projectIdUrl}/mis-aportes`);
			};
			mostrarModalConfirmacion = true;
		}
	});

	function cerrar() {
		if (hayaCambios) {
			navegacionPendiente = () => {
				evidenciasNuevas = [];
				cantidadAporte = undefined;
				descripcionAporte = '';
				goto(`/colaborador/proyectos/${projectIdUrl}/mis-aportes`);
			};
			mostrarModalConfirmacion = true;
		} else {
			goto(`/colaborador/proyectos/${projectIdUrl}/mis-aportes`);
		}
	}

	function confirmarSalida() {
		if (navegacionPendiente) {
			navegacionPendiente();
			navegacionPendiente = null;
		}
		mostrarModalConfirmacion = false;
	}

	function cancelarSalida() {
		navegacionPendiente = null;
		mostrarModalConfirmacion = false;
	}

	function abrirModalSubirArchivos() {
		mostrarModalSubirArchivos = true;
		archivosTemporales = [];
	}

	function cerrarModalSubirArchivos() {
		mostrarModalSubirArchivos = false;
		archivosTemporales = [];
	}

	function getIconForFile(tipo: string | undefined) {
		return tipo?.includes('pdf') ? FileText : ImageIcon;
	}

	function handleFileSelection(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const nuevosArchivos: (Archivo & { file: File })[] = [];

			for (let i = 0; i < input.files.length; i++) {
				const file = input.files[i];

				const yaExisteEnTemp = archivosTemporales.some((a) => a.nombre_original === file.name);
				const yaExisteEnEvidencias = evidenciasNuevas.some((ev) =>
					ev.archivos.some((a) => a.nombre_original === file.name)
				);

				if (yaExisteEnTemp || yaExisteEnEvidencias) {
					toastStore.show({
						variant: 'error',
						message: `El archivo ${file.name} ya fue agregado.`
					});
					continue;
				}

				const isImage = file.type.startsWith('image/');
				const url = isImage ? URL.createObjectURL(file) : '';

				nuevosArchivos.push({
					id_archivo: Date.now() + i,
					file,
					descripcion: file.name,
					tipo_mime: file.type,
					tamanio_bytes: file.size,
					url,
					nombre_original: file.name
				});
			}

			archivosTemporales = [...archivosTemporales, ...nuevosArchivos];
		}
		input.value = '';
	}

	function actualizarDescripcionArchivo(archivoId: number, nuevaDescripcion: string) {
		archivosTemporales = archivosTemporales.map((archivo) =>
			archivo.id_archivo === archivoId ? { ...archivo, descripcion: nuevaDescripcion } : archivo
		);
	}

	function eliminarArchivoTemporal(archivoId: number) {
		archivosTemporales = archivosTemporales.filter((a) => a.id_archivo !== archivoId);
	}

	function agregarArchivosAEvidencia() {
		if (archivosTemporales.length === 0) return;

		const nuevaEvidencia: EvidenciaEntradaNueva = {
			id_temp: Date.now(),
			archivos: archivosTemporales
		};

		evidenciasNuevas.push(nuevaEvidencia);
		cerrarModalSubirArchivos();
	}

	function removeEvidencia(index: number) {
		evidenciasNuevas.splice(index, 1);
		evidenciasNuevas = [...evidenciasNuevas];
	}

	function guardarAporte() {
		if (!cantidadAporte || cantidadAporte <= 0) {
			toastStore.show({
				variant: 'error',
				title: 'Error de validación',
				message: 'La cantidad debe ser mayor a 0.'
			});
			return;
		}

		estaGuardando = true;

		// Simular guardado
		setTimeout(() => {
			toastStore.show({
				variant: 'success',
				title: 'Aporte registrado',
				message: 'Tu aporte ha sido registrado exitosamente.',
				duration: 5000
			});
			goto(`/colaborador/proyectos/${projectIdUrl}/mis-aportes`);
		}, 500);
	}
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="mx-auto max-w-4xl px-4 md:px-6" in:fade>
		<!-- Header -->
		<header class="animate-fade-in-up mb-8 pt-6 pb-6 md:mb-12 md:pt-12">
			<div class="flex flex-col items-center text-center">
				<div class="mb-6 flex w-full justify-start">
					<button
						onclick={cerrar}
						class="rounded-full border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
						aria-label="Volver"
					>
						<ChevronLeft size={24} />
					</button>
				</div>

				<h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuevo aporte</h1>
				<p class="mt-4 max-w-lg text-gray-500">
					Registrá tu colaboración para el proyecto: <span class="font-semibold text-gray-700"
						>{data.proyecto.titulo}</span
					>
				</p>
			</div>
		</header>

		<div class="space-y-8">
			<!-- Selección de Tipo de Participación -->
			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
				<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
					<span
						class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600"
						>1</span
					>
					¿Qué vas a aportar?
				</h2>

				<div class="space-y-4">
					<label
						for="participacion"
						class="mb-1 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase"
					>
						Tipo de participación
					</label>
					<select
						id="participacion"
						bind:value={selectedParticipacionPermitidaId}
						class="w-full cursor-pointer appearance-none rounded-xl border-2 border-slate-100 bg-slate-50 p-4 font-medium text-slate-700 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
					>
						<option value={null} disabled>Seleccioná una opción...</option>
						{#each data.participacionesPermitidas as p}
							<option value={p.id_participacion_permitida}>
								{p.tipo_participacion?.descripcion}
								{#if p.tipo_participacion?.descripcion === 'Especie'}
									- {p.especie}
								{/if}
								({p.unidad_medida})
							</option>
						{/each}
					</select>
				</div>

				{#if selectedParticipacion}
					<div class="mt-6" transition:slide>
						<label
							for="cantidad"
							class="mb-1 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase"
						>
							Cantidad {#if esMonetaria}($){/if}
						</label>
						<div class="relative">
							<input
								id="cantidad"
								type="number"
								min="0.01"
								step="any"
								bind:value={cantidadAporte}
								placeholder="0"
								class="w-full rounded-xl border-2 border-slate-100 bg-slate-50 p-4 font-medium text-slate-700 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
							/>
							<div
								class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium text-slate-400"
							>
								{selectedParticipacion.unidad_medida}
							</div>
						</div>
					</div>
				{/if}
			</section>

			<!-- Carga de Evidencia -->
			{#if selectedParticipacion}
				<section
					class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
					transition:slide
				>
					<div class="mb-6 flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-lg font-bold text-slate-900">
							<span
								class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600"
								>2</span
							>
							Evidencia de aporte
						</h2>
						<button
							onclick={abrirModalSubirArchivos}
							class="rounded-lg px-3 py-1.5 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700"
						>
							+ Agregar archivos
						</button>
					</div>

					<div class="space-y-4">
						{#if evidenciasNuevas.length === 0}
							<button
								onclick={abrirModalSubirArchivos}
								class="group flex w-full flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-center transition-all hover:border-blue-300 hover:bg-blue-50/30"
							>
								<div
									class="rounded-full bg-slate-50 p-3 text-slate-300 transition-colors group-hover:text-blue-400"
								>
									<Upload size={24} />
								</div>
								<div>
									<p class="text-sm font-bold text-slate-600">Subir comprobante o foto</p>
									<p class="text-xs text-slate-400">PDF, JPG, PNG</p>
								</div>
							</button>
						{:else}
							<div class="grid grid-cols-1 gap-3">
								{#each evidenciasNuevas as evidencia, i}
									{#each evidencia.archivos as archivo}
										{@const Icon = getIconForFile(archivo.tipo_mime)}
										<div
											class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
										>
											<div class="flex items-center gap-3 overflow-hidden">
												<div class="shrink-0 rounded-lg bg-white p-2 text-slate-400">
													<Icon size={20} />
												</div>
												<div class="min-w-0">
													<p class="truncate text-sm font-bold text-slate-700">
														{archivo.file.name}
													</p>
													<p class="text-xs text-slate-400">
														{((archivo.tamanio_bytes || 0) / (1024 * 1024)).toFixed(2)} MB
													</p>
													<p class="mt-0.5 truncate text-[10px] font-medium text-slate-500 italic">
														"{archivo.descripcion}"
													</p>
												</div>
											</div>
											<button
												onclick={() => removeEvidencia(i)}
												class="p-2 text-slate-400 transition-colors hover:text-red-500"
											>
												<X size={18} />
											</button>
										</div>
									{/each}
								{/each}
							</div>
						{/if}
					</div>

					<div
						class="mt-4 flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"
					>
						<AlertCircle size={16} class="mt-0.5 shrink-0" />
						<p>
							Subir un comprobante facilita la validación de tu aporte por parte de la institución.
						</p>
					</div>
				</section>
			{/if}
		</div>

		<!-- Footer -->
		<footer class="mt-8 flex justify-end gap-3">
			<button
				onclick={cerrar}
				class="px-6 py-3 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
			>
				Cancelar
			</button>
			<Button
				label="Registrar aporte"
				disabled={!selectedParticipacion}
				size="md"
				onclick={guardarAporte}
				customClass="shadow-lg shadow-blue-200"
			/>
		</footer>
	</div>
</div>

<!-- Modal de Confirmación -->
{#if mostrarModalConfirmacion}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) cancelarSalida();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') cancelarSalida();
		}}
	>
		<div
			class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl md:rounded-3xl"
			transition:slide={{ duration: 300 }}
		>
			<!-- Header -->
			<div
				class="border-b border-slate-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8"
			>
				<div class="flex items-start gap-4">
					<div class="shrink-0 rounded-xl bg-amber-100 p-3 text-amber-600">
						<AlertCircle size={24} />
					</div>
					<div>
						<h3 id="modal-title" class="mb-2 text-xl font-black text-slate-900">
							¿Descartar cambios?
						</h3>
						<p class="text-sm leading-relaxed text-slate-600">
							Tenés cambios sin guardar. Si salís ahora, se perderán todas las modificaciones
							realizadas.
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="bg-slate-50/50 p-6 md:p-8">
				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
					<button
						onclick={cancelarSalida}
						class="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-300 hover:text-slate-800"
					>
						Continuar editando
					</button>
					<button
						onclick={confirmarSalida}
						class="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:from-red-600 hover:to-red-700 hover:shadow-red-300"
					>
						Descartar cambios
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal de Subir Archivos -->
{#if mostrarModalSubirArchivos}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-upload-title"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) cerrarModalSubirArchivos();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') cerrarModalSubirArchivos();
		}}
	>
		<div
			class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:rounded-3xl"
			transition:slide={{ duration: 300 }}
		>
			<!-- Header -->
			<div class="border-b border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-4">
						<div class="shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600">
							<Upload size={24} />
						</div>
						<div>
							<h3 id="modal-upload-title" class="mb-2 text-xl font-black text-slate-900">
								Subir evidencia de entrada
							</h3>
							<p class="text-sm leading-relaxed text-slate-600">
								Seleccioná uno o más archivos y agregá una descripción para cada uno
							</p>
						</div>
					</div>
					<button
						onclick={cerrarModalSubirArchivos}
						class="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
						aria-label="Cerrar modal"
					>
						<X size={20} />
					</button>
				</div>
			</div>

			<!-- Content -->
			<div class="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
				<!-- File selector -->
				<div class="mb-6">
					<label class="block w-full cursor-pointer">
						<div
							class="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/30"
						>
							<div class="flex flex-col items-center gap-3">
								<div class="rounded-full bg-blue-100 p-4 text-blue-600">
									<FileStack size={32} />
								</div>
								<div>
									<p class="text-base font-bold text-slate-700">
										Hacé clic para seleccionar archivos
									</p>
									<p class="mt-1 text-sm text-slate-500">PDF, JPG, PNG (máx. 10MB por archivo)</p>
								</div>
							</div>
						</div>
						<input
							type="file"
							multiple
							class="hidden"
							accept="image/*,.pdf"
							onchange={handleFileSelection}
						/>
					</label>
				</div>

				<!-- Lista de archivos seleccionados -->
				{#if archivosTemporales.length > 0}
					<div class="space-y-4">
						<h4 class="text-sm font-black tracking-wider text-slate-400 uppercase">
							Archivos seleccionados ({archivosTemporales.length})
						</h4>

						{#each archivosTemporales as archivo (archivo.id_archivo)}
							{@const Icon = getIconForFile(archivo.tipo_mime)}
							<div
								class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
								transition:slide={{ duration: 200 }}
							>
								<!-- Archivo info -->
								<div class="flex items-start gap-3">
									<div class="shrink-0 rounded-xl bg-white p-2.5 text-slate-400">
										<Icon size={20} />
									</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-bold text-slate-800" title={archivo.file.name}>
											{archivo.file.name}
										</p>
										<p class="mt-0.5 text-xs text-slate-500">
											{archivo.tamanio_bytes
												? (archivo.tamanio_bytes / (1024 * 1024)).toFixed(1) + ' MB'
												: 'Desconocido'}
										</p>
									</div>
									<button
										onclick={() => eliminarArchivoTemporal(archivo.id_archivo!)}
										class="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
										aria-label="Eliminar archivo"
									>
										<X size={18} />
									</button>
								</div>

								<!-- Descripción input -->
								<div>
									<label
										for="desc-{archivo.id_archivo}"
										class="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase"
									>
										Descripción del archivo
									</label>
									<input
										id="desc-{archivo.id_archivo}"
										type="text"
										value={archivo.descripcion}
										oninput={(e) =>
											actualizarDescripcionArchivo(archivo.id_archivo!, e.currentTarget.value)}
										placeholder="Ej: Foto del material entregado"
										class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700
											   transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
									/>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<div class="flex justify-center border-t border-slate-100 bg-slate-50/50 p-6 md:p-8">
				<Button
					label="Confirmar archivos"
					onclick={agregarArchivosAEvidencia}
					disabled={archivosTemporales.length === 0}
					customClass="shadow-lg shadow-blue-200 px-12"
				/>
			</div>
		</div>
	</div>
{/if}
