<script lang="ts">
	import ValidacionInstitucion from '$lib/validation/components/ValidacionInstitucion.svelte';
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

	const verificacionActual = $derived(data.verificacionActual);
	const motivoRechazo = $derived(data.motivoRechazo);
	let documentosVerificacion = $state<DocumentoExistente[]>(
		untrack(() => (data.documentosVerificacion as DocumentoExistente[]) ?? [])
	);

	const estado = $derived(verificacionActual?.estado ?? null);
	const enEdicion = $derived(estado === 'aprobada' || estado === 'rechazada');

	const tituloPagina = $derived.by(() => {
		if (!verificacionActual) return 'Verificación de la institución';
		if (estado === 'pendiente') return 'Documentación en revisión';
		if (estado === 'aprobada') return 'Actualizar documentación verificada';
		if (estado === 'rechazada') return 'Reenviar documentación';
		return 'Verificación de la institución';
	});

	const subtituloPagina = $derived.by(() => {
		if (!verificacionActual)
			return 'Completá la documentación que respalda a tu organización. Nuestro equipo la revisará de forma confidencial.';
		if (estado === 'pendiente')
			return 'Tu documentación está siendo evaluada. Cuando el equipo de administración responda, podrás volver a editarla.';
		if (estado === 'aprobada')
			return 'Podés agregar o eliminar documentos y enviarlos para revisión cuando estés listo.';
		if (estado === 'rechazada')
			return 'Corregí o reemplazá la documentación y volvé a enviarla para revisión.';
		return '';
	});

	onMount(() => {
		setBreadcrumbs([
			{ label: 'Institución', href: '/institucion/mi-panel' },
			{ label: 'Verificación' }
		]);
	});

	async function manejarSubida(detail: { files: File[] }) {
		try {
			// Upload new files if any were selected
			if (detail.files.length > 0) {
				const formData = new FormData();
				detail.files.forEach((f) => formData.append('files', f));
				const res = await fetch('/api/registro/verificacion', {
					method: 'POST',
					body: formData
				});
				const body = await res.json();
				if (!res.ok) {
					throw new Error(body.error || 'No se pudieron subir los archivos');
				}
			}

			// For aprobada/rechazada: also send for revision (PATCH)
			if (enEdicion) {
				const res = await fetch('/api/registro/verificacion', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ accion: 'enviar-para-revision' })
				});
				const body = await res.json();
				if (!res.ok) {
					throw new Error(body.error || 'No se pudo enviar para revisión');
				}
				toastStore.show({
					variant: 'success',
					title: 'Enviado para revisión',
					message: 'El equipo de administración revisará tu documentación.'
				});
				await invalidateAll();
			} else {
				// Initial upload
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
				title: 'Error',
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
		if (!res.ok) {
			throw new Error(body.error || 'No se pudo eliminar el archivo');
		}

		documentosVerificacion = documentosVerificacion.filter((doc) => doc.id_archivo !== idArchivo);
	}
</script>

<svelte:head>
	<title>Verificación de identidad - Conectando Corazones</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">{tituloPagina}</h1>
		<p class="mt-2 text-slate-600">{subtituloPagina}</p>
	</div>

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
			<p class="mt-1 text-sm">
				No podés editarla hasta que el equipo de administración responda.
			</p>

			{#if documentosVerificacion.length > 0}
				<ul class="mt-4 space-y-2">
					{#each documentosVerificacion as doc (doc.id_archivo)}
						<li
							class="flex flex-col gap-2 rounded-lg border border-sky-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
						>
							<div class="min-w-0">
								<p
									class="truncate text-sm font-medium text-slate-900"
									title={doc.nombre_original ?? 'Documento'}
								>
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
</div>
