<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { X } from 'lucide-svelte';

	type MetodoVerificacion = 'manual' | 'renaper' | 'omitido';

interface DocumentoExistente {
	id_archivo: number;
	nombre_original: string | null;
	url: string;
	tipo_mime: string | null;
	tamanio_bytes: number | null;
	created_at: string | null;
}

	interface Props {
		permitirOmitir?: boolean;
		onsubmit: (detail: { files: File[] }) => void;
	documentosExistentes?: DocumentoExistente[];
	ondeleteexisting?: (idArchivo: number) => Promise<void>;
		onskip?: () => void;
		oncancel?: () => void;
	}

	let {
		permitirOmitir = true,
		onsubmit,
		documentosExistentes = [],
		ondeleteexisting = async () => {},
		onskip = () => {},
		oncancel = () => {}
	}: Props = $props();

	let metodoSeleccionado: MetodoVerificacion = $state('manual');
	let archivosSeleccionados: File[] = $state([]);
	let aceptoDeclaracion = $state(false);
	let errorFormulario: string | null = $state(null);
	let avisoArchivosMostrado = $state(false);

	let botonEnviarDeshabilitado = $derived(!aceptoDeclaracion);

	const renaperDisponible = false;
	const MAX_FILES = 5;

	$effect(() => {
		if (!permitirOmitir && metodoSeleccionado === 'omitido') {
			metodoSeleccionado = 'manual';
		}
	});

	function actualizarArchivos(event: Event) {
		const input = event.target as HTMLInputElement;
		const nuevosArchivos = Array.from(input.files ?? []);
		let archivosAgregados = 0;
		let duplicadosIgnorados = 0;

		if (nuevosArchivos.length) {
			const archivosValidos: File[] = [];

			nuevosArchivos.forEach((nuevo) => {
				const esDuplicado = archivosSeleccionados.some(
					(existente) => existente.name === nuevo.name && existente.size === nuevo.size
				);

				if (esDuplicado) {
					duplicadosIgnorados++;
				} else {
					archivosValidos.push(nuevo);
				}
			});

			if (archivosSeleccionados.length + archivosValidos.length > MAX_FILES) {
				const espacioDisponible = MAX_FILES - archivosSeleccionados.length;
				if (espacioDisponible > 0) {
					archivosSeleccionados = [
						...archivosSeleccionados,
						...archivosValidos.slice(0, espacioDisponible)
					];
					archivosAgregados = espacioDisponible;
				}

				toastStore.show({
					variant: 'warning',
					title: 'Límite de archivos',
					message: `Solo se permiten hasta ${MAX_FILES} archivos. Se han agregado los que cabían.`
				});
			} else {
				archivosSeleccionados = [...archivosSeleccionados, ...archivosValidos];
				archivosAgregados = archivosValidos.length;
			}

			if (duplicadosIgnorados > 0) {
				toastStore.show({
					variant: 'warning',
					title: 'Archivos duplicados',
					message: `Se ignoraron ${duplicadosIgnorados} archivo(s) que ya estaban en la lista.`
				});
			}

			if (!avisoArchivosMostrado && archivosAgregados > 0) {
				toastStore.show({
					variant: 'info',
					title: 'Documentación recibida',
					message: 'Tus archivos se guardan cifrados y nuestro equipo los revisará manualmente.'
				});
				avisoArchivosMostrado = true;
			}
		}

		input.value = '';
	}

	function removerArchivo(index: number) {
		archivosSeleccionados = archivosSeleccionados.filter((_, i) => i !== index);
	}

	function formatearTamanio(bytes: number | null) {
		if (!bytes) return 'Tamaño no disponible';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatearFecha(fechaIso: string | null) {
		if (!fechaIso) return 'Fecha no disponible';
		const fecha = new Date(fechaIso);
		if (Number.isNaN(fecha.getTime())) return 'Fecha no disponible';
		return fecha.toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	async function eliminarDocumentoExistente(idArchivo: number) {
		try {
			await ondeleteexisting(idArchivo);
			documentosExistentes = documentosExistentes.filter((doc) => doc.id_archivo !== idArchivo);
			toastStore.show({
				variant: 'success',
				title: 'Archivo eliminado',
				message: 'El documento se eliminó correctamente.'
			});
		} catch (error) {
			toastStore.show({
				variant: 'error',
				title: 'No se pudo eliminar',
				message:
					error instanceof Error
						? error.message
						: 'No pudimos eliminar el documento. Intentá nuevamente.'
			});
		}
	}

	function enviarDocumentos() {
		if (metodoSeleccionado !== 'manual') {
			return;
		}

		if (!archivosSeleccionados.length) {
			errorFormulario = 'Debés adjuntar al menos un documento antes de continuar.';
			return;
		}

		if (!aceptoDeclaracion) {
			errorFormulario = 'Debés aceptar la declaración para continuar.';
			return;
		}

		errorFormulario = null;
		onsubmit({ files: archivosSeleccionados });
	}

	function omitirRevision() {
		metodoSeleccionado = 'omitido';
		errorFormulario = null;
		onskip?.();
	}

	function cancelar() {
		errorFormulario = null;
		oncancel?.();
	}
</script>

<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8">
	<fieldset
		class="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10"
		aria-describedby="metodo-ayuda"
	>
		<legend class="sr-only">Métodos de verificación</legend>
		<div class="grid gap-4 md:grid-cols-3" id="metodo-ayuda">
			<label
				class={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 text-left transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 sm:p-6 ${metodoSeleccionado === 'manual' ? 'border-blue-600 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white'}`}
			>
				<div class="flex items-center justify-between">
					<div>
						<span class="text-base font-semibold text-gray-900"> Revisión documental manual </span>
						<p class="mt-1 text-sm text-gray-600">
							Subí documentación respaldatoria para que nuestro equipo la revise.
						</p>
					</div>
					<input
						type="radio"
						name="metodo"
						value="manual"
						class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
						bind:group={metodoSeleccionado}
						aria-label="Seleccionar revisión documental manual"
					/>
				</div>
				<span class="text-xs font-medium tracking-wide text-blue-700 uppercase"> Recomendado </span>
			</label>

			<label
				class={`group relative flex cursor-not-allowed flex-col gap-3 rounded-2xl border p-5 text-left opacity-60 sm:p-6 ${metodoSeleccionado === 'renaper' ? 'border-blue-600 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white'}`}
				aria-disabled="true"
			>
				<div class="flex items-center justify-between">
					<div>
						<span class="text-base font-semibold text-gray-900">RENAPER (próximamente)</span>
						<p class="mt-1 text-sm text-gray-600">Validación con organismos estatales.</p>
					</div>
					<input
						type="radio"
						name="metodo"
						value="renaper"
						class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
						bind:group={metodoSeleccionado}
						aria-label="RENAPER disponible próximamente"
						disabled={!renaperDisponible}
					/>
				</div>
				<span class="text-xs font-medium tracking-wide text-gray-500 uppercase"> Bloqueado </span>
			</label>

			{#if permitirOmitir}
				<label
					class={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 text-left transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 sm:p-6 ${metodoSeleccionado === 'omitido' ? 'border-blue-600 bg-blue-50/60 shadow-lg' : 'border-gray-200 bg-white'}`}
				>
					<div class="flex items-center justify-between">
						<div>
							<span class="text-base font-semibold text-gray-900">Omitir por ahora</span>
							<p class="mt-1 text-sm text-gray-600">
								Podrás completar la verificación cuando lo necesites.
							</p>
						</div>
						<input
							type="radio"
							name="metodo"
							value="omitido"
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
							bind:group={metodoSeleccionado}
							aria-label="Omitir verificación por ahora"
						/>
					</div>
					<span class="text-xs font-medium tracking-wide text-gray-500 uppercase">
						Sin validación inmediata
					</span>
				</label>
			{/if}
		</div>

		{#if metodoSeleccionado === 'manual'}
			<div
				class="mt-10 space-y-6 rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-6 sm:p-8"
			>
				<p class="text-sm text-gray-700 sm:text-base">
					Subí documentos que respalden la existencia y legitimidad de tu institución. Solo los
					revisará nuestro equipo de validación.
				</p>
				<div class="space-y-3 text-sm text-gray-700">
					<p class="font-semibold text-gray-900">Lista de documentos aceptados:</p>
					<ul class="list-disc space-y-1 pl-6">
						<li>Estatuto social o acta constitutiva</li>
						<li>Constancia de CUIT o registro impositivo</li>
						<li>Certificación oficial emitida por organismo estatal</li>
					</ul>
				</div>

				<div class="space-y-2">
					{#if documentosExistentes.length}
						<div class="mb-3 rounded-lg border border-sky-200 bg-sky-50 p-4">
							<p class="text-sm font-semibold text-sky-900">Documentos ya enviados</p>
							<p class="mt-1 text-xs text-sky-800">
								Podés abrirlos para revisarlos o eliminarlos si querés reemplazarlos.
							</p>
							<ul class="mt-3 space-y-2">
								{#each documentosExistentes as doc (doc.id_archivo)}
									<li
										class="flex flex-col gap-3 rounded-lg border border-sky-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
									>
										<div class="min-w-0">
											<p
												class="truncate text-sm font-medium text-slate-900"
												title={doc.nombre_original ?? 'Documento'}
											>
												{doc.nombre_original ?? `Documento #${doc.id_archivo}`}
											</p>
											<p class="text-xs text-slate-500">
												{formatearTamanio(doc.tamanio_bytes)} · Subido el {formatearFecha(doc.created_at)}
											</p>
										</div>
										<div class="flex items-center gap-2">
											<a
												href={doc.url}
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center rounded-md border border-sky-300 bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-200"
											>
												Abrir
											</a>
											<button
												type="button"
												class="inline-flex items-center rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
												onclick={() => eliminarDocumentoExistente(doc.id_archivo)}
											>
												Eliminar
											</button>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<label class="block text-sm font-medium text-gray-900" for="documentos">
						Documentación respaldatoria
					</label>
					<input
						id="documentos"
						name="documentos"
						type="file"
						class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
						multiple
						onchange={actualizarArchivos}
						aria-describedby="ayuda-documentos"
					/>
					<p id="ayuda-documentos" class="text-xs text-gray-500">
						Podés adjuntar varios archivos en formatos PDF, JPG o DOC.
					</p>

					{#if archivosSeleccionados.length}
						<ul
							class="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white text-sm text-gray-700"
						>
							{#each archivosSeleccionados as archivo, i (archivo.name + archivo.size)}
								<li class="flex items-center justify-between px-4 py-2">
									<span class="truncate pr-4" title={archivo.name}>{archivo.name}</span>
									<div class="flex items-center gap-4">
										<span class="text-xs whitespace-nowrap text-gray-500"
											>{Math.ceil(archivo.size / 1024)} KB</span
										>
										<button
											type="button"
											class="text-gray-400 transition hover:text-red-500 focus:text-red-500 focus:outline-none"
											onclick={() => removerArchivo(i)}
											aria-label={`Quitar archivo ${archivo.name}`}
										>
											<X class="h-4 w-4" />
										</button>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="flex items-start gap-3">
					<input
						id="declaracion"
						type="checkbox"
						bind:checked={aceptoDeclaracion}
						class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
					/>
					<label for="declaracion" class="text-sm text-gray-700">
						Declaro que la información es veraz y autorizo su tratamiento para la verificación de
						identidad
					</label>
				</div>

				{#if errorFormulario}
					<p
						role="alert"
						class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
					>
						{errorFormulario}
					</p>
				{/if}

				<div class="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
					<Button
						type="button"
						variant="secondary"
						label="Cancelar"
						onclick={cancelar}
						customClass="w-full sm:w-auto"
					/>
					<Button
						type="button"
						label="Enviar"
						onclick={enviarDocumentos}
						customClass="w-full sm:w-auto"
						disabled={botonEnviarDeshabilitado}
						ariaDisabled={botonEnviarDeshabilitado}
					/>
				</div>
			</div>
		{:else if metodoSeleccionado === 'renaper'}
			<div
				class="mt-10 space-y-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600 sm:p-8"
			>
				<p>
					Estamos trabajando para habilitar la verificación automática con RENAPER. Te avisaremos
					cuando esté disponible.
				</p>
			</div>
		{:else if permitirOmitir}
			<div
				class="mt-10 space-y-6 rounded-2xl border border-dashed border-yellow-200 bg-yellow-50 p-6 text-center text-sm text-gray-700 sm:p-8"
			>
				<p>
					Podés continuar sin verificar tu institución por ahora. Recordá que necesitarás completar
					este paso antes de publicar proyectos.
				</p>
				<div class="flex justify-center">
					<Button type="button" label="Omitir verificación" onclick={omitirRevision} />
				</div>
			</div>
		{/if}
	</fieldset>
</div>
