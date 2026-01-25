<script lang="ts">
	import { ExternalLink, Download, X, Pencil } from 'lucide-svelte';
	import { obtenerIconoArchivo, formatearBytes } from '$lib/utils/archivos';
	import type { Archivo } from '$lib/domain/types/Archivo';

	interface Props {
		archivo: Archivo & { uploader_nombre?: string; fecha_formateada?: string };
		variant?: 'default' | 'compact' | 'upload'; // default: lista normal, compact: para espacios reducidos, upload: para lista de subida
		editable?: boolean;
		deletable?: boolean;
		showUploader?: boolean;
		customClass?: string;
		ondelete?: (id: number) => void;
		onedit?: (archivo: Archivo) => void;
	}

	let {
		archivo,
		variant = 'default',
		editable = false,
		deletable = false,
		showUploader = false,
		customClass = '',
		ondelete,
		onedit
	}: Props = $props();

	const Icon = obtenerIconoArchivo(archivo.tipo_mime);
	const fecha =
		archivo.fecha_formateada ||
		(archivo.created_at ? new Date(archivo.created_at).toLocaleDateString('es-AR') : '');
	const tamano = formatearBytes(archivo.tamanio_bytes);
</script>

<div
	class="group flex w-full min-w-0 items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 {customClass}"
>
	<div class="flex min-w-0 flex-1 items-center gap-3 overflow-hidden pr-3">
		<div
			class="shrink-0 rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
		>
			<Icon size={variant === 'compact' ? 18 : 22} />
		</div>
		<div class="min-w-0 flex-1">
			<p
				class="truncate text-sm font-bold text-slate-800"
				title={archivo.descripcion || archivo.nombre_original}
			>
				{archivo.descripcion || archivo.nombre_original}
			</p>

			{#if variant !== 'compact'}
				{#if archivo.nombre_original && archivo.descripcion && archivo.nombre_original !== archivo.descripcion}
					<p
						class="mt-0.5 truncate text-xs font-medium text-slate-400"
						title={archivo.nombre_original}
					>
						{archivo.nombre_original}
					</p>
				{/if}
			{/if}

			<div
				class="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium tracking-wider text-slate-500 uppercase"
			>
				{#if showUploader && archivo.uploader_nombre}
					<span
						class="max-w-[80px] truncate rounded bg-blue-50 px-1.5 py-0.5 text-blue-600 sm:max-w-[150px]"
						title={archivo.uploader_nombre}
					>
						{archivo.uploader_nombre}
					</span>
					<span class="text-slate-300">•</span>
				{/if}

				<span class="whitespace-nowrap">{tamano}</span>

				{#if fecha}
					<span class="text-slate-300">•</span>
					<span class="whitespace-nowrap">{fecha}</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex shrink-0 items-center gap-1">
		{#if editable}
			<button
				class="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
				title="Editar"
				onclick={() => onedit?.(archivo)}
			>
				<Pencil size={16} />
			</button>
		{/if}

		{#if archivo.url}
			<a
				href={archivo.url}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
				title="Ver en nueva pestaña"
			>
				<ExternalLink size={16} />
			</a>
			<a
				href={archivo.url}
				download
				class="hidden rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 sm:block"
				title="Descargar"
			>
				<Download size={16} />
			</a>
		{/if}

		{#if deletable}
			<button
				class="rounded-lg p-2 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
				title="Eliminar"
				onclick={() => ondelete?.(archivo.id_archivo!)}
			>
				<X size={18} />
			</button>
		{/if}
	</div>
</div>
