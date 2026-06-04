<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { X } from 'lucide-svelte';

	interface DocumentoExistente {
		id_archivo: number;
		nombre_original: string | null;
		url: string;
		tipo_mime: string | null;
		tamanio_bytes: number | null;
		created_at: string | null;
	}

	interface Props {
		verificacionArca?: {
			id_verificacion: number;
			estado: string;
			fecha_vencimiento?: string | null;
		} | null;
		documentoExistente?: DocumentoExistente | null;
		motivoRechazo?: string | null;
		onsubmit: (detail: { file: File }) => void;
		ondelete?: () => Promise<void>;
		wizardMode?: boolean;
		onArchivoChange?: (archivo: File | null) => void;
	}

	let {
		verificacionArca = null,
		documentoExistente = null,
		motivoRechazo = null,
		onsubmit,
		ondelete = async () => {},
		wizardMode = false,
		onArchivoChange = undefined
	}: Props = $props();

	let inscriptaArca = $state(false);

	const MAX_SIZE_MB = 5;

	let archivoSeleccionado: File | null = $state(null);
	let errorFormulario: string | null = $state(null);
	let eliminando = $state(false);
	let mostrandoFormActualizacion = $state(false);

	const estaVencida = $derived(
		verificacionArca?.estado === 'aprobada' &&
			!!verificacionArca.fecha_vencimiento &&
			new Date(verificacionArca.fecha_vencimiento) <= new Date()
	);

	const estadoDisplay = $derived.by(() => {
		if (!verificacionArca) return 'sin_certificado';
		if (verificacionArca.estado === 'pendiente') return 'pendiente';
		if (verificacionArca.estado === 'aprobada') return estaVencida ? 'vencida' : 'aprobada';
		if (verificacionArca.estado === 'rechazada') return 'rechazada';
		return 'sin_certificado';
	});

	const puedeCargar = $derived(
		estadoDisplay === 'sin_certificado' ||
			estadoDisplay === 'rechazada' ||
			estadoDisplay === 'vencida' ||
			mostrandoFormActualizacion
	);

	function formatearFecha(iso: string | null | undefined) {
		if (!iso) return 'Fecha no disponible';
		const fecha = new Date(iso);
		if (isNaN(fecha.getTime())) return 'Fecha no disponible';
		return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	function formatearTamanio(bytes: number | null) {
		if (!bytes) return '';
		if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function seleccionarArchivo(event: Event) {
		const input = event.target as HTMLInputElement;
		const archivo = input.files?.[0] ?? null;
		input.value = '';
		errorFormulario = null;
		if (!archivo) return;
		if (archivo.type !== 'application/pdf') {
			errorFormulario = 'Solo se aceptan archivos PDF.';
			return;
		}
		if (archivo.size > MAX_SIZE_MB * 1024 * 1024) {
			errorFormulario = `El archivo no puede superar los ${MAX_SIZE_MB} MB.`;
			return;
		}
		archivoSeleccionado = archivo;
		onArchivoChange?.(archivo);
	}

	function enviar() {
		if (!archivoSeleccionado) {
			errorFormulario = 'Debés adjuntar el certificado de exención antes de continuar.';
			return;
		}
		errorFormulario = null;
		onsubmit({ file: archivoSeleccionado });
	}

	async function eliminar() {
		eliminando = true;
		try {
			await ondelete();
		} finally {
			eliminando = false;
		}
	}
</script>

<div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
	<div class="mb-6">
		<h2 class="text-lg font-semibold text-slate-900">Certificación ARCA <span class="text-sm font-normal text-slate-400">(opcional)</span></h2>
		<p class="mt-1 text-sm text-slate-600">
			Si tu institución está inscripta en el padrón de entidades exentas de ARCA (RG 2681), podés
			cargar el certificado de exención para que las empresas que colaboren con tus proyectos puedan
			deducir sus aportes del Impuesto a las Ganancias.
		</p>
	</div>

	{#if estadoDisplay === 'pendiente'}
		<div class="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-900">
			<p class="text-sm font-semibold">Tu certificado ARCA está en revisión</p>
			<p class="mt-1 text-sm">No podés editarlo hasta que el equipo de administración responda.</p>
			{#if documentoExistente}
				<div class="mt-4">
					<a
						href={documentoExistente.url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center rounded-md border border-sky-300 bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-200"
					>
						Ver certificado adjunto
					</a>
				</div>
			{/if}
		</div>

	{:else if estadoDisplay === 'aprobada'}
		<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
			<p class="text-sm font-semibold">Certificación ARCA aprobada</p>
			<p class="mt-1 text-sm">
				Vigente hasta: <strong>{formatearFecha(verificacionArca?.fecha_vencimiento)}</strong>
			</p>
			{#if documentoExistente}
				<div class="mt-3">
					<a
						href={documentoExistente.url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
					>
						Ver certificado
					</a>
				</div>
			{/if}
		</div>
		{#if !mostrandoFormActualizacion}
			<button
				type="button"
				class="mt-4 text-sm text-slate-500 underline hover:text-slate-700"
				onclick={() => (mostrandoFormActualizacion = true)}
			>
				Renovar o actualizar el certificado
			</button>
		{/if}

	{:else if estadoDisplay === 'vencida'}
		<div class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
			<p class="text-sm font-semibold">Tu certificado ARCA está vencido</p>
			<p class="mt-1 text-sm">
				Venció el <strong>{formatearFecha(verificacionArca?.fecha_vencimiento)}</strong>. Subí el
				nuevo certificado emitido por ARCA para renovarlo.
			</p>
		</div>

	{:else if estadoDisplay === 'rechazada'}
		<div class="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
			<p class="text-sm font-semibold">Tu certificado ARCA fue rechazado</p>
			{#if motivoRechazo}
				<p class="mt-2 rounded-xl border border-rose-300/70 bg-white/70 px-3 py-2 text-sm">
					<strong>Motivo:</strong> {motivoRechazo}
				</p>
			{/if}
			<p class="mt-2 text-sm">Podés corregirlo y volver a enviarlo.</p>
		</div>
	{/if}

	{#if puedeCargar}
		{#if wizardMode}
			<label class="mt-4 flex cursor-pointer items-start gap-3">
				<input
					type="checkbox"
					bind:checked={inscriptaArca}
					class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
				/>
				<span class="text-sm leading-snug text-slate-800">
					Mi institución está inscripta en el padrón de entidades exentas de ARCA (RG 2681)
				</span>
			</label>
		{/if}
	{/if}

	{#if puedeCargar && (!wizardMode || inscriptaArca)}
		<div class="mt-6 space-y-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-6 sm:p-8">
			{#if documentoExistente && (estadoDisplay === 'rechazada' || estadoDisplay === 'vencida' || mostrandoFormActualizacion)}
				<div class="rounded-lg border border-sky-200 bg-sky-50 p-4">
					<p class="text-sm font-semibold text-sky-900">Certificado actual</p>
					<div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-slate-900">
								{documentoExistente.nombre_original ?? 'Certificado ARCA'}
							</p>
							{#if documentoExistente.tamanio_bytes}
								<p class="text-xs text-slate-500">{formatearTamanio(documentoExistente.tamanio_bytes)}</p>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							<a
								href={documentoExistente.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center rounded-md border border-sky-300 bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-200"
							>
								Abrir
							</a>
							<button
								type="button"
								disabled={eliminando}
								class="inline-flex items-center rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
								onclick={eliminar}
							>
								{eliminando ? 'Eliminando…' : 'Eliminar'}
							</button>
						</div>
					</div>
				</div>
			{/if}

			<div class="space-y-2">
				<label class="block text-sm font-medium text-slate-900" for="certificado-arca">
					Subí el certificado de exención emitido por ARCA (RG 2681)
				</label>
				<input
					id="certificado-arca"
					type="file"
					accept=".pdf"
					class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
					onchange={seleccionarArchivo}
					aria-describedby="ayuda-arca"
				/>
				<p id="ayuda-arca" class="text-xs text-slate-500">Solo PDF · Máximo {MAX_SIZE_MB} MB</p>
			</div>

			{#if archivoSeleccionado}
				<div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
					<span class="truncate pr-4 text-slate-800">{archivoSeleccionado.name}</span>
					<div class="flex items-center gap-3">
						<span class="text-xs whitespace-nowrap text-slate-500">
							{formatearTamanio(archivoSeleccionado.size)}
						</span>
						<button
							type="button"
							class="text-slate-400 transition hover:text-red-500"
							onclick={() => { archivoSeleccionado = null; onArchivoChange?.(null); }}
							aria-label="Quitar archivo seleccionado"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/if}

			{#if errorFormulario}
				<p role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
					{errorFormulario}
				</p>
			{/if}

			{#if !wizardMode}
				<div class="flex justify-end gap-3 pt-2">
					{#if mostrandoFormActualizacion}
						<Button
							type="button"
							variant="secondary"
							label="Cancelar"
							onclick={() => { mostrandoFormActualizacion = false; archivoSeleccionado = null; errorFormulario = null; }}
						/>
					{/if}
					<Button
						type="button"
						label="Enviar para revisión"
						onclick={enviar}
						disabled={!archivoSeleccionado}
						ariaDisabled={!archivoSeleccionado}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>
