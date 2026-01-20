<script lang="ts">
	import { usuario as user, isAdmin, isInstitucion, isColaborador } from '$lib/stores/auth';
	import { mockReportes } from '$lib/mocks/mock-reportes';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { Reporte } from '$lib/types/Reporte';
	import { fly } from 'svelte/transition';
	import { User, Folder, Trash2, AlertCircle } from 'lucide-svelte';

	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import { toastStore } from '$lib/stores/toast';

	let filteredReportes: Reporte[] = [];
	let estadoFilter: 'todos' | 'pendiente' | 'resuelto' | 'rechazado' = 'todos';
	let sortOrder: 'recent' | 'oldest' = 'recent';

	// Estado del Modal de Resolución
	let modalResolucionAbierto = false;
	let reporteSeleccionado: Reporte | null = null;
	let resolucionComentario = '';
	let resolucionEstado: 'resuelto' | 'rechazado' = 'resuelto';
	let errorValidacion = '';

	// Estado del Modal de Retiro
	let modalRetiroAbierto = false;
	let reporteARetirar: Reporte | null = null;

	// Paginación
	let currentPage = 1;
	const itemsPerPage = 10;
	let paginatedReportes: Reporte[] = [];

	// Filtra reportes reactivamente cuando cambia el usuario o los filtros
	$: {
		let result = [];
		if ($user) {
			if ($isAdmin) {
				result = [...mockReportes];
			} else {
				result = mockReportes.filter((r) => r.reportante_id === $user?.id_usuario);
			}

			// Filtrar por estado
			if (estadoFilter !== 'todos') {
				result = result.filter((r) => r.estado === estadoFilter);
			}

			// Ordenar
			result.sort((a, b) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
			});

			filteredReportes = result;
		}
	}

	$: totalPages = Math.ceil(filteredReportes.length / itemsPerPage);
	$: {
		if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
		if (currentPage < 1) currentPage = 1;

		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		paginatedReportes = filteredReportes.slice(start, end);
	}

	$: if (estadoFilter || sortOrder) {
		currentPage = 1;
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
			case 'resuelto':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'rechazado':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function getEstadoBorderColor(estado: string | undefined) {
		switch (estado) {
			case 'pendiente':
				return 'border-l-yellow-400';
			case 'resuelto':
				return 'border-l-green-500';
			case 'rechazado':
				return 'border-l-red-500';
			default:
				return 'border-l-gray-300';
		}
	}

	function getNombreUsuario(id: number | null | undefined): string {
		if (!id) return 'Desconocido';
		const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === id);
		return usuario ? usuario.username : `ID ${id}`;
	}

	function getTituloObjeto(tipo: string, id: number): string {
		if (tipo === 'Proyecto') {
			const proyecto = mockProyectos.find((p) => p.id_proyecto === id);
			return proyecto ? proyecto.titulo : `Proyecto ID ${id}`;
		} else if (tipo === 'Usuario') {
			return getNombreUsuario(id);
		}
		return `${tipo} #${id}`;
	}

	function abrirModalResolucion(reporte: Reporte) {
		reporteSeleccionado = reporte;
		resolucionComentario = '';
		resolucionEstado = 'resuelto';
		errorValidacion = '';
		modalResolucionAbierto = true;
	}

	function cerrarModalResolucion() {
		modalResolucionAbierto = false;
		reporteSeleccionado = null;
	}

	function confirmarResolucion() {
		if (!reporteSeleccionado) return;
		if (!resolucionComentario.trim()) {
			errorValidacion = 'El comentario de resolución es obligatorio.';
			return;
		}

		const index = mockReportes.findIndex((r) => r.id_reporte === reporteSeleccionado?.id_reporte);
		if (index !== -1) {
			const reporteActualizado = {
				...mockReportes[index],
				estado: resolucionEstado,
				fecha_resolucion: new Date(),
				admin_id: $user?.id_usuario || 1,
				comentario_resolucion: resolucionComentario
			};
			mockReportes[index] = reporteActualizado;

			if ($isAdmin) {
				filteredReportes = [...mockReportes];
			}

			reporteSeleccionado = reporteActualizado;

			toastStore.show({
				message: `El reporte ha sido ${resolucionEstado === 'resuelto' ? 'resuelto' : 'rechazado'} correctamente.`,
				variant: 'success'
			});
		}

		cerrarModalResolucion();
	}

	function abrirModalRetiro(reporte: Reporte) {
		if (!$isColaborador && !$isInstitucion) return;
		reporteARetirar = reporte;
		modalRetiroAbierto = true;
	}

	function cerrarModalRetiro() {
		modalRetiroAbierto = false;
		reporteARetirar = null;
	}

	function confirmarRetiro() {
		if (!reporteARetirar) return;

		const index = mockReportes.findIndex((r) => r.id_reporte === reporteARetirar?.id_reporte);
		if (index !== -1) {
			mockReportes.splice(index, 1);
			filteredReportes = filteredReportes.filter(
				(r) => r.id_reporte !== reporteARetirar?.id_reporte
			);
			toastStore.show({
				message: 'El reporte ha sido retirado correctamente.',
				variant: 'success'
			});
		}
		cerrarModalRetiro();
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Reportes - Conectando Corazones</title>
</svelte:head>

<main class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:px-12 lg:px-28">
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
		<!-- Filtros y Controles -->
		<div
			class="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row"
		>
			<div class="flex w-full items-center gap-2 sm:w-auto">
				<label for="status-filter" class="text-sm font-medium whitespace-nowrap text-gray-700"
					>Estado:</label
				>
				<select
					id="status-filter"
					bind:value={estadoFilter}
					class="form-select focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border-gray-300 text-sm sm:w-48"
				>
					<option value="todos">Todos</option>
					<option value="pendiente">Pendiente</option>
					<option value="resuelto">Resuelto</option>
					<option value="rechazado">Rechazado</option>
				</select>
			</div>

			<div class="flex w-full items-center gap-2 sm:w-auto">
				<label for="sort-order" class="text-sm font-medium whitespace-nowrap text-gray-700"
					>Orden:</label
				>
				<select
					id="sort-order"
					bind:value={sortOrder}
					class="form-select focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border-gray-300 text-sm sm:w-48"
				>
					<option value="recent">Más recientes</option>
					<option value="oldest">Más antiguos</option>
				</select>
			</div>
		</div>

		<!-- Lista de Reportes -->
		{#if paginatedReportes.length > 0}
			<div class="space-y-4">
				{#each paginatedReportes as reporte (reporte.id_reporte)}
					<div
						in:fly={{ y: 20, duration: 300 }}
						class={`overflow-hidden rounded-l-md rounded-r-xl border-y border-r border-l-4 border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${getEstadoBorderColor(reporte.estado)}`}
					>
						<div class="p-6">
							<div class="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row">
								<div>
									<div class="mb-1 flex items-center gap-2">
										{#if reporte.tipo_objeto === 'Usuario'}
											<User class="h-5 w-5 text-gray-500" />
										{:else}
											<Folder class="h-5 w-5 text-gray-500" />
										{/if}

										<h3 class="text-lg font-semibold text-gray-900">
											{#if $isAdmin}
												Reporte #{reporte.id_reporte}
											{:else}
												<!-- Para usuarios no admin, mostrar info más amigable -->
												{#if reporte.tipo_objeto === 'Proyecto'}
													Sobre Proyecto: <span class="text-primary-600"
														>{getTituloObjeto(reporte.tipo_objeto, reporte.id_objeto)}</span
													>
												{:else if reporte.tipo_objeto === 'Usuario'}
													Sobre Usuario: <span class="text-primary-600"
														>{getTituloObjeto(reporte.tipo_objeto, reporte.id_objeto)}</span
													>
												{:else}
													Reporte #{reporte.id_reporte}
												{/if}
											{/if}
										</h3>
										<span
											class={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getEstadoBadgeColor(reporte.estado)}`}
										>
											{(reporte.estado ?? 'pendiente').charAt(0).toUpperCase() +
												(reporte.estado ?? 'pendiente').slice(1)}
										</span>
									</div>
									<p class="pl-7 text-sm text-gray-500">
										Enviado el {formatDate(reporte.created_at)}
									</p>

									{#if $isAdmin}
										<div class="mt-1 ml-7 flex items-center gap-1 text-sm text-gray-600">
											<span class="font-medium">Reportado por:</span>
											<div class="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5">
												<User class="h-3 w-3 text-gray-500" />
												{getNombreUsuario(reporte.reportante_id)}
												<span class="text-xs text-gray-400">(ID: {reporte.reportante_id})</span>
											</div>
										</div>
									{/if}
								</div>

								{#if !$isAdmin && reporte.estado === 'pendiente'}
									<button
										on:click={() => abrirModalRetiro(reporte)}
										class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
										title="Retirar reporte"
									>
										<Trash2 class="h-4 w-4" />
										<span class="hidden sm:inline">Retirar reporte</span>
									</button>
								{/if}
							</div>

							<div class="grid gap-6 md:grid-cols-2">
								<div class="pl-7">
									<div class="mb-3">
										<span
											class="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase"
											>Motivo</span
										>
										<p class="font-medium text-gray-900">{reporte.motivo}</p>
									</div>
									<div>
										<span
											class="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase"
											>Descripción</span
										>
										<p class="text-sm leading-relaxed text-gray-700">{reporte.descripcion}</p>
									</div>

									{#if $isAdmin}
										<div class="mt-3">
											<span
												class="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase"
												>Objeto Reportado</span
											>
											<div class="flex items-center gap-2">
												<span
													class="badge rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
												>
													{reporte.tipo_objeto}
												</span>
												{#if $isAdmin}
													<span class="text-xs text-gray-500">
														ID: {reporte.id_objeto} - {getTituloObjeto(
															reporte.tipo_objeto,
															reporte.id_objeto
														)}
													</span>
												{:else}
													<span class="text-xs font-medium text-gray-700">
														{getTituloObjeto(reporte.tipo_objeto, reporte.id_objeto)}
													</span>
												{/if}
											</div>
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-3">
									{#if reporte.estado === 'resuelto' || reporte.estado === 'rechazado'}
										<div class="h-full rounded-lg border border-gray-100 bg-gray-50 p-4">
											<h4 class="mb-3 flex items-center gap-2 font-medium text-gray-900">
												<AlertCircle class="h-4 w-4 text-gray-500" />
												Resolución
											</h4>
											{#if reporte.fecha_resolucion}
												<p class="mb-2 text-xs text-gray-500">
													Resuelto el {formatDate(reporte.fecha_resolucion)}
													{#if reporte.admin_id}
														por <span class="font-medium text-gray-700"
															>{getNombreUsuario(reporte.admin_id)}</span
														> (Admin)
													{/if}
												</p>
											{/if}
											{#if reporte.comentario_resolucion}
												<p class="text-sm text-gray-700 italic">
													"{reporte.comentario_resolucion}"
												</p>
											{:else}
												<p class="text-sm text-gray-500 italic">Sin comentarios adicionales.</p>
											{/if}
										</div>
									{:else}
										<div
											class="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4"
										>
											<p class="text-sm text-gray-400">Esperando revisión...</p>

											{#if $isAdmin && reporte.estado === 'pendiente'}
												<button
													on:click={() => abrirModalResolucion(reporte)}
													class="mt-3 flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													Resolver reporte
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
				<div class="mt-8 flex items-center justify-center gap-2">
					<button
						disabled={currentPage === 1}
						class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
						on:click={() => goToPage(currentPage - 1)}
					>
						Anterior
					</button>

					{#each Array(totalPages) as _, i}
						<button
							class={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
								currentPage === i + 1
									? 'bg-blue-600 text-white'
									: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
							}`}
							on:click={() => goToPage(i + 1)}
						>
							{i + 1}
						</button>
					{/each}

					<button
						disabled={currentPage === totalPages}
						class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
						on:click={() => goToPage(currentPage + 1)}
					>
						Siguiente
					</button>
				</div>
				<div class="mt-2 text-center text-xs text-gray-500">
					Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredReportes.length)} - {Math.min(
						currentPage * itemsPerPage,
						filteredReportes.length
					)} de {filteredReportes.length} resultados
				</div>
			{/if}
		{:else}
			<div class="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
				<div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900">No se encontraron reportes</h3>
				<p class="mt-1 text-gray-500">
					No hay reportes que coincidan con los filtros seleccionados.
				</p>
				{#if estadoFilter !== 'todos'}
					<button
						class="text-primary-600 hover:text-primary-700 mt-4 text-sm font-medium"
						on:click={() => (estadoFilter = 'todos')}
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
		titulo={`Resolver reporte #${reporteSeleccionado?.id_reporte}`}
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
							value="resuelto"
							bind:group={resolucionEstado}
							class="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
						/>
						<span class="text-sm text-gray-700">Marcar como resuelto</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							type="radio"
							name="estado"
							value="rechazado"
							bind:group={resolucionEstado}
							class="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
						/>
						<span class="text-sm text-gray-700">Rechazar reporte</span>
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
					class="focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					placeholder="Describe la resolución o razón del rechazo..."
				></textarea>
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
					resolucionEstado === 'resuelto'
						? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
						: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
				}`}
				on:click={confirmarResolucion}
			>
				{resolucionEstado === 'resuelto' ? 'Confirmar resolución' : 'Rechazar reporte'}
			</button>
		</div>
	</Modal>

	<!-- Modal de Retiro de Reporte -->
	<Modal
		abierto={modalRetiroAbierto}
		titulo="Retirar reporte"
		on:cerrar={cerrarModalRetiro}
		anchoMaximo="max-w-md"
	>
		<div class="px-2">
			<div class="mx-auto mb-4 flex w-fit items-center justify-center rounded-full bg-red-100 p-3">
				<Trash2 class="h-6 w-6 text-red-600" />
			</div>
			<p class="text-center text-sm text-gray-600">
				¿Estás seguro de que querés descartar este reporte? Esta acción no se puede deshacer y el
				reporte se eliminará permanentemente.
			</p>
		</div>

		<div slot="footer" class="flex flex-col-reverse justify-end gap-2 sm:flex-row">
			<button
				type="button"
				class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
				on:click={cerrarModalRetiro}
			>
				Cancelar
			</button>
			<button
				type="button"
				class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm"
				on:click={confirmarRetiro}
			>
				Confirmar retiro
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
