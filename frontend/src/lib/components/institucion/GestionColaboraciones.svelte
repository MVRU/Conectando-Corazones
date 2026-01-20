<!--
* Componente: GestionColaboraciones  
        -*- Descripción: Gestión completa de colaboraciones con selector de proyecto, estadísticas y acciones
-->

<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Colaboracion } from '$lib/types/Colaboracion';
	import { formatearFecha } from '$lib/utils/validaciones';
	import { obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { InboxArrowDown, CheckCircle, XCircle, ChartBar, HandRaised } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		getTipoIcon,
		getTipoLabel,
		getColaboracionesCount,
		getColaboracionesPendientes,
		getColaboracionesAprobadas,
		calcularDiasActivo
	} from '$lib/utils/util-colaboraciones';

	// Filtro en_curso
	let proyectos: Proyecto[] = mockProyectos.filter((p) => p.estado === 'en_curso');

	proyectos = proyectos.map((proyecto) => ({
		...proyecto,
		colaboraciones: mockColaboraciones.filter((c) => c.proyecto_id === proyecto.id_proyecto)
	}));

	let proyectoSeleccionado: Proyecto = proyectos[0] || mockProyectos[0];
	let proyectoSeleccionadoId: number = proyectoSeleccionado?.id_proyecto || 0;

	// Variables para el modal de rechazo
	let mostrarModalRechazo = false;
	let colaboracionARechazar: number | null = null;
	let justificacionRechazo = '';
	let rechazoTocado = false;

	// cuando cambia el ID seleccionado, actualiza el proyecto
	$: if (proyectoSeleccionadoId) {
		const proyecto = proyectos.find((p) => p.id_proyecto === proyectoSeleccionadoId);
		if (proyecto) {
			proyectoSeleccionado = proyecto;
		}
	}

	function aceptarColaboracion(colaboracionId: number) {
		// Actualizar estado en el proyecto seleccionado
		if (proyectoSeleccionado.colaboraciones) {
			proyectoSeleccionado.colaboraciones = proyectoSeleccionado.colaboraciones.map((c) =>
				c.id_colaboracion === colaboracionId ? { ...c, estado: 'aprobada' as const } : c
			);
		}

		console.log(`Colaboración ${colaboracionId} aceptada`);
	}

	function mostrarModalParaRechazar(colaboracionId: number) {
		colaboracionARechazar = colaboracionId;
		justificacionRechazo = '';
		mostrarModalRechazo = true;
	}

	function cerrarModalRechazo() {
		mostrarModalRechazo = false;
		colaboracionARechazar = null;
		justificacionRechazo = '';
	}

	function confirmarRechazo() {
		rechazoTocado = true;
		const texto = justificacionRechazo.trim();
		if (!texto) return;

		if (colaboracionARechazar && proyectoSeleccionado.colaboraciones) {
			proyectoSeleccionado.colaboraciones = proyectoSeleccionado.colaboraciones.map((c) =>
				c.id_colaboracion === colaboracionARechazar
					? { ...c, estado: 'rechazada' as const, justificacion: texto }
					: c
			);

			console.log(
				`Colaboración ${colaboracionARechazar} rechazada con justificación: ${texto}`
			);
		}

		cerrarModalRechazo();
	}

	function obtenerEmailColaborador(colaboracion: Colaboracion): string | undefined {
		const contactos = colaboracion.colaborador?.contactos;
		return contactos?.find((c) => c.tipo_contacto === 'email')?.valor;
	}

	function obtenerTelefonoColaborador(colaboracion: Colaboracion): string | undefined {
		const contactos = colaboracion.colaborador?.contactos;
		return contactos?.find((c) => c.tipo_contacto === 'telefono')?.valor;
	}

	function getColaboracionesRechazadas(proyecto: Proyecto): number {
		return proyecto.colaboraciones?.filter((c) => c.estado === 'rechazada')?.length || 0;
	}

	// Estadísticas del proyecto seleccionado
	$: colaboraciones = proyectoSeleccionado.colaboraciones || [];
	$: pendientes = colaboraciones.filter((c) => c.estado === 'pendiente');
	$: aprobadas = colaboraciones.filter((c) => c.estado === 'aprobada');
