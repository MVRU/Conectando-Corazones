<!--
* Componente: GestionColaboraciones  
* Descripción: Gestión completa de colaboraciones con diseño responsive mejorado
-->

<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { Colaboracion } from '$lib/domain/types/Colaboracion';
	import { formatearFecha } from '$lib/utils/validaciones';
	import { obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
	import { toastStore } from '$lib/stores/toast';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import {
		InboxArrowDown,
		CheckCircle,
		XCircle,
		ChartBar,
		HandRaised,
		Phone,
		Envelope
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		getTipoIcon,
		getTipoLabel,
		getColaboracionesCount,
		getColaboracionesPendientes,
		getColaboracionesAprobadas,
		calcularDiasActivo
	} from '$lib/utils/util-colaboraciones';
	import { slide, fade, scale } from 'svelte/transition';

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

	// Función para obtener iniciales
	function getIniciales(username: string | undefined): string {
		return username ? username.charAt(0).toUpperCase() : '?';
	}
</script>

<svelte:head>
	<title>Solicitudes de colaboración - Conectando Corazones</title>
	<meta name="description" content="Gestioná las solicitudes de colaboración para tus proyectos" />
</svelte:head>

<main class="min-h-screen bg-gray-50/50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-[rgb(var(--base-color))] sm:text-3xl">
				Solicitudes de colaboración
			</h1>
			<p class="mt-2 text-gray-500">Gestioná quién se une a tus proyectos de impacto social.</p>
		</div>

		<!-- Selector de proyecto y Estadísticas -->
		{#if proyectos.length > 1}
			<section class="mb-8 space-y-6">
				<!-- Selector -->
				<div class="relative max-w-sm">
					<label for="project-select" class="mb-1 ml-1 block text-sm font-medium text-gray-700"
						>Proyecto seleccionado</label
					>
					<div class="relative">
						<select
							id="project-select"
							bind:value={proyectoSeleccionadoId}
							class="w-full cursor-pointer appearance-none rounded-xl border-gray-200 bg-white py-3 pr-10 pl-4 text-gray-900 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						>
							{#each proyectos as proyecto}
								<option value={proyecto.id_proyecto}>
									{proyecto.titulo}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Estadísticas: Mobile (Compactas) vs Desktop (Cards Detalladas) -->
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
					<!-- Pendientes -->
					<div
						class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-orange-50 p-2 text-orange-600">
								<Icon src={InboxArrowDown} class="h-6 w-6" />
							</div>
							<div>
								<p class="text-2xl font-bold text-gray-900">
									{getColaboracionesPendientes(proyectoSeleccionado)}
								</p>
								<p class="hidden text-sm font-medium text-gray-500 sm:block">Pendientes</p>
								<p class="text-xs text-gray-400 sm:hidden">Pend.</p>
							</div>
						</div>
					</div>

					<!-- Aprobadas -->
					<div
						class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-green-50 p-2 text-green-600">
								<Icon src={CheckCircle} class="h-6 w-6" />
							</div>
							<div>
								<p class="text-2xl font-bold text-gray-900">
									{getColaboracionesAprobadas(proyectoSeleccionado)}
								</p>
								<p class="hidden text-sm font-medium text-gray-500 sm:block">Activas</p>
								<p class="text-xs text-gray-400 sm:hidden">Act.</p>
							</div>
						</div>
					</div>

					<!-- Rechazadas -->
					<div
						class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-red-50 p-2 text-red-600">
								<Icon src={XCircle} class="h-6 w-6" />
							</div>
							<div>
								<p class="text-2xl font-bold text-gray-900">
									{getColaboracionesRechazadas(proyectoSeleccionado)}
								</p>
								<p class="hidden text-sm font-medium text-gray-500 sm:block">Rechazadas</p>
								<p class="text-xs text-gray-400 sm:hidden">Rech.</p>
							</div>
						</div>
					</div>

					<!-- Total -->
					<div
						class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-blue-50 p-2 text-blue-600">
								<Icon src={ChartBar} class="h-6 w-6" />
							</div>
							<div>
								<p class="text-2xl font-bold text-gray-900">
									{getColaboracionesCount(proyectoSeleccionado)}
								</p>
								<p class="hidden text-sm font-medium text-gray-500 sm:block">Total</p>
								<p class="text-xs text-gray-400 sm:hidden">Total</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Info extra desktop -->
				<div class="hidden gap-6 pl-1 text-sm text-gray-500 lg:flex">
					{#if proyectoSeleccionado.fecha_fin_tentativa}
						<p>
							<span class="font-medium text-gray-700">Finalización tentativa:</span>
							{formatearFecha(proyectoSeleccionado.fecha_fin_tentativa)}
						</p>
					{/if}
					{#if proyectoSeleccionado.created_at}
						<p>
							<span class="font-medium text-gray-700">Creado el:</span>
							{formatearFecha(proyectoSeleccionado.created_at)}
						</p>
					{/if}
				</div>
			</section>
		{/if}

		<!-- Layout Columnas -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
			<!-- Solicitudes Pendientes -->
			<section class="flex flex-col gap-4">
				<div class="flex items-center justify-between px-1">
					<h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900">
						Solicitudes pendientes
						{#if pendientes.length > 0}
							<span
								class="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-100 px-1 text-xs font-semibold text-orange-700"
							>
								{pendientes.length}
							</span>
						{/if}
					</h2>
				</div>

				{#if pendientes.length === 0}
					<div
						class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
					>
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-900/5"
						>
							<Icon src={InboxArrowDown} class="h-6 w-6 text-gray-400" />
						</div>
						<h3 class="mt-2 text-sm font-semibold text-gray-900">Sin solicitudes nuevas</h3>
						<p class="mt-1 text-sm text-gray-500">
							Cuando alguien quiera unirse a tu proyecto, aparecerá aquí.
						</p>
					</div>
				{:else}
					<div class="space-y-4">
						{#each pendientes as colaboracion (colaboracion.id_colaboracion)}
							<div
								class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
							>
								<div class="p-5">
									<div class="flex items-start gap-4">
										<!-- Avatar -->
										<div class="shrink-0">
											{#if colaboracion.colaborador?.url_foto}
												<img
													src={colaboracion.colaborador.url_foto}
													alt={colaboracion.colaborador.username}
													class="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
												/>
											{:else}
												<div
													class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-lg font-bold text-gray-600 shadow-sm"
												>
													{getIniciales(colaboracion.colaborador?.username)}
												</div>
											{/if}
										</div>

										<!-- Content -->
										<div class="min-w-0 flex-1">
											<div
												class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
											>
												<a
													href="/perfil/{colaboracion.colaborador?.username}"
													class="truncate font-semibold text-gray-900 hover:underline"
												>
													{obtenerNombreColaborador(colaboracion.colaborador)}
												</a>
												<span class="text-xs text-gray-400 tabular-nums">
													{formatearFecha(colaboracion.created_at)}
												</span>
											</div>

											<div class="mt-1 flex items-center gap-2 text-sm text-gray-600">
												<Icon src={getTipoIcon(colaboracion)} class="h-4 w-4 text-gray-400" />
												<span>{getTipoLabel(colaboracion)}</span>
											</div>

											{#if colaboracion.mensaje}
												<div
													class="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600 italic"
												>
													"{colaboracion.mensaje}"
												</div>
											{/if}

											<div class="mt-3 hidden flex-col gap-1 text-sm text-gray-500 sm:flex">
												{#if obtenerEmailColaborador(colaboracion)}
													<div class="flex items-center gap-2">
														<Icon src={Envelope} class="h-4 w-4 text-gray-400" />
														<span class="truncate">{obtenerEmailColaborador(colaboracion)}</span>
													</div>
												{/if}
												{#if obtenerTelefonoColaborador(colaboracion)}
													<div class="flex items-center gap-2">
														<Icon src={Phone} class="h-4 w-4 text-gray-400" />
														<span>{obtenerTelefonoColaborador(colaboracion)}</span>
													</div>
												{/if}
											</div>
										</div>
									</div>

									<!-- Actions -->
									<div class="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
										<Button
											label="Rechazar"
											variant="secondary"
											size="sm"
											type="button"
											onclick={() => mostrarModalParaRechazar(colaboracion.id_colaboracion || 0)}
											disabled={loadingAprobacion !== null}
											customClass="!w-full justify-center"
										/>
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
											customClass="!w-full justify-center"
										/>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Colaboradores Activos -->
			<section class="flex flex-col gap-4">
				<div class="flex items-center justify-between px-1">
					<h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900">
						Colaboradores activos
						{#if aprobadas.length > 0}
							<span
								class="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-green-100 px-1 text-xs font-semibold text-green-700"
							>
								{aprobadas.length}
							</span>
						{/if}
					</h2>
				</div>

				{#if aprobadas.length === 0}
					<div
						class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
					>
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-900/5"
						>
							<Icon src={HandRaised} class="h-6 w-6 text-gray-400" />
						</div>
						<h3 class="mt-2 text-sm font-semibold text-gray-900">Aún sin colaboradores</h3>
						<p class="mt-1 text-sm text-gray-500">
							Los voluntarios aceptados aparecerán en esta lista.
						</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each aprobadas as colaboracion (colaboracion.id_colaboracion)}
							<div
								class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
							>
								<div class="flex items-center gap-4">
									<!-- Avatar Small -->
									<a href="/perfil/{colaboracion.colaborador?.username}" class="relative shrink-0">
										{#if colaboracion.colaborador?.url_foto}
											<img
												src={colaboracion.colaborador.url_foto}
												alt={colaboracion.colaborador.username}
												class="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white"
											/>
										{:else}
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-sm font-bold text-blue-600 shadow-sm"
											>
												{getIniciales(colaboracion.colaborador?.username)}
											</div>
										{/if}
										<div
											class="absolute -right-1 -bottom-1 rounded-full border-2 border-white bg-green-500 p-0.5"
										>
											<div class="h-1.5 w-1.5 rounded-full bg-white"></div>
										</div>
									</a>

									<div class="min-w-0 flex-1">
										<div class="flex items-center justify-between">
											<a
												href="/perfil/{colaboracion.colaborador?.username}"
												class="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600"
											>
												{obtenerNombreColaborador(colaboracion.colaborador)}
											</a>
											{#if colaboracion.created_at}
												<span
													class="hidden items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 sm:inline-flex"
												>
													{calcularDiasActivo(colaboracion.created_at)} días
												</span>
											{/if}
										</div>
										<div class="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
											<span>{getTipoLabel(colaboracion)}</span>
											<span class="text-gray-300">•</span>
											<span>Desde {formatearFecha(colaboracion.created_at)}</span>
										</div>
									</div>

									<!-- Desktop Contacts -->
									<div class="hidden items-center gap-2 sm:flex">
										{#if obtenerEmailColaborador(colaboracion)}
											<a
												href="mailto:{obtenerEmailColaborador(colaboracion)}"
												class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
												title="Enviar email"
											>
												<Icon src={Envelope} class="h-5 w-5" />
											</a>
										{/if}
										{#if obtenerTelefonoColaborador(colaboracion)}
											<a
												href="tel:{obtenerTelefonoColaborador(colaboracion)}"
												class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
												title="Llamar"
											>
												<Icon src={Phone} class="h-5 w-5" />
											</a>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</div>
</main>

<!-- Modal de rechazo -->
{#if mostrarModalRechazo}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
		on:click={cerrarModalRechazo}
		on:keydown={(e) => e.key === 'Escape' && cerrarModalRechazo()}
		role="button"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
	>
		<div class="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"></div>

		<div
			class="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
			on:click|stopPropagation
			role="none"
			transition:scale={{ start: 0.95, duration: 200 }}
		>
			<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div class="sm:flex sm:items-start">
					<div
						class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
					>
						<Icon src={XCircle} class="h-6 w-6 text-red-600" />
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-base leading-6 font-semibold text-gray-900" id="modal-title">
							Rechazar solicitud
						</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								¿Estás seguro que querés rechazar esta colaboración? Esta acción enviará una
								notificación al usuario.
							</p>
						</div>
					</div>
				</div>

				<div class="mt-4">
					<label for="justificacion" class="block text-sm font-medium text-gray-700"
						>Motivo (requerido)</label
					>
					<textarea
						id="justificacion"
						bind:value={justificacionRechazo}
						rows="3"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
						placeholder="Por ejemplo: El perfil no coincide con lo buscado..."
					></textarea>
				</div>
			</div>

			<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
				<Button
					label={loadingRechazo ? 'Rechazando...' : 'Rechazar solicitud'}
					variant="danger"
					size="sm"
					type="button"
					onclick={confirmarRechazo}
					disabled={!justificacionRechazo.trim() || loadingRechazo}
					loading={loadingRechazo}
					customClass="!w-full sm:!w-auto sm:!ml-3 justify-center !bg-red-600 hover:!bg-red-700"
				/>
				<Button
					label="Cancelar"
					variant="secondary"
					size="sm"
					type="button"
					onclick={cerrarModalRechazo}
					disabled={loadingRechazo}
					customClass="!w-full sm:!w-auto mt-3 sm:mt-0 justify-center !bg-white !text-gray-900 !ring-1 !ring-inset !ring-gray-300 hover:!bg-gray-50"
				/>
			</div>
		</div>
	</div>
{/if}
