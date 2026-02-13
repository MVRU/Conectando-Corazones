<script lang="ts">
	import { onMount } from 'svelte';
	import { Filter, ChevronRight, ChevronDown, MapPin, Sparkles, School } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import AccionesRapidas from './institucion/AccionesRapidas.svelte';
	import MetricasPanel from './institucion/MetricasPanel.svelte';
	import SeguimientoObjetivos from './institucion/SeguimientoObjetivos.svelte';
	import EstadisticasAyuda from './institucion/EstadisticasAyuda.svelte';
	import TopColaboradores from './institucion/TopColaboradores.svelte';
	import ActividadReciente from './institucion/ActividadReciente.svelte';
	import UltimasResenas from './institucion/UltimasResenas.svelte';
	import AspectosMejorar from './institucion/AspectosMejorar.svelte';
	import Novedades from './Novedades.svelte';
	import EstadisticasColaboradorModal from './institucion/EstadisticasColaboradorModal.svelte';
	import EstadisticasProyectoModal from './institucion/EstadisticasProyectoModal.svelte';
	import EstadisticasAgendaModal from './institucion/EstadisticasAgendaModal.svelte';
	import GestionarEvidenciasModal from './institucion/GestionarEvidenciasModal.svelte';
	import type { InstitucionDashboardData } from './institucion/types';

	export let data: InstitucionDashboardData;

	// Filters state
	let filters = {
		periodo: 'mes_actual',
		categoria: 'todas',
		estado: 'en_curso',
		tipoParticipacion: 'todos',
		ubicacion: 'todas'
	};

	// Animation & Scroll
	let mounted = false;
	let filterScrollContainer: HTMLDivElement;
	let showFilterIndicator = false;
	let showFilters = false;
	let showLeftGradient = false;
	let showRightGradient = false;
	let showCollaboratorStats = false;
	let showProjectStats = false;
	let showCalendarStats = false;
	let showEvidenceModal = false;

	function checkFilterScroll() {
		if (!filterScrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = filterScrollContainer;
		showLeftGradient = scrollLeft > 10;
		showRightGradient = scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 10;
		showFilterIndicator = showRightGradient;
	}

	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';
	import { FileText } from 'lucide-svelte';

	onMount(() => {
		mounted = true;
		setTimeout(checkFilterScroll, 100);
		window.addEventListener('resize', checkFilterScroll);
		return () => window.removeEventListener('resize', checkFilterScroll);
	});

	async function loadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'Anonymous';
			img.src = url;
			img.onload = () => resolve(img);
			img.onerror = reject;
		});
	}

	import { PdfService } from '$lib/utils/pdf.service';

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
			'Reporte de Gestión Institucional',
			`Institución: ${data.info.nombre} | ${data.info.tipo.toUpperCase()}`,
			data.info.ubicacion,
			undefined, // Bio no usada en encabezado para Institución
			data.info.estaVerificado
		);

		// --- Resumen Ejecutivo (KPIs) ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Resumen Ejecutivo', yPos);

		const estProyectos = data.metricas.estadisticasProyectos;

		const kpis = [
			{
				valor: '$' + (estProyectos?.totalDineroRecaudado || 0).toLocaleString('es-AR'),
				etiqueta: 'Fondos Recaudados',
				subtitulo: 'Total histórico'
			},
			{
				valor: data.metricas.proyectosTotales.toString(),
				etiqueta: 'Proyectos Activos',
				subtitulo: 'En curso' // Asumiendo que totales activos son los relevantes aquí
			},
			{
				valor: Math.round(estProyectos?.promedioProgreso || 0) + '%',
				etiqueta: 'Progreso Promedio',
				subtitulo: 'Global'
			},
			{
				valor: data.metricas.colaboradoresActivos.toString(),
				etiqueta: 'Colaboradores',
				subtitulo: 'Activos hoy'
			}
		];

		yPos = PdfService.dibujarTarjetasMetricas(doc, kpis, yPos, 4);

		// --- Alerta de Auditoría (Específico de Institución) ---
		const proyectosAuditoria = estProyectos?.proyectosEnAuditoria || [];

		if (proyectosAuditoria.length > 0) {
			doc.setDrawColor(239, 68, 68); // Rojo borde
			doc.setFillColor(254, 242, 242); // Rojo fondo claro
			doc.roundedRect(PdfService.MARGEN, yPos, 170, 15 + proyectosAuditoria.length * 6, 3, 3, 'FD');

			doc.setTextColor(185, 28, 28); // Rojo texto oscuro
			doc.setFontSize(10);
			doc.setFont('helvetica', 'bold');
			doc.text('⚠ Alerta de Auditoría', PdfService.MARGEN + 5, yPos + 6);

			doc.setFont('helvetica', 'normal');
			doc.setFontSize(9);
			doc.text(
				'Se detectaron discrepancias en los siguientes proyectos:',
				PdfService.MARGEN + 5,
				yPos + 11
			);

			let auditY = yPos + 17;
			proyectosAuditoria.forEach((proj) => {
				doc.text(`• ${proj.titulo}: ${proj.motivo}`, PdfService.MARGEN + 5, auditY);
				auditY += 5;
			});

			yPos = auditY + 10;
		} else {
			yPos += 10;
		}

		// --- Estado de Proyectos (Tabla) ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Proyectos Destacados', yPos);

		const proyectosDestacados = estProyectos?.proyectosDestacados || [];

		const filasProyectos = proyectosDestacados.map((p) => [
			p.titulo,
			p.estado.charAt(0).toUpperCase() + p.estado.slice(1),
			p.beneficiarios.toString(),
			`${Math.round(p.progreso)}%`
		]);

		if (filasProyectos.length > 0) {
			yPos = PdfService.dibujarTabla(
				doc,
				[['Proyecto', 'Estado', 'Beneficiarios', 'Progreso']],
				filasProyectos,
				yPos
			);
		} else {
			doc.setFontSize(10);
			doc.setFont('helvetica', 'italic');
			doc.setTextColor(100, 116, 139);
			doc.text(
				'No hay proyectos destacados para mostrar en este momento.',
				PdfService.MARGEN,
				yPos + 10
			);
			yPos += 20;
		}

		yPos = PdfService.verificarSaltoPagina(doc, yPos);

		// --- Ranking de Colaboradores ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Top Colaboradores', yPos);

		const colabRows = data.topColaboradores.map((c, i) => [
			`${i + 1}`,
			c.nombre,
			c.rol,
			c.aportes.toString()
		]);

		yPos = PdfService.dibujarTabla(
			doc,
			[['#', 'Nombre', 'Rol', 'Aportes']],
			colabRows,
			yPos,
			'striped'
		);

		yPos = PdfService.verificarSaltoPagina(doc, yPos);

		// --- Análisis de Recursos (Gráfico de barras simulado) ---
		yPos = PdfService.dibujarTituloSeccion(doc, 'Distribución de Ayuda Recibida', yPos);

		const totalAyuda =
			data.estadisticasAyuda.voluntariado +
			data.estadisticasAyuda.monetaria +
			data.estadisticasAyuda.especie;

		const distData = [
			{
				etiqueta: 'Voluntariado',
				valor: data.estadisticasAyuda.voluntariado,
				color: PdfService.COLORES.AZUL_500
			},
			{
				etiqueta: 'Monetaria',
				valor: data.estadisticasAyuda.monetaria,
				color: PdfService.COLORES.ESMERALDA_500
			},
			{
				etiqueta: 'En Especie',
				valor: data.estadisticasAyuda.especie,
				color: PdfService.COLORES.AMBAR_500
			}
		];

		// Usar gráfico de barras simple (lista de barras)
		yPos = PdfService.dibujarGraficoBarrasSimple(doc, distData, totalAyuda, yPos);
		yPos += 10; // Espaciado extra

		// --- Sección de Feedback / Mejoras ---
		if (data.aspectosMejorar && data.aspectosMejorar.length > 0) {
			yPos = PdfService.verificarSaltoPagina(doc, yPos, 80);
			yPos = PdfService.dibujarTituloSeccion(doc, 'Feedback y Aspectos a Mejorar', yPos);

			data.aspectosMejorar.forEach((item) => {
				// Título del Proyecto
				doc.setFontSize(11);
				doc.setFont('helvetica', 'bold');
				doc.setTextColor(71, 85, 105);
				doc.text(item.proyecto, PdfService.MARGEN, yPos);
				yPos += 5;

				// Sugerencias
				doc.setFontSize(9);
				doc.setFont('helvetica', 'normal');
				doc.setTextColor(100, 116, 139);
				item.sugerencias.forEach((sug) => {
					const bullet = '• ';
					const anchoTexto = doc.internal.pageSize.getWidth() - PdfService.MARGEN * 2 - 5;
					const lineas = doc.splitTextToSize(bullet + sug, anchoTexto);
					doc.text(lineas, PdfService.MARGEN + 2, yPos);
					yPos += lineas.length * 4 + 2;
				});
				yPos += 4;
			});
		}

		// --- Pie de Página ---
		PdfService.dibujarPieDePagina(doc);

		doc.save(`reporte-institucional-${data.info.nombre.replace(/\s+/g, '-').toLowerCase()}.pdf`);
	}
