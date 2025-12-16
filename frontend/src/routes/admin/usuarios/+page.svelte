<script lang="ts">

	import Badge from '$lib/components/ui/elementos/Badge.svelte';

	import Button from '$lib/components/ui/elementos/Button.svelte';

	import { mockUsuarios } from '$lib/mocks/mock-usuarios';

	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';

	import type { Usuario } from '$lib/types/Usuario';



	const origenUsuarios = Object.values(mockUsuarios as MockUsuarios) as Usuario[];



	let filtroRol: '' | 'administrador' | 'institucion' | 'colaborador' = '';

	let filtroEstado: '' | 'activo' | 'inactivo' | 'pendiente' = '';

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



	function cambiarRol(usuarioId: number | undefined, nuevoRol: Usuario['rol']) {

		if (!usuarioId) return;

		usuarios = usuarios.map((u) => (u.id_usuario === usuarioId ? { ...u, rol: nuevoRol } : u));

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

								<p class="text-sm font-medium text-gray-900">{u.nombre} {u.apellido}</p>

								<p class="text-xs text-gray-500">{u.username}</p>

							</td>

							<td class="whitespace-nowrap px-3 py-2">

								<select

									class="rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

									bind:value={u.rol}

									on:change={(e) => cambiarRol(u.id_usuario, (e.currentTarget as HTMLSelectElement).value as Usuario['rol'])}

								>

									<option value="administrador">Administrador</option>

									<option value="institucion">Institución</option>

									<option value="colaborador">Colaborador</option>

								</select>

							</td>

							<td class="whitespace-nowrap px-3 py-2">

								<button

									type="button"

									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${

										u.estado === 'activo'

											? 'bg-emerald-50 text-emerald-700'

											: 'bg-gray-100 text-gray-600'

										}`}

									on:click={() => toggleEstado(u.id_usuario)}

								>

									{u.estado === 'activo' ? 'Activo' : 'Inactivo'}

								</button>

							</td>

							<td class="whitespace-nowrap px-3 py-2 text-xs text-gray-500 space-x-2">

								<span>Simulación en memoria</span>

								<a href={`/admin/usuarios/${u.id_usuario}`} class="text-[rgb(var(--color-primary))] hover:underline">

									Ver detalle

								</a>

							</td>

						</tr>

					{/each}

				</tbody>

			</table>

		</div>

	</section>

</div>

