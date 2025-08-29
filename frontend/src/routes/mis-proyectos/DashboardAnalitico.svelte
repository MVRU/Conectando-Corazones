<!--
* Componente: DashboardAnalitico
	-*- Descripción: Dashboard con enfoque en análisis temporal y evolución detallada
	-*- KPIs: tendencias, progreso histórico, comparativas y proyecciones

FIX: revisar y corregir errores tras cambios en interfaces
	-->

<script lang="ts">
	import { onMount } from 'svelte';
	import ProgressBar from '$lib/components/ui/elementos/ProgressBar.svelte';

	// Datos simulados para análisis temporal
	const tendenciasMensuales = [
		{ mes: 'Ene', proyectos: 1, donaciones: 2500, beneficiarios: 25 },
		{ mes: 'Feb', proyectos: 2, donaciones: 4200, beneficiarios: 52 },
		{ mes: 'Mar', proyectos: 1, donaciones: 3100, beneficiarios: 38 },
		{ mes: 'Abr', proyectos: 3, donaciones: 6800, beneficiarios: 89 },
		{ mes: 'May', proyectos: 2, donaciones: 5400, beneficiarios: 67 },
		{ mes: 'Jun', proyectos: 3, donaciones: 7200, beneficiarios: 94 }
	];

	const proyectosDetallados = [
		{
			titulo: 'Libros para escuela rural',
			fechaInicio: '2024-01-15',
			progreso: 85,
			objetivo: 500,
			recaudado: 425,
			unidad: 'libros',
			beneficiarios: 120,
			historial: [
				{ fecha: '2024-01-15', valor: 0 },
				{ fecha: '2024-02-01', valor: 45 },
				{ fecha: '2024-03-01', valor: 125 },
				{ fecha: '2024-04-01', valor: 250 },
				{ fecha: '2024-05-01', valor: 350 },
				{ fecha: '2024-06-01', valor: 425 }
			]
		},
		{
			titulo: 'Comedor comunitario',
			fechaInicio: '2024-02-10',
			progreso: 60,
			objetivo: 50000,
			recaudado: 30000,
			unidad: '$',
			beneficiarios: 80,
			historial: [
				{ fecha: '2024-02-10', valor: 0 },
				{ fecha: '2024-03-01', valor: 8000 },
				{ fecha: '2024-04-01', valor: 15000 },
				{ fecha: '2024-05-01', valor: 22000 },
				{ fecha: '2024-06-01', valor: 30000 }
			]
		}
	];

	const comparativaAnual = {
		2023: { proyectos: 8, donaciones: 28500, beneficiarios: 234, insignias: 12 },
		2024: { proyectos: 12, donaciones: 45750, beneficiarios: 342, insignias: 15 }
	};

	const instituciones = [
		{ nombre: 'Cruz Roja', proyectos: 3, colaboracion: '8 meses', impacto: 89 },
		{ nombre: 'Unicef', proyectos: 2, colaboracion: '4 meses', impacto: 156 },
		{ nombre: 'Rotary Club', proyectos: 4, colaboracion: '12 meses', impacto: 67 },
		{ nombre: 'Fundación Huerta', proyectos: 2, colaboracion: '6 meses', impacto: 45 },
		{ nombre: 'Hogar San José', proyectos: 1, colaboracion: '3 meses', impacto: 23 }
	];

	let animate = false;

	onMount(() => {
		setTimeout(() => (animate = true), 100);
	});

	function formatearFecha(fecha: string) {
		return new Date(fecha).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
	}

	function calcularTendencia(datos: any[], campo: string) {
		if (datos.length < 2) return 0;
		const ultimo = datos[datos.length - 1][campo];
		const anterior = datos[datos.length - 2][campo];
		return ((ultimo - anterior) / anterior) * 100;
	}
</script>

