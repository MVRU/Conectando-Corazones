<script lang="ts">

	import Badge from '$lib/components/ui/elementos/Badge.svelte';

	import Button from '$lib/components/ui/elementos/Button.svelte';

	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockResenasUsuarios } from '$lib/mocks/mock-resenas-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';

	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';

	import type { Usuario } from '$lib/types/Usuario';
	import type { Resena } from '$lib/types/Resena';
	import type { Proyecto } from '$lib/types/Proyecto';
	import { exportarUsuarios } from '$lib/utils/export-csv';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';



	const origenUsuarios = Object.values(mockUsuarios as MockUsuarios) as Usuario[];

	interface UsuarioConCalificacion extends Usuario {
		calificacionPromedio: number;
		totalResenas: number;
		resenas: Resena[];
		proyectosParticipados: Proyecto[];
	}



	let filtroRol: '' | 'administrador' | 'institucion' | 'colaborador' = '';

	let filtroEstado: '' | 'activo' | 'inactivo' | 'pendiente' | 'suspendido' = '';

	let busqueda = '';



	let usuarios = origenUsuarios.map((u) => ({ ...u }));
	let usuarioSeleccionado: UsuarioConCalificacion | null = null;
	const itemsPerPage = 10;
	let currentPage = 1;



	// Lista filtrada reactiva

	let usuariosFiltrados: Usuario[] = usuarios;



	$: usuariosFiltrados = usuarios.filter((u) => {

		const coincideRol = !filtroRol || u.rol === filtroRol;

		const coincideEstado = !filtroEstado || u.estado === filtroEstado;

		const texto = `${u.nombre} ${u.apellido} ${u.username}`.toLowerCase();

		const coincideBusqueda = !busqueda || texto.includes(busqueda.toLowerCase());

		return coincideRol && coincideEstado && coincideBusqueda;

	});

	$: totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / itemsPerPage));

	$: if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	$: usuariosPaginados = usuariosFiltrados.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function goToPage(page: number) {
		currentPage = Math.min(Math.max(1, page), totalPages);
	}



	function obtenerIniciales(nombre?: string, apellido?: string) {
		const n = `${nombre ?? ''} ${apellido ?? ''}`.trim();
		if (!n) return 'U';
		return n
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((p) => p[0]?.toUpperCase())
			.join('');
	}

	function getRolLabel(rol?: Usuario['rol']) {
		if (rol === 'administrador') return 'Administrador';
		if (rol === 'institucion') return 'Institución';
		if (rol === 'colaborador') return 'Colaborador';
		return 'Sin rol';
	}

	function getRolClases(rol?: Usuario['rol']) {
		if (rol === 'administrador') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
		if (rol === 'institucion') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
		if (rol === 'colaborador') return 'bg-sky-50 text-sky-700 border-sky-200';
		return 'bg-gray-50 text-gray-600 border-gray-200';
	}

	function getEstadoClases(estado?: string) {
		if (estado === 'activo') return 'bg-emerald-50 text-emerald-700';
		if (estado === 'pendiente') return 'bg-amber-50 text-amber-700';
		if (estado === 'suspendido') return 'bg-red-50 text-red-700';
		return 'bg-gray-100 text-gray-600';
	}

	function getEstadoLabel(estado?: string) {
		if (estado === 'activo') return 'Activo';
		if (estado === 'pendiente') return 'Pendiente';
		if (estado === 'suspendido') return 'Suspendido';
		return 'Inactivo';
	}

	function calcularCalificacionUsuario(usuarioId: number | undefined): {
		promedio: number;
		total: number;
		resenas: Resena[];
	} {
		if (!usuarioId) return { promedio: 0, total: 0, resenas: [] };
		const resenas = mockResenasUsuarios.filter(
			(r) => r.id_objeto === usuarioId && r.tipo_objeto === 'Usuario' && r.aprobado
		);
		if (resenas.length === 0) return { promedio: 0, total: 0, resenas: [] };
		const suma = resenas.reduce((acc, r) => acc + r.puntaje, 0);
		const promedio = suma / resenas.length;
		return { promedio, total: resenas.length, resenas };
	}

	function obtenerProyectosParticipados(usuarioId: number | undefined): Proyecto[] {
		if (!usuarioId) return [];
		const colaboracionesUsuario = mockColaboraciones.filter(
			(c) => c.colaborador_id === usuarioId
		);
		const proyectosIds = colaboracionesUsuario
			.map((c) => c.proyecto_id)
			.filter((id): id is number => id !== undefined);
		const proyectosUnicos = [...new Set(proyectosIds)];
		return mockProyectos.filter((p) => p.id_proyecto && proyectosUnicos.includes(p.id_proyecto));
	}

	const usuariosConCalificaciones: UsuarioConCalificacion[] = Object.values(mockUsuarios)
		.filter((u) => u.rol !== 'administrador')
		.map((u) => {
			const { promedio, total, resenas } = calcularCalificacionUsuario(u.id_usuario);
			const proyectosParticipados = obtenerProyectosParticipados(u.id_usuario);
			return {
				...u,
				calificacionPromedio: promedio,
				totalResenas: total,
				resenas,
				proyectosParticipados
			};
		})
		.filter((u) => u.calificacionPromedio > 0 && u.calificacionPromedio < 3.0)
		.sort((a, b) => a.calificacionPromedio - b.calificacionPromedio);

	function getCalificacionColor(promedio: number): string {
		if (promedio < 2.0) return 'bg-red-100 text-red-700 border-red-300';
		if (promedio < 2.5) return 'bg-orange-100 text-orange-700 border-orange-300';
		return 'bg-yellow-100 text-yellow-700 border-yellow-300';
	}

	function verDetalle(usuario: UsuarioConCalificacion) {
		usuarioSeleccionado = usuario;
	}

	function cerrarDetalle() {
		usuarioSeleccionado = null;
	}




