<!--
* Componente: GestionColaboraciones  
        -*- Descripción: Gestíon completa de colaboraciones con selector de proyecto, estadísticas y acciones
-->

<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { Colaboracion } from '$lib/domain/types/Colaboracion';
	import { formatearFecha } from '$lib/utils/validaciones';
	import { obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { toastStore } from '$lib/stores/toast';
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

	// Prop recibida desde el padre
	export let proyectos: Proyecto[] = [];

	let proyectoSeleccionado: Proyecto;
	let proyectoSeleccionadoId: number | undefined;

	$: if (proyectos.length > 0 && !proyectoSeleccionado) {
		proyectoSeleccionado = proyectos[0];
		proyectoSeleccionadoId = proyectoSeleccionado.id_proyecto;
	}

	// Variables para el modal de rechazo
	let mostrarModalRechazo = false;
	let colaboracionARechazar: number | null = null;
	let justificacionRechazo = '';

	// Estados de loading
	let loadingAprobacion: number | null = null;
	let loadingRechazo = false;

	// cuando cambia el ID seleccionado, actualiza el proyecto
	$: if (proyectoSeleccionadoId) {
		const proyecto = proyectos.find((p) => p.id_proyecto === proyectoSeleccionadoId);
		if (proyecto) {
			proyectoSeleccionado = proyecto;
		}
	}

	async function aceptarColaboracion(colaboracionId: number) {
		loadingAprobacion = colaboracionId;
		try {
			const res = await fetch(`/api/colaboraciones/${colaboracionId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ estado: 'aprobada' })
			});

			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.error || 'Error al aprobar la colaboración');
			}

			// Actualizar estado en el proyecto seleccionado
			if (proyectoSeleccionado.colaboraciones) {
				proyectoSeleccionado.colaboraciones = proyectoSeleccionado.colaboraciones.map((c) =>
					c.id_colaboracion === colaboracionId ? result : c
				);
			}

			toastStore.show({
				message: 'Colaboración aprobada exitosamente',
				variant: 'success'
			});
		} catch (error: any) {
			toastStore.show({
				message: error.message || 'Error al aprobar la colaboración',
				variant: 'error'
			});
		} finally {
			loadingAprobacion = null;
		}
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

	async function confirmarRechazo() {
		if (colaboracionARechazar) {
			loadingRechazo = true;
			try {
				const justificacion = justificacionRechazo.trim();
				if (!justificacion) {
					return;
				}

				const res = await fetch(`/api/colaboraciones/${colaboracionARechazar}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ estado: 'rechazada', justificacion })
				});

				const result = await res.json();

				if (!res.ok) {
					throw new Error(result.error || 'Error al rechazar la colaboración');
				}

				if (proyectoSeleccionado.colaboraciones) {
					proyectoSeleccionado.colaboraciones = proyectoSeleccionado.colaboraciones.map((c) =>
						c.id_colaboracion === colaboracionARechazar ? result : c
					);
				}

				toastStore.show({
					message: 'Colaboración rechazada',
					variant: 'success'
				});
			} catch (error: any) {
				toastStore.show({
					message: error.message || 'Error al rechazar la colaboración',
					variant: 'error'
				});
			} finally {
				loadingRechazo = false;
			}
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
	<meta name="description" content="Gestioná las solicitudes de colaboración para tus proyectos" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-[rgb(var(--base-color))] sm:text-3xl">
				Solicitudes de colaboración recibidas
			</h1>
			<p class="mt-2 text-gray-600">Gestioná las solicitudes de colaboración para tus proyectos</p>
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
							class="focus:ring-opacity-20 w-full rounded-lg border border-gray-300 px-3 py-3 text-base transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:py-2 sm:text-sm"
						>
							{#each proyectos as proyecto}
								<option value={proyecto.id_proyecto}>
									{proyecto.titulo}
								</option>
							{/each}
						</select>
					</div>

					<div class="rounded-lg bg-gray-50 p-4">
						<!-- Estadísticas rápidas -->
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
						<h2 class="truncate text-lg font-semibold text-gray-900">
							<span class="sm:hidden">Solicitudes</span>
							<span class="hidden sm:inline">Solicitudes de colaboración</span>
						</h2>
						<span
							class="inline-flex shrink-0 items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-orange-800"
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
							<div class="px-4 py-4 transition-colors hover:bg-gray-50 sm:px-6">
								<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
									<div class="w-full min-w-0 flex-1">
										<div class="mb-3 flex items-start gap-3 sm:mb-4 sm:gap-4">
											<!-- Avatar Clickeable -->
											<a
												href="/perfil/{colaboracion.colaborador?.username}"
												class="group flex-shrink-0"
											>
												{#if colaboracion.colaborador?.url_foto}
													<img
														src={colaboracion.colaborador.url_foto}
														alt={colaboracion.colaborador.username}
														class="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm transition-transform group-hover:scale-105"
													/>
												{:else}
													<div
														class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-lg font-bold text-gray-500 shadow-sm transition-transform group-hover:scale-105"
													>
														{colaboracion.colaborador?.username?.charAt(0).toUpperCase()}
													</div>
												{/if}
											</a>

											<div class="min-w-0 flex-1">
												<!-- Nombre y Link -->
												<a
													href="/perfil/{colaboracion.colaborador?.username}"
													class="hover:underline"
												>
													<h3 class="truncate text-base font-semibold text-gray-900">
														{obtenerNombreColaborador(colaboracion.colaborador)}
													</h3>
												</a>

												<!-- Info de Participación -->
												<div
													class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500"
												>
													<Icon src={getTipoIcon(colaboracion)} class="h-4 w-4 text-gray-400" />
													<span>{getTipoLabel(colaboracion)}</span>
													<span>• Postulado el {formatearFecha(colaboracion.created_at)}</span>
												</div>
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

									<div
										class="mt-2 flex w-full gap-3 sm:mt-0 sm:ml-6 sm:w-auto sm:flex-col sm:gap-2"
									>
										<Button
											label={loadingAprobacion === colaboracion.id_colaboracion
												? 'Aprobando...'
												: 'Aprobar'}
											variant="primary"
											size="sm"
											type="button"
											onclick={() => aceptarColaboracion(colaboracion.id_colaboracion || 0)}
											disabled={loadingAprobacion !== null}
											loading={loadingAprobacion === colaboracion.id_colaboracion}
											customClass="flex-1 !min-w-0 sm:flex-none !bg-green-600 hover:!bg-green-700 sm:!min-w-[90px] transition-all duration-200"
										/>
										<Button
											label="Rechazar"
											variant="secondary"
											size="sm"
											type="button"
											onclick={() => mostrarModalParaRechazar(colaboracion.id_colaboracion || 0)}
											disabled={loadingAprobacion !== null}
											customClass="flex-1 !min-w-0 sm:flex-none !bg-red-600 hover:!bg-red-700 !text-white sm:!min-w-[90px] transition-all duration-200"
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
					<div class="flex items-center justify-between gap-2">
						<h2 class="truncate text-lg font-semibold text-gray-900">
							<span class="sm:hidden">Activos</span>
							<span class="hidden sm:inline">Colaboradores activos</span>
						</h2>
						<span
							class="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-green-800"
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
							<h3 class="mb-2 text-lg font-medium text-gray-900">Aún no tenés colaboradores</h3>
							<p class="text-gray-500">
								Los colaboradores aceptados aparecerán aquí. Revisá las solicitudes pendientes para
								encontrar personas dispuestas a ayudar.
							</p>
						</div>
					{:else}
						{#each aprobadas as colaboracion (colaboracion.id_colaboracion)}
							<div class="px-4 py-4 sm:px-6">
								<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div class="flex w-full min-w-0 flex-1 items-center gap-3 sm:gap-4">
										<!-- Avatar Clickeable -->
										<a
											href="/perfil/{colaboracion.colaborador?.username}"
											class="group flex-shrink-0"
										>
											{#if colaboracion.colaborador?.url_foto}
												<img
													src={colaboracion.colaborador.url_foto}
													alt={colaboracion.colaborador.username}
													class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm transition-transform group-hover:scale-105"
												/>
											{:else}
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-base font-bold text-gray-500 shadow-sm transition-transform group-hover:scale-105"
												>
													{colaboracion.colaborador?.username?.charAt(0).toUpperCase()}
												</div>
											{/if}
										</a>

										<div class="min-w-0 flex-1">
											<a
												href="/perfil/{colaboracion.colaborador?.username}"
												class="hover:underline"
											>
												<h3 class="truncate text-sm font-semibold text-gray-900">
													{obtenerNombreColaborador(colaboracion.colaborador)}
												</h3>
											</a>

											<div
												class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500"
											>
												<div class="flex items-center gap-1">
													<Icon src={getTipoIcon(colaboracion)} class="h-3.5 w-3.5 text-gray-400" />
													<span>{getTipoLabel(colaboracion)}</span>
												</div>

												{#if colaboracion.created_at}
													<span class="text-gray-400">
														• Desde {formatearFecha(colaboracion.created_at)}
														({calcularDiasActivo(colaboracion.created_at)} d)
													</span>
												{/if}
											</div>
										</div>
									</div>

									<div class="mt-2 flex items-center justify-start gap-2 sm:mt-0 sm:justify-end">
										<span
											class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
										>
											Activo
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

<!-- Modal de rechazo con animaciones mejoradas -->
{#if mostrarModalRechazo}
	<div
		class="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm duration-200"
		on:click={cerrarModalRechazo}
		on:keydown={(e) => e.key === 'Escape' && cerrarModalRechazo()}
		role="button"
		tabindex="-1"
		aria-label="Cerrar modal"
	>
		<div
			class="animate-in zoom-in-95 slide-in-from-bottom-4 mx-4 w-full max-w-md transform rounded-2xl border border-red-100 bg-white shadow-2xl duration-300"
			on:click|stopPropagation
			role="none"
		>
			<!-- Header con ícono -->
			<div class="border-b border-gray-200 px-6 py-5">
				<div class="flex items-start">
					<div
						class="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100"
					>
						<Icon src={XCircle} class="h-6 w-6 text-red-600" id="modal-title-icon" />
					</div>
					<div class="flex-1">
						<h3 class="text-xl font-semibold text-gray-900" id="modal-title">Rechazar solicitud</h3>
						<p class="mt-1 text-sm text-gray-500">
							Esta acción es irreversible. El colaborador será notificado.
						</p>
					</div>
				</div>
			</div>

			<!-- Body -->
			<div class="px-6 py-5">
				<label for="justificacion-rechazo" class="mb-2 block text-sm font-medium text-gray-900">
					Justificación del rechazo <span class="text-red-500">*</span>
				</label>
				<textarea
					id="justificacion-rechazo"
					bind:value={justificacionRechazo}
					rows="4"
					disabled={loadingRechazo}
					class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
					placeholder="Explicá el motivo del rechazo. Ejemplo: El perfil no cumple con los requisitos específicos del proyecto..."
				></textarea>
				<p class="mt-2 text-xs text-gray-500">
					{justificacionRechazo.trim().length} caracteres
				</p>
			</div>

			<!-- Footer con botones -->
			<div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
				<div class="flex justify-end space-x-3">
					<Button
						label="Cancelar"
						variant="secondary"
						size="sm"
						type="button"
						onclick={cerrarModalRechazo}
						disabled={loadingRechazo}
						customClass="!bg-white !text-gray-700 hover:!bg-gray-100 !border !border-gray-300"
					/>
					<Button
						label={loadingRechazo ? 'Rechazando...' : 'Confirmar rechazo'}
						variant="danger"
						size="sm"
						type="button"
						onclick={confirmarRechazo}
						disabled={!justificacionRechazo.trim() || loadingRechazo}
						loading={loadingRechazo}
						customClass="!min-w-[140px]"
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
