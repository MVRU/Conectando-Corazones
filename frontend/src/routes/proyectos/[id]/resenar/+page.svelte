<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { usuario as usuarioStore, isAuthenticated } from '$lib/stores/auth';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import { mockTestimonios } from '$lib/mocks/mock-testimonios';
	import { yaReseno, obtenerPlaceholderResena, obtenerTituloResena } from '$lib/utils/resenas';
	import type { Resena } from '$lib/types/Resena';
	import type { Proyecto } from '$lib/types/Proyecto';

	// Obtener ID del proyecto desde la URL
	$: proyectoId = $page.params.id ? parseInt($page.params.id) : null;

	// Estado del formulario
	let nuevaResena = { contenido: '', puntaje: 5 };
	let enviando = false;
	let error = '';
	let exito = false;

	// Datos del proyecto
	let proyecto: Proyecto | undefined = undefined;
	let yaResenoProyecto = false;
	let usuarioParticipo = false;
	let cargandoValidaciones = true;

	onMount(async () => {
		cargandoValidaciones = true;
		
		// 1. Cargar proyecto
		if (proyectoId) {
			proyecto = mockProyectos.find(p => p.id_proyecto === proyectoId);
			
			if (!proyecto) {
				error = 'Proyecto no encontrado';
				cargandoValidaciones = false;
				return;
			}

			// 2. Verificar si el proyecto está completado
			if (proyecto.estado !== 'completado') {
				error = 'Solo se pueden reseñar proyectos completados';
				cargandoValidaciones = false;
				return;
			}

			// 3. Verificar autenticación (solo si hay usuario logueado)
			if ($isAuthenticated && $usuarioStore) {
				// 4. Verificar si el usuario participó del proyecto
				usuarioParticipo = await verificarParticipacionUsuario(proyecto, $usuarioStore);
				if (!usuarioParticipo) {
					error = 'Solo pueden reseñar usuarios que hayan participado en este proyecto';
					cargandoValidaciones = false;
					return;
				}

				// 5. Verificar si el usuario ya reseñó este proyecto
				yaResenoProyecto = yaReseno(
					$usuarioStore.username || '', 
					mockTestimonios, 
					'proyecto', 
					proyectoId
				);
			} else {
				// Si no está logueado, permitir reseñar (para testing)
				usuarioParticipo = true;
			}
		}
		
		cargandoValidaciones = false;
	});

	// Función para verificar si el usuario participó del proyecto
	async function verificarParticipacionUsuario(proyecto: Proyecto, usuario: any): Promise<boolean> {
		// TODO: Implementar llamada real a la API para verificar participación
		// TODO: Verificar participación en el proyecto
		
		// Verificar si el usuario está en las colaboraciones del proyecto
		if (proyecto.colaboraciones) {
			const participo = proyecto.colaboraciones.some(colaboracion => 
				colaboracion.colaborador?.id_usuario === usuario.id_usuario &&
				(colaboracion.estado === 'aprobada' || colaboracion.estado === 'pendiente')
			);
			
			if (participo) return true;
		}
		
		// Verificar si el usuario es de la institución que creó el proyecto
		if (usuario.rol === 'institucion' && proyecto.institucion_id === usuario.id_usuario) {
			return true;
		}
		
		return false;
	}

	async function enviarResena() {
		if (!proyecto) return;

		enviando = true;
		error = '';

		try {
			// TODO: Implementar validación de contenido (spam, contenido inapropiado)
			// TODO: Agregar notificación a la institución sobre nueva reseña

			// Simular envío a la API
			await new Promise(resolve => setTimeout(resolve, 1000));

			const resena: Resena = {
				contenido: nuevaResena.contenido.trim(),
				puntaje: nuevaResena.puntaje,
				tipo_objeto: 'proyecto',
				id_objeto: proyecto.id_proyecto,
				username: $usuarioStore?.username || 'usuario_anonimo'
			};

			// TODO: Llamada real a la API para guardar reseña
			// TODO: Implementar rollback en caso de error
			// TODO: Agregar logs de auditoría
			console.log('Reseña enviada:', resena);

			exito = true;
			
			// Redirigir después de 2 segundos
			setTimeout(() => {
				goto(`/proyectos/${proyectoId}`);
			}, 2000);

		} catch (err) {
			error = 'Error al enviar la reseña. Inténtalo de nuevo.';
		} finally {
			enviando = false;
		}
	}

	function cancelar() {
		goto(`/proyectos/${proyectoId}`);
	}
</script>

<svelte:head>
	<title>Reseñar Proyecto - Conectando Corazones</title>
</svelte:head>

