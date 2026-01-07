<!--
* Componente: DashboardInstitucion
	-*- Descripción: Dashboard especializado para instituciones que gestionan proyectos
	-*- KPIs: gestión de proyectos, recaudación, colaboradores, análisis de rendimiento, alcance

	FIX: revisar y corregir errores tras cambios en interfaces
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import ProgressBar from '$lib/components/ui/elementos/ProgressBar.svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import {
		Fire,
		Bolt,
		Heart,
		Clipboard,
		ArrowTrendingUp,
		ArrowRight,
		ChartBar,
		BuildingOffice,
		Sparkles,
		Calendar,
		Users,
		Eye,
		Clock,
		Megaphone,
		CurrencyDollar
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	// Datos para gestión institucional
	const institucionInfo = {
		nombre: 'Cruz Roja Argentina',
		tipoOrganizacion: 'ONG',
		tiempoPlataforma: '2 años',
		proyectosPublicados: 15,
		proyectosActivos: 6,
		totalRecaudado: 127500
	};

	const proyectosActivos = [
		{
			id: 1,
			titulo: 'Botiquín para escuela rural',
			fechaCreacion: '2024-03-15',
			deadline: '2024-07-30',
			objetivo: 25000,
			recaudado: 18750,
			progreso: 75,
			colaboradores: 23,
			visualizaciones: 1200,
			estado: 'en_progreso',
			urgencia: 'media'
		},
		{
			id: 2,
			titulo: 'Comedor comunitario Villa Esperanza',
			fechaCreacion: '2024-04-01',
			deadline: '2024-08-15',
			objetivo: 50000,
			recaudado: 32000,
			progreso: 64,
			colaboradores: 18,
			visualizaciones: 890,
			estado: 'en_progreso',
			urgencia: 'alta'
		},
		{
			id: 3,
			titulo: 'Libros para biblioteca móvil',
			fechaCreacion: '2024-05-10',
			deadline: '2024-09-20',
			objetivo: 15000,
			recaudado: 12750,
			progreso: 85,
			colaboradores: 31,
			visualizaciones: 1450,
			estado: 'proximo_cierre',
			urgencia: 'baja'
		}
	];

	const colaboradoresAnalisis = [
		{
			categoria: 'Donantes Recurrentes',
			cantidad: 45,
			porcentaje: 60,
			aporte: 'Mayor contribución económica',
			tendencia: 'creciente'
		},
		{
			categoria: 'Voluntarios Activos',
			cantidad: 28,
			porcentaje: 75,
			aporte: 'Tiempo y habilidades',
			tendencia: 'estable'
		},
		{
			categoria: 'Donantes Ocasionales',
			cantidad: 89,
			porcentaje: 30,
			aporte: 'Donaciones puntuales',
			tendencia: 'variable'
		},
		{
			categoria: 'Organizaciones Aliadas',
			cantidad: 7,
			porcentaje: 85,
			aporte: 'Recursos y redes',
			tendencia: 'creciente'
		}
	];

	const metricsRendimiento = {
		promedioRecaudacion: 8500,
		tiempoPromedioCompletar: '4.2 meses',
		tasaExito: 87,
		proyectoMasExitoso: 'Comedor Villa Norte',
		mejorMes: 'Mayo 2024'
	};

	const proximasAcciones = [
		{
			tipo: 'deadline',
			descripcion: 'Revisión de progreso - Botiquín escuela',
			fecha: 'En 3 días',
			urgencia: 'alta'
		},
		{
			tipo: 'comunicacion',
			descripcion: 'Actualizar beneficiarios sobre comedor',
			fecha: 'En 1 semana',
			urgencia: 'media'
		},
		{
			tipo: 'recaudacion',
			descripcion: 'Campaña final biblioteca móvil',
			fecha: 'En 2 semanas',
			urgencia: 'alta'
		}
	];

	const estadisticasAlcance = {
		totalVisualizaciones: 5640,
		interaccionesUltimoMes: 234,
		compartidoEnRedes: 89,
		nuevosSeguidores: 45
	};

	const tendenciasMensuales = [
		{ mes: 'Ene', recaudado: 8500, colaboradores: 12 },
		{ mes: 'Feb', recaudado: 12300, colaboradores: 18 },
		{ mes: 'Mar', recaudado: 15600, colaboradores: 25 },
		{ mes: 'Abr', recaudado: 22100, colaboradores: 31 },
		{ mes: 'May', recaudado: 34200, colaboradores: 42 },
		{ mes: 'Jun', recaudado: 34650, colaboradores: 45 }
	];

	let animate = false;

	onMount(() => {
		setTimeout(() => (animate = true), 100);
	});

	function getEstadoColor(estado: string) {
		switch (estado) {
			case 'en_progreso':
				return 'border-blue-200 bg-blue-50 text-blue-700';
			case 'proximo_cierre':
				return 'border-green-200 bg-green-50 text-green-700';
			case 'completado':
				return 'border-gray-200 bg-gray-50 text-gray-700';
			default:
				return 'border-gray-200 bg-gray-50 text-gray-700';
		}
	}

	function getUrgenciaIcon(urgencia: string) {
		switch (urgencia) {
			case 'alta':
				return Fire;
			case 'media':
				return Bolt;
			case 'baja':
				return Heart;
			default:
				return Clipboard;
		}
	}

	function getTendenciaIcon(tendencia: string) {
		switch (tendencia) {
			case 'creciente':
				return ArrowTrendingUp;
			case 'estable':
				return ArrowRight;
			case 'variable':
				return ChartBar;
			default:
				return Clipboard;
		}
	}
