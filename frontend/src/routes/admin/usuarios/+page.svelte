<script lang="ts">

	import Badge from '$lib/components/ui/elementos/Badge.svelte';

	import Button from '$lib/components/ui/elementos/Button.svelte';

	import { mockUsuarios } from '$lib/mocks/mock-usuarios';

	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';

	import type { Usuario } from '$lib/types/Usuario';
	import { exportarUsuarios } from '$lib/utils/export-csv';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';



	const origenUsuarios = Object.values(mockUsuarios as MockUsuarios) as Usuario[];



	let filtroRol: '' | 'administrador' | 'institucion' | 'colaborador' = '';

	let filtroEstado: '' | 'activo' | 'inactivo' | 'pendiente' | 'suspendido' = '';

	let busqueda = '';



	let usuarios = origenUsuarios.map((u) => ({ ...u }));



	// Lista filtrada reactiva

	let usuariosFiltrados: Usuario[] = usuarios;



	$: usuariosFiltrados = usuarios.filter((u) => {

		const coincideRol = !filtroRol || u.rol === filtroRol;

		const coincideEstado = !filtroEstado || u.estado === filtroEstado;

		const texto = `${u.nombre} ${u.apellido} ${u.username}`.toLowerCase();

		const coincideBusqueda = !busqueda || texto.includes(busqueda.toLowerCase());

		return coincideRol && coincideEstado && coincideBusqueda;

	});



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



	function toggleEstado(usuarioId: number | undefined) {

		if (!usuarioId) return;

		usuarios = usuarios.map((u) => {

			if (u.id_usuario !== usuarioId) return u;

			const nuevoEstado = u.estado === 'activo' ? 'inactivo' : 'activo';

			return { ...u, estado: nuevoEstado };

		});

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



	<!-- Tabla de usuarios -->

	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

		<div class="mb-3 flex items-center justify-between text-xs text-gray-500">

			<p>

				Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios

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

					{#each usuariosFiltrados as u}

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

								<button

									type="button"

									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${

										getEstadoClases(u.estado)

										}`}

									on:click={() => toggleEstado(u.id_usuario)}

								>

									{u.estado === 'activo' ? 'Activo' : 'Inactivo'}

								</button>

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

</div>

