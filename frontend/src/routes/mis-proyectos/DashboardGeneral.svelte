<!--
* Componente: DashboardGeneral
	-*- Descripción: Dashboard principal con métricas en formato de tarjetas grid
	-*- KPIs: proyectos participados, donaciones, instituciones, beneficiarios, progreso, insignias

	FIX: revisar y corregir errores tras cambios en interfaces
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import ProgressBar from '$lib/components/ui/elementos/ProgressBar.svelte';

	// Datos simulados basados en los KPIs de la imagen
	const metricas = {
		totalProyectos: 12,
		proyectosCompletados: 8,
		proyectosEnEjecucion: 4,
		totalDonado: 45750,
		instituciones: 6,
		beneficiarios: 342,
		insignias: 15,
		porcentajeProgreso: 67
	};

	const proyectosActivos = [
		{
			titulo: 'Libros para escuela rural',
			progreso: 85,
			objetivo: '500 libros',
			recaudado: '425 libros'
		},
		{ titulo: 'Comedor comunitario', progreso: 60, objetivo: '$50,000', recaudado: '$30,000' },
		{
			titulo: 'Computadoras para biblioteca',
			progreso: 40,
			objetivo: '20 equipos',
			recaudado: '8 equipos'
		},
		{ titulo: 'Medicamentos básicos', progreso: 90, objetivo: '$15,000', recaudado: '$13,500' }
	];

	const categorias = [
		{ nombre: 'Educación', tuInteres: 85, realParticipacion: 70 },
		{ nombre: 'Salud', tuInteres: 60, realParticipacion: 80 },
		{ nombre: 'Alimentación', tuInteres: 75, realParticipacion: 45 },
		{ nombre: 'Tecnología', tuInteres: 40, realParticipacion: 60 }
	];

	const evolucionAnual = [
		{ año: '2022', beneficiarios: 89 },
		{ año: '2023', beneficiarios: 234 },
		{ año: '2024', beneficiarios: 342 }
	];

	let animate = false;

	onMount(() => {
		setTimeout(() => (animate = true), 100);
	});
</script>