{#if cargandoValidaciones}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
			<h2 class="mt-4 text-xl font-semibold text-gray-900">Verificando permisos...</h2>
			<p class="mt-2 text-gray-600">Validando tu participación en el proyecto</p>
		</div>
	</div>
{:else if error}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 text-red-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
			<h2 class="mt-4 text-xl font-semibold text-gray-900">Error</h2>
			<p class="mt-2 text-gray-600">{error}</p>
			<div class="mt-6">
				<button
					on:click={() => goto('/proyectos')}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Volver a Proyectos
				</button>
			</div>
		</div>
	</div>
{:else if exito}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 text-green-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<h2 class="mt-4 text-xl font-semibold text-gray-900">¡Reseña Enviada!</h2>
			<p class="mt-2 text-gray-600">Tu reseña ha sido enviada exitosamente. Redirigiendo...</p>
		</div>
	</div>
{:else if !usuarioParticipo}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 text-yellow-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
			<h2 class="mt-4 text-xl font-semibold text-gray-900">No puedes reseñar este proyecto</h2>
			<p class="mt-2 text-gray-600">Solo pueden reseñar usuarios que hayan participado en este proyecto.</p>
			<div class="mt-6">
				<button
					on:click={() => goto(`/proyectos/${proyectoId}`)}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Ver Proyecto
				</button>
			</div>
		</div>
	</div>
{:else if yaResenoProyecto}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 text-yellow-400">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h2 class="mt-4 text-xl font-semibold text-gray-900">Ya Reseñaste este Proyecto</h2>
			<p class="mt-2 text-gray-600">Ya has enviado una reseña para este proyecto.</p>
			<div class="mt-6">
				<button
					on:click={() => goto(`/proyectos/${proyectoId}`)}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Ver Proyecto
				</button>
			</div>
		</div>
	</div>
{:else if proyecto}
	<main class="min-h-screen bg-gray-50">
		<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="mb-8">
				<button
					on:click={cancelar}
					class="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Volver al proyecto
				</button>
				
				<h1 class="text-3xl font-bold text-gray-900">Reseñar Proyecto</h1>
				<p class="mt-2 text-lg text-gray-600">Comparte tu experiencia con este proyecto completado</p>
			</div>

			<!-- Información del proyecto -->
			<div class="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div class="p-6">
					<div class="flex items-start gap-4">
						{#if proyecto.url_portada}
							<img
								src={proyecto.url_portada}
								alt="Portada del proyecto"
								class="h-20 w-20 rounded-lg object-cover"
							/>
						{/if}
						<div class="flex-1">
							<h2 class="text-xl font-semibold text-gray-900">{proyecto.titulo}</h2>
							<p class="mt-1 text-gray-600 line-clamp-2">{proyecto.descripcion}</p>
							<div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
								<span class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
									Completado
								</span>
								{#if proyecto.institucion}
									<span>por {proyecto.institucion.nombre_legal || proyecto.institucion.nombre}</span>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Formulario de reseña -->
			<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div class="p-6">
					<form on:submit|preventDefault={enviarResena} class="space-y-6">
						<!-- Puntaje -->
						<div>
							<fieldset>
								<legend class="block text-sm font-medium text-gray-700 mb-3">
									¿Cómo calificarías tu experiencia con este proyecto?
								</legend>
								<div class="flex items-center gap-2">
									{#each Array(5).keys() as i}
										<button
											type="button"
											on:click={() => nuevaResena.puntaje = i + 1}
											class="h-10 w-10 {i < nuevaResena.puntaje ? 'text-amber-400' : 'text-gray-300'} hover:text-amber-400 transition-colors"
											aria-label="Puntaje {i + 1} de 5"
										>
											<svg fill="currentColor" viewBox="0 0 20 20" class="h-full w-full">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.955z" />
											</svg>
										</button>
									{/each}
									<span class="ml-3 text-sm text-gray-600">
										{nuevaResena.puntaje === 1 ? 'Muy malo' : 
										 nuevaResena.puntaje === 2 ? 'Malo' : 
										 nuevaResena.puntaje === 3 ? 'Regular' : 
										 nuevaResena.puntaje === 4 ? 'Bueno' : 'Excelente'}
									</span>
								</div>
							</fieldset>
						</div>

						<!-- Contenido -->
						<div>
							<label for="contenido" class="block text-sm font-medium text-gray-700 mb-2">
								Comparte tu experiencia
							</label>
							<textarea
								id="contenido"
								bind:value={nuevaResena.contenido}
								rows="6"
								placeholder="Podes escribir libremente sobre lo que viviste. Si necesitas una guía, te sugerimos incluir:"
								class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required
							></textarea>
							
							<!-- Guía de escritura -->
							<div class="mt-3 rounded-lg bg-blue-50 p-4">
								<h4 class="text-sm font-medium text-blue-900 mb-3">💡 Guía para escribir tu reseña</h4>
								<div class="space-y-2 text-sm text-blue-800">
									<div class="flex items-start gap-2">
										<span class="text-lg">✨</span>
										<div>
											<span class="font-medium">Aspectos positivos:</span> ¿Qué salió bien? ¿Qué fortalezas notaste en el equipo, la organización o los colaboradores?
										</div>
									</div>
									<div class="flex items-start gap-2">
										<span class="text-lg">⚡</span>
										<div>
											<span class="font-medium">Desafíos o dificultades:</span> ¿Qué fue lo más difícil de llevar adelante? ¿Qué hubieras hecho distinto?
										</div>
									</div>
									<div class="flex items-start gap-2">
										<span class="text-lg">🌍</span>
										<div>
											<span class="font-medium">Impacto:</span> ¿Cómo creés que este proyecto benefició a la comunidad o institución?
										</div>
									</div>
									<div class="flex items-start gap-2">
										<span class="text-lg">📖</span>
										<div>
											<span class="font-medium">Anécdotas:</span> ¿Hay alguna historia que quieras compartir?
										</div>
									</div>
								</div>
							</div>
							
							<p class="mt-2 text-sm text-gray-500">
								Mínimo 20 caracteres. Tu reseña ayudará a otros a conocer mejor este proyecto.
							</p>
						</div>

						<!-- Error -->
						{#if error}
							<div class="rounded-lg bg-red-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div class="ml-3">
										<p class="text-sm text-red-800">{error}</p>
									</div>
								</div>
							</div>
						{/if}

						<!-- Botones de acción -->
						<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
							<button
								type="button"
								on:click={cancelar}
								class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={!nuevaResena.contenido.trim() || nuevaResena.contenido.trim().length < 20 || enviando}
								class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{enviando ? 'Enviando...' : 'Publicar Reseña'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</main>
{:else}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-semibold text-gray-900">Cargando proyecto...</h2>
		</div>
	</div>
{/if}
