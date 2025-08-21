<!--

FIX: corregir para que coincida con DER

* Componente: ProjectSelector
  -*- Descripción: Selector para cambiar entre proyectos de la institución
-->

<script lang="ts">
	import type { ProyectoConPostulaciones } from '$lib/types/Postulacion'; // FIX: usar Colaboracion

	export let proyectos: ProyectoConPostulaciones[] = [];
	export let proyectoSeleccionado: ProyectoConPostulaciones;
	export let onChange: (proyecto: ProyectoConPostulaciones) => void;

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const proyectoId = parseInt(target.value);
		const proyecto = proyectos.find((p) => p.id === proyectoId);
		if (proyecto) {
			onChange(proyecto);
		}
	}

	function getEstadoBadgeColor(estado?: string): string {
		switch (estado) {
			case 'activo':
				return 'bg-green-100 text-green-800';
			case 'finalizado':
				return 'bg-gray-100 text-gray-800';
			case 'pausado':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-blue-100 text-blue-800';
		}
	}

	function getPostulacionesCount(proyecto: ProyectoConPostulaciones): number {
		return proyecto.postulaciones.length;
	}

	function getColaboradoresCount(proyecto: ProyectoConPostulaciones): number {
		return proyecto.colaboradoresActivos.length;
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-lg font-semibold text-gray-900">Seleccionar proyecto</h2>
		<span class="text-sm text-gray-500">
			{proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} total{proyectos.length !== 1
				? 'es'
				: ''}
		</span>
	</div>

	<div class="space-y-4">
		<!-- Selector dropdown -->
		<div>
			<label for="project-select" class="mb-2 block text-sm font-medium text-gray-700">
				Proyecto activo:
			</label>
			<select
				id="project-select"
				bind:value={proyectoSeleccionado.id}
				on:change={handleChange}
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
			>
				{#each proyectos as proyecto}
					<option value={proyecto.id}>
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
				{#if proyectoSeleccionado.estado}
					<!-- FIX: corregir estados de Proyecto -->
					<span
						class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getEstadoBadgeColor(
							proyectoSeleccionado.estado
						)}"
					>
						{proyectoSeleccionado.estado === 'activo'
							? 'Activo'
							: proyectoSeleccionado.estado === 'finalizado'
								? 'Finalizado'
								: proyectoSeleccionado.estado === 'pausado'
									? 'Pausado'
									: 'Sin estado'}
					</span>
				{/if}
			</div>

			<!-- Estadísticas rápidas -->
			<div class="grid grid-cols-2 gap-4">
				<div class="rounded-lg border border-gray-200 bg-white p-3">
					<div class="flex items-center">
						<div class="mr-2 text-orange-500">📥</div>
						<div>
							<p class="text-xs text-gray-500">Postulaciones</p>
							<p class="text-lg font-semibold text-gray-900">
								{getPostulacionesCount(proyectoSeleccionado)}
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-gray-200 bg-white p-3">
					<div class="flex items-center">
						<div class="mr-2 text-green-500">🤝</div>
						<div>
							<p class="text-xs text-gray-500">Colaboradores</p>
							<p class="text-lg font-semibold text-gray-900">
								{getColaboradoresCount(proyectoSeleccionado)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{#if proyectoSeleccionado.fechaCreacion}
				<p class="mt-3 text-xs text-gray-500">
					Creado el {new Date(proyectoSeleccionado.fechaCreacion).toLocaleDateString('es-AR')}
				</p>
			{/if}
		</div>
	</div>
</div>
