<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from "$app/stores";
	import { goto, beforeNavigate } from "$app/navigation";
	import Button from "$lib/components/ui/elementos/Button.svelte";
	import { 
		FileText, 
		Image as ImageIcon, 
		Upload, 
		X, 
		ChevronLeft,
		Plus,
		AlertCircle,
		FileStack,
		History,
		ExternalLink,
		Download
	} from "lucide-svelte";
	import { fade, slide } from "svelte/transition";
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
	let selectedTipoParticipacion = $state<TipoParticipacionDescripcion | "">("");
	let selectedParticipacionPermitidaId = $state<number | null>(null);

	// Filtrar participaciones por tipo seleccionado
	let filteredParticipaciones = $derived(
		data.participacionesPermitidas.filter(p => {
			if (!selectedTipoParticipacion) return false;
			return p.tipo_participacion?.descripcion === selectedTipoParticipacion;
		})
	);

	// Mostrar selector de meta solo si es "Especie" Y hay más de una opción
	const mostrarSelectorMeta = $derived(
		selectedTipoParticipacion === 'Especie' && filteredParticipaciones.length > 1
	);

	// Función para obtener el nombre del colaborador // TODO: considerar centralizar esta función ya que se usa en varios lugares
	function getNombreColaborador(usuarioId: number): string {
		const usuario = Object.values(mockUsuarios).find(u => u.id_usuario === usuarioId);
		if (!usuario) return 'Colaborador';
		
		if ('razon_social' in usuario && usuario.razon_social) {
			return usuario.razon_social;
		}
		
		if (usuario.nombre && usuario.apellido) {
			return `${usuario.nombre} ${usuario.apellido}`;
		}
		
		return usuario.username || 'Colaborador';
	}

	// Función para obtener el icono según el tipo de archivo // TODO: centralizar
	function getIconForFile(tipo: string | undefined) {
		return tipo?.includes('pdf') ? FileText : ImageIcon;
	}

	let evidenciasEntrada = $derived<ArchivoUI[]>(
		selectedParticipacionPermitidaId
			? mockEvidencias
					.filter(e => 
						e.id_participacion_permitida === selectedParticipacionPermitidaId &&
						e.tipo_evidencia === 'entrada'
					)
					.flatMap(e => e.archivos || [])
					.map(a => ({
						...a,
						url: a.url, // Asegurar que url es string (en mock siempre está pero en type Archivo también)
						uploader_nombre: getNombreColaborador(a.usuario_id ?? 0),
						fecha_formateada: new Date(a.created_at ?? new Date()).toLocaleDateString('es-AR'),
						tipo_visual: (a.tipo_mime?.includes('pdf') ? 'pdf' : 'image') as 'pdf' | 'image',
						tamanio_formateado: a.tamanio_bytes ? `${(a.tamanio_bytes / (1024 * 1024)).toFixed(1)} MB` : 'Desconocido'
					}))
			: []
	);

	let evidenciasSalidaExistentes = $derived<ArchivoUI[]>(
		selectedParticipacionPermitidaId
			? mockEvidencias
					.filter(e => 
						e.id_participacion_permitida === selectedParticipacionPermitidaId &&
						e.tipo_evidencia === 'salida'
					)
					.flatMap(e => e.archivos || [])
					.map(a => ({
						...a,
						url: a.url,
						uploader_nombre: data.proyecto.nombreInstitucion || 'Institución',
						fecha_formateada: new Date(a.created_at ?? new Date()).toLocaleDateString('es-AR'),
						tipo_visual: (a.tipo_mime?.includes('pdf') ? 'pdf' : 'image') as 'pdf' | 'image',
						tamanio_formateado: a.tamanio_bytes ? `${(a.tamanio_bytes / (1024 * 1024)).toFixed(1)} MB` : 'Desconocido'
					}))
			: []
	);

	let evidenciasSalidaNuevas: EvidenciaNueva[] = $state([]);
	
	let mostrarModalSubirArchivos = $state(false);
	let archivosTemporales: (Archivo & { file: File })[] = $state([]);
	
	let evidenciasEliminadas: Set<number> = $state(new Set());

	let evidenciasSalidaTotal = $derived<ArchivoUI[]>([
		...evidenciasSalidaExistentes.filter(e => !evidenciasEliminadas.has(e.id_archivo ?? 0)),
		...evidenciasSalidaNuevas.flatMap(ev => 
			ev.archivos.map(archivo => ({
				...archivo,
				uploader_nombre: data.proyecto.nombreInstitucion || 'Institución',
				fecha_formateada: ev.created_at ? new Date(ev.created_at).toLocaleDateString('es-AR') : '',
				tipo_visual: (archivo.tipo_mime?.includes('pdf') ? 'pdf' : 'image') as 'pdf' | 'image',
				tamanio_formateado: archivo.tamanio_bytes ? `${(archivo.tamanio_bytes / (1024 * 1024)).toFixed(1)} MB` : 'Desconocido',
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
		const listener = (e: MediaQueryListEvent) => isMobile = e.matches;
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
		archivosTemporales = archivosTemporales.map(archivo =>
			archivo.id_archivo === archivoId
				? { ...archivo, descripcion: nuevaDescripcion }
				: archivo
		);
	}

	function eliminarArchivoTemporal(archivoId: number) {
		archivosTemporales = archivosTemporales.filter(a => a.id_archivo !== archivoId);
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
		const indexNueva = evidenciasSalidaNuevas.findIndex(ev => 
			ev.archivos.some(a => a.id_archivo === id)
		);
		
		if (indexNueva !== -1) {
			const evidencia = evidenciasSalidaNuevas[indexNueva];
			const archivoIndex = evidencia.archivos.findIndex(a => a.id_archivo === id);
			
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
				selectedParticipacionPermitidaId = filteredParticipaciones[0].id_participacion_permitida;
			} else {
				selectedParticipacionPermitidaId = null;
			}
		}
	});
</script>

<div class="min-h-screen bg-slate-50/30 pb-10 md:pb-20">
	<div class="max-w-7xl mx-auto px-4 md:px-6" in:fade>
		
		<!-- Header -->
		<header class="animate-fade-in-up mb-12 md:mb-16 pt-6 md:pt-12 pb-6">
			<div class="flex flex-col items-center">
				<div class="w-full flex justify-start mb-6 md:mb-8">
					<button 
						onclick={cerrar}
						class="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-slate-200"
						aria-label="Volver"
					>
						<ChevronLeft size={24} />
					</button>
				</div>
				
				<div class="text-center">
					<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
						Cargar evidencias
					</h1>
					<p class="mx-auto mt-6 md:mt-8 max-w-2xl text-base md:text-lg text-gray-500">
						Transparentá el uso de los recursos para fortalecer tu comunidad
					</p>
				</div>
			</div>
		</header>

		<!-- Selectores -->
		<section class="mb-8 md:mb-12">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
				<!-- Proyecto Seleccionado -->
				<div class="space-y-2">
					<label for="proyecto" class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
						Proyecto
					</label>
					<select 
						id="proyecto"
						bind:value={selectedProyectoId}
						class="w-full p-4 md:p-5 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300"
					>
						{#each data.proyectosDisponibles as proyecto}
							<option value={proyecto.id_proyecto}>{proyecto.titulo}</option>
						{/each}
					</select>
				</div>

				<!-- Tipo de Participación -->
				<div class="space-y-2">
					<label for="tipo" class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
						Tipo de participación
					</label>
					<select 
						id="tipo"
						bind:value={selectedTipoParticipacion}
						class="w-full p-4 md:p-5 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300"
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
						<label for="participacion" class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
							Meta del proyecto
						</label>
						<select 
							id="participacion"
							bind:value={selectedParticipacionPermitidaId}
							class="w-full p-4 md:p-5 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-300"
						>
							<option value={null} disabled>Seleccionar meta</option>
							{#each filteredParticipaciones as p}
								<option value={p.id_participacion_permitida}>
									{p.especie ? p.especie : 'Donación en especie'} ({p.objetivo} {p.unidad_medida})
								</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		</section>

		<!-- Contenido Principal -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
			
			<!-- Evidencias de Entrada -->
			<section class="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
				<div class="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
					<div class="flex items-center gap-3 mb-2">
						<div class="p-2 bg-blue-100 text-blue-600 rounded-xl">
							<FileStack size={20} />
						</div>
						<h3 class="text-base md:text-lg font-black text-slate-900 uppercase tracking-wide">
							Evidencias de entrada
						</h3>
					</div>
					<p class="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
						Archivos que subieron los colaboradores para validar su aporte
					</p>
				</div>
				
				<div class="p-6 md:p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
					{#if evidenciasEntrada.length === 0}
						<div class="py-12 md:py-16 flex flex-col items-center justify-center text-center space-y-4">
							<div class="p-5 bg-slate-50 rounded-full text-slate-300 border-2 border-slate-200">
								<FileStack size={40} />
							</div>
							<div class="space-y-1 px-6">
								<p class="text-sm md:text-base font-bold text-slate-600">
									{selectedParticipacionPermitidaId ? 'No hay evidencias de entrada' : 'Seleccioná un tipo de participación'}
								</p>
								<p class="text-xs text-slate-400 font-medium">
									{selectedParticipacionPermitidaId ? 'Los colaboradores aún no subieron archivos' : 'Para ver las evidencias disponibles'}
								</p>
							</div>
						</div>
					{:else}
						<div class="space-y-3">
							{#each evidenciasEntrada as file}
								{@const Icon = getIconForFile(file.tipo_mime)}
								<div class="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 transition-all">
									<div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-3">
										<div class="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
											<Icon size={22} />
										</div>
										<div class="min-w-0 flex-1 overflow-hidden">
											<p class="text-sm md:text-base font-bold text-slate-800 truncate" title={file.descripcion}>{file.descripcion}</p>
											{#if file.nombre_original}
												<p class="text-xs text-slate-400 font-medium truncate mt-0.5" title={file.nombre_original}>{file.nombre_original}</p>
											{/if}
											<div class="flex items-center gap-2 mt-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
												<span class="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md truncate max-w-[150px] hidden md:inline" title={file.uploader_nombre}>{file.uploader_nombre}</span>
												<span class="text-slate-300 hidden md:inline">•</span>
												<span class="text-slate-400">{file.fecha_formateada}</span>
											</div>
										</div>
									</div>
									
									<div class="flex items-center gap-1">
										<a href={file.url} target="_blank" rel="noopener noreferrer" class="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Abrir en nueva pestaña">
											<ExternalLink size={18} />
										</a>
										<a href={file.url} download class="hidden sm:block p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Descargar">
											<Download size={18} />
										</a>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</section>

			<!-- Evidencias de Salida -->
			<section class="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
				<div class="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-amber-100 text-amber-600 rounded-xl">
								<History size={20} />
							</div>
							<h3 class="text-base md:text-lg font-black text-slate-900 uppercase tracking-wide">
								Evidencias de salida
							</h3>
						</div>
						
						<button 
							onclick={abrirModalSubirArchivos}
							class="cursor-pointer bg-slate-900 hover:bg-blue-600 text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95"
							aria-label="Agregar evidencia de salida"
						>
							<Plus size={20} />
						</button>
					</div>
					<p class="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
						Subí comprobantes que demuestren el uso final de los recursos
					</p>
				</div>

				<div class="p-6 md:p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
					{#if evidenciasSalidaTotal.length === 0}
						<div class="py-12 md:py-16 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/20">
							<div class="p-5 bg-white rounded-full text-slate-300 shadow-sm border border-slate-100">
								<Upload size={40} />
							</div>
							<div class="space-y-1 px-6">
								<p class="text-sm md:text-base font-bold text-slate-600">Aún no hay archivos cargados</p>
								<p class="text-xs text-slate-400 font-medium">Formatos: PDF, JPG, PNG</p>
							</div>
						</div>
					{:else}
						<div class="space-y-3">
							{#each evidenciasSalidaTotal as file (file.id_archivo || file.evidencia_temp_id + '_' + file.nombre_original)}
								{@const Icon = getIconForFile(file.tipo_mime)}
								<div 
									class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 transition-all shadow-sm"
									transition:slide={{ duration: 200 }}
								>
									<div class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-3">
										<div class="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
											<Icon size={22} />
										</div>
										<div class="min-w-0 flex-1 overflow-hidden">
											<p class="text-sm md:text-base font-bold text-slate-800 truncate" title={file.descripcion}>{file.descripcion}</p>
											{#if file.nombre_original}
												<p class="text-xs text-slate-400 font-medium truncate mt-0.5" title={file.nombre_original}>{file.nombre_original}</p>
											{/if}
											<div class="flex items-center gap-2 mt-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
												<span class="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md hidden md:inline">{file.uploader_nombre}</span>
												<span class="text-slate-300 hidden md:inline">•</span>
												<span class="text-slate-400">{file.fecha_formateada}</span>
											</div>
										</div>
									</div>
									
									<div class="flex items-center gap-1">
										{#if file.url}
											<a href={file.url} target="_blank" rel="noopener noreferrer" class="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Abrir en nueva pestaña">
												<ExternalLink size={18} />
											</a>
										{/if}
										<button 
											onclick={() => removeEvidencia(file.id_archivo || 0)}
											class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
											aria-label="Eliminar evidencia"
											title="Eliminar"
										>
											<X size={20} />
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</section>
		</div>

		<!-- Footer con Acciones -->
		<footer class="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
			<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
				<div class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex-1">
					<AlertCircle size={20} class="text-blue-500 shrink-0 mt-0.5" />
					<div>
						<p class="text-sm font-bold text-blue-900 leading-tight mb-1">
							Evidencia de salida obligatoria
						</p>
						<p class="text-xs text-blue-700 leading-relaxed">
							Debés subir al menos una evidencia de salida para que los colaboradores puedan validar el cierre del objetivo.
						</p>
					</div>
				</div>
				
				<div class="flex items-center gap-4 w-full md:w-auto">
					<button 
						onclick={cerrar}
						class="flex-1 md:flex-none px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
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
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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
			class="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
			transition:slide={{ duration: 300 }}
		>
			<!-- Header -->
			<div class="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-br from-amber-50 to-orange-50">
				<div class="flex items-start gap-4">
					<div class="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
						<AlertCircle size={24} />
					</div>
					<div>
						<h3 id="modal-title" class="text-xl font-black text-slate-900 mb-2">
							¿Descartar cambios?
						</h3>
						<p class="text-sm text-slate-600 leading-relaxed">
							Tenés cambios sin guardar. Si salís ahora, se perderán todas las modificaciones realizadas.
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="p-6 md:p-8 bg-slate-50/50">
				<div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
					<button
						onclick={cancelarSalida}
						class="flex-1 px-6 py-3 text-sm font-bold text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:text-slate-800 transition-all"
					>
						Continuar editando
					</button>
					<button
						onclick={confirmarSalida}
						class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-red-300"
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
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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
			class="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
			transition:slide={{ duration: 300 }}
		>
			<!-- Header -->
			<div class="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50">
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-4">
						<div class="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
							<Upload size={24} />
						</div>
						<div>
							<h3 id="modal-upload-title" class="text-xl font-black text-slate-900 mb-2">
								Subir evidencia de salida
							</h3>
							<p class="text-sm text-slate-600 leading-relaxed">
								Seleccioná uno o más archivos y agregá una descripción para cada uno
							</p>
						</div>
					</div>
					<button
						onclick={cerrarModalSubirArchivos}
						class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
						aria-label="Cerrar modal"
					>
						<X size={20} />
					</button>
				</div>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
				<!-- File selector -->
				<div class="mb-6">
					<label class="block w-full cursor-pointer">
						<div class="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all">
							<div class="flex flex-col items-center gap-3">
								<div class="p-4 bg-blue-100 text-blue-600 rounded-full">
									<FileStack size={32} />
								</div>
								<div>
									<p class="text-base font-bold text-slate-700">
										Hacé clic para seleccionar archivos
									</p>
									<p class="text-sm text-slate-500 mt-1">
										PDF, JPG, PNG (máx. 10MB por archivo)
									</p>
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
						<h4 class="text-sm font-black uppercase tracking-wider text-slate-400">
							Archivos seleccionados ({archivosTemporales.length})
						</h4>
						
						{#each archivosTemporales as archivo (archivo.id_archivo)}
							{@const Icon = getIconForFile(archivo.tipo_mime)}
							<div 
								class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
								transition:slide={{ duration: 200 }}
							>
								<!-- Archivo info -->
								<div class="flex items-start gap-3">
									<div class="p-2.5 bg-white rounded-xl text-slate-400 shrink-0">
										<Icon size={20} />
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-sm font-bold text-slate-800 truncate" title={archivo.file.name}>
											{archivo.file.name}
										</p>
										<p class="text-xs text-slate-500 mt-0.5">
											{archivo.tamanio_bytes ? (archivo.tamanio_bytes / (1024 * 1024)).toFixed(1) + " MB" : 'Desconocido'}
										</p>
									</div>
									<button
										onclick={() => eliminarArchivoTemporal(archivo.id_archivo!)}
										class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
										aria-label="Eliminar archivo"
									>
										<X size={18} />
									</button>
								</div>

								<!-- Descripción input -->
								<div>
									<label for="desc-{archivo.id_archivo}" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
										Descripción del archivo
									</label>
									<input
										id="desc-{archivo.id_archivo}"
										type="text"
										value={archivo.descripcion}
										oninput={(e) => actualizarDescripcionArchivo(archivo.id_archivo!, e.currentTarget.value)}
										placeholder="Ej: Factura de compra de materiales"
										class="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
									/>
								</div>

								<!-- Preview para imágenes -->
								{#if archivo.tipo_mime?.startsWith('image/') && archivo.url}
									<div class="rounded-lg overflow-hidden border border-slate-200">
										<img 
											src={archivo.url} 
											alt={archivo.descripcion}
											class="w-full h-48 object-cover"
										/>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-slate-400">
						<p class="text-sm font-medium">
							No hay archivos seleccionados
						</p>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50">
				<div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
					<button
						onclick={cerrarModalSubirArchivos}
						class="flex-1 px-6 py-3 text-sm font-bold text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:text-slate-800 transition-all"
					>
						Cancelar
					</button>
					<button
						onclick={agregarArchivosAEvidencia}
						disabled={archivosTemporales.length === 0}
						class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
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