<div class="space-y-8">
	<!-- Header Analítico -->
	<div
		class="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 100ms"
	>
		<div class="grid gap-6 md:grid-cols-3">
			<div class="text-center">
				<h3 class="text-sm font-medium text-blue-600">Tendencia Proyectos</h3>
				<p class="mt-1 text-2xl font-bold text-gray-900">
					{tendenciasMensuales[tendenciasMensuales.length - 1].proyectos}
				</p>
				<p class="text-sm text-green-600">
					+{calcularTendencia(tendenciasMensuales, 'proyectos').toFixed(1)}% vs mes anterior
				</p>
			</div>
			<div class="text-center">
				<h3 class="text-sm font-medium text-green-600">Tendencia Donaciones</h3>
				<p class="mt-1 text-2xl font-bold text-gray-900">
					${tendenciasMensuales[tendenciasMensuales.length - 1].donaciones.toLocaleString()}
				</p>
				<p class="text-sm text-green-600">
					+{calcularTendencia(tendenciasMensuales, 'donaciones').toFixed(1)}% vs mes anterior
				</p>
			</div>
			<div class="text-center">
				<h3 class="text-sm font-medium text-orange-600">Tendencia Beneficiarios</h3>
				<p class="mt-1 text-2xl font-bold text-gray-900">
					{tendenciasMensuales[tendenciasMensuales.length - 1].beneficiarios}
				</p>
				<p class="text-sm text-green-600">
					+{calcularTendencia(tendenciasMensuales, 'beneficiarios').toFixed(1)}% vs mes anterior
				</p>
			</div>
		</div>
	</div>

	<!-- Evolución Mensual -->
	<div
		class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 200ms"
	>
		<h2 class="mb-6 text-xl font-bold text-gray-900">📊 Evolución Mensual 2024</h2>

		<div class="mb-6 grid gap-4 text-center sm:grid-cols-3">
			<div class="rounded-xl bg-blue-50 p-4">
				<h4 class="text-sm font-medium text-blue-600">Proyectos</h4>
				<div class="mt-2 flex h-16 items-end justify-center gap-1">
					{#each tendenciasMensuales as mes, i (i)}
						<div class="flex flex-col items-center">
							<div
								class="w-4 rounded-t bg-blue-500 transition-all duration-1000"
								style="height: {(mes.proyectos / 3) * 40}px; transition-delay: {300 + i * 100}ms"
							></div>
							<span class="mt-1 text-xs text-gray-600">{mes.mes}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-xl bg-green-50 p-4">
				<h4 class="text-sm font-medium text-green-600">Donaciones (k$)</h4>
				<div class="mt-2 flex h-16 items-end justify-center gap-1">
					{#each tendenciasMensuales as mes, i (i)}
						<div class="flex flex-col items-center">
							<div
								class="w-4 rounded-t bg-green-500 transition-all duration-1000"
								style="height: {(mes.donaciones / 8000) * 40}px; transition-delay: {400 +
									i * 100}ms"
							></div>
							<span class="mt-1 text-xs text-gray-600">{mes.mes}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-xl bg-orange-50 p-4">
				<h4 class="text-sm font-medium text-orange-600">Beneficiarios</h4>
				<div class="mt-2 flex h-16 items-end justify-center gap-1">
					{#each tendenciasMensuales as mes, i (i)}
						<div class="flex flex-col items-center">
							<div
								class="w-4 rounded-t bg-orange-500 transition-all duration-1000"
								style="height: {(mes.beneficiarios / 100) * 40}px; transition-delay: {500 +
									i * 100}ms"
							></div>
							<span class="mt-1 text-xs text-gray-600">{mes.mes}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Timeline de Proyectos -->
	<div
		class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition-delay: 300ms"
	>
		<h2 class="mb-6 text-xl font-bold text-gray-900">⏱️ Timeline de Proyectos Activos</h2>

		<div class="space-y-6">
			{#each proyectosDetallados as proyecto, i (i)}
				<div
					class="relative border-l-2 border-blue-200 pb-6 pl-8 last:border-l-0"
					class:opacity-0={!animate}
					style="transition-delay: {600 + i * 200}ms"
				>
					<!-- Punto del timeline -->
					<div
						class="absolute top-0 -left-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow"
					></div>

					<div class="rounded-xl bg-gray-50 p-4">
						<div class="mb-3 flex items-start justify-between">
							<div>
								<h3 class="font-semibold text-gray-900">{proyecto.titulo}</h3>
								<p class="text-sm text-gray-600">Inicio: {formatearFecha(proyecto.fechaInicio)}</p>
							</div>
							<div class="text-right">
								<span class="text-lg font-bold text-blue-600">{proyecto.progreso}%</span>
								<p class="text-xs text-gray-500">{proyecto.beneficiarios} beneficiarios</p>
							</div>
						</div>

						<div class="mb-3">
							<ProgressBar percent={proyecto.progreso} />
							<div class="mt-1 flex justify-between text-xs text-gray-500">
								<span>{proyecto.recaudado} {proyecto.unidad}</span>
								<span>Meta: {proyecto.objetivo} {proyecto.unidad}</span>
							</div>
						</div>

						<!-- Mini historial -->
						<div class="mt-4">
							<h4 class="mb-2 text-xs font-medium text-gray-700">Progreso histórico:</h4>
							<div class="flex h-8 items-end gap-1">
								{#each proyecto.historial as punto, j (j)}
									<div class="flex flex-col items-center">
										<div
											class="w-2 rounded-t bg-blue-400 transition-all duration-1000"
											style="height: {(punto.valor / proyecto.objetivo) *
												24}px; transition-delay: {800 + i * 200 + j * 50}ms"
										></div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Comparativa Anual y Instituciones -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Comparativa Año Anterior -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 700ms"
		>
			<h2 class="mb-6 text-lg font-bold text-gray-900">📈 Comparativa Anual</h2>

			<div class="space-y-4">
				<div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
					<span class="font-medium text-gray-700">Proyectos</span>
					<div class="flex items-center gap-3">
						<span class="text-sm text-gray-600">2023: {comparativaAnual[2023].proyectos}</span>
						<span class="text-lg font-bold text-blue-600"
							>2024: {comparativaAnual[2024].proyectos}</span
						>
						<span class="text-xs text-green-600">
							+{Math.round(
								((comparativaAnual[2024].proyectos - comparativaAnual[2023].proyectos) /
									comparativaAnual[2023].proyectos) *
									100
							)}%
						</span>
					</div>
				</div>

				<div class="flex items-center justify-between rounded-lg bg-green-50 p-3">
					<span class="font-medium text-gray-700">Donaciones</span>
					<div class="flex items-center gap-3">
						<span class="text-sm text-gray-600"
							>2023: ${comparativaAnual[2023].donaciones.toLocaleString()}</span
						>
						<span class="text-lg font-bold text-green-600"
							>2024: ${comparativaAnual[2024].donaciones.toLocaleString()}</span
						>
						<span class="text-xs text-green-600">
							+{Math.round(
								((comparativaAnual[2024].donaciones - comparativaAnual[2023].donaciones) /
									comparativaAnual[2023].donaciones) *
									100
							)}%
						</span>
					</div>
				</div>

				<div class="flex items-center justify-between rounded-lg bg-orange-50 p-3">
					<span class="font-medium text-gray-700">Beneficiarios</span>
					<div class="flex items-center gap-3">
						<span class="text-sm text-gray-600">2023: {comparativaAnual[2023].beneficiarios}</span>
						<span class="text-lg font-bold text-orange-600"
							>2024: {comparativaAnual[2024].beneficiarios}</span
						>
						<span class="text-xs text-green-600">
							+{Math.round(
								((comparativaAnual[2024].beneficiarios - comparativaAnual[2023].beneficiarios) /
									comparativaAnual[2023].beneficiarios) *
									100
							)}%
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Análisis de Instituciones -->
		<div
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
			class:opacity-0={!animate}
			class:translate-y-4={!animate}
			style="transition-delay: 800ms"
		>
			<h2 class="mb-6 text-lg font-bold text-gray-900">🏢 Análisis de Instituciones</h2>

			<div class="space-y-3">
				{#each instituciones as institucion, i (i)}
					<div
						class="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
						class:opacity-0={!animate}
						style="transition-delay: {900 + i * 100}ms"
					>
						<div class="flex-1">
							<h4 class="font-medium text-gray-900">{institucion.nombre}</h4>
							<div class="flex gap-4 text-xs text-gray-600">
								<span>{institucion.proyectos} proyectos</span>
								<span>{institucion.colaboracion}</span>
							</div>
						</div>
						<div class="text-right">
							<span class="text-lg font-bold text-purple-600">{institucion.impacto}</span>
							<p class="text-xs text-gray-500">beneficiarios</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
