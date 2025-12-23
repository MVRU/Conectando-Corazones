<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockResenasUsuarios } from '$lib/mocks/mock-resenas-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';
	import type { Usuario } from '$lib/types/Usuario';
	import type { Resena } from '$lib/types/Resena';
	import type { Proyecto } from '$lib/types/Proyecto';

	interface UsuarioConCalificacion extends Usuario {
		calificacionPromedio: number;
		totalResenas: number;
		resenas: Resena[];
		proyectosParticipados: Proyecto[];
	}

	let usuarioSeleccionado: UsuarioConCalificacion | null = null;

	// Calcular calificaciones para cada usuario
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

	// Obtener proyectos donde participó un usuario
	function obtenerProyectosParticipados(usuarioId: number | undefined): Proyecto[] {
		if (!usuarioId) return [];

		// Buscar colaboraciones del usuario
		const colaboracionesUsuario = mockColaboraciones.filter(
			(c) => c.colaborador_id === usuarioId
		);

		// Obtener IDs de proyectos de las colaboraciones
		const proyectosIds = colaboracionesUsuario
			.map((c) => c.proyecto_id)
			.filter((id): id is number => id !== undefined);

		// Eliminar duplicados
		const proyectosUnicos = [...new Set(proyectosIds)];

		return mockProyectos.filter((p) => p.id_proyecto && proyectosUnicos.includes(p.id_proyecto));
	}

	// Obtener usuarios con bajas calificaciones (< 3.0)
	const usuariosConCalificaciones: UsuarioConCalificacion[] = Object.values(mockUsuarios)
		.filter((u) => u.rol !== 'administrador') // Excluir administradores
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
		.filter((u) => u.calificacionPromedio > 0 && u.calificacionPromedio < 3.0) // Solo bajas calificaciones
		.sort((a, b) => a.calificacionPromedio - b.calificacionPromedio); // Ordenar de menor a mayor

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
	<title>Usuarios con bajas calificaciones - Panel admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Análisis de calidad" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Usuarios con bajas calificaciones</h1>
			<p class="mt-1 text-sm text-gray-600">
				Análisis de usuarios con calificación promedio menor a 3.0 estrellas
			</p>
		</div>
	</div>

	<!-- Métrica -->
	<section class="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
		<p class="text-xs font-medium text-orange-700">Usuarios con calificación baja</p>
		<p class="mt-2 text-2xl font-semibold text-orange-900">{usuariosConCalificaciones.length}</p>
		<p class="mt-1 text-xs text-orange-600">Calificación promedio menor a 3.0 estrellas</p>
	</section>

	<!-- Lista de usuarios -->
	<section class="space-y-4">
		{#if usuariosConCalificaciones.length === 0}
			<div class="rounded-xl border border-gray-200 bg-white p-8 text-center">
				<p class="text-gray-500">No hay usuarios con bajas calificaciones en este momento</p>
			</div>
		{:else}
			{#each usuariosConCalificaciones as usuario}
				<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
					<div class="mb-4 flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-2 flex items-center gap-3">
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
							<h3 class="mb-1 text-lg font-semibold text-gray-900">
								{usuario.nombre} {usuario.apellido}
							</h3>
							<p class="mb-2 text-sm text-gray-600">@{usuario.username}</p>
							<div class="mt-3 space-y-1 text-xs text-gray-500">
								<p>
									<span class="font-medium">Total de reseñas:</span> {usuario.totalResenas}
								</p>
								<p>
									<span class="font-medium">Proyectos participados:</span> {usuario.proyectosParticipados.length}
								</p>
								<p>
									<span class="font-medium">Estado:</span>
									<span
										class="ml-1 rounded-full px-2 py-0.5 text-[10px] font-medium {usuario.estado ===
										'activo'
											? 'bg-emerald-50 text-emerald-700'
											: 'bg-gray-100 text-gray-600'}"
									>
										{usuario.estado}
									</span>
								</p>
							</div>
						</div>
					</div>

					<Button
						label="Ver detalles y análisis"
						variant="primary"
						size="sm"
						type="button"
						on:click={() => verDetalle(usuario)}
					/>
				</div>
			{/each}
		{/if}
	</section>
</div>

<!-- Modal de detalle -->
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
				// Prevenir propagación de eventos de teclado
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
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<div class="p-6 space-y-6">
				<!-- Reseñas -->
				<section>
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Reseñas y comentarios ({usuarioSeleccionado.resenas.length})</h3>
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
													class="h-4 w-4 {i < resena.puntaje
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
											<span class="ml-2 text-xs font-medium text-gray-600">{resena.puntaje} / 5</span>
										</div>
										<span class="text-xs text-gray-500">Por: {resena.username || 'Usuario'}</span>
									</div>
									<p class="text-sm text-gray-700">{resena.contenido}</p>
								</div>
							{/each}
						</div>
					{/if}
				</section>

				<!-- Proyectos participados -->
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
									<p class="mt-1 text-sm text-gray-600 line-clamp-2">{proyecto.descripcion}</p>
									<div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
										<span>Estado: {
											proyecto.estado 
												? (typeof proyecto.estado === 'object' && proyecto.estado !== null && 'descripcion' in proyecto.estado
													? String((proyecto.estado as { descripcion: unknown }).descripcion)
													: typeof proyecto.estado === 'string' 
														? proyecto.estado 
														: 'N/A')
												: 'N/A'
										}</span>
										{#if proyecto.created_at}
											<span>•</span>
											<span>Creado: {proyecto.created_at.toLocaleDateString('es-AR')}</span>
										{/if}
									</div>
									<a
										href="/admin/proyectos/{proyecto.id_proyecto}"
										class="mt-2 inline-block text-xs text-blue-600 hover:underline"
									>
										Ver proyecto →
									</a>
								</div>
							{/each}
						</div>
					{/if}
				</section>
			</div>

			<div class="sticky bottom-0 border-t border-gray-200 bg-white p-6">
				<div class="flex justify-end gap-2">
					<Button label="Cerrar" variant="secondary" size="sm" type="button" on:click={cerrarDetalle} />
					<a href="/admin/usuarios/{usuarioSeleccionado.id_usuario}">
						<Button label="Ver perfil completo" variant="primary" size="sm" type="button" />
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
