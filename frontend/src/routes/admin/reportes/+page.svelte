<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockReportes } from '$lib/mocks/mock-reportes';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { Reporte } from '$lib/types/Reporte';

	let filtroEstado: '' | 'pendiente' | 'resuelto' | 'rechazado' = '';
	let filtroTipo: '' | 'Usuario' | 'Proyecto' = '';
	let busqueda = '';

	const reportes = mockReportes.map((r) => ({ ...r }));

	$: reportesFiltrados = reportes.filter((r) => {
		const coincideEstado = !filtroEstado || r.estado === filtroEstado;
		const coincideTipo = !filtroTipo || r.tipo_objeto === filtroTipo;
		const texto = `${r.motivo} ${r.descripcion}`.toLowerCase();
		const coincideBusqueda = !busqueda || texto.includes(busqueda.toLowerCase());
		return coincideEstado && coincideTipo && coincideBusqueda;
	});

	function obtenerNombreObjeto(reporte: Reporte): string {
		if (reporte.tipo_objeto === 'Usuario') {
			const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === reporte.id_objeto);
			return usuario ? `${usuario.nombre} ${usuario.apellido} (@${usuario.username})` : `Usuario #${reporte.id_objeto}`;
		} else {
			const proyecto = mockProyectos.find((p) => p.id_proyecto === reporte.id_objeto);
			return proyecto ? proyecto.titulo : `Proyecto #${reporte.id_objeto}`;
		}
	}

	function obtenerNombreReportante(reporte: Reporte): string {
		const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === reporte.reportante_id);
		return usuario ? `${usuario.nombre} ${usuario.apellido} (@${usuario.username})` : `Usuario #${reporte.reportante_id}`;
	}

	function cambiarEstado(reporteId: number | undefined, nuevoEstado: Reporte['estado']) {
		if (!reporteId) return;
		const reporte = reportes.find((r) => r.id_reporte === reporteId);
		if (reporte) {
			reporte.estado = nuevoEstado;
			if (nuevoEstado !== 'pendiente') {
				reporte.fecha_resolucion = new Date();
				reporte.admin_id = 1; // Simulando que el admin actual resuelve
			}
		}
	}

	function getEstadoColor(estado: string | undefined): string {
		switch (estado) {
			case 'pendiente':
				return 'bg-yellow-50 text-yellow-700 border-yellow-200';
			case 'resuelto':
				return 'bg-green-50 text-green-700 border-green-200';
			case 'rechazado':
				return 'bg-red-50 text-red-700 border-red-200';
			default:
				return 'bg-gray-50 text-gray-700 border-gray-200';
		}
	}

	const totalPendientes = reportes.filter((r) => r.estado === 'pendiente').length;
	const totalResueltos = reportes.filter((r) => r.estado === 'resuelto').length;
	const totalRechazados = reportes.filter((r) => r.estado === 'rechazado').length;
</script>

<svelte:head>
	<title>Reportes - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Reportes" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Gestión de reportes</h1>
			<p class="mt-1 text-sm text-gray-600">Irregularidades encontradas en proyectos y usuarios</p>
		</div>
	</div>

	<!-- Métricas -->
	<section class="grid gap-4 sm:grid-cols-3">
		<div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-yellow-700">Pendientes</p>
			<p class="mt-2 text-2xl font-semibold text-yellow-900">{totalPendientes}</p>
		</div>
		<div class="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-green-700">Resueltos</p>
			<p class="mt-2 text-2xl font-semibold text-green-900">{totalResueltos}</p>
		</div>
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-red-700">Rechazados</p>
			<p class="mt-2 text-2xl font-semibold text-red-900">{totalRechazados}</p>
		</div>
	</section>

	<!-- Filtros -->
	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
		<div class="flex flex-wrap items-end gap-4">
			<div>
				<label for="filtro-estado" class="block text-xs font-medium text-gray-600">Estado</label>
				<select
					id="filtro-estado"
					bind:value={filtroEstado}
					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Todos</option>
					<option value="pendiente">Pendiente</option>
					<option value="resuelto">Resuelto</option>
					<option value="rechazado">Rechazado</option>
				</select>
			</div>

			<div>
				<label for="filtro-tipo" class="block text-xs font-medium text-gray-600">Tipo</label>
				<select
					id="filtro-tipo"
					bind:value={filtroTipo}
					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Todos</option>
					<option value="Usuario">Usuario</option>
					<option value="Proyecto">Proyecto</option>
				</select>
			</div>

			<div class="flex-1 min-w-[180px]">
				<label for="busqueda" class="block text-xs font-medium text-gray-600">Buscar</label>
				<input
					id="busqueda"
					type="text"
					bind:value={busqueda}
					placeholder="Motivo o descripción"
					class="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	</section>

	<!-- Lista de reportes -->
	<section class="space-y-4">
		<div class="mb-3 flex items-center justify-between text-xs text-gray-500">
			<p>Mostrando {reportesFiltrados.length} de {reportes.length} reportes</p>
		</div>

		{#each reportesFiltrados as reporte}
			<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
				<div class="mb-4 flex items-start justify-between">
					<div class="flex-1">
						<div class="mb-2 flex items-center gap-3">
							<span class="rounded-full px-3 py-1 text-xs font-medium {getEstadoColor(reporte.estado)}">
								{reporte.estado === 'pendiente'
									? 'Pendiente'
									: reporte.estado === 'resuelto'
										? 'Resuelto'
										: 'Rechazado'}
							</span>
							<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
								{reporte.tipo_objeto}
							</span>
							<span class="text-xs text-gray-500">
								Reporte #{reporte.id_reporte}
							</span>
						</div>
						<h3 class="mb-1 text-lg font-semibold text-gray-900">{reporte.motivo}</h3>
						<p class="mb-2 text-sm text-gray-600">{reporte.descripcion}</p>
						<div class="mt-3 space-y-1 text-xs text-gray-500">
							<p><span class="font-medium">Objeto reportado:</span> {obtenerNombreObjeto(reporte)}</p>
							<p><span class="font-medium">Reportado por:</span> {obtenerNombreReportante(reporte)}</p>
							<p><span class="font-medium">Fecha:</span> {reporte.created_at?.toLocaleDateString('es-AR')}</p>
							{#if reporte.fecha_resolucion}
								<p>
									<span class="font-medium">Resuelto el:</span> {reporte.fecha_resolucion.toLocaleDateString('es-AR')}
								</p>
							{/if}
							{#if reporte.comentario_resolucion}
								<div class="mt-2 rounded-md bg-gray-50 p-2">
									<p class="font-medium text-gray-700">Comentario de resolución:</p>
									<p class="text-gray-600">{reporte.comentario_resolucion}</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				{#if reporte.estado === 'pendiente'}
					<div class="flex gap-2 border-t border-gray-100 pt-4">
						<Button
							label="Marcar como resuelto"
							variant="primary"
							size="sm"
							type="button"
							on:click={() => cambiarEstado(reporte.id_reporte, 'resuelto')}
						/>
						<Button
							label="Rechazar"
							variant="secondary"
							size="sm"
							type="button"
							on:click={() => cambiarEstado(reporte.id_reporte, 'rechazado')}
						/>
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-xl border border-gray-200 bg-white p-8 text-center">
				<p class="text-gray-500">No se encontraron reportes con los filtros seleccionados</p>
			</div>
		{/each}
	</section>
</div>
