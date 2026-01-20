<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import { mockHistorialCambios } from '$lib/mocks/mock-historial-cambios';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { HistorialDeCambios } from '$lib/types/HistorialDeCambios';
	import { obtenerNombreUsuario, obtenerUsuarioPorId } from '$lib/utils/util-usuarios';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';

	let filtroTipo: '' | 'Usuario' | 'Proyecto' | 'Resena' | 'Reporte' | 'Categoria' = '';
	let filtroAccion: '' | 'creado' | 'actualizado' | 'eliminado' | 'aprobado' | 'rechazado' | 'suspendido' | 'activado' = '';
	let busqueda = '';

	const logs = mockHistorialCambios.map((l) => ({ ...l }));

	$: logsFiltrados = logs.filter((l) => {
		const coincideTipo = !filtroTipo || l.tipo_objeto === filtroTipo;
		const coincideAccion = !filtroAccion || l.accion === filtroAccion;
		const texto = `${l.accion} ${l.atributo_afectado || ''} ${l.justificacion || ''}`.toLowerCase();
		const coincideBusqueda = !busqueda || texto.includes(busqueda.toLowerCase());
		return coincideTipo && coincideAccion && coincideBusqueda;
	});

	function obtenerUrlUsuario(usuarioId: number | undefined): string | null {
		if (!usuarioId) return null;
		const usuario = obtenerUsuarioPorId(usuarioId);
		return usuario ? obtenerUrlPerfil(usuario) : null;
	}

	function obtenerUrlObjeto(log: HistorialDeCambios): string | null {
		if (!log.id_objeto) return null;
		if (log.tipo_objeto === 'Proyecto') return `/proyectos/${log.id_objeto}`;
		if (log.tipo_objeto === 'Usuario') return obtenerUrlUsuario(log.id_objeto);
		return null;
	}

	function getAccionColor(accion: string): string {
		switch (accion) {
			case 'creado':
				return 'bg-blue-50 text-blue-700 border-blue-200';
			case 'actualizado':
				return 'bg-yellow-50 text-yellow-700 border-yellow-200';
			case 'eliminado':
				return 'bg-red-50 text-red-700 border-red-200';
			case 'aprobado':
				return 'bg-green-50 text-green-700 border-green-200';
			case 'rechazado':
				return 'bg-red-50 text-red-700 border-red-200';
			case 'suspendido':
				return 'bg-orange-50 text-orange-700 border-orange-200';
			case 'activado':
				return 'bg-green-50 text-green-700 border-green-200';
			default:
				return 'bg-gray-50 text-gray-700 border-gray-200';
		}
	}

	function getTipoIcono(tipo: string): string {
		switch (tipo) {
			case 'Usuario':
				return '👤';
			case 'Proyecto':
				return '📋';
			case 'Resena':
				return '⭐';
			case 'Reporte':
				return '🚨';
			case 'Categoria':
				return '🏷️';
			default:
				return '📄';
		}
	}
</script>

<svelte:head>
	<title>Logs de actividad - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Auditoría" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Logs de actividad</h1>
			<p class="mt-1 text-sm text-gray-600">Historial de cambios y acciones en la plataforma</p>
		</div>
	</div>

	<!-- Filtros -->
	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
		<div class="flex flex-wrap items-end gap-4">
			<div>
				<label for="filtro-tipo" class="block text-xs font-medium text-gray-600">Tipo de objeto</label>
				<select
					id="filtro-tipo"
					bind:value={filtroTipo}
					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Todos</option>
					<option value="Usuario">Usuario</option>
					<option value="Proyecto">Proyecto</option>
					<option value="Resena">Reseña</option>
					<option value="Reporte">Reporte</option>
					<option value="Categoria">Categoría</option>
				</select>
			</div>

			<div>
				<label for="filtro-accion" class="block text-xs font-medium text-gray-600">Acción</label>
				<select
					id="filtro-accion"
					bind:value={filtroAccion}
					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Todas</option>
					<option value="creado">Creado</option>
					<option value="actualizado">Actualizado</option>
					<option value="eliminado">Eliminado</option>
					<option value="aprobado">Aprobado</option>
					<option value="rechazado">Rechazado</option>
					<option value="suspendido">Suspendido</option>
					<option value="activado">Activado</option>
				</select>
			</div>

			<div class="flex-1 min-w-[180px]">
				<label for="busqueda" class="block text-xs font-medium text-gray-600">Buscar</label>
				<input
					id="busqueda"
					type="text"
					bind:value={busqueda}
					placeholder="Acción, atributo o justificación"
					class="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	</section>

	<!-- Lista de logs -->
	<section class="space-y-3">
		<div class="mb-3 flex items-center justify-between text-xs text-gray-500">
			<p>Mostrando {logsFiltrados.length} de {logs.length} registros</p>
		</div>

		{#each logsFiltrados as log}
			{@const urlObjeto = obtenerUrlObjeto(log)}
			<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
				<div class="flex items-start gap-4">
					<div class="flex-shrink-0 text-2xl">{getTipoIcono(log.tipo_objeto)}</div>
					<div class="flex-1">
						<div class="mb-2 flex items-center gap-2">
							<span class="rounded-full border px-3 py-1 text-xs font-medium {getAccionColor(log.accion)}">
								{log.accion.charAt(0).toUpperCase() + log.accion.slice(1)}
							</span>
							{#if urlObjeto}
								<a
									href={urlObjeto}
									class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 hover:underline"
								>
									{log.tipo_objeto} #{log.id_objeto}
								</a>
							{:else}
								<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
									{log.tipo_objeto} #{log.id_objeto}
								</span>
							{/if}
						</div>
						{#if log.atributo_afectado}
							<div class="mb-2 text-sm">
								<span class="font-medium text-gray-700">Atributo:</span>
								<span class="ml-1 text-gray-600">{log.atributo_afectado}</span>
								{#if log.valor_anterior !== null && log.valor_anterior !== undefined}
									<span class="ml-2 text-xs text-gray-500">
										<span class="line-through">{log.valor_anterior}</span>
										<span class="mx-1">→</span>
										<span class="font-medium">{log.valor_nuevo || 'N/A'}</span>
									</span>
								{/if}
							</div>
						{/if}
						{#if log.justificacion}
							<p class="mb-2 text-sm text-gray-600 italic">"{log.justificacion}"</p>
						{/if}
						<div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
							<span>
								<span class="font-medium">Por:</span>
								{#if obtenerUrlUsuario(log.usuario_id)}
									<a
										href={obtenerUrlUsuario(log.usuario_id)}
										class="ml-1 text-gray-600 transition hover:text-blue-600 hover:underline"
									>
										{log.usuario_id ? obtenerNombreUsuario(log.usuario_id) : 'Sistema'}
									</a>
								{:else}
									<span class="ml-1">
										{log.usuario_id ? obtenerNombreUsuario(log.usuario_id) : 'Sistema'}
									</span>
								{/if}
							</span>
							<span>•</span>
							<span>{log.created_at?.toLocaleString('es-AR') || 'Fecha no disponible'}</span>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="rounded-xl border border-gray-200 bg-white p-8 text-center">
				<p class="text-gray-500">No se encontraron registros con los filtros seleccionados</p>
			</div>
		{/each}
	</section>
</div>
