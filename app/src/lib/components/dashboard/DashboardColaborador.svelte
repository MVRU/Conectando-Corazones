<script lang="ts">
	import { onMount } from 'svelte';
	import { Filter, ChevronRight, ChevronDown, MapPin, Sparkles, Users } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import AccionesRapidas from './colaborador/AccionesRapidas.svelte';
	import MetricasPanel from './colaborador/MetricasPanel.svelte';
	import SeguimientoObjetivos from './colaborador/SeguimientoObjetivos.svelte';
	import EstadisticasAyuda from './colaborador/EstadisticasAyuda.svelte';
	import ActividadReciente from './colaborador/ActividadReciente.svelte';
	import UltimasResenas from './colaborador/UltimasResenas.svelte';
	import Novedades from './colaborador/Novedades.svelte';
	import EstadisticasProyectoModal from './colaborador/EstadisticasProyectoModal.svelte';
	import EstadisticasAgendaModal from './colaborador/EstadisticasAgendaModal.svelte';
	import GestionarEvidenciasModal from './colaborador/GestionarEvidenciasModal.svelte';
	import InstitucionesAlcanzadasModal from './colaborador/InstitucionesAlcanzadasModal.svelte';
	import EvaluarCierreModal from './colaborador/EvaluarCierreModal.svelte';
	import HeatmapActividad from './colaborador/HeatmapActividad.svelte';
	import ProyectosComunidad from './colaborador/ProyectosComunidad.svelte';
	import type { ColaboradorDashboardData } from './colaborador/types';

	export let data: ColaboradorDashboardData;

	// Estado de los filtros
	let filters = {
		periodo: 'mes_actual',
		categoria: 'todas',
		estado: 'en_curso',
		tipoParticipacion: 'todos',
		ubicacion: 'todas'
	};

	// Animación y Scroll
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
	let showInstitucionesModal = false;
	let showClosureModal = false;

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

	async function generatePDF() {
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 20;
		let yPos = 20;

		// Load Logo
		let logoImg: HTMLImageElement | null = null;
		try {
			logoImg = await loadImage('/logo-1.png');
		} catch (e) {
			console.error('No se pudo cargar el logo', e);
		}

		// --- Header ---
		doc.setFillColor(15, 16, 41);
		doc.rect(0, 0, pageWidth, 55, 'F');

		if (logoImg) {
			const logoWidth = 25;
			const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
			doc.addImage(logoImg, 'PNG', margin, 15, logoWidth, logoHeight);
		}

		doc.setTextColor(255, 255, 255);
		doc.setFontSize(22);
		doc.setFont('helvetica', 'bold');
		const titleX = logoImg ? margin + 30 : margin;
		doc.text('Reporte de Impacto', titleX, 25);

		doc.setFontSize(12);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(148, 163, 184); // Slate 400
		doc.text(data.info.tipo.toUpperCase(), titleX, 32);

		doc.setFontSize(10);
		doc.setTextColor(203, 213, 225); // Slate 300
		doc.text(data.info.ubicacion, titleX, 38);

		if (data.info.bio) {
			doc.setFontSize(9);
			doc.setFont('helvetica', 'italic');
			doc.setTextColor(148, 163, 184); // Slate 400
			const bioLines = doc.splitTextToSize(data.info.bio, pageWidth - titleX - margin);
			doc.text(bioLines.slice(0, 2), titleX, 44);
		}

		yPos = 70;

		// --- Métricas Clave (Grilla 3x2) ---
		doc.setTextColor(15, 23, 42);
		doc.setFontSize(16);
		doc.setFont('helvetica', 'bold');
		doc.text('Métricas Clave', margin, yPos);
		yPos += 10;

		const metrics = [
			{ label: 'Proyectos Colaborados', value: data.metricas.proyectosTotales.toString() },
			{
				label: 'Instituciones Ayudadas',
				value: data.metricas.institucionesAlcanzadas.toString()
			},
			{
				label: 'Total Aportado (ARS)',
				value: `$${(data.metricas.estadisticasProyectos?.totalDineroRecaudado || 0).toLocaleString('es-AR')}`
			},
			{
				label: 'Beneficiarios Alcanzados',
				value: (data.metricas.estadisticasProyectos?.totalBeneficiarios || 0).toString()
			},
			{ label: 'Solicitudes Pendientes', value: data.metricas.solicitudesPendientes.toString() },
			{
				label: 'Progreso Promedio',
				value: `${data.metricas.estadisticasProyectos?.promedioProgreso || 0}%`
			}
		];

		const gridCols = 3;
		const colWidth = (pageWidth - margin * 2) / gridCols;
		const rowHeight = 22;

		metrics.forEach((metric, index) => {
			const col = index % gridCols;
			const row = Math.floor(index / gridCols);
			const x = margin + col * colWidth;
			const y = yPos + row * rowHeight;

			doc.setFillColor(248, 250, 252); // Slate 50
			doc.setDrawColor(226, 232, 240); // Slate 200
			doc.roundedRect(x + 2, y, colWidth - 4, rowHeight - 6, 3, 3, 'FD');

			doc.setFontSize(8);
			doc.setFont('helvetica', 'normal');
			doc.setTextColor(100, 116, 139);
			doc.text(metric.label, x + 6, y + 6);

			doc.setFontSize(11);
			doc.setFont('helvetica', 'bold');
			doc.setTextColor(15, 23, 42);
			doc.text(metric.value, x + 6, y + 12);
		});

		yPos += Math.ceil(metrics.length / gridCols) * rowHeight + 10;

		// --- Análisis de Impacto ---
		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.text('Distribución de Ayuda por Tipo', margin, yPos);
		yPos += 10;

		const impactData = [
			{
				label: 'Monetaria',
				value: data.estadisticasAyuda.monetaria,
				unit: 'ARS',
				color: [16, 185, 129]
			},
			{
				label: 'Voluntariado',
				value: data.estadisticasAyuda.voluntariado,
				unit: data.estadisticasAyuda.unidadVoluntariado,
				color: [59, 130, 246]
			},
			{
				label: 'En Especie',
				value: data.estadisticasAyuda.especie,
				unit: 'unidades',
				color: [245, 158, 11]
			}
		];

		impactData.forEach((item) => {
			doc.setFontSize(10);
			doc.setFont('helvetica', 'bold');
			doc.setTextColor(71, 85, 105);
			doc.text(`${item.label}:`, margin, yPos);

			const valText = `${item.value.toLocaleString('es-AR')} ${item.unit}`;
			doc.setFont('helvetica', 'normal');
			doc.text(valText, margin + 30, yPos);

			yPos += 6;
		});

		yPos += 10;

		// --- Seguimiento de Objetivos ---
		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(15, 23, 42);
		doc.text('Seguimiento de Objetivos en Proyectos', margin, yPos);
		yPos += 5;

		const objetivosRows = data.seguimientoObjetivos.flatMap((p) =>
			p.objetivos.map((obj) => [
				p.nombre,
				obj.descripcion,
				`${obj.actual} / ${obj.meta} ${obj.unidad}`,
				`${obj.progreso}%`
			])
		);

		autoTable(doc, {
			startY: yPos,
			head: [['Proyecto', 'Objetivo / Especie', 'Avance', '%']],
			body: objetivosRows,
			theme: 'grid',
			headStyles: { fillColor: [15, 16, 41], textColor: 255 },
			styles: { fontSize: 9 },
			columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 3: { halign: 'center' } },
			margin: { left: margin, right: margin }
		});

		// @ts-ignore
		yPos = doc.lastAutoTable.finalY + 15;

		// --- Footer ---
		const totalPages = doc.getNumberOfPages();
		for (let i = 1; i <= totalPages; i++) {
			doc.setPage(i);
			doc.setFontSize(8);
			doc.setTextColor(148, 163, 184);
			doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

			const dateStr = `Generado el: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`;
			doc.text(dateStr, margin, pageHeight - 10);
			doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, {
				align: 'right'
			});
		}

		doc.save(`reporte-colaborador-${data.info.nombre.replace(/\s+/g, '-').toLowerCase()}.pdf`);
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
						class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
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

				<!-- Indicadores de Scroll -->
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

		<!-- Tarjetas de Métricas -->
		<div class="animate-fade-in-up delay-200">
			<MetricasPanel
				metricas={{
					proyectosActivos: data.metricas.proyectosTotales,
					institucionesAlcanzadas: data.metricas.institucionesAlcanzadas,
					nuevasInstituciones: data.metricas.nuevasInstituciones,
					proximoCierre: data.metricas.diasProximoCierre
				}}
				on:clickInstituciones={() => (showInstitucionesModal = true)}
				on:clickProyectos={() => (showProjectStats = true)}
				on:clickAgenda={() => (showCalendarStats = true)}
			/>
		</div>

		<!-- Grilla de Diseño Principal -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 lg:grid-cols-12">
			<!-- Columna Izquierda: Actividad Principal (7/12 ancho) -->
			<div class="flex flex-col gap-6 lg:col-span-7">
				<!-- Seguimiento de Objetivos -->
				<div class="min-h-[400px]">
					<SeguimientoObjetivos objetivos={data.seguimientoObjetivos} />
				</div>
				<!-- Heatmap de Actividad -->
				<div class="flex-1">
					<HeatmapActividad data={data.heatmapActividad} />
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
					<!-- TODO: implementar módulo de reseñas -->
					<UltimasResenas resenas={data.ultimasResenas} />
				</div>
			</div>
		</div>

		<!-- Fila Inferior: Proyectos y Novedades -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 md:grid-cols-2">
			<!-- Proyectos de la Comunidad -->
			<div class="min-h-[200px]">
				<ProyectosComunidad proyectos={data.proyectosComunidad} />
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
		proyectos={data.metricas.estadisticasProyectos?.proyectosDestacados || []}
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
