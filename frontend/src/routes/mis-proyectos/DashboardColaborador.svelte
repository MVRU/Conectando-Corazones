<!--
* Componente: DashboardColaborador
	-*- Descripción: Dashboard compacto personalizado para colaboradores individuales
	-*- KPIs: participación personal, logros, próximas oportunidades, impacto directo

	FIX: revisar y corregir errores tras cambios en interfaces
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import ProgressBar from '$lib/components/ui/elementos/ProgressBar.svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';

	// Datos personalizados para colaborador
	const perfilColaborador = {
		nombre: 'Juan Pérez',
		tiempoActivo: '8 meses',
		nivel: 'Colaborador Comprometido',
		proximoNivel: 'Colaborador Avanzado',
		progresoNivel: 73
	};

	const metricsPersonales = {
		horasVoluntariado: 89,
		donacionesRealizadas: 12,
		proyectosCompletados: 8,
		proyectosActivos: 4,
		puntosDImpacto: 1247,
		ranking: 23
	};

	const actividadReciente = [
		{
			tipo: 'donacion',
			descripcion: 'Donaste $2,500 para medicamentos',
			proyecto: 'Botiquín escuela rural',
			fecha: 'hace 2 días',
			impacto: '+15 puntos'
		},
		{
			tipo: 'voluntariado',
			descripcion: '3 horas de tutoría matemática',
			proyecto: 'Apoyo escolar Villa Rosa',
			fecha: 'hace 5 días',
			impacto: '+25 puntos'
		},
		{
			tipo: 'material',
			descripcion: '45 libros de cuentos infantiles',
			proyecto: 'Biblioteca comunitaria',
			fecha: 'hace 1 semana',
			impacto: '+30 puntos'
		}
	];

	const proximasOportunidades = [
		{
			titulo: 'Jornada de recolección de alimentos',
			institucion: 'Cruz Roja',
			fecha: '15 Jun',
			tipo: 'Voluntariado',
			tiempo: '4 horas',
			urgencia: 'alta'
		},
		{
			titulo: 'Necesitamos tablets para clases virtuales',
			institucion: 'Escuela Digital',
			fecha: '20 Jun',
			tipo: 'Donación',
			objetivo: '10 tablets',
			urgencia: 'media'
		},
		{
			titulo: 'Construcción de huerta comunitaria',
			institucion: 'Fundación Verde',
			fecha: '25 Jun',
			tipo: 'Voluntariado',
			tiempo: '6 horas',
			urgencia: 'baja'
		}
	];

	const insigniasRecientes = [
		{ nombre: 'Primera Donación', icono: '🏆', fecha: 'Ene 2024' },
		{ nombre: 'Voluntario Constante', icono: '⭐', fecha: 'Mar 2024' },
		{ nombre: 'Mentor del Mes', icono: '👨‍🏫', fecha: 'May 2024' },
		{ nombre: 'Donante Generoso', icono: '💎', fecha: 'Jun 2024' }
	];

	const categoriasFavoritas = [
		{ nombre: 'Educación', participacion: 85, proyectos: 5 },
		{ nombre: 'Salud', participacion: 60, proyectos: 3 },
		{ nombre: 'Alimentación', participacion: 45, proyectos: 2 },
		{ nombre: 'Medio Ambiente', participacion: 30, proyectos: 1 }
	];

	let animate = false;

	onMount(() => {
		setTimeout(() => (animate = true), 100);
	});

	function getUrgenciaColor(urgencia: string) {
		switch (urgencia) {
			case 'alta':
				return 'border-red-200 bg-red-50 text-red-700';
			case 'media':
				return 'border-yellow-200 bg-yellow-50 text-yellow-700';
			case 'baja':
				return 'border-green-200 bg-green-50 text-green-700';
			default:
				return 'border-gray-200 bg-gray-50 text-gray-700';
		}
	}

	function getTipoIcon(tipo: string) {
		switch (tipo) {
			case 'donacion':
				return '💰';
			case 'voluntariado':
				return '🤝';
			case 'material':
				return '📦';
			default:
				return '📋';
		}
	}
</script>