</script>

<div
	class="min-h-screen overflow-x-hidden bg-[#0F1029] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200"
>
	<!-- overlay de textura con ruido -->
	<div
		class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E');"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Decorative Background Elements -->
		<div
			class="fixed top-0 left-1/4 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]"
		></div>
		<div
			class="fixed top-20 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]"
		></div>
		<div
			class="fixed bottom-0 left-1/3 -z-10 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]"
		></div>

		<!-- Header Info -->
		<div
			class="animate-fade-in-up flex w-full flex-col justify-between gap-6 md:flex-row md:items-end"
		>
			<div class="w-full">
				<div class="mb-4 flex items-center gap-2 md:mb-6">
					<span
						class="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
					>
						<span class="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
						Panel institucional
					</span>
				</div>
				<h1
					class="font-display mb-6 text-3xl font-bold tracking-tight text-white drop-shadow-sm md:mb-8 md:text-5xl lg:text-6xl"
				>
					Hola, <span
						class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>{data.info.nombre}</span
					>
				</h1>
				<div
					class="flex w-full flex-col justify-between gap-4 text-sm font-medium text-slate-400 md:flex-row md:items-center md:text-base"
				>
					<!-- Institution Meta -->
					<div class="flex flex-row flex-wrap items-center gap-3 md:gap-4">
						<span
							class="flex w-fit items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-400 shadow-sm"
						>
							<School size={15} />
							{data.info.tipo}
						</span>
						<span class="inline-block h-1 w-1 rounded-full bg-slate-600"></span>
						<span class="flex items-center gap-1">
							<MapPin size={14} class="text-slate-500" />
							{data.info.ubicacion}
						</span>
					</div>

					<!-- Toggle Filters (Desktop: Right aligned) -->
					<div class="flex items-center gap-3">
						<button
							on:click={() => (showFilters = !showFilters)}
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
				proyectosPendienteCierre={data.metricas.proyectosPendienteCierre}
				estaVerificado={data.info.estaVerificado}
				bind:showEvidenceModal
				onExportPDF={generatePDF}
			/>
		</div>

		<!-- Filters Toggle -->

		{#if showFilters}
			<div
				transition:slide={{ duration: 300, axis: 'y' }}
				class="relative flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md lg:flex-row lg:items-center"
			>
				<div class="mb-2 flex items-center gap-2 text-slate-300 lg:mb-0">
					<div class="rounded-lg bg-blue-500/10 p-2 text-blue-400">
						<Filter size={18} />
					</div>
					<span class="text-sm font-medium">Filtrar vista por:</span>
				</div>

				<div
					bind:this={filterScrollContainer}
					on:scroll={checkFilterScroll}
					class="grid w-full grid-cols-1 gap-3 pb-2 md:grid md:w-full md:grid-cols-3 md:pb-0 lg:w-auto xl:grid-cols-5"
				>
					<div class="relative w-full min-w-[140px] shrink-0 snap-start">
						<select
							bind:value={filters.periodo}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="mes_actual">Este mes</option>
							<option value="trimestre">Este trimestre</option>
							<option value="anio">Este año</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[160px] shrink-0 snap-start">
						<select
							bind:value={filters.categoria}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="todas">Todas las categorías</option>
							<option value="educacion">Educación</option>
							<option value="salud">Salud</option>
							<option value="tecnologia">Tecnología</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[140px] shrink-0 snap-start">
						<select
							bind:value={filters.estado}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="todos">Todos los estados</option>
							<option value="en_curso">En curso</option>
							<option value="pendiente_solicitud_cierre">Pendiente solicitud cierre</option>
							<option value="en_revision">En revisión</option>
							<option value="completado">Completado</option>
							<option value="cancelado">Cancelado</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[150px] shrink-0 snap-start">
						<select
							bind:value={filters.tipoParticipacion}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="todos">Cualquier ayuda</option>
							<option value="voluntariado">Voluntariado</option>
							<option value="monetaria">Monetaria</option>
							<option value="especie">En especie</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[150px] shrink-0 snap-start">
						<select
							bind:value={filters.ubicacion}
							class="focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 focus:ring-1"
						>
							<option value="todas">Todas las ubicaciones</option>
							<option value="local">Local</option>
							<option value="provincial">Provincial</option>
							<option value="nacional">Nacional</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>
				</div>

				<!-- Scroll Indicators -->
				{#if showLeftGradient}
					<div
						class="from-bg-[#0F1029] via-bg-[#0F1029]/80 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent md:hidden"
					></div>
				{/if}
				{#if showRightGradient}
					<div
						class="to-bg-[#0F1029] via-bg-[#0F1029]/80 pointer-events-none absolute top-0 right-0 bottom-0 z-10 flex w-12 items-center justify-end bg-gradient-to-r from-transparent p-2 md:hidden"
					>
						<ChevronRight size={16} class="text-primary animate-pulse" />
					</div>
				{/if}
			</div>
		{/if}

		<!-- Metrics Cards -->
		<div class="animate-fade-in-up delay-200">
			<MetricasPanel
				metricas={{
					proyectosActivos: data.metricas.proyectosTotales,
					colaboradores: data.metricas.colaboradoresActivos,
					nuevosColaboradores: 2,
					proximoCierre: data.metricas.diasProximoCierre
				}}
				on:clickColaboradores={() => (showCollaboratorStats = true)}
				on:clickProyectos={() => (showProjectStats = true)}
				on:clickAgenda={() => (showCalendarStats = true)}
			/>
		</div>

		<!-- Main Grid Layout -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 lg:grid-cols-12">
			<!-- Left Column: Main Activity (7/12 width) -->
			<div class="flex flex-col gap-6 lg:col-span-7">
				<!-- Seguimiento de Objetivos -->
				<div class="min-h-[400px]">
					<SeguimientoObjetivos objetivos={data.seguimientoObjetivos} />
				</div>
				<!-- Actividad Reciente -->
				<div class="flex-1">
					<ActividadReciente actividad={data.actividadReciente} />
				</div>
			</div>

			<!-- Right Column: Sidebar Stats (5/12 width) -->
			<div class="flex flex-col gap-6 lg:col-span-5">
				<!-- Estadísticas Ayuda -->
				<div class="min-h-[300px]">
					<EstadisticasAyuda estadisticas={data.estadisticasAyuda} />
				</div>

				<!-- Top Colaboradores -->
				<!-- Top Colaboradores -->
				<div class="min-h-[300px]">
					<TopColaboradores colaboradores={data.topColaboradores} />
				</div>

				<!-- Últimas Reseñas -->
				<div class="min-h-[300px]">
					<!-- TODO: implementar módulo de reseñas -->
					<UltimasResenas resenas={data.ultimasResenas} />
				</div>
			</div>
		</div>

		<!-- Bottom Row: Aspectos & Novedades (Delay 300 inherited or new?) Let's keep it part of flow or add delay-400 if I defined it. I didn't define 400. So I'll just wrap it in delay-300 as well or leave it. -->
		<!-- Actually, let's wrap the bottom row too for consistency -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 md:grid-cols-2">
			<!-- Aspectos a mejorar -->
			<div class="min-h-[200px]">
				<AspectosMejorar aspectos={data.aspectosMejorar} />
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

	<!-- Modals -->
	<EstadisticasColaboradorModal
		show={showCollaboratorStats}
		stats={data.metricas.estadisticasColaboradores}
		onClose={() => (showCollaboratorStats = false)}
	/>

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
		proyectos={data.metricas.estadisticasProyectos?.proyectosDestacados || []}
		onClose={() => (showEvidenceModal = false)}
	/>
</div>

<style>
	/* Custom Fade In Animation */
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
