<script lang="ts">
	import { isAdmin } from '$lib/stores/auth';
	import type { Reporte } from '$lib/domain/entities/Reporte';
	import { fly } from 'svelte/transition';
	import { User, Folder, AlertCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/stores';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import { toastStore } from '$lib/stores/toast';

	export let data;

	$: reportes = data.reportes;
	$: totalReportes = data.total;

	$: estadoFilter = data.filtros.estado || 'todos';
	$: tipoFilter = data.filtros.tipo_objeto || 'todos';

	// Estado del Modal de Resolución
	let modalResolucionAbierto = false;
	let reporteSeleccionado: Reporte | null = null;
	let resolucionComentario = '';
	let resolucionEstado: 'verificado' | 'desestimado' = 'verificado';
	let errorValidacion = '';
	let enviandoResolucion = false;

	// Paginación
	$: itemsPerPage = data.filtros.limit;
	$: totalPages = itemsPerPage ? Math.ceil(totalReportes / itemsPerPage) : 1;
	$: currentPage = Math.floor(data.filtros.offset / (itemsPerPage || 1)) + 1;

	// Navegación reactiva cuando cambian los filtros
	function updateQuery(paramsToUpdate: Record<string, string | null>) {
		const params = new URLSearchParams($page.url.searchParams);
		for (const key in paramsToUpdate) {
			const value = paramsToUpdate[key];
			if (value !== null) params.set(key, value);
			else params.delete(key);
		}
		params.set('offset', '0');
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function formatDate(date: Date | undefined) {
		if (!date) return 'N/A';
		return new Intl.DateTimeFormat('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	}

	function getEstadoBadgeColor(estado: string | undefined) {
		switch (estado) {
			case 'pendiente':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'verificado':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'desestimado':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function getEstadoBorderColor(estado: string | undefined) {
		switch (estado) {
			case 'pendiente':
				return 'border-l-yellow-400';
			case 'verificado':
				return 'border-l-green-500';
			case 'desestimado':
				return 'border-l-red-500';
			default:
				return 'border-l-gray-300';
		}
	}

	function abrirModalResolucion(reporte: Reporte) {
		reporteSeleccionado = reporte;
		resolucionComentario = '';
		resolucionEstado = 'verificado';
		errorValidacion = '';
		modalResolucionAbierto = true;
	}

	function cerrarModalResolucion() {
		modalResolucionAbierto = false;
		reporteSeleccionado = null;
	}

	async function confirmarResolucion() {
		if (!reporteSeleccionado || enviandoResolucion) return;
		const comentarioTrim = resolucionComentario.trim();
		if (comentarioTrim.length < 20) {
			errorValidacion = 'El comentario debe tener al menos 20 caracteres.';
			return;
		}
		if (comentarioTrim.length > 800) {
			errorValidacion = 'El comentario no puede superar los 800 caracteres.';
			return;
		}

		enviandoResolucion = true;
		try {
			const res = await fetch(`/api/reportes/${reporteSeleccionado.id_reporte}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					estado: resolucionEstado,
					comentario: resolucionComentario
				})
			});

			const result = await res.json();
			if (!res.ok || !result.success) {
				throw new Error(result.error || 'Error al procesar la resolución.');
			}

			toastStore.show({
				message: `Reporte #${reporteSeleccionado.id_reporte} marcado como ${resolucionEstado}.`,
				variant: 'success'
			});

			// Recargar datos actuales
			goto($page.url.pathname + $page.url.search, { invalidateAll: true });
			cerrarModalResolucion();
		} catch (error: any) {
			toastStore.show({
				message: error.message || 'Error al conectar con el servidor.',
				variant: 'error'
			});
		} finally {
			enviandoResolucion = false;
		}
	}

	function goToPage(pageNumber: number) {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			const params = new URLSearchParams($page.url.searchParams);
			params.set('offset', ((pageNumber - 1) * itemsPerPage).toString());
			goto(`?${params.toString()}`, { noScroll: false });
		}
	}
</script>

<svelte:head>
	<title>Reportes - Conectando Corazones</title>
</svelte:head>

<main class="w-full bg-gradient-to-b from-gray-50 to-white px-0 py-20 md:px-12 lg:px-28">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-16 text-center">
		<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
			{#if $isAdmin}
				Gestión de reportes
			{:else}
				Mis reportes
			{/if}
		</h1>
		<p class="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
			{#if $isAdmin}
				Administrá y revisá los reportes de la plataforma.
			{:else}
				Consultá el estado y resolución de los reportes que has realizado.
			{/if}
		</p>
	</div>

	<!-- Contenedor principal -->
	<div class="animate-fade-in-up mx-auto w-full max-w-5xl">
		{#if data.error}
			<div
				class="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 shadow-sm"
			>
				<AlertCircle class="h-5 w-5" />
				<p class="text-sm font-medium">{data.error}</p>
			</div>
		{/if}

		{#if $navigating}
			<div class="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
				<svg
					class="h-4 w-4 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				Cargando...
			</div>
		{/if}

		<!-- Filtros y Controles -->
		<div
			class="mb-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row"
		>
			<div class="flex w-full items-center gap-3 sm:w-auto">
				<label for="status-filter" class="text-base font-bold whitespace-nowrap text-gray-700"
					>Estado:</label
				>
				<select
					id="status-filter"
					bind:value={estadoFilter}
					on:change={() => updateQuery({ estado: estadoFilter })}
					class="form-select focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border-gray-300 py-2.5 text-base font-medium sm:w-64"
				>
					<option value="todos">Todos los estados</option>
					<option value="pendiente">Pendiente</option>
					<option value="verificado">Verificado</option>
					<option value="desestimado">Desestimado</option>
				</select>
			</div>

			{#if $isAdmin}
				<div class="flex w-full items-center gap-3 sm:w-auto">
					<label for="type-filter" class="text-base font-bold whitespace-nowrap text-gray-700"
						>Tipo:</label
					>
					<select
						id="type-filter"
						bind:value={tipoFilter}
						on:change={() => updateQuery({ tipo_objeto: tipoFilter })}
						class="form-select focus:ring-primary-500 focus:border-primary-500 w-full rounded-xl border-gray-300 py-2.5 text-base font-medium sm:w-64"
					>
						<option value="todos">Todos los tipos</option>
						<option value="Proyecto">Proyectos</option>
						<option value="Usuario">Usuarios</option>
					</select>
				</div>
			{/if}
		</div>

		<!-- Lista de Reportes -->
		{#if reportes.length > 0}
			<div class="space-y-4">
				{#each reportes as reporte (reporte.id_reporte)}
					<div
						in:fly={{ y: 20, duration: 300 }}
						class={`overflow-hidden rounded-l-md rounded-r-xl border-y border-r border-l-4 border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${getEstadoBorderColor(reporte.estado)}`}
					>
						<div class="p-2 md:p-8">
							<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
								<div>
									<div class="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
										<!-- Fila superior: foto + nombre -->
										<div class="flex items-center gap-4">
											{#if reporte.tipo_objeto === 'Usuario'}
												{#if reporte.imagen_objeto}
													<img
														src={reporte.imagen_objeto}
														alt="Foto de perfil"
														class="h-12 w-12 flex-shrink-0 rounded-full object-cover shadow-sm ring-2 ring-gray-100"
													/>
												{:else}
													<User class="h-6 w-6 text-gray-400" />
												{/if}
											{:else if reporte.imagen_objeto}
												<img
													src={reporte.imagen_objeto}
													alt="Imagen del proyecto"
													class="h-12 w-12 flex-shrink-0 rounded-xl object-cover shadow-sm ring-2 ring-gray-100"
												/>
											{:else}
												<Folder class="h-6 w-6 text-gray-400" />
											{/if}

											<h3 class="min-w-0 text-xl font-bold tracking-tight text-gray-900">
												{#if reporte.tipo_objeto === 'Proyecto'}
													<a
														href={`/proyectos/${reporte.id_objeto}`}
														class="hover:text-primary-600 transition-colors hover:underline"
													>
														Proyecto: {reporte.nombre_objeto ?? `ID ${reporte.id_objeto}`}
													</a>
												{:else if reporte.tipo_objeto === 'Usuario'}
													<a
														href={reporte.nombre_objeto
															? `/perfil/${reporte.nombre_objeto}`
															: `/perfil/${reporte.id_objeto}`}
														class="hover:text-primary-600 transition-colors hover:underline"
													>
														Usuario: {reporte.nombre_objeto ?? `ID ${reporte.id_objeto}`}
													</a>
												{:else}
													{reporte.tipo_objeto}: {reporte.nombre_objeto ?? `ID ${reporte.id_objeto}`}
												{/if}
											</h3>
										</div>

										<!-- Badge de estado: debajo de la foto+nombre, alineado con el texto -->
										<div class="pl-[64px] sm:pl-0">
											<span
												class={`inline-block rounded-full border px-3 py-1 text-sm font-semibold shadow-sm ${getEstadoBadgeColor(reporte.estado)}`}
											>
												{(reporte.estado ?? 'pendiente').charAt(0).toUpperCase() +
													(reporte.estado ?? 'pendiente').slice(1)}
											</span>
										</div>
									</div>
									<p class="pl-0 text-base text-gray-500 md:pl-[64px]">
										Enviado el {formatDate(reporte.created_at)}
									</p>

									{#if $isAdmin}
										<div class="mt-2 ml-0 flex items-center gap-2 text-base text-gray-600 md:ml-[64px]">
											<span class="font-medium">Reportado por:</span>
											<a
												href={reporte.reportante?.username
													? `/perfil/${reporte.reportante.username}`
													: '#'}
												class="flex min-w-0 items-center gap-2 rounded-full bg-gray-100 px-3 py-1 transition-colors hover:bg-gray-200"
											>
												{#if reporte.reportante?.url_foto}
													<img
														src={reporte.reportante.url_foto}
														alt="Foto de perfil"
														class="h-6 w-6 rounded-full object-cover shadow-sm"
													/>
												{:else}
													<User class="h-4 w-4 text-gray-500" />
												{/if}
												<span class="min-w-0 truncate font-bold text-gray-800"
													>{reporte.reportante?.username ?? `ID ${reporte.reportante_id}`}</span
												>
												<span class="text-xs text-gray-400">ID: {reporte.reportante_id}</span>
											</a>
										</div>
									{/if}
								</div>
							</div>

							<div class="mt-8 grid gap-4 md:grid-cols-2 md:gap-8">
								<div class="pl-0 md:pl-[64px]">
									<div class="mb-6">
										<span
											class="mb-2 block text-sm font-bold tracking-widest text-gray-400 uppercase"
											>Motivo del Reporte</span
										>
										<p class="text-lg font-semibold text-gray-800">{reporte.motivo}</p>
									</div>
									<div>
										<span
											class="mb-2 block text-sm font-bold tracking-widest text-gray-400 uppercase"
											>Descripción Detallada</span
										>
										<p class="break-words text-lg leading-relaxed text-gray-700">{reporte.descripcion}</p>
									</div>
								</div>

								<div class="flex flex-col gap-4">
									{#if reporte.estado === 'verificado' || reporte.estado === 'desestimado'}
										<div class="h-full rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm md:p-6">
											<h4 class="mb-4 flex items-center gap-2 break-words text-lg font-bold text-gray-900">
												<AlertCircle class="text-primary-500 h-5 w-5" />
												Resolución Administrativa
											</h4>
											{#if reporte.fecha_resolucion}
												<p class="mb-2 break-all text-xs text-gray-500">
													Finalizado el {formatDate(reporte.fecha_resolucion)}
													{#if reporte.admin_id}
														por <span class="font-medium text-gray-700"
															>{reporte.admin?.username ?? `ID ${reporte.admin_id}`}</span
														>
													{/if}
												</p>
											{/if}
											{#if reporte.comentario_resolucion}
												<p class="break-all text-sm text-gray-700 italic">
													"{reporte.comentario_resolucion}"
												</p>
											{:else}
												<p class="text-sm text-gray-500 italic">Sin comentarios adicionales.</p>
											{/if}
										</div>
									{:else}
										<div
											class="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/50 p-6 shadow-sm"
										>
											<div class="mb-3 rounded-full bg-blue-100 p-3">
												<svg
													class="h-6 w-6 animate-pulse text-blue-600"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</div>
											<h4 class="mb-1 text-base font-bold text-gray-900">En revisión</h4>
											<p class="text-center text-sm text-gray-500">
												El reporte ha sido recibido y está esperando por su resolución.
											</p>

											{#if $isAdmin && reporte.estado === 'pendiente'}
												<button
													on:click={() => abrirModalResolucion(reporte)}
													class="bg-primary hover:bg-primary-hover mt-4 flex items-center gap-2 rounded-xl px-6 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-5 w-5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2.5"
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													Resolver reporte ahora
												</button>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Paginación -->
			{#if totalPages > 1}
				<div class="mt-8 flex items-center justify-center gap-3">
					<button
						disabled={currentPage === 1}
						class="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-base font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md disabled:opacity-40 disabled:shadow-none"
						on:click={() => goToPage(currentPage - 1)}
					>
						Anterior
					</button>

					{#each Array(totalPages) as _, i}
						<button
							class={`h-11 w-11 rounded-xl text-base font-bold shadow-sm transition-all ${
								currentPage === i + 1
									? 'bg-primary hover:bg-primary-hover text-white'
									: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
							}`}
							on:click={() => goToPage(i + 1)}
						>
							{i + 1}
						</button>
					{/each}

					<button
						disabled={currentPage === totalPages}
						class="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-base font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md disabled:opacity-40 disabled:shadow-none"
						on:click={() => goToPage(currentPage + 1)}
					>
						Siguiente
					</button>
				</div>
				<div class="mt-4 text-center text-sm font-medium text-gray-500">
					Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalReportes)} - {Math.min(
						currentPage * itemsPerPage,
						totalReportes
					)} de <span class="font-bold text-gray-800">{totalReportes}</span> resultados
				</div>
			{/if}
		{:else}
			<div
				class="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-24 text-center shadow-sm"
			>
				<div
					class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-50/50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10 text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900">
					{#if $isAdmin}
						No se encontraron reportes
					{:else}
						Todavía no has realizado reportes
					{/if}
				</h3>
				<p class="mx-auto mt-3 max-w-md text-lg text-gray-500">
					{#if $isAdmin}
						No hay reportes que coincidan con los filtros seleccionados o el historial está vacío.
					{:else}
						Aquí aparecerán los reportes que realices sobre proyectos o usuarios de la comunidad.
					{/if}
				</p>
				{#if estadoFilter !== 'todos'}
					<button
						class="text-primary-600 hover:text-primary-700 mt-4 text-sm font-medium"
						on:click={() => updateQuery({ estado: null })}
					>
						Limpiar filtros
					</button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Modal de Resolución de Reporte -->
	<Modal
		abierto={modalResolucionAbierto}
		titulo="Resolver reporte"
		on:cerrar={cerrarModalResolucion}
		anchoMaximo="max-w-md"
	>
		<div class="space-y-4">
			<div>
				<span class="block text-sm font-medium text-gray-700">Acción</span>
				<div class="mt-2 flex gap-4">
					<label class="flex items-center gap-2">
						<input
							type="radio"
							name="estado"
							value="verificado"
							bind:group={resolucionEstado}
							class="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
						/>
						<span class="text-sm text-gray-700">Verificar reporte</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="radio"
							name="estado"
							value="desestimado"
							bind:group={resolucionEstado}
							class="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
						/>
						<span class="text-sm text-gray-700">Desestimar reporte</span>
					</label>
				</div>
			</div>

			<div>
				<label for="comentario" class="block text-sm font-medium text-gray-700"
					>Comentario de resolución <span class="text-red-500">*</span></label
				>
				<textarea
					id="comentario"
					bind:value={resolucionComentario}
					rows="4"
					minlength="20"
					maxlength="800"
					class="focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					placeholder="Explica detalladamente la resolución (mínimo 20 caracteres)..."
				></textarea>
				<div class="mt-2 flex items-center justify-between">
					<p
						class="text-xs transition-colors duration-200 {resolucionComentario.length < 20
							? 'text-amber-600'
							: resolucionComentario.length > 800
								? 'text-red-600'
								: 'text-gray-500'}"
					>
						Mínimo 20 caracteres • Máximo 800 • Caracteres: {resolucionComentario.length}
					</p>
					{#if resolucionComentario.length > 0}
						<p class="text-xs text-gray-400">Máximo: 800</p>
					{/if}
				</div>
				{#if errorValidacion}
					<p class="mt-1 text-sm text-red-600">{errorValidacion}</p>
				{/if}
			</div>
		</div>

		<div slot="footer" class="flex flex-col-reverse justify-end gap-2 sm:flex-row">
			<button
				type="button"
				class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
				on:click={cerrarModalResolucion}
			>
				Cancelar
			</button>
			<button
				type="button"
				class={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm ${
					resolucionEstado === 'verificado'
						? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
						: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
				}`}
				on:click={confirmarResolucion}
			>
				{resolucionEstado === 'verificado' ? 'Confirmar verificación' : 'Desestimar reporte'}
			</button>
		</div>
	</Modal>
</main>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>