</script>

<div class="space-y-8">
	<!-- Header Institucional -->
	<div
		class="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 p-6 text-white shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 100ms"
	>
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl">
					<Icon src={BuildingOffice} class="h-8 w-8 text-white" />
				</div>
				<div>
					<h1 class="text-2xl font-bold">{institucionInfo.nombre}</h1>
					<p class="text-purple-100">
						{institucionInfo.tipoOrganizacion} • En plataforma {institucionInfo.tiempoPlataforma}
					</p>
				</div>
			</div>
			<div class="text-right">
				<p class="text-3xl font-bold">${institucionInfo.totalRecaudado.toLocaleString()}</p>
				<p class="text-sm text-purple-100">Total Recaudado</p>
			</div>
		</div>

		<div class="grid gap-4 sm:grid-cols-3">
			<div class="rounded-lg bg-white/10 p-3 text-center">
				<p class="text-2xl font-bold">{institucionInfo.proyectosPublicados}</p>
				<p class="text-sm text-purple-100">Proyectos Publicados</p>
			</div>
			<div class="rounded-lg bg-white/10 p-3 text-center">
				<p class="text-2xl font-bold">{institucionInfo.proyectosActivos}</p>
				<p class="text-sm text-purple-100">Proyectos Activos</p>
			</div>
			<div class="rounded-lg bg-white/10 p-3 text-center">
				<p class="text-2xl font-bold">{metricsRendimiento.tasaExito}%</p>
				<p class="text-sm text-purple-100">Tasa de Éxito</p>
			</div>
		</div>
	</div>

	<!-- Gestión de Proyectos Activos -->
	<div
		class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 200ms"
	>
		<h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
			<Icon src={Sparkles} class="h-6 w-6 text-yellow-500" /> Gestión de Proyectos Activos
		</h2>

		<div class="space-y-4">
			{#each proyectosActivos as proyecto, i}
				<div
					class="rounded-xl border {getEstadoColor(
						proyecto.estado
					)} p-5 transition-all duration-300 hover:shadow-md"
					class:opacity-0={!animate}
					style="transition-delay: {300 + i * 100}ms"
				>
					<div class="mb-3 flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-1 flex items-center gap-2">
								<h3 class="text-lg font-semibold">{proyecto.titulo}</h3>
								<span class="text-lg">
									<Icon src={getUrgenciaIcon(proyecto.urgencia)} class="h-5 w-5 text-gray-600" />
								</span>
							</div>
							<div class="mb-2 flex gap-4 text-sm opacity-75">
								<span class="flex items-center gap-1">
									<Icon src={Calendar} class="h-4 w-4" /> Deadline: {new Date(
										proyecto.deadline
									).toLocaleDateString('es-AR')}
								</span>
								<span class="flex items-center gap-1">
									<Icon src={Users} class="h-4 w-4" />
									{proyecto.colaboradores} colaboradores
								</span>
								<span class="flex items-center gap-1">
									<Icon src={Eye} class="h-4 w-4" />
									{proyecto.visualizaciones} visualizaciones
								</span>
							</div>
						</div>
						<div class="text-right">
							<p class="text-2xl font-bold">{proyecto.progreso}%</p>
							<p class="text-sm opacity-75">Progreso</p>
						</div>
					</div>

					<div class="mb-3">
						<ProgressBar
							percent={proyecto.progreso}
							color={proyecto.progreso > 80 ? 'green' : proyecto.progreso > 50 ? 'blue' : 'purple'}
						/>
						<div class="mt-2 flex justify-between text-sm">
							<span class="font-medium">${proyecto.recaudado.toLocaleString()} recaudado</span>
							<span>Meta: ${proyecto.objetivo.toLocaleString()}</span>
						</div>
					</div>

					<div class="flex gap-2">
						<button
							class="rounded-full bg-white/60 px-3 py-1 text-xs transition-colors hover:bg-white/80"
						>
							Ver detalles
						</button>
						<button
							class="rounded-full bg-white/60 px-3 py-1 text-xs transition-colors hover:bg-white/80"
						>
							Contactar colaboradores
						</button>
						<button
							class="rounded-full bg-white/60 px-3 py-1 text-xs transition-colors hover:bg-white/80"
						>
							Actualizar progreso
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Fila de análisis: Colaboradores y Rendimiento -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Análisis de Colaboradores -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 400ms"
		>
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
				<Icon src={Users} class="h-5 w-5 text-blue-600" /> Análisis de Colaboradores
			</h2>

			<div class="space-y-4">
				{#each colaboradoresAnalisis as categoria, i}
					<div
						class="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
						class:opacity-0={!animate}
						style="transition-delay: {500 + i * 100}ms"
					>
						<div class="mb-2 flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<h4 class="font-semibold text-gray-900">{categoria.categoria}</h4>
									<span class="text-lg">
										<Icon
											src={getTendenciaIcon(categoria.tendencia)}
											class="h-5 w-5 text-gray-600"
										/>
									</span>
								</div>
								<p class="text-sm text-gray-600">{categoria.aporte}</p>
							</div>
							<div class="text-right">
								<span class="text-xl font-bold text-purple-600">{categoria.cantidad}</span>
								<p class="text-xs text-gray-500">personas</p>
							</div>
						</div>

						<div class="mt-2">
							<div class="mb-1 flex justify-between text-xs">
								<span>Engagement</span>
								<span>{categoria.porcentaje}%</span>
							</div>
							<div class="h-2 w-full rounded-full bg-gray-200">
								<div
									class="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-1000"
									style="width: {categoria.porcentaje}%"
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Métricas de Rendimiento -->
		<div
			class="space-y-6"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 500ms"
		>
			<!-- Rendimiento General -->
			<div class="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-lg">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-green-900">
					<Icon src={ChartBar} class="h-5 w-5 text-green-700" /> Rendimiento General
				</h2>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-green-700">Promedio recaudación:</span>
						<span class="font-semibold text-green-900"
							>${metricsRendimiento.promedioRecaudacion.toLocaleString()}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-green-700">Tiempo promedio:</span>
						<span class="font-semibold text-green-900"
							>{metricsRendimiento.tiempoPromedioCompletar}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-green-700">Mejor mes:</span>
						<span class="font-semibold text-green-900">{metricsRendimiento.mejorMes}</span>
					</div>
				</div>
			</div>

			<!-- Alcance y Visibilidad -->
			<div class="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-lg">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
					<Icon src={Eye} class="h-5 w-5 text-blue-700" /> Alcance y Visibilidad
				</h2>
				<div class="grid grid-cols-2 gap-4 text-center">
					<div>
						<p class="text-2xl font-bold text-blue-600">
							{estadisticasAlcance.totalVisualizaciones}
						</p>
						<p class="text-xs text-blue-700">Total vistas</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-blue-600">
							{estadisticasAlcance.interaccionesUltimoMes}
						</p>
						<p class="text-xs text-blue-700">Interacciones</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-blue-600">{estadisticasAlcance.compartidoEnRedes}</p>
						<p class="text-xs text-blue-700">Compartidos</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-blue-600">{estadisticasAlcance.nuevosSeguidores}</p>
						<p class="text-xs text-blue-700">Nuevos seguidores</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Fila inferior: Próximas Acciones y Tendencias -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Próximas Acciones -->
		<div
			class="rounded-2xl border border-orange-100 bg-orange-50 p-6 shadow-lg"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 600ms"
		>
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-orange-900">
				<Icon src={Bolt} class="h-5 w-5 text-orange-700" /> Próximas Acciones Requeridas
			</h2>

			<div class="space-y-3">
				{#each proximasAcciones as accion, i}
					<div
						class="flex items-start gap-3 rounded-lg bg-white/60 p-3 transition-all duration-300 hover:bg-white/80"
						class:opacity-0={!animate}
						style="transition-delay: {700 + i * 100}ms"
					>
						<div class="text-2xl">
							<Icon
								src={accion.tipo === 'deadline'
									? Clock
									: accion.tipo === 'comunicacion'
										? Megaphone
										: CurrencyDollar}
								class="h-6 w-6 text-orange-600"
							/>
						</div>
						<div class="flex-1">
							<p class="font-medium text-orange-900">{accion.descripcion}</p>
							<div class="mt-1 flex items-center gap-2">
								<span class="text-xs text-orange-700">{accion.fecha}</span>
								<span
									class="rounded-full px-2 py-1 text-xs {accion.urgencia === 'alta'
										? 'bg-red-100 text-red-700'
										: 'bg-yellow-100 text-yellow-700'}"
								>
									{accion.urgencia === 'alta' ? 'Urgente' : 'Normal'}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Tendencias de Crecimiento -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 700ms"
		>
			<h2 class="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
				<Icon src={ArrowTrendingUp} class="h-5 w-5 text-green-600" /> Tendencias de Crecimiento
			</h2>

			<div class="space-y-4">
				<div>
					<h4 class="mb-2 text-sm font-medium text-gray-700">Recaudación Mensual ($)</h4>
					<div class="flex h-20 items-end gap-1">
						{#each tendenciasMensuales as mes, i}
							<div class="flex flex-1 flex-col items-center">
								<div
									class="w-full rounded-t bg-gradient-to-t from-purple-500 to-purple-400 transition-all duration-1000"
									style="height: {(mes.recaudado / 35000) * 60}px; transition-delay: {800 +
										i * 100}ms"
								></div>
								<span class="mt-1 text-xs text-gray-600">{mes.mes}</span>
							</div>
						{/each}
					</div>
				</div>

				<div>
					<h4 class="mb-2 text-sm font-medium text-gray-700">Colaboradores Nuevos</h4>
					<div class="flex h-16 items-end gap-1">
						{#each tendenciasMensuales as mes, i}
							<div class="flex flex-1 flex-col items-center">
								<div
									class="w-full rounded-t bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000"
									style="height: {(mes.colaboradores / 50) * 40}px; transition-delay: {900 +
										i * 100}ms"
								></div>
								<span class="mt-1 text-xs text-gray-600">{mes.mes}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
