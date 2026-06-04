<script lang="ts">
	import ValidacionInstitucion from '$lib/validation/components/ValidacionInstitucion.svelte';
	import CertificacionArca from '$lib/validation/components/CertificacionArca.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { goto, invalidateAll } from '$app/navigation';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { onMount, untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	type DocumentoExistente = {
		id_archivo: number;
		nombre_original: string | null;
		url: string;
		tipo_mime: string | null;
		tamanio_bytes: number | null;
		created_at: string | null;
	};

	const verificacionInstitucional = $derived(data.verificacionInstitucional);
	const motivoRechazo = $derived(data.motivoRechazo);
	let documentosVerificacion = $state<DocumentoExistente[]>(
		untrack(() => (data.documentosVerificacion as DocumentoExistente[]) ?? [])
	);

	const estado = $derived(verificacionInstitucional?.estado ?? null);
	const enEdicion = $derived(estado === 'aprobada' || estado === 'rechazada');

	// --- Tabs ---
	let tabActiva = $state<'institucional' | 'arca'>('institucional');

	// Indicador visual para el chip ARCA
	const indicadorArca = $derived.by((): 'success' | 'warning' | 'error' | null => {
		const v = data.verificacionArca;
		if (!v) return null;
		if (v.estado === 'rechazada') return 'error';
		if (v.estado === 'pendiente') return 'warning';
		if (v.estado === 'aprobada') {
			if (v.fecha_vencimiento && new Date(v.fecha_vencimiento) <= new Date()) return 'error';
			return 'success';
		}
		return null;
	});

	// Indicador visual para el chip institucional
	const indicadorInstitucional = $derived.by((): 'success' | 'warning' | 'error' | null => {
		if (!verificacionInstitucional) return null;
		if (estado === 'rechazada') return 'error';
		if (estado === 'pendiente') return 'warning';
		if (estado === 'aprobada') return 'success';
		return null;
	});

	onMount(() => {
		setBreadcrumbs([
			{ label: 'Institución', href: '/institucion/mi-panel' },
			{ label: 'Verificación' }
		]);
	});

	// --- Institucional ---

	async function manejarSubida(detail: { files: File[] }) {
		try {
			if (detail.files.length > 0) {
				const formData = new FormData();
				formData.append('tipo', 'institucional');
				detail.files.forEach((f) => formData.append('files', f));
				const res = await fetch('/api/registro/verificacion', {
					method: 'POST',
					body: formData
				});
				const body = await res.json();
				if (!res.ok) throw new Error(body.error || 'No se pudieron subir los archivos');
			}

			if (enEdicion) {
				const res = await fetch('/api/registro/verificacion', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ accion: 'enviar-para-revision', tipo: 'institucional' })
				});
				const body = await res.json();
				if (!res.ok) throw new Error(body.error || 'No se pudo enviar para revisión');
				toastStore.show({
					variant: 'success',
					title: 'Enviado para revisión',
					message: 'El equipo de administración revisará tu documentación.'
				});
				await invalidateAll();
			} else {
				toastStore.show({
					variant: 'success',
					title: 'Documentación recibida',
					message: 'Tu verificación quedó en proceso de revisión.'
				});
				goto('/institucion/mi-panel');
			}
		} catch (e) {
			toastStore.show({
				variant: 'error',
				title: enEdicion ? 'Error al enviar para revisión' : 'Error al subir documentación',
				message: e instanceof Error ? e.message : 'Intentá de nuevo en unos minutos.'
			});
		}
	}

	async function eliminarDocumentoExistente(idArchivo: number) {
		const res = await fetch('/api/registro/verificacion', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id_archivo: idArchivo })
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(body.error || 'No se pudo eliminar el archivo');
		documentosVerificacion = documentosVerificacion.filter((doc) => doc.id_archivo !== idArchivo);
	}

	// --- ARCA ---

	async function manejarSubidaArca(detail: { file: File }) {
		try {
			const formData = new FormData();
			formData.append('tipo', 'arca');
			formData.append('files', detail.file);
			const res = await fetch('/api/registro/verificacion', {
				method: 'POST',
				body: formData
			});
			const body = await res.json();
			if (!res.ok) throw new Error(body.error || 'No se pudo subir el certificado');

			const estadoArca = data.verificacionArca?.estado ?? null;
			const enEdicionArca = estadoArca === 'aprobada' || estadoArca === 'rechazada';

			if (enEdicionArca) {
				const patchRes = await fetch('/api/registro/verificacion', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ accion: 'enviar-para-revision', tipo: 'arca' })
				});
				const patchBody = await patchRes.json();
				if (!patchRes.ok) throw new Error(patchBody.error || 'No se pudo enviar para revisión');
			}

			toastStore.show({
				variant: 'success',
				title: 'Certificado enviado',
				message: 'El equipo de administración revisará tu certificado ARCA.'
			});
			await invalidateAll();
		} catch (e) {
			toastStore.show({
				variant: 'error',
				title: 'Error al enviar el certificado ARCA',
				message: e instanceof Error ? e.message : 'Intentá de nuevo en unos minutos.'
			});
		}
	}

	async function eliminarArca() {
		const doc = data.documentoArca;
		if (!doc) return;
		const res = await fetch('/api/registro/verificacion', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id_archivo: doc.id_archivo })
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(body.error || 'No se pudo eliminar el certificado');
		await invalidateAll();
	}

	const coloresIndicador = {
		success: 'bg-emerald-400',
		warning: 'bg-amber-400',
		error: 'bg-rose-500'
	} as const;
