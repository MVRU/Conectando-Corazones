<script lang="ts">
	import { Filter, ChevronDown, MapPin, Users, HeartOff, Calendar, LayoutGrid } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import AccionesRapidas from './colaborador/AccionesRapidas.svelte';
	import MetricasPanel from './colaborador/MetricasPanel.svelte';
	import SeguimientoObjetivos from './colaborador/SeguimientoObjetivos.svelte';
	import EstadisticasAyuda from './colaborador/EstadisticasAyuda.svelte';
	import UltimasResenas from './colaborador/UltimasResenas.svelte';
	import Novedades from './Novedades.svelte';
	import EstadisticasProyectoModal from './colaborador/EstadisticasProyectoModal.svelte';
	import EstadisticasAgendaModal from './colaborador/EstadisticasAgendaModal.svelte';
	import GestionarEvidenciasModal from './colaborador/GestionarEvidenciasModal.svelte';
	import InstitucionesAlcanzadasModal from './colaborador/InstitucionesAlcanzadasModal.svelte';
	import EvaluarCierreModal from './colaborador/EvaluarCierreModal.svelte';
	import HeatmapActividad from './colaborador/HeatmapActividad.svelte';
	import ProyectosComunidad from './colaborador/ProyectosComunidad.svelte';
	import EmptyState from './ui/EmptyState.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { tieneNuevosMensajes } from '$lib/utils/chat-visit';
	import {
		PERIODO_OPCIONES,
		normalizarPeriodo,
		obtenerTituloPeriodo,
		type PeriodoSlug
	} from '$lib/utils/periodo';
	import type { ColaboradorDashboardData } from './colaborador/types';
	import jsPDF from 'jspdf';
	import { PdfService } from '$lib/utils/pdf.service';

	const hayNuevosMensajesChat = $derived(
		tieneNuevosMensajes(page.data.ultimoMensajeAjenoAt ?? null)
	);

	let showFilters = $state(false);
	let showProjectStats = $state(false);
	let showCalendarStats = $state(false);
	let showEvidenceModal = $state(false);
	let showInstitucionesModal = $state(false);
	let showClosureModal = $state(false);

	interface Props {
		data: ColaboradorDashboardData;
		periodo?: PeriodoSlug;
	}

	let { data, periodo = 'todo' }: Props = $props();

	const mostrarBadgeNuevas = $derived(periodo === 'todo');

	function cambiarPeriodo(event: Event) {
		const target = event.target as HTMLSelectElement;
		const nuevo = normalizarPeriodo(target.value);
		const url = new URL(page.url);
		if (nuevo === 'todo') url.searchParams.delete('periodo');
		else url.searchParams.set('periodo', nuevo);
		goto(url, { keepFocus: true, noScroll: true });
	}

	async function generatePDF() {
		const doc = new jsPDF();

		let logoImg: HTMLImageElement | null = null;
		try {
			logoImg = await PdfService.cargarImagen('/logo-1.png');
		} catch (e) {
			console.error('No se pudo cargar el logo', e);
		}

		// --- Encabezado ---
		let yPos = PdfService.dibujarEncabezado(
			doc,
			logoImg,
			'Reporte de Impacto Social',
			`Colaborador: ${data.info.nombre} | ${data.info.tipo.toUpperCase()}`,
			data.info.ubicacion,
			data.info.bio
		);

		// --- Subtítulo de período centrado en pill (solo si no es "todo") ---
		const tituloPeriodo = obtenerTituloPeriodo(periodo);
		if (tituloPeriodo) {
			yPos -= 5;
			const anchoPagina = doc.internal.pageSize.getWidth();
			const texto = `Período: ${tituloPeriodo}`;
			doc.setFontSize(13);
			doc.setFont('helvetica', 'bold');
			const anchoTexto = doc.getTextWidth(texto);
			const padding = 10;
			const anchoPill = anchoTexto + padding * 2;
			const altoPill = 9;
			const xPill = (anchoPagina - anchoPill) / 2;
			doc.setFillColor(239, 246, 255);
			doc.setDrawColor(...PdfService.COLORES.AZUL_500);
			doc.roundedRect(xPill, yPos, anchoPill, altoPill, 3, 3, 'FD');
			doc.setTextColor(...PdfService.COLORES.AZUL_500);
			doc.text(texto, anchoPagina / 2, yPos + altoPill / 2 + 1.5, { align: 'center' });
			yPos += altoPill + 8;
		}

		// --- Resumen de Impacto Personal (Destacado) ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Mi Impacto Personal', yPos);

		const personalImpact = [
			{
				etiqueta: 'Voluntariado',
				valor: data.estadisticasAyuda.voluntariado.toString(),
				unidad: data.estadisticasAyuda.unidadVoluntariado,
				color: PdfService.COLORES.AZUL_500
			},
			{
				etiqueta: 'Donaciones Monetarias',
				valor: `$${data.estadisticasAyuda.monetaria.toLocaleString('es-AR')}`,
				unidad: 'ARS',
				color: PdfService.COLORES.ESMERALDA_500
			},
			{
				etiqueta: 'Donaciones en Especie',
				valor: data.estadisticasAyuda.especie.toString(),
				unidad: 'unidades',
				color: PdfService.COLORES.AMBAR_500
			}
		];

		yPos = PdfService.dibujarTarjetasMetricas(doc, personalImpact, yPos);

		// --- Métricas Globales (Contexto) ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Impacto en la Comunidad', yPos);

		const metricasGlobales = [
			{ etiqueta: 'Proyectos Apoyados', valor: data.metricas.proyectosTotales.toString() },
			{
				etiqueta: 'Instituciones Ayudadas',
				valor: data.metricas.institucionesAlcanzadas.toString()
			},
			{
				etiqueta: 'Beneficiarios Potenciales',
				valor: (data.metricas.estadisticasProyectos?.totalBeneficiarios || 0).toString()
			},
			{ etiqueta: 'Solicitudes Activas', valor: data.metricas.solicitudesPendientes.toString() }
		];

		yPos = PdfService.dibujarTarjetasMetricas(doc, metricasGlobales, yPos, 4);
		yPos += 5;

		// --- Gráfico de Distribución ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Distribución de Ayuda', yPos);

		let total =
			data.estadisticasAyuda.distribucion.voluntariado +
				data.estadisticasAyuda.distribucion.monetaria +
				data.estadisticasAyuda.distribucion.especie || 1;
		if (total === 0) total = 1;

		const distribucion = [
			{
				valor: data.estadisticasAyuda.distribucion.voluntariado,
				color: PdfService.COLORES.AZUL_500,
				etiqueta: 'Voluntariado'
			},
			{
				valor: data.estadisticasAyuda.distribucion.monetaria,
				color: PdfService.COLORES.ESMERALDA_500,
				etiqueta: 'Monetaria'
			},
			{
				valor: data.estadisticasAyuda.distribucion.especie,
				color: PdfService.COLORES.AMBAR_500,
				etiqueta: 'Especie'
			}
		];

		// Usar barra de distribución (segmentada)
		yPos = PdfService.dibujarBarraDistribucion(doc, distribucion, total, yPos);

		// --- Detalle de Proyectos (Tabla) — usa la versión filtrada por período ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Detalle de Participación en Proyectos', yPos);

		const filasTabla = data.seguimientoObjetivosEnPeriodo.flatMap((p) => {
			return p.objetivos.map((obj) => [
				p.nombre,
				obj.descripcion,
				obj.tipo.charAt(0).toUpperCase() + obj.tipo.slice(1),
				`${obj.actual} / ${obj.meta} ${obj.unidad}`,
				`${obj.progreso}%`
			]);
		});

		yPos = PdfService.dibujarTabla(
			doc,
			[['Proyecto', 'Objetivo', 'Tipo', 'Aporte / Meta', 'Avance']],
			filasTabla,
			yPos
		);

		// --- Pie de Página ---
		PdfService.dibujarPieDePagina(doc);

		doc.save(`reporte-impacto-${data.info.nombre.replace(/\s+/g, '-').toLowerCase()}.pdf`);
	}