<div class="space-y-6">
	<!-- Header Personal -->
	<div
		class="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 p-6 text-white shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 100ms"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl">
					👤
				</div>
				<div>
					<h1 class="text-2xl font-bold">¡Hola, {perfilColaborador.nombre}! 👋</h1>
					<p class="text-blue-100">
						{perfilColaborador.nivel} • Activo {perfilColaborador.tiempoActivo}
					</p>
				</div>
			</div>
			<div class="text-right">
				<p class="text-3xl font-bold">{metricsPersonales.puntosDImpacto}</p>
				<p class="text-sm text-blue-100">Puntos de Impacto</p>
				<p class="text-xs text-blue-200">Ranking #{metricsPersonales.ranking}</p>
			</div>
		</div>

		<!-- Progreso hacia siguiente nivel -->
		<div class="mt-4">
			<div class="mb-2 flex justify-between text-sm">
				<span>Progreso a {perfilColaborador.proximoNivel}</span>
				<span>{perfilColaborador.progresoNivel}%</span>
			</div>
			<div class="h-2 w-full rounded-full bg-blue-400/30">
				<div
					class="h-2 rounded-full bg-white transition-all duration-1000"
					style="width: {perfilColaborador.progresoNivel}%"
				></div>
			</div>
		</div>
	</div>

	<!-- Métricas Rápidas -->
	<div
		class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 200ms"
	>
		<div class="rounded-xl border border-purple-100 bg-purple-50 p-4 text-center">
			<p class="text-2xl font-bold text-purple-600">{metricsPersonales.horasVoluntariado}h</p>
			<p class="text-sm text-purple-600">Voluntariado</p>
		</div>
		<div class="rounded-xl border border-green-100 bg-green-50 p-4 text-center">
			<p class="text-2xl font-bold text-green-600">{metricsPersonales.donacionesRealizadas}</p>
			<p class="text-sm text-green-600">Donaciones</p>
		</div>
		<div class="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
			<p class="text-2xl font-bold text-blue-600">{metricsPersonales.proyectosCompletados}</p>
			<p class="text-sm text-blue-600">Completados</p>
		</div>
		<div class="rounded-xl border border-orange-100 bg-orange-50 p-4 text-center">
			<p class="text-2xl font-bold text-orange-600">{metricsPersonales.proyectosActivos}</p>
			<p class="text-sm text-orange-600">Activos</p>
		</div>
	</div>

	<!-- Contenido Principal: 2 Columnas -->
	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Columna Izquierda -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Actividad Reciente -->
			<div
				class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
				class:opacity-0={!animate}
				class:translate-y-4={!animate}
				style="transition-delay: 300ms"
			>
				<h2 class="mb-4 text-lg font-bold text-gray-900">📈 Tu Actividad Reciente</h2>
				<div class="space-y-3">
					{#each actividadReciente as actividad, i}
						<div
							class="flex items-start gap-3 rounded-lg border border-gray-100 p-3 transition-all duration-300 hover:bg-gray-50"
							class:opacity-0={!animate}
							style="transition-delay: {400 + i * 100}ms"
						>
							<div class="text-2xl">{getTipoIcon(actividad.tipo)}</div>
							<div class="flex-1">
								<p class="font-medium text-gray-900">{actividad.descripcion}</p>
								<p class="text-sm text-gray-600">{actividad.proyecto}</p>
								<div class="mt-1 flex items-center gap-2">
									<span class="text-xs text-gray-500">{actividad.fecha}</span>
									<span class="text-xs font-medium text-green-600">{actividad.impacto}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Próximas Oportunidades -->
			<div
				class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
				class:opacity-0={!animate}
				class:translate-y-4={!animate}
				style="transition-delay: 400ms"
			>
				<h2 class="mb-4 text-lg font-bold text-gray-900">🚀 Próximas Oportunidades</h2>
				<div class="space-y-3">
					{#each proximasOportunidades as oportunidad, i}
						<div
							class="rounded-lg border {getUrgenciaColor(
								oportunidad.urgencia
							)} p-4 transition-all duration-300 hover:shadow-md"
							class:opacity-0={!animate}
							style="transition-delay: {500 + i * 100}ms"
						>
							<div class="mb-2 flex items-start justify-between">
								<h3 class="font-semibold">{oportunidad.titulo}</h3>
								<span class="rounded-full bg-white/50 px-2 py-1 text-xs font-medium">
									{oportunidad.fecha}
								</span>
							</div>
							<p class="mb-2 text-sm">{oportunidad.institucion}</p>
							<div class="flex items-center gap-4 text-xs">
								<span class="font-medium">{oportunidad.tipo}</span>
								{#if oportunidad.tiempo}
									<span>⏱️ {oportunidad.tiempo}</span>
								{/if}
								{#if oportunidad.objetivo}
									<span>🎯 {oportunidad.objetivo}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Columna Derecha -->
		<div class="space-y-6">
			<!-- Insignias Recientes -->
			<div
				class="rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-lg"
				class:opacity-0={!animate}
				class:translate-y-4={!animate}
				style="transition-delay: 500ms"
			>
				<h2 class="mb-4 text-lg font-bold text-gray-900">🏆 Insignias</h2>
				<div class="grid grid-cols-2 gap-3">
					{#each insigniasRecientes as insignia, i}
						<div
							class="rounded-lg bg-white/60 p-3 text-center transition-all duration-300 hover:bg-white"
							class:opacity-0={!animate}
							style="transition-delay: {600 + i * 100}ms"
						>
							<div class="mb-1 text-2xl">{insignia.icono}</div>
							<p class="text-xs font-medium text-gray-900">{insignia.nombre}</p>
							<p class="text-xs text-gray-500">{insignia.fecha}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Tus Categorías Favoritas -->
			<div
				class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
				class:opacity-0={!animate}
				class:translate-y-4={!animate}
				style="transition-delay: 600ms"
			>
				<h2 class="mb-4 text-lg font-bold text-gray-900">❤️ Tus Categorías</h2>
				<div class="space-y-3">
					{#each categoriasFavoritas as categoria, i}
						<div
							class="space-y-1"
							class:opacity-0={!animate}
							style="transition-delay: {700 + i * 100}ms"
						>
							<div class="flex justify-between text-sm">
								<span class="font-medium text-gray-700">{categoria.nombre}</span>
								<span class="text-xs text-gray-500">{categoria.proyectos} proyectos</span>
							</div>
							<div class="h-2 w-full rounded-full bg-gray-200">
								<div
									class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
									style="width: {categoria.participacion}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Resumen Rápido -->
			<div
				class="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-lg"
				class:opacity-0={!animate}
				class:translate-y-4={!animate}
				style="transition-delay: 700ms"
			>
				<h2 class="mb-4 text-lg font-bold text-blue-900">📊 Resumen</h2>
				<div class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-blue-700">Impacto este mes:</span>
						<span class="font-semibold text-blue-900">89 beneficiarios</span>
					</div>
					<div class="flex justify-between">
						<span class="text-blue-700">Próximo objetivo:</span>
						<span class="font-semibold text-blue-900">1,500 puntos</span>
					</div>
					<div class="flex justify-between">
						<span class="text-blue-700">Días hasta nivel:</span>
						<span class="font-semibold text-blue-900">12 días</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
