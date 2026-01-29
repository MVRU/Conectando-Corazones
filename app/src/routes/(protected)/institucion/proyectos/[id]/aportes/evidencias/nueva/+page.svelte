<script lang="ts">
	import { page } from '$app/stores';
	import { goto, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ChevronLeft, Plus, Upload, X, AlertCircle, FileStack, History } from 'lucide-svelte';
	import ArchivoCard from '$lib/components/ui/cards/ArchivoCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { obtenerIconoArchivo, formatearBytes } from '$lib/utils/archivos';
	import { fade, slide } from 'svelte/transition';
	import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
	import type { Evidencia } from '$lib/domain/types/Evidencia';
	import type { Archivo } from '$lib/domain/types/Archivo';
	import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';
	import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
	import { toastStore } from '$lib/stores/toast';

	let { data } = $props();

	const projectIdUrl = $page.params.id;

	// Extensiones para el manejo de UI y subida de archivos
	type ArchivoUI = Archivo & {
		uploader_nombre: string;
		fecha_formateada: string;
		tipo_visual: 'pdf' | 'image';
		tamanio_formateado: string;
		file?: File; // Para archivos nuevos
		evidencia_temp_id?: number; // Para agrupar en UI
	};

	type EvidenciaNueva = Omit<Evidencia, 'id_evidencia'> & {
		id_temp: number;
		archivos: (Archivo & { file: File })[];
	};

	let selectedProyectoId = $state<number>(data.proyecto.id_proyecto ?? 0);
	let selectedTipoParticipacion = $state<TipoParticipacionDescripcion | ''>('');
	let selectedParticipacionPermitidaId = $state<number | null>(null);

	// Filtrar participaciones por tipo seleccionado
	let filteredParticipaciones = $derived(
		data.participacionesPermitidas.filter((p) => {
			if (!selectedTipoParticipacion) return false;
			return p.tipo_participacion?.descripcion === selectedTipoParticipacion;
		})
	);

	// Mostrar selector de meta solo si es "Especie" Y hay más de una opción
	const mostrarSelectorMeta = $derived(
		selectedTipoParticipacion === 'Especie' && filteredParticipaciones.length > 1
	);

	// Función para obtener el nombre del colaborador
	// TODO: considerar centralizar esta función ya que se usa en varios lugares
	function getNombreColaborador(usuarioId: number): string {
		const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === usuarioId);
		if (!usuario) return 'Colaborador';

		if ('razon_social' in usuario && usuario.razon_social) {
			return usuario.razon_social;
		}

		if (usuario.nombre && usuario.apellido) {
			return `${usuario.nombre} ${usuario.apellido}`;
		}

		return usuario.username || 'Colaborador';
	}

	let evidenciasEntrada = $derived<ArchivoUI[]>(
		selectedParticipacionPermitidaId
			? mockEvidencias
					.filter(
						(e) =>
							e.id_participacion_permitida === selectedParticipacionPermitidaId &&
							e.tipo_evidencia === 'entrada'
					)
					.flatMap((e) => e.archivos || [])
					.map((a) => ({
						...a,
						url: a.url, // Asegurar que url es string (en mock siempre está pero en type Archivo también)
						uploader_nombre: getNombreColaborador(a.usuario_id ?? 0),
						fecha_formateada: new Date(a.created_at ?? new Date()).toLocaleDateString('es-AR'),
						tipo_visual: (a.tipo_mime?.includes('pdf') ? 'pdf' : 'image') as 'pdf' | 'image',
						tamanio_formateado: a.tamanio_bytes
							? `${(a.tamanio_bytes / (1024 * 1024)).toFixed(1)} MB`
							: 'Desconocido'
					}))
			: []
	);

	let evidenciasSalidaExistentes = $derived<ArchivoUI[]>(
		selectedParticipacionPermitidaId
			? mockEvidencias
					.filter(
						(e) =>
							e.id_participacion_permitida === selectedParticipacionPermitidaId &&
							e.tipo_evidencia === 'salida'
					)
					.flatMap((e) => e.archivos || [])
					.map((a) => ({
						...a,
						url: a.url,
						uploader_nombre: data.proyecto.nombreInstitucion || 'Institución',
						fecha_formateada: new Date(a.created_at ?? new Date()).toLocaleDateString('es-AR'),
						tipo_visual: (a.tipo_mime?.includes('pdf') ? 'pdf' : 'image') as 'pdf' | 'image',
						tamanio_formateado: a.tamanio_bytes
							? `${(a.tamanio_bytes / (1024 * 1024)).toFixed(1)} MB`
							: 'Desconocido'
					}))
			: []
	);

	let evidenciasSalidaNuevas: EvidenciaNueva[] = $state([]);

	let mostrarModalSubirArchivos = $state(false);
	let archivosTemporales: (Archivo & { file: File })[] = $state([]);

	let evidenciasEliminadas: Set<number> = $state(new Set());

	let evidenciasSalidaTotal = $derived<ArchivoUI[]>([
		...evidenciasSalidaExistentes.filter((e) => !evidenciasEliminadas.has(e.id_archivo ?? 0)),
		...evidenciasSalidaNuevas.flatMap((ev) =>
			ev.archivos.map((archivo) => ({
				...archivo,
				uploader_nombre: data.proyecto.nombreInstitucion || 'Institución',
				fecha_formateada: ev.created_at ? new Date(ev.created_at).toLocaleDateString('es-AR') : '',
				tipo_visual: (archivo.tipo_mime?.includes('pdf') ? 'pdf' : 'image') as 'pdf' | 'image',
				tamanio_formateado: archivo.tamanio_bytes
					? `${(archivo.tamanio_bytes / (1024 * 1024)).toFixed(1)} MB`
					: 'Desconocido',
				evidencia_temp_id: ev.id_temp
			}))
		)
	]);

	let hayaCambios = $derived(
		evidenciasSalidaNuevas.length > 0 ||
			evidenciasEliminadas.size > 0 ||
			archivosTemporales.length > 0
	);

	let isMobile = $state(false);

	let mostrarModalConfirmacion = $state(false);
	let navegacionPendiente: (() => void) | null = null;
	let estaGuardando = $state(false);

	onMount(() => {
		const mql = window.matchMedia('(max-width: 640px)');
		isMobile = mql.matches;
		const listener = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mql.addEventListener('change', listener);

		// Prevenir salida del navegador si hay cambios
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

	// Interceptar navegación interna de SvelteKit
	beforeNavigate((navigation) => {
		if (hayaCambios && !mostrarModalConfirmacion && !estaGuardando) {
			navigation.cancel();
			navegacionPendiente = () => {
				evidenciasSalidaNuevas = [];
				evidenciasEliminadas = new Set();
				navigation.cancel();
				goto(navigation.to?.url.pathname || `/institucion/proyectos/${projectIdUrl}/aportes`);
			};
			mostrarModalConfirmacion = true;
		}
	});

	function cerrar() {
		if (hayaCambios) {
			navegacionPendiente = () => {
				evidenciasSalidaNuevas = [];
				evidenciasEliminadas = new Set();
				goto(`/institucion/proyectos/${projectIdUrl}/aportes`);
			};
			mostrarModalConfirmacion = true;
		} else {
			goto(`/institucion/proyectos/${projectIdUrl}/aportes`);
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

	function guardarCambios() {
		// TODO: Implementar lógica de guardado real

		// Marcar que estamos guardando para evitar el modal de confirmación
		estaGuardando = true;

		// Limpiar el estado de cambios
		evidenciasSalidaNuevas = [];
		evidenciasEliminadas = new Set();

		toastStore.show({
			variant: 'success',
			title: 'Cambios guardados',
			message: 'Las evidencias fueron guardadas exitosamente',
			duration: 5000
		});

		goto(`/institucion/proyectos/${projectIdUrl}/aportes`);
	}

	function abrirModalSubirArchivos() {
		mostrarModalSubirArchivos = true;
		archivosTemporales = [];
	}

	function cerrarModalSubirArchivos() {
		mostrarModalSubirArchivos = false;
		archivosTemporales = [];
	}

	function handleFileSelection(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			const nuevosArchivos: (Archivo & { file: File })[] = [];

			for (let i = 0; i < input.files.length; i++) {
				const file = input.files[i];
				const isImage = file.type.startsWith('image/');
				const url = isImage ? URL.createObjectURL(file) : '';

				nuevosArchivos.push({
					id_archivo: Date.now() + i, // ID temporal
					file,
					descripcion: file.name, // Descripción inicial: nombre del archivo
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

		const nuevaEvidencia: EvidenciaNueva = {
			id_temp: Date.now(),
			tipo_evidencia: 'salida',
			created_at: new Date(),
			archivos: archivosTemporales,
			archivos_ids: [],
			id_participacion_permitida: selectedParticipacionPermitidaId!
		};

		evidenciasSalidaNuevas.push(nuevaEvidencia);
		cerrarModalSubirArchivos();
	}

	function removeEvidencia(id: number) {
		const indexNueva = evidenciasSalidaNuevas.findIndex((ev) =>
			ev.archivos.some((a) => a.id_archivo === id)
		);

		if (indexNueva !== -1) {
			const evidencia = evidenciasSalidaNuevas[indexNueva];
			const archivoIndex = evidencia.archivos.findIndex((a) => a.id_archivo === id);

			if (archivoIndex !== -1) {
				evidencia.archivos.splice(archivoIndex, 1);

				if (evidencia.archivos.length === 0) {
					evidenciasSalidaNuevas.splice(indexNueva, 1);
				}

				evidenciasSalidaNuevas = [...evidenciasSalidaNuevas];
			}
		} else {
			evidenciasEliminadas.add(id);
			evidenciasEliminadas = new Set(evidenciasEliminadas);
		}
	}

	$effect(() => {
		if (selectedProyectoId !== data.proyecto.id_proyecto) {
			goto(`/institucion/proyectos/${selectedProyectoId}/aportes/evidencias/nueva`);
		}
	});

	$effect(() => {
		if (selectedTipoParticipacion) {
			if (filteredParticipaciones.length === 1) {
				selectedParticipacionPermitidaId =
					filteredParticipaciones[0].id_participacion_permitida ?? null;
			} else {
				selectedParticipacionPermitidaId = null;
			}
		}
	});
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="mx-auto max-w-7xl px-4 md:px-6" in:fade>
		<!-- Header -->
		<header class="animate-fade-in-up mb-12 pt-6 pb-6 md:mb-16 md:pt-12">
			<div class="flex flex-col items-center">
				<div class="mb-6 flex w-full justify-start md:mb-8">
					<button
						onclick={cerrar}
						class="rounded-full border border-slate-200 p-2 text-slate-400 shadow-sm transition-all hover:bg-white hover:text-slate-600"
						aria-label="Volver"
					>
						<ChevronLeft size={24} />
					</button>
				</div>

				<div class="text-center">
					<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
						Cargar evidencias
					</h1>
					<p class="mx-auto mt-6 max-w-2xl text-base text-gray-500 md:mt-8 md:text-lg">
						Transparentá el uso de los recursos para fortalecer tu comunidad
					</p>
				</div>
			</div>
		</header>

		<!-- Selectores -->
		<section class="mb-8 md:mb-12">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
				<!-- Proyecto Seleccionado -->
				<div class="space-y-2">
					<label
						for="proyecto"
						class="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase md:text-xs"
					>
						Proyecto
					</label>
					<select
						id="proyecto"
						bind:value={selectedProyectoId}
						class="w-full cursor-pointer appearance-none rounded-2xl border-2 border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm transition-all outline-none hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:p-5"
					>
						{#each data.proyectosDisponibles as proyecto}
							<option value={proyecto.id_proyecto}>{proyecto.titulo}</option>
						{/each}
					</select>
				</div>

				<!-- Tipo de Participación -->
				<div class="space-y-2">
					<label
						for="tipo"
						class="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase md:text-xs"
					>
						Tipo de participación
					</label>
					<select
						id="tipo"
						bind:value={selectedTipoParticipacion}
						class="w-full cursor-pointer appearance-none rounded-2xl border-2 border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm transition-all outline-none hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:p-5"
					>
						<option value="" disabled>Seleccionar tipo</option>
						{#each data.tiposParticipacion as tipo}
							<option value={tipo}>{tipo === 'Especie' ? 'En especie' : tipo}</option>
						{/each}
					</select>
				</div>

				<!-- Meta del Proyecto (Condicional) -->
				{#if mostrarSelectorMeta}
					<div class="space-y-2" transition:slide={{ duration: 300 }}>
						<label
							for="participacion"
							class="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase md:text-xs"
						>
							Meta del proyecto
						</label>
						<select
							id="participacion"
							bind:value={selectedParticipacionPermitidaId}
							class="w-full cursor-pointer appearance-none rounded-2xl border-2 border-slate-200 bg-white p-4 font-bold text-slate-700 shadow-sm transition-all outline-none hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:p-5"
						>
							<option value={null} disabled>Seleccionar meta</option>
							{#each filteredParticipaciones as p}
								<option value={p.id_participacion_permitida}>
									{p.especie ? p.especie : 'Donación en especie'} ({p.objetivo}
									{p.unidad_medida})
								</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		</section>

		<!-- Contenido Principal -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
			<!-- Evidencias de Entrada -->
			<section
				class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:rounded-3xl"
			>
				<div class="border-b border-slate-100 bg-slate-50/50 p-6 md:p-8">
					<div class="mb-2 flex items-center gap-3">
						<div class="rounded-xl bg-blue-100 p-2 text-blue-600">
							<FileStack size={20} />
						</div>
						<h3 class="text-base font-black tracking-wide text-slate-900 uppercase md:text-lg">
							Evidencias de entrada
						</h3>
					</div>
					<p class="text-xs leading-relaxed font-medium text-slate-500 md:text-sm">
						Archivos que subieron los colaboradores para validar su aporte
					</p>
				</div>

				<div class="custom-scrollbar max-h-[600px] overflow-y-auto p-6 md:p-8">
					{#if evidenciasEntrada.length === 0}
						<div
							class="flex flex-col items-center justify-center space-y-4 py-12 text-center md:py-16"
						>
							<div class="rounded-full border-2 border-slate-200 bg-slate-50 p-5 text-slate-300">
								<FileStack size={40} />
							</div>
							<div class="space-y-1 px-6">
								<p class="text-sm font-bold text-slate-600 md:text-base">
									{selectedParticipacionPermitidaId
										? 'No hay evidencias de entrada'
										: 'Seleccioná un tipo de participación'}
								</p>
								<p class="text-xs font-medium text-slate-400">
									{selectedParticipacionPermitidaId
										? 'Los colaboradores aún no subieron archivos'
										: 'Para ver las evidencias disponibles'}
								</p>
							</div>
						</div>
					{:else}
						<div class="space-y-3">
							{#each evidenciasEntrada as file}
								<ArchivoCard archivo={file} showUploader={true} />
							{/each}
						</div>
					{/if}
				</div>
			</section>

			<!-- Evidencias de Salida -->
			<section
				class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:rounded-3xl"
			>
				<div class="border-b border-slate-100 bg-slate-50/50 p-6 md:p-8">
					<div class="mb-2 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="rounded-xl bg-amber-100 p-2 text-amber-600">
								<History size={20} />
							</div>
							<h3 class="text-base font-black tracking-wide text-slate-900 uppercase md:text-lg">
								Evidencias de salida
							</h3>
						</div>

						<button
							onclick={abrirModalSubirArchivos}
							class="cursor-pointer rounded-xl bg-slate-900 p-3 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-200 active:scale-95"
							aria-label="Agregar evidencia de salida"
						>
							<Plus size={20} />
						</button>
					</div>
					<p class="text-xs leading-relaxed font-medium text-slate-500 md:text-sm">
						Subí comprobantes que demuestren el uso final de los recursos
					</p>
				</div>

				<div class="custom-scrollbar max-h-[600px] overflow-y-auto p-6 md:p-8">
					{#if evidenciasSalidaTotal.length === 0}
						<div
							class="flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/20 py-12 text-center md:py-16"
						>
							<div
								class="rounded-full border border-slate-100 bg-white p-5 text-slate-300 shadow-sm"
							>
								<Upload size={40} />
							</div>
							<div class="space-y-1 px-6">
								<p class="text-sm font-bold text-slate-600 md:text-base">
									Aún no hay archivos cargados
								</p>
								<p class="text-xs font-medium text-slate-400">Formatos: PDF, JPG, PNG</p>
							</div>
						</div>
					{:else}
						<div class="space-y-3">
							{#each evidenciasSalidaTotal as file (file.id_archivo || file.evidencia_temp_id + '_' + file.nombre_original)}
								<div transition:slide={{ duration: 200 }}>
									<ArchivoCard
										archivo={file}
										showUploader={true}
										deletable={true}
										ondelete={() => removeEvidencia(file.id_archivo || 0)}
										customClass="hover:border-amber-400"
									/>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</section>
		</div>

		<!-- Footer con Acciones -->
		<footer
			class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:rounded-3xl md:p-8"
		>
			<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
				<div
					class="flex flex-1 items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4"
				>
					<AlertCircle size={20} class="mt-0.5 shrink-0 text-blue-500" />
					<div>
						<p class="mb-1 text-sm leading-tight font-bold text-blue-900">
							Evidencia de salida obligatoria
						</p>
						<p class="text-xs leading-relaxed text-blue-700">
							Debés subir al menos una evidencia de salida para que los colaboradores puedan validar
							el cierre del objetivo.
						</p>
					</div>
				</div>

				<div class="flex w-full items-center gap-4 md:w-auto">
					<button
						onclick={cerrar}
						class="flex-1 px-6 py-3 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 md:flex-none"
					>
						Cancelar
					</button>
					<div class="flex-1 md:flex-none">
						<Button
							label="Guardar"
							disabled={!hayaCambios || !selectedParticipacionPermitidaId}
							size="md"
							customClass="w-full shadow-lg shadow-blue-200"
							onclick={guardarCambios}
						/>
					</div>
				</div>
			</div>
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
								Subir evidencia de salida
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
							{@const Icon = obtenerIconoArchivo(archivo.tipo_mime)}
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
											{formatearBytes(archivo.tamanio_bytes)}
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
										placeholder="Ej: Factura de compra de materiales"
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
									/>
								</div>

								<!-- Preview para imágenes -->
								{#if archivo.tipo_mime?.startsWith('image/') && archivo.url}
									<div class="overflow-hidden rounded-lg border border-slate-200">
										<img
											src={archivo.url}
											alt={archivo.descripcion}
											class="h-48 w-full object-cover"
										/>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="py-8 text-center text-slate-400">
						<p class="text-sm font-medium">No hay archivos seleccionados</p>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8">
				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
					<button
						onclick={cerrarModalSubirArchivos}
						class="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-300 hover:text-slate-800"
					>
						Cancelar
					</button>
					<button
						onclick={agregarArchivosAEvidencia}
						disabled={archivosTemporales.length === 0}
						class="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
					>
						Agregar {archivosTemporales.length > 0 ? `(${archivosTemporales.length})` : ''}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 1.25rem;
		padding-right: 3rem;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
