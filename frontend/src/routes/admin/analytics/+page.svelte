<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';
	import { mockCategorias } from '$lib/mocks/mock-categorias';
	import { mockProyectoCategorias } from '$lib/mocks/mock-proyecto-categorias';
	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { Proyecto } from '$lib/types/Proyecto';

	const usuariosArray = Object.values(mockUsuarios as MockUsuarios);
	const proyectosArray: Proyecto[] = mockProyectos;

	// Crecimiento de usuarios por mes
	function calcularCrecimientoUsuarios() {
		const usuariosPorMes = usuariosArray.reduce((acc, u) => {
			if (!u.created_at) return acc;
			const mes = u.created_at.toLocaleDateString('es-AR', { year: 'numeric', month: 'short' });
			acc[mes] = (acc[mes] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(usuariosPorMes)
			.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
			.map(([mes, cantidad]) => ({ mes, cantidad }));
	}

	// Crecimiento de proyectos por mes
	function calcularCrecimientoProyectos() {
		const proyectosPorMes = proyectosArray.reduce((acc, p) => {
			if (!p.created_at) return acc;
			const mes = p.created_at.toLocaleDateString('es-AR', { year: 'numeric', month: 'short' });
			acc[mes] = (acc[mes] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(proyectosPorMes)
			.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
			.map(([mes, cantidad]) => ({ mes, cantidad }));
	}

	// Tasa de éxito de proyectos
	function calcularTasaExito() {
		const total = proyectosArray.length;
		const completados = proyectosArray.filter((p) => {
			const estado = typeof p.estado === 'object' && p.estado !== null && 'descripcion' in p.estado
				? (p.estado as { descripcion: unknown }).descripcion
				: p.estado;
			return estado === 'completado';
		}).length;
		const enCurso = proyectosArray.filter((p) => {
			const estado = typeof p.estado === 'object' && p.estado !== null && 'descripcion' in p.estado
				? (p.estado as { descripcion: unknown }).descripcion
				: p.estado;
			return estado === 'en_curso';
		}).length;
		const cancelados = proyectosArray.filter((p) => {
			const estado = typeof p.estado === 'object' && p.estado !== null && 'descripcion' in p.estado
				? (p.estado as { descripcion: unknown }).descripcion
				: p.estado;
			return estado === 'cancelado';
		}).length;

		return {
			total,
			completados,
			enCurso,
			cancelados,
			tasaExito: total > 0 ? ((completados / total) * 100).toFixed(1) : '0'
		};
	}

	// Participación por categoría
	function calcularParticipacionPorCategoria() {
		const participacionPorCategoria = mockProyectoCategorias.reduce((acc, pc) => {
			if (!pc.categoria) return acc;
			const categoriaNombre = pc.categoria.descripcion;
			acc[categoriaNombre] = (acc[categoriaNombre] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return Object.entries(participacionPorCategoria)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([categoria, cantidad]) => ({ categoria, cantidad }));
	}

	const crecimientoUsuarios = calcularCrecimientoUsuarios();
	const crecimientoProyectos = calcularCrecimientoProyectos();
	const tasaExito = calcularTasaExito();
	const participacionCategorias = calcularParticipacionPorCategoria();

	// Calcular máximos para escalar gráficos
	const maxUsuarios = Math.max(...crecimientoUsuarios.map((u) => u.cantidad), 1);
	const maxProyectos = Math.max(...crecimientoProyectos.map((p) => p.cantidad), 1);
	const maxCategorias = Math.max(...participacionCategorias.map((c) => c.cantidad), 1);

	// Altura de los gráficos
	const alturaGrafico = 200;
	const anchoBarra = 40;
	const espacioEntreBarras = 10;
</script>

<svelte:head>
	<title>Analytics - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Analytics" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Analytics y tendencias</h1>
			<p class="mt-1 text-sm text-gray-600">Métricas y estadísticas de la plataforma</p>
		</div>
	</div>

	<!-- Métricas principales -->
	<section class="grid gap-4 sm:grid-cols-4">
		<div class="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-blue-700">Tasa de éxito</p>
			<p class="mt-2 text-2xl font-semibold text-blue-900">{tasaExito.tasaExito}%</p>
			<p class="mt-1 text-xs text-blue-600">{tasaExito.completados} de {tasaExito.total} proyectos</p>
		</div>
		<div class="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-green-700">Proyectos completados</p>
			<p class="mt-2 text-2xl font-semibold text-green-900">{tasaExito.completados}</p>
		</div>
		<div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-yellow-700">En curso</p>
			<p class="mt-2 text-2xl font-semibold text-yellow-900">{tasaExito.enCurso}</p>
		</div>
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-red-700">Cancelados</p>
			<p class="mt-2 text-2xl font-semibold text-red-900">{tasaExito.cancelados}</p>
		</div>
	</section>

	<!-- Gráficos de crecimiento -->
	<section class="grid gap-6 lg:grid-cols-2">
		<!-- Crecimiento de usuarios -->
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Crecimiento de usuarios</h2>
			{#if crecimientoUsuarios.length > 0}
				<div class="relative" style="height: {alturaGrafico}px;">
					<svg width="100%" height={alturaGrafico} class="overflow-visible">
						{#each crecimientoUsuarios as item, i}
							{@const x = i * (anchoBarra + espacioEntreBarras) + 20}
							{@const altura = (item.cantidad / maxUsuarios) * (alturaGrafico - 40)}
							{@const y = alturaGrafico - altura - 20}
							<g>
								<rect
									x={x}
									y={y}
									width={anchoBarra}
									height={altura}
									fill="#3b82f6"
									class="hover:opacity-80 transition-opacity"
								/>
								<text
									x={x + anchoBarra / 2}
									y={y - 5}
									text-anchor="middle"
									class="text-xs fill-gray-700"
								>
									{item.cantidad}
								</text>
								<text
									x={x + anchoBarra / 2}
									y={alturaGrafico - 5}
									text-anchor="middle"
									class="text-[10px] fill-gray-500"
									transform="rotate(-45 {x + anchoBarra / 2} {alturaGrafico - 5})"
								>
									{item.mes}
								</text>
							</g>
						{/each}
					</svg>
				</div>
			{:else}
				<p class="text-sm text-gray-500">No hay datos disponibles</p>
			{/if}
		</div>

		<!-- Crecimiento de proyectos -->
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Crecimiento de proyectos</h2>
			{#if crecimientoProyectos.length > 0}
				<div class="relative" style="height: {alturaGrafico}px;">
					<svg width="100%" height={alturaGrafico} class="overflow-visible">
						{#each crecimientoProyectos as item, i}
							{@const x = i * (anchoBarra + espacioEntreBarras) + 20}
							{@const altura = (item.cantidad / maxProyectos) * (alturaGrafico - 40)}
							{@const y = alturaGrafico - altura - 20}
							<g>
								<rect
									x={x}
									y={y}
									width={anchoBarra}
									height={altura}
									fill="#10b981"
									class="hover:opacity-80 transition-opacity"
								/>
								<text
									x={x + anchoBarra / 2}
									y={y - 5}
									text-anchor="middle"
									class="text-xs fill-gray-700"
								>
									{item.cantidad}
								</text>
								<text
									x={x + anchoBarra / 2}
									y={alturaGrafico - 5}
									text-anchor="middle"
									class="text-[10px] fill-gray-500"
									transform="rotate(-45 {x + anchoBarra / 2} {alturaGrafico - 5})"
								>
									{item.mes}
								</text>
							</g>
						{/each}
					</svg>
				</div>
			{:else}
				<p class="text-sm text-gray-500">No hay datos disponibles</p>
			{/if}
		</div>
	</section>

	<!-- Participación por categoría -->
	<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-gray-900">Participación por categoría</h2>
		<div class="space-y-3">
			{#each participacionCategorias as item}
				<div class="flex items-center gap-3">
					<div class="flex-1">
						<div class="mb-1 flex items-center justify-between text-sm">
							<span class="font-medium text-gray-700">{item.categoria}</span>
							<span class="text-gray-600">{item.cantidad} proyectos</span>
						</div>
						<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
							<div
								class="h-full bg-blue-500 transition-all"
								style="width: {(item.cantidad / maxCategorias) * 100}%"
							></div>
						</div>
					</div>
				</div>
			{:else}
				<p class="text-sm text-gray-500">No hay datos disponibles</p>
			{/each}
		</div>
	</section>
</div>
