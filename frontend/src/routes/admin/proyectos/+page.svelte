<script lang="ts">

	import Badge from '$lib/components/ui/elementos/Badge.svelte';

	import Button from '$lib/components/ui/elementos/Button.svelte';

	import { mockProyectos } from '$lib/mocks/mock-proyectos';

	import type { Proyecto } from '$lib/types/Proyecto';
	import { exportarProyectos } from '$lib/utils/export-csv';
	import {
		actualizarEstadoProyecto,
		filtrarProyectosAdmin,
		type EstadoProyectoAdmin,
		type FiltroEstadoProyecto
	} from '$lib/utils/util-proyectos-admin';



	let proyectos: Proyecto[] = mockProyectos as Proyecto[];



	let filtroEstado: FiltroEstadoProyecto = '';

	let filtroInstitucion = '';

	let busquedaProyecto = '';



	let proyectosFiltrados: Proyecto[] = proyectos;



	$: proyectosFiltrados = filtrarProyectosAdmin(
		proyectos,
		filtroEstado,
		filtroInstitucion,
		busquedaProyecto
	);



	function cambiarEstado(idProyecto: number | undefined, nuevoEstado: EstadoProyectoAdmin) {
		proyectos = actualizarEstadoProyecto(proyectos, idProyecto, nuevoEstado);
	}

</script>



<svelte:head>

	<title>Proyectos - Panel admin</title>

</svelte:head>



<div class="space-y-6">

	<div class="flex flex-wrap items-center justify-between gap-4">

		<div>

			<Badge text="Proyectos" />

			<h1 class="mt-3 text-2xl font-bold text-gray-900">Gestión de proyectos</h1>

			<p class="mt-1 text-sm text-gray-600">Listado simulado a partir de los mocks</p>

		</div>

		<div>
			<Button
				label="Exportar CSV"
				variant="secondary"
				size="sm"
				type="button"
				on:click={() => exportarProyectos(proyectosFiltrados as unknown as Array<Record<string, unknown>>)}
			/>
		</div>

	</div>



	<!-- Filtros -->

	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

		<div class="flex flex-wrap items-end gap-4">

			<div>

				<label for="filtro-estado-proyecto" class="block text-xs font-medium text-gray-600">Estado</label>

				<select

					id="filtro-estado-proyecto"

					bind:value={filtroEstado}

					class="mt-1 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

				>

					<option value="">Todos</option>

					<option value="en_curso">En curso</option>

					<option value="en_revision">En revisión</option>

					<option value="en_auditoria">En auditoría</option>

					<option value="completado">Completado</option>

					<option value="cancelado">Cancelado</option>

				</select>

			</div>



			<div>

				<label for="filtro-institucion" class="block text-xs font-medium text-gray-600">Institución</label>

				<input

					id="filtro-institucion"

					type="text"

					bind:value={filtroInstitucion}

					placeholder="Buscar por institución"

					class="mt-1 w-56 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

				/>

			</div>



			<div class="flex-1 min-w-[180px]">

				<label for="busqueda-proyecto" class="block text-xs font-medium text-gray-600">Buscar proyecto</label>

				<input

					id="busqueda-proyecto"

					type="text"

					bind:value={busquedaProyecto}

					placeholder="Título del proyecto"

					class="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

				/>

			</div>

		</div>

	</section>



	<!-- Tabla de proyectos -->

	<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

		<div class="mb-3 flex items-center justify-between text-xs text-gray-500">

			<p>

				Mostrando {proyectosFiltrados.length} de {proyectos.length} proyectos

			</p>

		</div>



		<div class="overflow-x-auto">

			<table class="min-w-full divide-y divide-gray-200 text-sm">

				<thead class="bg-gray-50">

					<tr>

						<th class="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">

							Proyecto

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Institución

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Estado

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Colaboraciones

						</th>

						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

							Acciones

						</th>

					</tr>

				</thead>

				<tbody class="divide-y divide-gray-100 bg-white">

					{#each proyectosFiltrados as p}

						<tr>

							<td class="whitespace-nowrap px-3 py-2">

								<p class="text-sm font-medium text-gray-900">{p.titulo}</p>

								<p class="text-xs text-gray-500">

									{p.created_at ? new Date(p.created_at).toLocaleDateString('es-AR') : 's/f'}

								</p>

							</td>

							<td class="whitespace-nowrap px-3 py-2">

								<p class="text-sm text-gray-800">{p.institucion?.nombre_legal || 'Sin institución'}</p>

							</td>

							<td class="whitespace-nowrap px-3 py-2">

								<select

									class="rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

									bind:value={p.estado}

									on:change={(e) => cambiarEstado(p.id_proyecto, (e.currentTarget as HTMLSelectElement).value as Proyecto['estado'])}

								>

									<option value="en_curso">En curso</option>

									<option value="en_revision">En revisión</option>

									<option value="en_auditoria">En auditoría</option>

									<option value="completado">Completado</option>

									<option value="cancelado">Cancelado</option>

								</select>

							</td>

							<td class="whitespace-nowrap px-3 py-2 text-center text-xs text-gray-700">

								{p.colaboraciones?.length ?? 0}

							</td>

							<td class="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
								{#if p.id_proyecto}
									<a
										href={`/proyectos/${p.id_proyecto}`}
										class="text-[rgb(var(--color-primary))] hover:underline"
									>
										Ver detalle
									</a>
								{:else}
									<span class="text-gray-400">Sin detalle</span>
								{/if}
							</td>

						</tr>

					{/each}

				</tbody>

			</table>

		</div>

	</section>

</div>

