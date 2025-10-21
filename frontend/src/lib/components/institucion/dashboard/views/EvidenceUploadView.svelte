<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { FileDown, UploadCloud } from 'lucide-svelte';

	import {
		BG_CARD,
		BORDER_SUBTLE,
		PRIMARY_500,
		RING_AZURE_25,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from '../tokens';
	import type { EvidenceRecord, EvidenceUploadContext } from '../types';
	import { extractExtension, formatFileSizeMB, formatReadableDate } from '../utils/upload';

	const dispatch = createEventDispatcher<{ cancel: void }>();

	export let context: EvidenceUploadContext;

	const nowLabel = formatReadableDate(new Date());
	const entryEvidence: EvidenceRecord = context.entryEvidence;
	const entryEvidencePreviewUrl = entryEvidence.previewUrl ?? null;
	const entryEvidencePreviewImageUrl = entryEvidence.previewImageUrl ?? null;
	const entryEvidencePreviewAlt =
		entryEvidence.previewImageAlt ??
		'Vista previa ilustrativa de la evidencia de entrada compartida.';

	let exitEvidenceDescription = '';
	let selectedFiles: File[] = [];
	let rejectedFiles: string[] = [];
	let submissionError: string | null = null;
	let isDragOver = false;
	let maxFileSizeBytes = 0;
	let maxFileSizeLabel = '';
	let previewImageFailed = false;

	const primaryButtonStyle = `background:${PRIMARY_500}; color:${TEXT_100}; --tw-ring-color:${RING_AZURE_25};`;
	const ghostButtonStyle = `border-color:${PRIMARY_500}; color:${PRIMARY_500}; --tw-ring-color:${RING_AZURE_25};`;
	const featureCardStyle = `background:${BG_CARD}; border-color:${BORDER_SUBTLE}; color:${TEXT_100};`;
	const previewShellStyle = `border-color:${BORDER_SUBTLE}; background:linear-gradient(135deg, rgba(10,18,51,0.6), rgba(21,28,57,0.4));`;

	const handlePreviewImageError = () => {
		previewImageFailed = true;
	};

	const handleCancel = () => {
		selectedFiles = [];
		rejectedFiles = [];
		exitEvidenceDescription = '';
		submissionError = null;
		dispatch('cancel');
	};

	$: acceptedFormats = context.allowedFormats.map((format) => `.${format}`).join(',');
	$: allowedFormatsCopy = context.allowedFormats.map((format) => format.toUpperCase()).join(', ');
	$: maxFileSizeBytes = context.maxFileSizeMB * 1024 * 1024;
	$: maxFileSizeLabel = `${context.maxFileSizeMB} MB`;
	$: selectedFileNames = selectedFiles.length
		? selectedFiles.map((file) => file.name).join(', ')
		: 'Sin archivos seleccionados';
	$: selectedExtensions = selectedFiles.length
		? Array.from(
				new Set(
					selectedFiles
						.map((file) => extractExtension(file.name))
						.filter((ext): ext is string => Boolean(ext))
				)
			)
				.map((ext) => ext.toUpperCase())
				.join(', ')
		: 'Pendiente';

	const handleFiles = (fileList: FileList | null) => {
		if (!fileList) return;

		const accepted: File[] = [];
		const rejected: string[] = [];
		const allowedSet = new Set(context.allowedFormats);
		const dedupe = new Set(selectedFiles.map((file) => `${file.name}-${file.size}`));

		Array.from(fileList).forEach((file) => {
			const extension = extractExtension(file.name);
			if (!extension || !allowedSet.has(extension as (typeof context.allowedFormats)[number])) {
				rejected.push(`${file.name} (formato no permitido)`);
				return;
			}

			if (file.size > maxFileSizeBytes) {
				rejected.push(`${file.name} (supera ${maxFileSizeLabel})`);
				return;
			}

			const dedupeKey = `${file.name}-${file.size}`;
			if (!dedupe.has(dedupeKey)) {
				dedupe.add(dedupeKey);
				accepted.push(file);
			}
		});

		if (accepted.length) {
			selectedFiles = [...selectedFiles, ...accepted];
		}

		rejectedFiles = rejected;
	};

	const handleInputChange = (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		handleFiles(input.files);
		input.value = '';
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragOver = false;
		handleFiles(event.dataTransfer?.files ?? null);
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		isDragOver = true;
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		isDragOver = false;
	};

	const handleSubmit = () => {
		submissionError = null;
		if (!selectedFiles.length) {
			submissionError = 'Seleccioná al menos un archivo de evidencia de salida.';
			return;
		}
		if (!exitEvidenceDescription.trim()) {
			submissionError = 'Completá la descripción de la evidencia de salida.';
			return;
		}
	};
</script>

<form
	class="space-y-10 rounded-[32px] border px-6 py-8 shadow-2xl lg:px-10"
	style={`border-color:${BORDER_SUBTLE}; background:linear-gradient(160deg, rgba(14,24,54,0.96), rgba(9,14,32,0.85)); color:${TEXT_100};`}
	on:submit|preventDefault={handleSubmit}
	aria-labelledby="evidence-upload-heading"
>
	<header class="space-y-6">
		<div
			class="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]"
		>
			<span
				class="rounded-full px-4 py-1"
				style={`background:${PRIMARY_500}21; color:${PRIMARY_500};`}
			>
				Proyecto · {context.projectName}
			</span>
		</div>
		<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div class="space-y-2">
				<h2
					id="evidence-upload-heading"
					class="text-3xl font-bold tracking-tight text-white sm:text-4xl"
				>
					Cargar evidencia
				</h2>
				<p class="max-w-3xl text-sm sm:text-base" style={`color:${TEXT_300};`}>
					{context.instructions}
				</p>
			</div>
		</div>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
		<article
			class="flex h-full flex-col gap-6 rounded-3xl border p-6"
			style={featureCardStyle}
			aria-labelledby="entry-evidence-title"
		>
			<header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div class="space-y-2">
					<p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
						Evidencia de entrada
					</p>
					<h3 id="entry-evidence-title" class="text-xl font-semibold text-white">
						{entryEvidence.fileName}
					</h3>
					<p class="text-sm" style={`color:${TEXT_300};`}>
						{entryEvidence.description}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<span
						class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase"
						style={`background:${PRIMARY_500}26; color:${PRIMARY_500};`}
					>
						{entryEvidence.fileExtension}
					</span>
				</div>
			</header>

			<figure class="overflow-hidden rounded-2xl border" style={previewShellStyle}>
				{#if entryEvidencePreviewImageUrl && !previewImageFailed}
					<img
						src={entryEvidencePreviewImageUrl}
						alt={entryEvidencePreviewAlt}
						class="h-72 w-full object-cover object-center"
						loading="lazy"
						decoding="async"
						on:error={handlePreviewImageError}
					/>
				{:else if entryEvidencePreviewUrl}
					<object
						data={entryEvidencePreviewUrl}
						type={entryEvidence.mimeType}
						class="h-72 w-full"
						aria-label={`Vista previa de ${entryEvidence.fileName}`}
					>
						<p class="p-5 text-sm" style={`color:${TEXT_300};`}>
							La vista previa no está disponible. Podés descargar el archivo para revisarlo en
							detalle.
						</p>
					</object>
				{:else}
					<div
						class="flex h-72 w-full items-center justify-center p-5 text-sm"
						style={`color:${TEXT_300};`}
					>
						<p>
							La vista previa no está disponible. Podés descargar el archivo para revisarlo en
							detalle.
						</p>
					</div>
				{/if}
				<figcaption
					class="border-t px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/60"
					style={`border-color:${BORDER_SUBTLE};`}
				>
					{entryEvidence.fileExtension.toUpperCase()} · {entryEvidence.mimeType}
				</figcaption>
			</figure>

			<dl class="grid gap-4 text-sm sm:grid-cols-2">
				<div class="space-y-1">
					<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Fecha de subida</dt>
					<dd class="font-medium text-white/90">{formatReadableDate(entryEvidence.uploadedAt)}</dd>
				</div>
				<div class="space-y-1">
					<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Tipo de evidencia</dt>
					<dd class="font-medium text-white/90">Entrada</dd>
				</div>
				<div class="space-y-1 sm:col-span-2">
					<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Subida por</dt>
					<dd class="font-medium text-white/90">{entryEvidence.uploadedBy}</dd>
				</div>
			</dl>
		</article>

		<section
			class="flex h-full flex-col gap-6 rounded-3xl border p-6"
			style={featureCardStyle}
			aria-labelledby="exit-evidence-title"
		>
			<header class="space-y-2">
				<p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
					Evidencia de salida
				</p>
				<h3 id="exit-evidence-title" class="text-xl font-semibold text-white">
					Añadí tus archivos
				</h3>
				<p class="text-sm" style={`color:${TEXT_300};`}>
					Formatos compatibles: {allowedFormatsCopy}. Límite por archivo {maxFileSizeLabel}.
				</p>
			</header>

			<div class="space-y-3">
				<label
					class="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition"
					class:border-solid={isDragOver}
					style={`border-color:${isDragOver ? PRIMARY_500 : BORDER_SUBTLE}; background:rgba(15,17,45,0.35); color:${TEXT_100};`}
					for="exit-evidence-input"
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
					aria-describedby="exit-evidence-hint"
					aria-label="Añadí archivos de salida"
				>
					<UploadCloud
						class="h-12 w-12 text-white/70 transition-transform group-hover:scale-105"
						aria-hidden="true"
					/>
					<div class="space-y-1">
						<p class="text-base font-semibold text-white">
							Soltá archivos aquí o hacé clic para buscar
						</p>
						<p class="text-xs text-white/60">
							Podés cargar más de un archivo y ordenarlos luego en la revisión final.
						</p>
					</div>
					<input
						id="exit-evidence-input"
						class="sr-only"
						type="file"
						multiple
						accept={acceptedFormats}
						on:change={handleInputChange}
					/>
				</label>
				<p id="exit-evidence-hint" class="text-xs text-white/60">
					Arrastrá y soltá tus archivos o seleccioná desde tu dispositivo.
				</p>
			</div>

			{#if rejectedFiles.length}
				<div
					class="rounded-2xl border p-3 text-sm"
					style={`border-color:${PRIMARY_500}66; color:${TEXT_100}; background:rgba(11,152,250,0.12);`}
					role="alert"
					aria-live="polite"
				>
					<p class="font-semibold">Algunos archivos fueron rechazados:</p>
					<ul class="mt-2 list-disc space-y-1 pl-5 text-xs text-white/80">
						{#each rejectedFiles as rejected}
							<li>{rejected}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div class="space-y-4">
				<div class="space-y-2">
					<label class="text-sm font-semibold text-white" for="exit-evidence-description">
						Descripción de la evidencia de salida
					</label>
					<textarea
						id="exit-evidence-description"
						class="min-h-[140px] w-full rounded-2xl border bg-transparent p-4 text-sm text-white transition-colors focus:outline-none focus:ring-2"
						style={`border-color:${BORDER_SUBTLE}; --tw-ring-color:${RING_AZURE_25};`}
						bind:value={exitEvidenceDescription}
						maxlength={400}
						placeholder="Ejemplo: Fotografías de aulas iluminadas y acta de recepción firmada."
						aria-describedby="description-help"
					></textarea>
					<div
						class="flex items-center justify-between text-xs text-white/60"
						id="description-help"
					>
						<span>Máximo 400 caracteres.</span>
						<span aria-live="polite">{exitEvidenceDescription.length} / 400</span>
					</div>
				</div>

				<div class="space-y-3">
					<h4 class="text-sm font-semibold text-white">Archivos seleccionados</h4>
					{#if selectedFiles.length}
						<ul class="space-y-2" aria-live="polite">
							{#each selectedFiles as file (file.name + file.size)}
								<li
									class="rounded-2xl border p-3 text-sm"
									style={`border-color:${BORDER_SUBTLE}; background:rgba(255,255,255,0.04);`}
								>
									<p class="font-semibold text-white">{file.name}</p>
									<p class="text-xs text-white/60">
										Extensión: {extractExtension(file.name)?.toUpperCase() ?? 'N/A'} · Tamaño: {formatFileSizeMB(
											file.size
										)}
									</p>
								</li>
							{/each}
						</ul>
					{:else}
						<p
							class="rounded-2xl border border-dashed p-3 text-sm text-white/60"
							style={`border-color:${BORDER_SUBTLE};`}
						>
							Aún no seleccionaste archivos.
						</p>
					{/if}
				</div>

				<dl class="grid gap-4 text-sm sm:grid-cols-2">
					<div class="space-y-1">
						<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Archivos</dt>
						<dd class="font-medium text-white/90">{selectedFileNames}</dd>
					</div>
					<div class="space-y-1">
						<dt class="text-xs uppercase tracking-[0.18em] text-white/60">
							Extensiones detectadas
						</dt>
						<dd class="font-medium text-white/90">{selectedExtensions}</dd>
					</div>
					<div class="space-y-1">
						<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Fecha de subida</dt>
						<dd class="font-medium text-white/90">{nowLabel} (se registrará al confirmar)</dd>
					</div>
					<div class="space-y-1">
						<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Evidencia</dt>
						<dd class="font-medium text-white/90">Salida</dd>
					</div>
					<div class="space-y-1 sm:col-span-2">
						<dt class="text-xs uppercase tracking-[0.18em] text-white/60">Se subirá como</dt>
						<dd class="font-medium text-white/90">{context.uploadingEntity}</dd>
					</div>
				</dl>
			</div>
		</section>
	</div>

	{#if submissionError}
		<p
			class="rounded-2xl border px-4 py-3 text-sm font-semibold"
			style={`border-color:${PRIMARY_500}; color:${PRIMARY_500};`}
			role="alert"
			aria-live="assertive"
		>
			{submissionError}
		</p>
	{/if}

	<div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
		<button
			type="button"
			class="min-w-[160px] rounded-3xl border px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-transform duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2"
			style={ghostButtonStyle}
			on:click={handleCancel}
		>
			Cancelar
		</button>
		<button
			type="submit"
			class="min-w-[180px] rounded-3xl px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4"
			style={primaryButtonStyle}
		>
			Subir evidencia
		</button>
	</div>
</form>