</script>

<svelte:head>
	<title>Solicitudes de colaboración recibidas - Conectando Corazones</title>
	<meta name="description" content="Gestiona las solicitudes de colaboración para tus proyectos" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))]">
				Solicitudes de colaboración recibidas
			</h1>
			<p class="mt-2 text-gray-600">Gestiona las solicitudes de colaboración para tus proyectos</p>
		</div>

		<!-- Selector de proyecto -->
		{#if proyectos.length > 1}
			<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900">Seleccionar proyecto</h2>
					<span class="text-sm text-gray-500">
						{proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} total{proyectos.length !==
						1
							? 'es'
							: ''}
					</span>
				</div>

				<div class="space-y-4">
					<!-- Selector dropdown -->
					<div>
						<label for="project-select" class="mb-2 block text-sm font-medium text-gray-700">
							Proyecto en curso:
						</label>
						<select
							id="project-select"
							bind:value={proyectoSeleccionadoId}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
						>
							{#each proyectos as proyecto}
								<option value={proyecto.id_proyecto}>
									{proyecto.titulo}
								</option>
							{/each}
						</select>
					</div>

					<!-- Información del proyecto seleccionado -->
					<div class="rounded-lg bg-gray-50 p-4">
						<div class="mb-3 flex items-start justify-between">
							<div class="flex-1">
								<h3 class="mb-1 font-medium text-gray-900">
									{proyectoSeleccionado.titulo}
								</h3>
								{#if proyectoSeleccionado.descripcion}
									<p class="line-clamp-2 text-sm text-gray-600">
										{proyectoSeleccionado.descripcion}
									</p>
								{/if}
							</div>
						</div>

						<!-- Estadísticas rápidas -->
						<div class="grid grid-cols-4 gap-3">
							<div class="rounded-lg border border-gray-200 bg-white p-3">
								<div class="flex items-center">
									<div class="mr-2 text-orange-500">
										<Icon src={InboxArrowDown} class="h-6 w-6" />
									</div>
									<div>
										<p class="text-xs text-gray-500">Pendientes</p>
										<p class="text-lg font-semibold text-gray-900">
											{getColaboracionesPendientes(proyectoSeleccionado)}
										</p>
									</div>
								</div>
							</div>

							<div class="rounded-lg border border-gray-200 bg-white p-3">
								<div class="flex items-center">
									<div class="mr-2 text-green-500">
										<Icon src={CheckCircle} class="h-6 w-6" />
									</div>
									<div>
										<p class="text-xs text-gray-500">Aprobadas</p>
										<p class="text-lg font-semibold text-gray-900">
											{getColaboracionesAprobadas(proyectoSeleccionado)}
										</p>
									</div>
								</div>
							</div>

							<div class="rounded-lg border border-gray-200 bg-white p-3">
								<div class="flex items-center">
									<div class="mr-2 text-red-500">
										<Icon src={XCircle} class="h-6 w-6" />
									</div>
									<div>
										<p class="text-xs text-gray-500">Rechazadas</p>
										<p class="text-lg font-semibold text-gray-900">
											{getColaboracionesRechazadas(proyectoSeleccionado)}
										</p>
									</div>
								</div>
							</div>

							<div class="rounded-lg border border-gray-200 bg-white p-3">
								<div class="flex items-center">
									<div class="mr-2 text-blue-500">
										<Icon src={ChartBar} class="h-6 w-6" />
									</div>
									<div>
										<p class="text-xs text-gray-500">Total</p>
										<p class="text-lg font-semibold text-gray-900">
											{getColaboracionesCount(proyectoSeleccionado)}
										</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Información adicional -->
						<div class="mt-4 space-y-2">
							{#if proyectoSeleccionado.fecha_fin_tentativa}
								<p class="text-xs text-gray-500">
									<span class="font-medium">Finalización tentativa:</span>
									{formatearFecha(proyectoSeleccionado.fecha_fin_tentativa)}
								</p>
							{/if}

							{#if proyectoSeleccionado.created_at}
								<p class="text-xs text-gray-500">
									<span class="font-medium">Creado el:</span>
									{formatearFecha(proyectoSeleccionado.created_at)}
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
		<!-- Dos columnas: Solicitudes + Colaboradores activos -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Solicitudes de colaboración (pendientes) -->
			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-gray-900">Solicitudes de colaboración</h2>
						<span
							class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800"
						>
							{pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}
						</span>
					</div>
				</div>

				<div class="divide-y divide-gray-200">
					{#if pendientes.length === 0}
						<div class="px-6 py-12 text-center">
							<div class="mb-4 flex justify-center text-4xl">
								<Icon src={InboxArrowDown} class="h-12 w-12 text-gray-400" />
							</div>
							<h3 class="mb-2 text-lg font-medium text-gray-900">No hay solicitudes pendientes</h3>
							<p class="text-gray-500">
								Cuando recibas solicitudes de colaboración aparecerán aquí para que puedas
								gestionarlas.
							</p>
						</div>
					{:else}
						{#each pendientes as colaboracion (colaboracion.id_colaboracion)}
							<div class="px-6 py-4 transition-colors hover:bg-gray-50">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<div class="mb-2 flex items-center gap-3">
											<span class="text-2xl">
												<Icon src={getTipoIcon(colaboracion)} class="h-8 w-8" />
											</span>
											<div>
												<h3 class="text-base font-medium text-gray-900">
													{obtenerNombreColaborador(colaboracion.colaborador)}
												</h3>
												<p class="text-sm text-gray-500">
													{getTipoLabel(colaboracion)} • Postulado el {formatearFecha(
														colaboracion.created_at
													)}
												</p>
											</div>
										</div>

										{#if obtenerEmailColaborador(colaboracion)}
											<p class="mb-1 text-sm text-gray-600">
												<span class="font-medium">Email:</span>
												{obtenerEmailColaborador(colaboracion)}
											</p>
										{/if}

										{#if obtenerTelefonoColaborador(colaboracion)}
											<p class="mb-1 text-sm text-gray-600">
												<span class="font-medium">Teléfono:</span>
												{obtenerTelefonoColaborador(colaboracion)}
											</p>
										{/if}

										{#if colaboracion.mensaje}
											<div class="mt-3 rounded-lg bg-gray-50 p-3">
												<p class="text-sm text-gray-700">
													<span class="font-medium">Mensaje:</span>
												</p>
												<p class="mt-1 text-sm text-gray-600">
													{colaboracion.mensaje}
												</p>
											</div>
										{/if}

										{#if colaboracion.estado === 'rechazada' && colaboracion.justificacion}
											<div class="mt-3 rounded-lg bg-red-50 p-3">
												<p class="text-sm text-red-700">
													<span class="font-medium">Motivo del rechazo:</span>
												</p>
												<p class="mt-1 text-sm text-red-600">
													{colaboracion.justificacion}
												</p>
											</div>
										{/if}
									</div>

									<div class="ml-6 flex flex-col gap-2">
										<Button
											label="✓ Aceptar"
											variant="primary"
											size="sm"
											type="button"
											on:click={() => aceptarColaboracion(colaboracion.id_colaboracion || 0)}
											customClass="!bg-green-600 hover:!bg-green-700 !min-w-[90px]"
										/>
										<Button
											label="✕ Rechazar"
											variant="secondary"
											size="sm"
											type="button"
											on:click={() => mostrarModalParaRechazar(colaboracion.id_colaboracion || 0)}
											customClass="!bg-red-600 hover:!bg-red-700 !text-white !min-w-[90px]"
										/>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Colaboradores activos (aprobadas) -->
			<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
				<div class="border-b border-gray-200 px-6 py-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-gray-900">Colaboradores activos</h2>
						<span
							class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
						>
							{aprobadas.length} activo{aprobadas.length !== 1 ? 's' : ''}
						</span>
					</div>
				</div>

				<div class="divide-y divide-gray-200">
					{#if aprobadas.length === 0}
						<div class="px-6 py-12 text-center">
							<div class="mb-4 flex justify-center text-4xl">
								<Icon src={HandRaised} class="h-12 w-12 text-gray-400" />
							</div>
							<h3 class="mb-2 text-lg font-medium text-gray-900">Aún no tienes colaboradores</h3>
							<p class="text-gray-500">
								Los colaboradores aceptados aparecerán aquí. Revisa las solicitudes pendientes para
								encontrar personas dispuestas a ayudar.
							</p>
						</div>
					{:else}
						{#each aprobadas as colaboracion (colaboracion.id_colaboracion)}
							<div class="px-6 py-4">
								<div class="flex items-start justify-between">
									<div class="flex items-center gap-3">
										<span class="text-2xl">
											<Icon src={getTipoIcon(colaboracion)} class="h-8 w-8" />
										</span>
										<div>
											<h3 class="text-base font-medium text-gray-900">
												{obtenerNombreColaborador(colaboracion.colaborador)}
											</h3>
											<p class="text-sm text-gray-500">
												{getTipoLabel(colaboracion)}
											</p>
											{#if colaboracion.created_at}
												<p class="mt-1 text-xs text-gray-400">
													Colaborando desde el {formatearFecha(colaboracion.created_at)}
													({calcularDiasActivo(colaboracion.created_at)} días)
												</p>
											{/if}
										</div>
									</div>

									<div class="flex items-center gap-2">
										<span
											class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
										>
											✓ Activo
										</span>
									</div>
								</div>

								{#if obtenerEmailColaborador(colaboracion)}
									<div class="mt-3 pl-11">
										<p class="text-sm text-gray-600">
											<span class="font-medium">Email:</span>
											<a
												href="mailto:{obtenerEmailColaborador(colaboracion)}"
												class="text-blue-600 transition-colors hover:text-blue-800"
											>
												{obtenerEmailColaborador(colaboracion)}
											</a>
										</p>
									</div>
								{/if}

								{#if obtenerTelefonoColaborador(colaboracion)}
									<div class="mt-1 pl-11">
										<p class="text-sm text-gray-600">
											<span class="font-medium">Teléfono:</span>
											<a
												href="tel:{obtenerTelefonoColaborador(colaboracion)}"
												class="text-blue-600 transition-colors hover:text-blue-800"
											>
												{obtenerTelefonoColaborador(colaboracion)}
											</a>
										</p>
									</div>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>

<!-- Modal de rechazo Marca error de accesibilidad, pero funciona bien con esos comentarios, pss no borrarlos -->
{#if mostrarModalRechazo}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center" on:click={cerrarModalRechazo}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="mx-4 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-2xl"
			on:click|stopPropagation
		>
			<div class="mb-4">
				<h3 class="text-lg font-semibold text-gray-900">Rechazar solicitud de colaboración</h3>
				<p class="mt-2 text-sm text-gray-600">
					Coloque una justificación del por qué rechaza la solicitud de colaboración <span class="font-medium text-red-600">(obligatorio)</span>
				</p>
			</div>

			<div class="mb-6">
				<label for="justificacion-rechazo" class="mb-2 block text-sm font-medium text-gray-700">
					Justificación del rechazo:
				</label>
				<textarea
					id="justificacion-rechazo"
					bind:value={justificacionRechazo}
					rows="4"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
					placeholder="Ejemplo: No cumple con los requisitos específicos del proyecto..."
				></textarea>
				{#if rechazoTocado && !justificacionRechazo.trim().length}
					<p class="mt-2 text-sm text-red-600">Este campo es obligatorio.</p>
				{/if}
			</div>

			<div class="flex justify-end space-x-3">
				<Button
					label="Cancelar"
					variant="secondary"
					size="sm"
					type="button"
					on:click={cerrarModalRechazo}
					customClass="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
				/>
				<Button
					label="Confirmar rechazo"
					variant="secondary"
					size="sm"
					type="button"
					on:click={confirmarRechazo}
					disabled={!justificacionRechazo.trim().length}
					customClass="!bg-red-600 hover:!bg-red-700 !text-white"
				/>
			</div>
		</div>
	</div>
{/if}