</script>



<svelte:head>

	<title>Usuarios - Panel admin</title>

</svelte:head>



<div class="space-y-6">

	<div class="flex flex-wrap items-center justify-between gap-4">

		<div>

			<Badge text="Usuarios" />

			<h1 class="mt-3 text-2xl font-bold text-gray-900">Gestión de usuarios</h1>

			<p class="mt-1 text-sm text-gray-600">Listado simulado a partir de los mocks</p>

		</div>

		<div class="flex gap-2">
			<Button
				label="Exportar CSV"
				variant="secondary"
				size="sm"
				type="button"
				on:click={() => exportarUsuarios(usuariosFiltrados as unknown as Array<Record<string, unknown>>)}
			/>
			<Button
				label="Crear usuario"
				variant="primary"
				size="sm"
				type="button"
				href="/admin/usuarios/crear"
			/>
		</div>

	</div>



	<!-- Filtros -->

	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

		<div class="flex flex-wrap items-end gap-4">

			<div>

				<label for="filtro-rol" class="block text-xs font-medium text-gray-600">Rol</label>

				<select

					id="filtro-rol"

					bind:value={filtroRol}

					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

				>

					<option value="">Todos</option>

					<option value="administrador">Administrador</option>

					<option value="institucion">Institución</option>

					<option value="colaborador">Colaborador</option>

				</select>

			</div>



			<div>

				<label for="filtro-estado" class="block text-xs font-medium text-gray-600">Estado</label>

				<select

					id="filtro-estado"

					bind:value={filtroEstado}

					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

				>

					<option value="">Todos</option>

					<option value="activo">Activo</option>

					<option value="inactivo">Inactivo</option>

					<option value="pendiente">Pendiente</option>

					<option value="suspendido">Suspendido</option>

				</select>

			</div>



			<div class="flex-1 min-w-[180px]">

				<label for="busqueda" class="block text-xs font-medium text-gray-600">Buscar</label>

				<input

					id="busqueda"

					type="text"

					bind:value={busqueda}

					placeholder="Nombre, apellido o username"

					class="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

				/>

			</div>

		</div>

	</section>



	<!-- Reactivación de cuentas -->
	<section class="rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-sm text-gray-700">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h2 class="text-sm font-semibold text-gray-900">Reactivación de cuentas</h2>
				<p class="mt-1 text-xs text-gray-600">
					Las cuentas inhabilitadas pueden reactivarse únicamente mediante solicitud formal y
					validación administrativa.
				</p>
			</div>
			<span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
				Sin solicitudes pendientes
			</span>
		</div>
	</section>

	<!-- Tabla de usuarios -->

	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

		<div class="mb-3 flex items-center justify-between text-xs text-gray-500">

			<p>

				Mostrando {usuariosPaginados.length} de {usuariosFiltrados.length} usuarios

			</p>

		</div>



		<div class="overflow-x-auto">

			<table class="min-w-full divide-y divide-gray-200 text-sm">

				<thead class="bg-gray-50">

					<tr>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Usuario

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Rol

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Estado

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Acciones

						</th>

					</tr>

				</thead>

				<tbody class="divide-y divide-gray-100 bg-white">

					{#each usuariosPaginados as u}

						<tr>

							<td class="whitespace-nowrap px-3 py-2">
								<div class="flex items-center gap-3">
									<div
										class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700"
									>
										{obtenerIniciales(u.nombre, u.apellido)}
									</div>
									<div>
										<p class="text-sm font-medium text-gray-900">
											{#if obtenerUrlPerfil(u)}
												<a
													href={obtenerUrlPerfil(u)!}
													class="transition hover:text-blue-600 hover:underline"
												>
													{u.nombre} {u.apellido}
												</a>
											{:else}
												{u.nombre} {u.apellido}
											{/if}
										</p>
										<p class="text-xs text-gray-500">@{u.username}</p>
									</div>
								</div>

							</td>

							<td class="whitespace-nowrap px-3 py-2">
								<span
									class={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${getRolClases(u.rol)}`}
								>
									{getRolLabel(u.rol)}
								</span>
							</td>

							<td class="whitespace-nowrap px-3 py-2">
								<div class="flex flex-col gap-1">
									<span
										class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
											getEstadoClases(u.estado)
										}`}
									>
										{getEstadoLabel(u.estado)}
									</span>
									{#if u.estado === 'inactivo'}
										<span class="text-[10px] text-gray-500">
											Reactivación por solicitud
										</span>
									{/if}
								</div>
							</td>

							<td class="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
								<div class="flex items-center gap-3">
									{#if obtenerUrlPerfil(u)}
										<a
											href={obtenerUrlPerfil(u)!}
											class="font-medium text-[rgb(var(--color-primary))] hover:underline"
										>
											Ver perfil
										</a>
									{:else}
										<span class="text-gray-400">Sin perfil</span>
									{/if}
								</div>
							</td>

						</tr>

					{/each}

				</tbody>

			</table>

		</div>

	</section>
	{#if usuariosFiltrados.length > itemsPerPage}
		<div class="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-500">
			<Button
				label="Anterior"
				variant="secondary"
				size="sm"
				type="button"
				disabled={currentPage === 1}
				on:click={() => goToPage(currentPage - 1)}
			/>
			{#each Array(totalPages) as _, i}
				<Button
					label={(i + 1).toString()}
					variant={currentPage === i + 1 ? 'primary' : 'secondary'}
					size="sm"
					type="button"
					on:click={() => goToPage(i + 1)}
				/>
			{/each}
			<Button
				label="Siguiente"
				variant="secondary"
				size="sm"
				type="button"
				disabled={currentPage === totalPages}
				on:click={() => goToPage(currentPage + 1)}
			/>
		</div>
	{/if}

	<!-- Usuarios con bajas calificaciones -->
	<section class="rounded-xl border border-orange-200 bg-orange-50/40 p-4 shadow-sm">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h2 class="text-sm font-semibold text-gray-900">Usuarios con bajas calificaciones</h2>
				<p class="mt-1 text-xs text-gray-600">
					Calificación promedio menor a 3.0 estrellas en reseñas aprobadas.
				</p>
			</div>
			<span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-orange-700">
				{usuariosConCalificaciones.length} usuarios
			</span>
		</div>
		<div class="mt-4 space-y-3">
			{#if usuariosConCalificaciones.length === 0}
				<div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
					<p class="text-xs text-gray-500">No hay usuarios con bajas calificaciones.</p>
				</div>
			{:else}
				{#each usuariosConCalificaciones as usuario}
					<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<div class="mb-2 flex items-center gap-2">
									<span
										class="rounded-full border px-3 py-1 text-xs font-medium {getCalificacionColor(
											usuario.calificacionPromedio
										)}"
									>
										⭐ {usuario.calificacionPromedio.toFixed(1)} / 5.0
									</span>
									<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
										{usuario.rol === 'institucion' ? 'Institución' : 'Colaborador'}
									</span>
								</div>
								<p class="text-sm font-semibold text-gray-900">
									{usuario.nombre} {usuario.apellido}
								</p>
								<p class="text-xs text-gray-500">@{usuario.username}</p>
							</div>
							<div class="flex items-center gap-2">
								<Button
									label="Ver detalles y análisis"
									variant="secondary"
									size="sm"
									type="button"
									on:click={() => verDetalle(usuario)}
								/>
							</div>
						</div>
						<div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
							<span>
								<span class="font-medium">Total de reseñas:</span> {usuario.totalResenas}
							</span>
							<span>
								<span class="font-medium">Proyectos participados:</span>{' '}
								{usuario.proyectosParticipados.length}
							</span>
							<span>
								<span class="font-medium">Estado:</span> {getEstadoLabel(usuario.estado)}
							</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</section>

</div>

{#if usuarioSeleccionado}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		on:click={cerrarDetalle}
		on:keydown={(e) => e.key === 'Escape' && cerrarDetalle()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
			on:click|stopPropagation
			on:keydown={(e) => {
				e.stopPropagation();
			}}
			role="dialog"
			tabindex="-1"
		>
			<div class="sticky top-0 border-b border-gray-200 bg-white p-6">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-2xl font-bold text-gray-900">
							{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
						</h2>
						<p class="mt-1 text-sm text-gray-600">@{usuarioSeleccionado.username}</p>
						<div class="mt-2 flex items-center gap-2">
							<span
								class="rounded-full border px-3 py-1 text-sm font-medium {getCalificacionColor(
									usuarioSeleccionado.calificacionPromedio
								)}"
							>
								⭐ Calificación promedio: {usuarioSeleccionado.calificacionPromedio.toFixed(1)} / 5.0
							</span>
						</div>
					</div>
					<button
						type="button"
						on:click={cerrarDetalle}
						class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						aria-label="Cerrar"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div class="space-y-6 p-6">
				<section>
					<h3 class="mb-4 text-lg font-semibold text-gray-900">
						Reseñas y comentarios ({usuarioSeleccionado.resenas.length})
					</h3>
					{#if usuarioSeleccionado.resenas.length === 0}
						<p class="text-sm text-gray-500">No hay reseñas disponibles</p>
					{:else}
						<div class="space-y-4">
							{#each usuarioSeleccionado.resenas as resena}
								<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
									<div class="mb-2 flex items-center justify-between">
										<div class="flex items-center gap-2">
											{#each Array(5).keys() as i}
												<svg
													class="h-4 w-4 {i < resena.puntaje ? 'text-amber-400' : 'text-gray-300'}"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z"
													/>
												</svg>
											{/each}
											<span class="ml-2 text-xs font-medium text-gray-600">
												{resena.puntaje} / 5
											</span>
										</div>
										<span class="text-xs text-gray-500">Por: {resena.username || 'Usuario'}</span>
									</div>
									<p class="text-sm text-gray-700">{resena.contenido}</p>
								</div>
							{/each}
						</div>
					{/if}
				</section>

				<section>
					<h3 class="mb-4 text-lg font-semibold text-gray-900">
						Proyectos donde participó ({usuarioSeleccionado.proyectosParticipados.length})
					</h3>
					{#if usuarioSeleccionado.proyectosParticipados.length === 0}
						<p class="text-sm text-gray-500">No ha participado en ningún proyecto</p>
					{:else}
						<div class="space-y-3">
							{#each usuarioSeleccionado.proyectosParticipados as proyecto}
								<div class="rounded-lg border border-gray-200 bg-white p-4">
									<h4 class="font-semibold text-gray-900">{proyecto.titulo}</h4>
									<p class="mt-1 line-clamp-2 text-sm text-gray-600">{proyecto.descripcion}</p>
									<div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
										<span>Estado: {proyecto.estado ?? 'N/A'}</span>
										{#if proyecto.created_at}
											<span>•</span>
											<span>
												Creado: {new Date(proyecto.created_at).toLocaleDateString('es-AR')}
											</span>
										{/if}
									</div>
									{#if proyecto.id_proyecto}
										<a
											href={`/proyectos/${proyecto.id_proyecto}`}
											class="mt-2 inline-block text-xs text-blue-600 hover:underline"
										>
											Ver proyecto →
										</a>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>

			<div class="sticky bottom-0 border-t border-gray-200 bg-white p-6">
				<div class="flex justify-end gap-2">
					<Button label="Cerrar" variant="secondary" size="sm" type="button" on:click={cerrarDetalle} />
					{#if obtenerUrlPerfil(usuarioSeleccionado)}
						<a href={obtenerUrlPerfil(usuarioSeleccionado)!}>
							<Button label="Ver perfil completo" variant="primary" size="sm" type="button" />
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}