</script>

<div
	class="min-h-screen overflow-x-hidden bg-[#0F1029] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200"
>
	<!-- overlay de textura con ruido -->
	<div
		class="pointer-events-none fixed inset-0 z-0 opacity-3"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E');"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Elementos Decorativos de Fondo -->
		<div
			class="fixed top-0 left-1/4 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]"
		></div>
		<div
			class="fixed top-20 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]"
		></div>
		<div
			class="fixed bottom-0 left-1/3 -z-10 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]"
		></div>

		<!-- Información del Encabezado -->
		<div
			class="animate-fade-in-up flex w-full flex-col justify-between gap-6 md:flex-row md:items-end"
		>
			<div class="w-full">
				<div class="mb-4 flex items-center gap-2 md:mb-6">
					<span
						class="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
					>
						<span class="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
						Panel de control
					</span>
				</div>
				<h1
					class="font-display mb-6 text-3xl font-bold tracking-tight text-white drop-shadow-sm md:mb-8 md:text-5xl lg:text-6xl"
				>
					Hola, <span
						class="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>{data.info.nombre}</span
					>
				</h1>
				<div
					class="flex w-full flex-col justify-between gap-4 text-sm font-medium text-slate-400 md:flex-row md:items-center md:text-base"
				>
					<!-- Metadata del Colaborador -->
					<div class="flex flex-row flex-wrap items-center gap-3 md:gap-4">
						<span
							class="flex w-fit items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-400 shadow-sm"
						>
							<Users size={15} />
							{data.info.tipo}
						</span>
						<span class="inline-block h-1 w-1 rounded-full bg-slate-600"></span>
						<span class="flex items-center gap-1">
							<MapPin size={14} class="text-slate-500" />
							{data.info.ubicacion}
						</span>
					</div>

					<!-- Alternar Filtros (Escritorio: Alineado a la derecha) -->
					<div class="flex items-center gap-3">
						<button
							onclick={() => (showFilters = !showFilters)}
							class="group flex w-fit items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 transition-all hover:bg-white/10 active:scale-95"
						>
							<Filter
								size={14}
								class="text-slate-400 transition-colors group-hover:text-blue-400"
							/>
							<span
								class="text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-200"
							>
								{showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
							</span>
							<ChevronDown
								size={14}
								class="text-slate-500 transition-transform duration-300 {showFilters
									? 'rotate-180'
									: ''}"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Acciones rápidas -->
		<div class="animate-fade-in-up delay-100">
			<AccionesRapidas
				solicitudesPendientes={data.metricas.solicitudesPendientes}
				mensajesNoLeidos={data.metricas.mensajesNoLeidos}
				hayNuevosMensajes={hayNuevosMensajesChat}
				proyectosPendienteCierre={data.metricas.proyectosPendienteCierre}
				bind:showEvidenceModal
				bind:showClosureModal
				onExportPDF={generatePDF}
			/>
		</div>

		{#if showFilters}
			<div
				transition:slide={{ duration: 300, axis: 'y' }}
				class="relative flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md lg:flex-row lg:items-center"
			>
				<div class="mb-2 flex items-center gap-2 text-slate-300 lg:mb-0">
					<div class="rounded-lg bg-blue-500/10 p-2 text-blue-400">
						<Filter size={18} />
					</div>
					<span class="text-sm font-medium">Filtrar por período:</span>
				</div>

				<div class="relative w-full min-w-[180px] lg:w-auto">
					<select
						value={periodo}
						onchange={cambiarPeriodo}
						class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
					>
						{#each PERIODO_OPCIONES as opcion (opcion.slug)}
							<option value={opcion.slug}>{opcion.label}</option>
						{/each}
					</select>
					<ChevronDown
						size={14}
						class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
					/>
				</div>
			</div>
		{/if}

		<!-- Tarjetas de Métricas -->
		<div class="animate-fade-in-up delay-200">
			<MetricasPanel
				metricas={{
					proyectosActivos: data.metricas.proyectosTotales,
					nuevosProyectos: data.metricas.nuevosProyectos,
					institucionesAlcanzadas: data.metricas.institucionesAlcanzadas,
					nuevasInstituciones: data.metricas.nuevasInstituciones,
					proximoCierre: data.metricas.diasProximoCierre
				}}
				{mostrarBadgeNuevas}
				onclickInstituciones={() => (showInstitucionesModal = true)}
				onclickProyectos={() => (showProjectStats = true)}
				onclickAgenda={() => (showCalendarStats = true)}
			/>
		</div>

		<!-- Grilla de Diseño Principal -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 lg:grid-cols-12">
			<!-- Columna Izquierda: Actividad Principal (7/12 ancho) -->
			<div class="flex flex-col gap-6 lg:col-span-7">
				<!-- Seguimiento de Objetivos -->
				<div class="min-h-[400px]">
					{#if data.seguimientoObjetivos && data.seguimientoObjetivos.length > 0}
						<SeguimientoObjetivos objetivos={data.seguimientoObjetivos} />
					{:else}
						<div class="flex h-full items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
							<EmptyState 
								message="No estás participando en proyectos" 
								description="Explora los proyectos de la comunidad y comienza a colaborar para ver tus objetivos aquí."
								icon={HeartOff}
							/>
						</div>
					{/if}
				</div>
				<!-- Heatmap de Actividad -->
				<div class="flex-1">
					{#if data.heatmapActividad && data.heatmapActividad.length > 0}
						<HeatmapActividad data={data.heatmapActividad} />
					{:else}
						<div class="flex h-full items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm p-8">
							<EmptyState 
								message="Sin actividad registrada" 
								description="Tu historial de colaboraciones aparecerá aquí conforme participes en proyectos solidarios."
								icon={Calendar}
							/>
						</div>
					{/if}
				</div>
			</div>

			<!-- Columna Derecha: Estadísticas Laterales (5/12 ancho) -->
			<div class="flex flex-col gap-6 lg:col-span-5">
				<!-- Estadísticas Ayuda -->
				<div class="min-h-[300px]">
					<EstadisticasAyuda estadisticas={data.estadisticasAyuda} />
				</div>

				<!-- Últimas Reseñas -->
				<div class="min-h-[300px]">
					<UltimasResenas resenas={data.ultimasResenas} />
				</div>
			</div>
		</div>

		<!-- Fila Inferior: Proyectos y Novedades -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 md:grid-cols-2">
			<!-- Proyectos de la Comunidad -->
			<div class="min-h-[200px]">
				{#if data.proyectosComunidad && data.proyectosComunidad.length > 0}
					<ProyectosComunidad proyectos={data.proyectosComunidad} />
				{:else}
					<div class="flex h-full items-center justify-center rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
						<EmptyState 
							message="No hay recomendaciones" 
							description="Prueba actualizar tus categorías preferidas para que podamos recomendarte proyectos afines."
							icon={LayoutGrid}
						/>
					</div>
				{/if}
			</div>

			<!-- Novedades -->
			<div class="min-h-[200px]">
				<Novedades
					novedades={[
						{
							id: '1',
							titulo: 'Nueva función habilitada',
							fecha: new Date().toISOString(),
							contenido: 'Ahora podés exportar tus reportes en PDF.',
							imagen:
								'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
						},
						{
							id: '2',
							titulo: 'Lanzamiento a la comunidad',
							fecha: '2026-02-13',
							contenido:
								'¡Ya tenemos fecha! El 13 de febrero será el primer lanzamiento oficial de Conectando Corazones.',
							imagen:
								'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
						}
					]}
				/>
			</div>
		</div>
	</div>

	<!-- Modales -->

	<EstadisticasProyectoModal
		show={showProjectStats}
		stats={data.metricas.estadisticasProyectos}
		onClose={() => (showProjectStats = false)}
	/>

	<EstadisticasAgendaModal
		show={showCalendarStats}
		stats={data.metricas.estadisticasCalendario}
		onClose={() => (showCalendarStats = false)}
	/>

	<GestionarEvidenciasModal
		show={showEvidenceModal}
		proyectos={data.proyectosParaEvidencia || []}
		onClose={() => (showEvidenceModal = false)}
	/>

	<!-- Modal de Instituciones Alcanzadas -->
	<InstitucionesAlcanzadasModal
		show={showInstitucionesModal}
		stats={data.metricas.estadisticasInstituciones}
		onClose={() => (showInstitucionesModal = false)}
	/>

	<EvaluarCierreModal
		show={showClosureModal}
		proyectos={data.metricas.proyectosParaCierre || []}
		onClose={() => (showClosureModal = false)}
	/>
</div>

<style>
	/* Animación personalizada de aparición (Fade In) */
	@keyframes fadeInUp {
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
		animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
	}
	.delay-100 {
		animation-delay: 100ms;
	}
	.delay-200 {
		animation-delay: 200ms;
	}
	.delay-300 {
		animation-delay: 300ms;
	}
</style>