<div class="space-y-8">
	<!-- Métricas Principales -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Total de Proyectos -->
		<div
			class="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 100ms"
		>
			<div class="absolute -right-4 -top-4 text-6xl opacity-10">📊</div>
			<div class="relative">
				<h3 class="text-sm font-medium text-blue-600">Total Proyectos</h3>
				<p class="mt-2 text-3xl font-bold text-gray-900">{metricas.totalProyectos}</p>
				<div class="mt-3 flex gap-4 text-xs">
					<span class="flex items-center gap-1 text-green-600">
						✅ {metricas.proyectosCompletados} completados
					</span>
					<span class="flex items-center gap-1 text-blue-600">
						🔄 {metricas.proyectosEnEjecucion} activos
					</span>
				</div>
			</div>
		</div>

		<!-- Total Donado -->
		<div
			class="group relative overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 200ms"
		>
			<div class="absolute -right-4 -top-4 text-6xl opacity-10">💰</div>
			<div class="relative">
				<h3 class="text-sm font-medium text-green-600">Total Donado</h3>
				<p class="mt-2 text-3xl font-bold text-gray-900">
					${metricas.totalDonado.toLocaleString()}
				</p>
				<p class="mt-1 text-xs text-gray-500">En efectivo y materiales</p>
			</div>
		</div>

		<!-- Instituciones Colaboradas -->
		<div
			class="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 300ms"
		>
			<div class="absolute -right-4 -top-4 text-6xl opacity-10">🏢</div>
			<div class="relative">
				<h3 class="text-sm font-medium text-purple-600">Instituciones</h3>
				<p class="mt-2 text-3xl font-bold text-gray-900">{metricas.instituciones}</p>
				<p class="mt-1 text-xs text-gray-500">Organizaciones colaboradas</p>
			</div>
		</div>

		<!-- Beneficiarios -->
		<div
			class="group relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 400ms"
		>
			<div class="absolute -right-4 -top-4 text-6xl opacity-10">❤️</div>
			<div class="relative">
				<h3 class="text-sm font-medium text-orange-600">Beneficiarios</h3>
				<p class="mt-2 text-3xl font-bold text-gray-900">{metricas.beneficiarios}</p>
				<p class="mt-1 text-xs text-gray-500">Personas ayudadas</p>
			</div>
		</div>
	</div>

	<!-- Proyectos Activos con Progreso -->
	<div
		class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 500ms"
	>
		<div class="mb-6 flex items-center gap-3">
			<h2 class="text-xl font-bold text-gray-900">📈 Proyectos Activos</h2>
			<div class="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			{#each proyectosActivos as proyecto, i}
				<div
					class="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50"
					class:opacity-0={!animate}
					style="transition-delay: {600 + i * 100}ms"
				>
					<h3 class="font-semibold text-gray-900">{proyecto.titulo}</h3>
					<div class="mt-3">
						<div class="mb-2 flex justify-between text-sm">
							<span class="text-gray-600">Progreso</span>
							<span class="font-medium text-blue-600">{proyecto.progreso}%</span>
						</div>
						<ProgressBar percent={proyecto.progreso} />
						<div class="mt-2 flex justify-between text-xs text-gray-500">
							<span>Meta: {proyecto.objetivo}</span>
							<span>Actual: {proyecto.recaudado}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Fila inferior: Categorías e Insignias -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Categorías de Interés vs Reales -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 700ms"
		>
			<h2 class="mb-6 text-lg font-bold text-gray-900">🎯 Intereses vs Participación</h2>
			<div class="space-y-4">
				{#each categorias as categoria}
					<div class="space-y-2">
						<div class="flex justify-between text-sm">
							<span class="font-medium text-gray-700">{categoria.nombre}</span>
						</div>
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="w-16 text-xs text-blue-600">Tu interés</span>
								<div class="h-2 flex-1 rounded-full bg-blue-100">
									<div
										class="h-2 rounded-full bg-blue-500 transition-all duration-1000"
										style="width: {categoria.tuInteres}%"
									></div>
								</div>
								<span class="w-8 text-xs text-gray-600">{categoria.tuInteres}%</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="w-16 text-xs text-green-600">Real</span>
								<div class="h-2 flex-1 rounded-full bg-green-100">
									<div
										class="h-2 rounded-full bg-green-500 transition-all duration-1000"
										style="width: {categoria.realParticipacion}%"
									></div>
								</div>
								<span class="w-8 text-xs text-gray-600">{categoria.realParticipacion}%</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Insignias y Evolución -->
		<div
			class="space-y-6"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 800ms"
		>
			<!-- Insignias -->
			<div
				class="rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-lg"
			>
				<h2 class="mb-4 text-lg font-bold text-gray-900">🏆 Insignias Conseguidas</h2>
				<div class="flex items-center gap-4">
					<div class="text-4xl font-bold text-yellow-600">{metricas.insignias}</div>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Logros desbloqueados</p>
						<div class="mt-2 flex gap-1">
							{#each Array(Math.min(metricas.insignias, 8)) as _, i}
								<div class="h-2 w-2 rounded-full bg-yellow-400"></div>
							{/each}
							{#if metricas.insignias > 8}
								<span class="text-xs text-gray-500">+{metricas.insignias - 8}</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Evolución Anual -->
			<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-lg font-bold text-gray-900">📅 Evolución Anual</h2>
				<div class="space-y-3">
					{#each evolucionAnual as año}
						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-700">{año.año}</span>
							<div class="flex items-center gap-2">
								<div class="h-2 w-20 rounded-full bg-blue-100">
									<div
										class="h-2 rounded-full bg-blue-500 transition-all duration-1000"
										style="width: {(año.beneficiarios / metricas.beneficiarios) * 100}%"
									></div>
								</div>
								<span class="text-sm font-semibold text-blue-600">{año.beneficiarios}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
