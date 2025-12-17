<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { Proyecto } from '$lib/types/Proyecto';
	import { ESTADO_LABELS } from '$lib/types/Estado';
	import type { EstadoDescripcion } from '$lib/types/Estado';

	let proyectoDetalle: Proyecto | undefined;
	let editandoEstado = false;

	$: {
		const id = Number($page.params.id);
		proyectoDetalle = (mockProyectos as Proyecto[]).find((p) => p.id_proyecto === id);
	}

	function cambiarEstado(nuevoEstado: EstadoDescripcion) {
		if (!proyectoDetalle) return;
		proyectoDetalle = { ...proyectoDetalle, estado: nuevoEstado };
		editandoEstado = false;
		// TODO: Aquí se haría la llamada al backend para actualizar
	}

	function formatearFecha(fecha?: Date): string {
		if (!fecha) return 'No especificada';
		return new Date(fecha).toLocaleDateString('es-AR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatearFechaCorta(fecha?: Date): string {
		if (!fecha) return 'No especificada';
		return new Date(fecha).toLocaleDateString('es-AR');
	}

	function obtenerColorEstado(estado?: EstadoDescripcion): string {
		if (!estado) return 'bg-gray-100 text-gray-600';
		switch (estado) {
			case 'en_curso':
				return 'bg-blue-50 text-blue-700';
			case 'completado':
				return 'bg-emerald-50 text-emerald-700';
			case 'en_revision':
				return 'bg-yellow-50 text-yellow-700';
			case 'en_auditoria':
				return 'bg-orange-50 text-orange-700';
			case 'cancelado':
				return 'bg-red-50 text-red-700';
			case 'pendiente_solicitud_cierre':
				return 'bg-purple-50 text-purple-700';
			default:
				return 'bg-gray-100 text-gray-600';
		}
	}

	function obtenerColorEstadoColaboracion(estado: string): string {
		switch (estado) {
			case 'aprobada':
				return 'bg-emerald-50 text-emerald-700';
			case 'pendiente':
				return 'bg-yellow-50 text-yellow-700';
			case 'rechazada':
				return 'bg-red-50 text-red-700';
			case 'anulada':
				return 'bg-gray-100 text-gray-600';
			default:
				return 'bg-gray-100 text-gray-600';
		}
	}

	// Mock de historial de actividades
	const historialActividades = [
		{
			fecha: proyectoDetalle?.created_at || new Date(),
			accion: 'Proyecto creado',
			detalle: 'El proyecto fue registrado en la plataforma',
			usuario: proyectoDetalle?.institucion?.nombre_legal || 'Institución'
		},
		{
			fecha: new Date(Date.now() - 86400000),
			accion: 'Actualización de estado',
			detalle: 'El estado del proyecto cambió a ' + (proyectoDetalle?.estado || 'en curso'),
			usuario: 'Sistema'
		}
	];
</script>

<svelte:head>
	<title>Detalle de proyecto - Panel admin</title>
</svelte:head>

{#if !proyectoDetalle}
	<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
		<p class="text-sm font-medium text-red-800">Proyecto no encontrado</p>
		<Button
			label="Volver a proyectos"
			variant="secondary"
			size="sm"
			type="button"
			on:click={() => goto('/admin/proyectos')}
		/>
	</div>
{:else}
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				{#if proyectoDetalle.url_portada}
					<img
						src={proyectoDetalle.url_portada}
						alt={proyectoDetalle.titulo}
						class="h-20 w-20 rounded-lg object-cover"
					/>
				{:else}
					<div
						class="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-200 text-2xl font-semibold text-gray-600"
					>
						{proyectoDetalle.titulo.charAt(0)}
					</div>
				{/if}
				<div>
					<Badge text="Proyecto" />
					<h1 class="mt-2 text-2xl font-bold text-gray-900">{proyectoDetalle.titulo}</h1>
					<p class="mt-1 text-sm text-gray-600">
						{proyectoDetalle.institucion?.nombre_legal || 'Sin institución asignada'}
					</p>
				</div>
			</div>
			<div class="flex gap-2">
				<Button
					label="Editar proyecto"
					variant="primary"
					size="sm"
					type="button"
					on:click={() => alert('Funcionalidad pendiente: editar proyecto')}
				/>
				<Button
					label="Volver"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => history.back()}
				/>
			</div>
		</div>

		<!-- Información principal -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Información básica -->
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Información básica</h2>
				<dl class="space-y-4 text-sm">
					<div>
						<dt class="font-medium text-gray-500">Estado</dt>
						<dd class="mt-1">
							{#if editandoEstado}
								<select
									class="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
									bind:value={proyectoDetalle.estado}
									on:change={(e) =>
										cambiarEstado((e.currentTarget as HTMLSelectElement).value as EstadoDescripcion)}
								>
									<option value="en_curso">En curso</option>
									<option value="pendiente_solicitud_cierre">Pendiente solicitud de cierre</option>
									<option value="en_revision">En revisión</option>
									<option value="en_auditoria">En auditoría</option>
									<option value="completado">Completado</option>
									<option value="cancelado">Cancelado</option>
								</select>
							{:else}
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${obtenerColorEstado(
										proyectoDetalle.estado
									)}`}
								>
									{proyectoDetalle.estado ? ESTADO_LABELS[proyectoDetalle.estado] : 'Sin estado'}
								</span>
								<button
									type="button"
									class="ml-2 text-xs text-blue-600 hover:underline"
									on:click={() => (editandoEstado = true)}
								>
									Editar
								</button>
							{/if}
						</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Descripción</dt>
						<dd class="mt-1 text-gray-900">{proyectoDetalle.descripcion}</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Fecha de creación</dt>
						<dd class="mt-1 text-gray-900">{formatearFecha(proyectoDetalle.created_at)}</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Cierre de postulaciones</dt>
						<dd class="mt-1 text-gray-900">
							{formatearFecha(proyectoDetalle.fecha_cierre_postulaciones)}
						</dd>
					</div>

					<div>
						<dt class="font-medium text-gray-500">Fecha fin tentativa</dt>
						<dd class="mt-1 text-gray-900">{formatearFecha(proyectoDetalle.fecha_fin_tentativa)}</dd>
					</div>

					{#if proyectoDetalle.beneficiarios}
						<div>
							<dt class="font-medium text-gray-500">Beneficiarios estimados</dt>
							<dd class="mt-1 text-gray-900">{proyectoDetalle.beneficiarios} personas</dd>
						</div>
					{/if}
				</dl>
			</section>

			<!-- Institución y categorías -->
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Institución y categorías</h2>

				{#if proyectoDetalle.institucion}
					<div class="mb-6">
						<dt class="mb-2 font-medium text-gray-500">Institución responsable</dt>
						<dd class="space-y-2">
							<p class="text-sm font-medium text-gray-900">{proyectoDetalle.institucion.nombre_legal}</p>
							{#if proyectoDetalle.institucion.contactos && proyectoDetalle.institucion.contactos.length > 0}
								<p class="text-xs text-gray-600">
									{proyectoDetalle.institucion.contactos
										.find((c) => c.etiqueta === 'principal' && c.tipo_contacto === 'email')
										?.valor || 'Sin email'}
								</p>
							{/if}
						</dd>
					</div>
				{/if}

				{#if proyectoDetalle.categorias && proyectoDetalle.categorias.length > 0}
					<div>
						<dt class="mb-2 font-medium text-gray-500">Categorías</dt>
						<dd class="flex flex-wrap gap-2">
							{#each proyectoDetalle.categorias as categoria}
								<span
									class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700"
								>
									{categoria.descripcion}
								</span>
							{/each}
						</dd>
					</div>
				{:else}
					<p class="text-sm text-gray-500">No hay categorías asignadas</p>
				{/if}
			</section>
		</div>

		<!-- Tipos de participación -->
		{#if proyectoDetalle.participacion_permitida && proyectoDetalle.participacion_permitida.length > 0}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Tipos de participación</h2>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each proyectoDetalle.participacion_permitida as participacion}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium text-gray-900">
									{participacion.tipo_participacion?.descripcion || 'Sin tipo'}
								</span>
							</div>
							<div class="mt-2 flex items-baseline gap-2">
								<span class="text-lg font-semibold text-gray-900">
									{participacion.actual || 0}
								</span>
								<span class="text-sm text-gray-500">/ {participacion.objetivo}</span>
								{#if participacion.unidad_medida}
									<span class="text-xs text-gray-500">{participacion.unidad_medida}</span>
								{/if}
							</div>
							<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									class="h-full bg-blue-600"
									style="width: {Math.min(100, ((participacion.actual || 0) / participacion.objetivo) * 100)}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Colaboraciones -->
		{#if proyectoDetalle.colaboraciones && proyectoDetalle.colaboraciones.length > 0}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">
					Colaboraciones ({proyectoDetalle.colaboraciones.length})
				</h2>
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200 text-sm">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
									Colaborador
								</th>
								<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
									Estado
								</th>
								<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
									Fecha
								</th>
								<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
									Mensaje
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 bg-white">
							{#each proyectoDetalle.colaboraciones as colaboracion}
								<tr>
									<td class="whitespace-nowrap px-3 py-2">
										<p class="text-sm font-medium text-gray-900">
											{colaboracion.colaborador?.nombre || 'Sin nombre'}{' '}
											{colaboracion.colaborador?.apellido || ''}
										</p>
										<p class="text-xs text-gray-500">{colaboracion.colaborador?.username || 'Sin username'}</p>
									</td>
									<td class="whitespace-nowrap px-3 py-2">
										<span
											class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${obtenerColorEstadoColaboracion(
												colaboracion.estado
											)}`}
										>
											{colaboracion.estado}
										</span>
									</td>
									<td class="whitespace-nowrap px-3 py-2 text-gray-500">
										{formatearFechaCorta(colaboracion.created_at)}
									</td>
									<td class="px-3 py-2 text-gray-600">
										{colaboracion.mensaje || '-'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{:else}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Colaboraciones</h2>
				<p class="text-sm text-gray-500">No hay colaboraciones registradas para este proyecto</p>
			</section>
		{/if}

		<!-- Evidencias -->
		{#if proyectoDetalle.evidencias && proyectoDetalle.evidencias.length > 0}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Evidencias ({proyectoDetalle.evidencias.length})</h2>
				<div class="space-y-4">
					{#each proyectoDetalle.evidencias as evidencia}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p class="text-sm text-gray-900">{evidencia.descripcion}</p>
							<p class="mt-1 text-xs text-gray-500">
								Fecha: {formatearFechaCorta(evidencia.created_at)}
							</p>
							{#if evidencia.archivos && evidencia.archivos.length > 0}
								<p class="mt-2 text-xs text-gray-600">
									{evidencia.archivos.length} archivo(s) adjunto(s)
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Ubicaciones -->
		{#if proyectoDetalle.ubicaciones && proyectoDetalle.ubicaciones.length > 0}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Ubicaciones ({proyectoDetalle.ubicaciones.length})</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each proyectoDetalle.ubicaciones as proyectoUbicacion}
						{@const ubicacion = proyectoUbicacion.ubicacion}
						{#if ubicacion}
							{@const ubic = ubicacion as any}
							<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
								<div class="flex items-center justify-between mb-2">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700"
									>
										{ubic.tipo_ubicacion || 'Ubicación'}
									</span>
									{#if ubic.modalidad}
										<span
											class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700"
										>
											{ubic.modalidad}
										</span>
									{/if}
								</div>
								
								{#if ubic.modalidad === 'presencial' && ubic.direccion}
									<div class="space-y-1">
										{#if ubic.direccion?.localidad}
											<p class="text-sm font-medium text-gray-900">
												{ubic.direccion.localidad.nombre}
												{#if ubic.direccion.localidad.provincia}
													, {ubic.direccion.localidad.provincia}
												{/if}
											</p>
										{/if}
										{#if ubic.direccion?.calle}
											<p class="text-xs text-gray-600">
												{ubic.direccion.calle} {ubic.direccion.numero}
												{#if ubic.direccion.piso}
													, Piso {ubic.direccion.piso}
												{/if}
												{#if ubic.direccion.departamento}
													, Depto. {ubic.direccion.departamento}
												{/if}
											</p>
										{/if}
										{#if ubic.direccion?.referencia}
											<p class="text-xs text-gray-500">{ubic.direccion.referencia}</p>
										{/if}
									</div>
								{:else if ubic.modalidad === 'virtual' && ubic.url_virtual}
									<div class="space-y-1">
										<p class="text-sm font-medium text-gray-900">Ubicación virtual</p>
										<a
											href={ubic.url_virtual}
											target="_blank"
											rel="noopener noreferrer"
											class="text-xs text-blue-600 hover:underline break-all"
										>
											{ubic.url_virtual}
										</a>
									</div>
								{:else if ubic.direccion?.localidad}
									<div class="space-y-1">
										<p class="text-sm font-medium text-gray-900">
											{ubic.direccion.localidad.nombre}
											{#if ubic.direccion.localidad.provincia}
												, {ubic.direccion.localidad.provincia}
											{/if}
										</p>
										{#if ubic.direccion.calle}
											<p class="text-xs text-gray-600">
												{ubic.direccion.calle} {ubic.direccion.numero}
											</p>
										{/if}
									</div>
								{/if}
								
								{#if ubic.que_se_hace}
									<div class="mt-2 pt-2 border-t border-gray-200">
										<p class="text-xs font-medium text-gray-500">Qué se hace:</p>
										<p class="text-xs text-gray-700 mt-1">{ubic.que_se_hace}</p>
									</div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</section>
		{/if}

		<!-- Solicitudes de finalización -->
		{#if proyectoDetalle.solicitudes_finalizacion && proyectoDetalle.solicitudes_finalizacion.length > 0}
			<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">
					Solicitudes de finalización ({proyectoDetalle.solicitudes_finalizacion.length})
				</h2>
				<div class="space-y-4">
					{#each proyectoDetalle.solicitudes_finalizacion as solicitud}
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<div class="flex items-center justify-between">
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${obtenerColorEstado(
										(solicitud.estado || 'en_curso') as EstadoDescripcion
									)}`}
								>
									{solicitud.estado || 'Sin estado'}
								</span>
								<span class="text-xs text-gray-500">
									{formatearFechaCorta(solicitud.created_at)}
								</span>
							</div>
							{#if solicitud.evidencias && solicitud.evidencias.length > 0}
								<p class="mt-2 text-xs text-gray-600">
									{solicitud.evidencias.length} evidencia(s) asociada(s)
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Historial de actividades -->
		<section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Historial de actividades</h2>
			<div class="space-y-4">
				{#each historialActividades as actividad}
					<div class="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
						<div
							class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
						>
							{actividad.accion.charAt(0)}
						</div>
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-gray-900">{actividad.accion}</p>
								<p class="text-xs text-gray-500">{formatearFecha(actividad.fecha)}</p>
							</div>
							<p class="mt-1 text-xs text-gray-600">{actividad.detalle}</p>
							<p class="mt-1 text-xs text-gray-500">Por: {actividad.usuario}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Acciones administrativas -->
		<section class="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-red-900">Acciones administrativas</h2>
			<div class="flex flex-wrap gap-3">
				<Button
					label={proyectoDetalle.estado === 'cancelado' ? 'Reactivar proyecto' : 'Cancelar proyecto'}
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => {
						const proyecto = proyectoDetalle;
						if (!proyecto) return;
						if (
							confirm(
								'¿Estás seguro de ' +
									(proyecto.estado === 'cancelado' ? 'reactivar' : 'cancelar') +
									' este proyecto?'
							)
						) {
							alert('Funcionalidad pendiente: cancelar/reactivar proyecto');
						}
					}}
				/>
				<Button
					label="Marcar como completado"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => {
						if (confirm('¿Estás seguro de marcar este proyecto como completado?')) {
							cambiarEstado('completado');
						}
					}}
				/>
				<Button
					label="Eliminar proyecto"
					variant="secondary"
					size="sm"
					type="button"
					on:click={() => {
						if (confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) {
							alert('Funcionalidad pendiente: eliminar proyecto');
						}
					}}
				/>
			</div>
		</section>
	</div>
{/if}