</script>

<svelte:head>
	<title>Verificación de identidad - Conectando Corazones</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Verificaciones de la institución</h1>
		<p class="mt-2 text-slate-600">
			Gestioná tu verificación documental y la certificación fiscal ARCA.
		</p>
	</div>

	<!-- Chips de navegación -->
	<div class="mb-8 flex justify-center gap-2">
		<!-- Tab institucional -->
		<button
			type="button"
			onclick={() => (tabActiva = 'institucional')}
			class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200
				{tabActiva === 'institucional'
				? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
				: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
		>
			Verificación documental
			{#if indicadorInstitucional}
				<span
					class="h-2 w-2 rounded-full {coloresIndicador[indicadorInstitucional]}"
					title={indicadorInstitucional === 'success'
						? 'Aprobada'
						: indicadorInstitucional === 'warning'
							? 'En revisión'
							: 'Requiere atención'}
				></span>
			{/if}
		</button>

		<!-- Tab ARCA -->
		<button
			type="button"
			onclick={() => (tabActiva = 'arca')}
			class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200
				{tabActiva === 'arca'
				? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
				: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
		>
		 	Certificación ARCA
			{#if indicadorArca}
				<span
					class="h-2 w-2 rounded-full {coloresIndicador[indicadorArca]}"
					title={indicadorArca === 'success'
						? 'Vigente'
						: indicadorArca === 'warning'
							? 'En revisión'
							: 'Requiere atención'}
				></span>
			{:else}
				<span class="rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-500">
					opcional
				</span>
			{/if}
		</button>
	</div>

	<!-- Contenido del tab activo -->
	{#if tabActiva === 'institucional'}
		{#if estado === 'rechazada'}
			<div class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
				<h2 class="text-sm font-semibold">Tu verificación fue rechazada</h2>
				<p class="mt-1 text-sm">
					Podés corregir la documentación y volver a presentarla desde este formulario.
				</p>
				{#if motivoRechazo}
					<p class="mt-2 rounded-xl border border-amber-300/70 bg-white/70 px-3 py-2 text-sm">
						<strong>Motivo informado por administración:</strong> {motivoRechazo}
					</p>
				{/if}
			</div>
		{/if}

		{#if estado === 'pendiente'}
			<div class="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-900">
				<h2 class="text-sm font-semibold">Tu documentación está en revisión</h2>
				<p class="mt-1 text-sm">No podés editarla hasta que el equipo de administración responda.</p>

				{#if documentosVerificacion.length > 0}
					<ul class="mt-4 space-y-2">
						{#each documentosVerificacion as doc (doc.id_archivo)}
							<li
								class="flex flex-col gap-2 rounded-lg border border-sky-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
							>
								<div class="min-w-0">
									<p class="truncate text-sm font-medium text-slate-900" title={doc.nombre_original ?? 'Documento'}>
										{doc.nombre_original ?? `Documento #${doc.id_archivo}`}
									</p>
								</div>
								<a
									href={doc.url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center rounded-md border border-sky-300 bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-200"
								>
									Abrir
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-3 text-sm italic text-sky-700">No hay documentos cargados aún.</p>
				{/if}

				<div class="mt-5">
					<button
						type="button"
						class="inline-flex items-center rounded-lg border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100"
						onclick={() => goto('/institucion/mi-panel')}
					>
						Volver al panel
					</button>
				</div>
			</div>
		{:else}
			<ValidacionInstitucion
				permitirOmitir={false}
				modoActualizacion={enEdicion}
				onsubmit={manejarSubida}
				documentosExistentes={documentosVerificacion}
				ondeleteexisting={eliminarDocumentoExistente}
				oncancel={() => goto('/institucion/mi-panel')}
			/>
		{/if}
	{:else}
		<CertificacionArca
			verificacionArca={data.verificacionArca}
			documentoExistente={data.documentoArca}
			motivoRechazo={data.motivoRechazoArca}
			onsubmit={manejarSubidaArca}
			ondelete={eliminarArca}
		/>
	{/if}
</div>
