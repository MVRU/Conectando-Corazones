<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockResenasUsuarios } from '$lib/mocks/mock-resenas-usuarios';
	import { mockResenasPendientes } from '$lib/mocks/mock-resenas-pendientes';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { Resena } from '$lib/types/Resena';

	// Combinar todas las reseñas
	let todasLasResenas: Resena[] = [
		...mockResenasUsuarios,
		...mockResenasPendientes
	].map((r) => ({ ...r }));

	let filtroEstado: '' | 'pendiente' | 'aprobada' | 'rechazada' = '';
	let filtroTipo: '' | 'Usuario' | 'Proyecto' = '';
	let busqueda = '';

	$: resenasFiltradas = todasLasResenas.filter((r) => {
		let coincideEstado = true;
		if (filtroEstado === 'pendiente') {
			coincideEstado = r.aprobado === undefined || r.aprobado === null;
		} else if (filtroEstado === 'aprobada') {
			coincideEstado = r.aprobado === true;
		} else if (filtroEstado === 'rechazada') {
			coincideEstado = r.aprobado === false;
		}

		const coincideTipo = !filtroTipo || r.tipo_objeto === filtroTipo;
		const texto = `${r.contenido} ${r.username || ''}`.toLowerCase();
		const coincideBusqueda = !busqueda || texto.includes(busqueda.toLowerCase());

		return coincideEstado && coincideTipo && coincideBusqueda;
	});

	function obtenerNombreObjeto(resena: Resena): string {
		if (resena.tipo_objeto === 'Usuario') {
			const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === resena.id_objeto);
			return usuario ? `${usuario.nombre} ${usuario.apellido} (@${usuario.username})` : `Usuario #${resena.id_objeto}`;
		} else {
			const proyecto = mockProyectos.find((p) => p.id_proyecto === resena.id_objeto);
			return proyecto ? proyecto.titulo : `Proyecto #${resena.id_objeto}`;
		}
	}

	function cambiarEstadoResena(resenaId: number | undefined, nuevoEstado: boolean) {
		if (!resenaId) return;
		const resena = todasLasResenas.find((r) => r.id_resena === resenaId);
		if (resena) {
			resena.aprobado = nuevoEstado;
		}
	}

	function getEstadoColor(aprobado: boolean | undefined | null): string {
		if (aprobado === undefined || aprobado === null) {
			return 'bg-yellow-50 text-yellow-700 border-yellow-200';
		}
		if (aprobado === true) {
			return 'bg-green-50 text-green-700 border-green-200';
		}
		return 'bg-red-50 text-red-700 border-red-200';
	}

	function getEstadoTexto(aprobado: boolean | undefined | null): string {
		if (aprobado === undefined || aprobado === null) return 'Pendiente';
		if (aprobado === true) return 'Aprobada';
		return 'Rechazada';
	}

	const totalPendientes = todasLasResenas.filter((r) => r.aprobado === undefined || r.aprobado === null).length;
	const totalAprobadas = todasLasResenas.filter((r) => r.aprobado === true).length;
	const totalRechazadas = todasLasResenas.filter((r) => r.aprobado === false).length;
</script>

<svelte:head>
	<title>Moderación de reseñas - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Moderación" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Moderación de reseñas</h1>
			<p class="mt-1 text-sm text-gray-600">Aprobar o rechazar reseñas antes de publicarlas</p>
		</div>
	</div>

	<!-- Métricas -->
	<section class="grid gap-4 sm:grid-cols-3">
		<div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-yellow-700">Pendientes</p>
			<p class="mt-2 text-2xl font-semibold text-yellow-900">{totalPendientes}</p>
		</div>
		<div class="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-green-700">Aprobadas</p>
			<p class="mt-2 text-2xl font-semibold text-green-900">{totalAprobadas}</p>
		</div>
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
			<p class="text-xs font-medium text-red-700">Rechazadas</p>
			<p class="mt-2 text-2xl font-semibold text-red-900">{totalRechazadas}</p>
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
					<option value="aprobada">Aprobada</option>
					<option value="rechazada">Rechazada</option>
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
					placeholder="Contenido o usuario"
					class="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	</section>

	<!-- Lista de reseñas -->
	<section class="space-y-4">
		<div class="mb-3 flex items-center justify-between text-xs text-gray-500">
			<p>Mostrando {resenasFiltradas.length} de {todasLasResenas.length} reseñas</p>
		</div>

		{#each resenasFiltradas as resena}
			<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
				<div class="mb-4 flex items-start justify-between">
					<div class="flex-1">
						<div class="mb-2 flex items-center gap-3">
							<span class="rounded-full border px-3 py-1 text-xs font-medium {getEstadoColor(resena.aprobado)}">
								{getEstadoTexto(resena.aprobado)}
							</span>
							<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
								{resena.tipo_objeto}
							</span>
							<div class="flex items-center gap-1">
								{#each Array(5).keys() as i}
									<svg
										class="h-3 w-3 {i < resena.puntaje
											? 'text-amber-400'
											: 'text-gray-300'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z"
										/>
									</svg>
								{/each}
								<span class="ml-1 text-xs text-gray-600">{resena.puntaje} / 5</span>
							</div>
						</div>
						<p class="mb-2 text-sm text-gray-700">{resena.contenido}</p>
						<div class="mt-3 space-y-1 text-xs text-gray-500">
							<p><span class="font-medium">Sobre:</span> {obtenerNombreObjeto(resena)}</p>
							<p><span class="font-medium">Por:</span> {resena.username || 'Usuario anónimo'}</p>
							<p><span class="font-medium">ID Reseña:</span> #{resena.id_resena}</p>
						</div>
					</div>
				</div>

				{#if resena.aprobado === undefined || resena.aprobado === null}
					<div class="flex gap-2 border-t border-gray-100 pt-4">
						<Button
							label="Aprobar"
							variant="primary"
							size="sm"
							type="button"
							on:click={() => cambiarEstadoResena(resena.id_resena, true)}
						/>
						<Button
							label="Rechazar"
							variant="secondary"
							size="sm"
							type="button"
							on:click={() => cambiarEstadoResena(resena.id_resena, false)}
						/>
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-xl border border-gray-200 bg-white p-8 text-center">
				<p class="text-gray-500">No se encontraron reseñas con los filtros seleccionados</p>
			</div>
		{/each}
	</section>
</div>
