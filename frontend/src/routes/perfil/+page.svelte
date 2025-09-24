<script lang="ts">
	import { usuario as usuarioStore, isAuthenticated } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import DireccionForm from '$lib/components/forms/DireccionForm.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	onMount(() => {
		if (!$isAuthenticated) {
			goto('/iniciar-sesion');
		}
	});

	// Proyectos del usuario (mock)
	$: proyectosUsuario = mockProyectos.filter(p => p.institucion_id === $usuarioStore?.id_usuario);
	$: proyectosActivos = proyectosUsuario.filter(p => p.estado === 'en_curso');
	$: proyectosCompletados = proyectosUsuario.filter(p => p.estado === 'completado');

	// Estado del modal de edición
	let mostrarModalEdicion = false;

	// Estado de la sección activa
	let seccionActiva = 'informacion';

	function abrirModalEdicion() {
		mostrarModalEdicion = true;
	}

	function cerrarModalEdicion() {
		mostrarModalEdicion = false;
	}

	function handleDireccionSubmit() {
		// Aquí iría la llamada a la API para guardar la dirección
		console.log('Dirección guardada');
		cerrarModalEdicion();
	}

	function obtenerContacto(tipo: string): string {
		const contacto = $usuarioStore?.contactos?.find(c => c.tipo_contacto === tipo);
		return contacto?.valor || 'No disponible';
	}

	function obtenerUbicacion(): string {
		if ($usuarioStore?.direccion) {
			const { calle, numero, localidad } = $usuarioStore.direccion;
			const localidadNombre = localidad?.nombre || 'Localidad no disponible';
			const provincia = localidad?.provincia?.nombre || 'Provincia no disponible';
			return `${calle} ${numero}, ${localidadNombre}, ${provincia}`;
		}
		return 'No disponible';
	}
</script>

<svelte:head>
	<title>Mi Perfil - Conectando Corazones</title>
</svelte:head>

{#if $isAuthenticated && $usuarioStore}
	<main class="min-h-screen bg-gray-50">
		<!-- Header del perfil -->
		<div class="bg-[rgb(var(--base-color))] text-white">
			<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div class="flex items-center gap-4">
					<img
						src={$usuarioStore.url_foto ?? '/users/default-avatar.jpg'}
						alt="Foto de perfil"
						class="h-16 w-16 rounded-full border-4 border-white/20 object-cover"
					/>
					<div>
						<h1 class="text-2xl font-bold">
							{$usuarioStore.nombre} {$usuarioStore.apellido}
						</h1>
						<p class="text-blue-100 capitalize">{$usuarioStore.rol}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Navegación por tabs -->
		<div class="border-b border-gray-200 bg-white">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<nav class="flex space-x-8">
					<button 
						on:click={() => seccionActiva = 'informacion'}
						class="border-b-2 py-4 px-1 text-sm font-medium {seccionActiva === 'informacion' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
					>
						Información
					</button>
					<button 
						on:click={() => seccionActiva = 'activos'}
						class="border-b-2 py-4 px-1 text-sm font-medium {seccionActiva === 'activos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
					>
						Proyectos Activos ({proyectosActivos.length})
					</button>
					<button 
						on:click={() => seccionActiva = 'historial'}
						class="border-b-2 py-4 px-1 text-sm font-medium {seccionActiva === 'historial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
					>
						Historial ({proyectosCompletados.length})
					</button>
				</nav>
			</div>
		</div>

		<!-- Contenido principal -->
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{#if seccionActiva === 'informacion'}
				<!-- Tarjeta de información principal -->
				<div class="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
					<div class="p-8">
						<div class="flex items-start gap-6">
							<img
								src={$usuarioStore.url_foto ?? '/users/default-avatar.jpg'}
								alt="Foto de perfil"
								class="h-24 w-24 rounded-full object-cover"
							/>
							<div class="flex-1">
								<h2 class="text-3xl font-bold text-gray-900">
									{$usuarioStore.rol === 'institucion' ? ($usuarioStore as any).nombre_legal || $usuarioStore.nombre : $usuarioStore.nombre + ' ' + $usuarioStore.apellido}
								</h2>
								<p class="mt-2 text-lg text-gray-600">
									{$usuarioStore.rol === 'institucion' 
										? 'Organización sin fines de lucro comprometida con el desarrollo social'
										: 'Colaborador comprometido con causas sociales'
									}
								</p>
								
								<!-- Tags -->
								<div class="mt-4 flex flex-wrap gap-2">
									{#if $usuarioStore.categorias_preferidas}
										{#each $usuarioStore.categorias_preferidas.slice(0, 3) as categoria}
											<span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
												{categoria.descripcion}
											</span>
										{/each}
									{:else}
										<span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
											{$usuarioStore.rol}
										</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Botón de editar -->
						<div class="mt-6 flex justify-end">
							<button
								on:click={abrirModalEdicion}
								class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
								Editar información
							</button>
						</div>

						<!-- Información de contacto -->
						<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="space-y-4">
								<div>
									<span class="text-sm font-medium text-gray-500">Ubicación</span>
									<p class="text-gray-900">{obtenerUbicacion()}</p>
								</div>
								<div>
									<span class="text-sm font-medium text-gray-500">Contacto</span>
									<p class="text-gray-900">
										{obtenerContacto('email')} • {obtenerContacto('telefono')}
									</p>
								</div>
								{#if $usuarioStore.rol === 'institucion'}
									<div>
										<span class="text-sm font-medium text-gray-500">Número de Institución</span>
										<p class="text-gray-900">#{($usuarioStore as any).numero_institucion || $usuarioStore.id_usuario}</p>
									</div>
								{/if}
							</div>
							<div class="space-y-4">
								<div>
									<span class="text-sm font-medium text-gray-500">Usuario</span>
									<p class="text-gray-900">@{$usuarioStore.username}</p>
								</div>
								<div>
									<span class="text-sm font-medium text-gray-500">Estado</span>
									<p class="text-gray-900 capitalize">{$usuarioStore.estado}</p>
								</div>
								<div>
									<span class="text-sm font-medium text-gray-500">Miembro desde</span>
									<p class="text-gray-900">
										{$usuarioStore.created_at ? new Date($usuarioStore.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) : 'No disponible'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else if seccionActiva === 'activos'}
				<!-- Sección de proyectos activos -->
				{#if proyectosActivos.length > 0}
					<section class="mb-8">
						<div class="mb-6">
							<h3 class="text-2xl font-bold text-gray-900">Proyectos Activos</h3>
							<p class="text-gray-600">Iniciativas en curso que requieren colaboración</p>
						</div>
						<div class="grid gap-6 md:grid-cols-2">
							{#each proyectosActivos as proyecto}
								<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
									{#if proyecto.url_portada}
										<img src={proyecto.url_portada} alt={proyecto.titulo} class="h-48 w-full object-cover" />
									{/if}
									<div class="p-6">
										<h4 class="text-xl font-semibold text-gray-900">{proyecto.titulo}</h4>
										<p class="mt-2 text-gray-600 line-clamp-2">{proyecto.descripcion}</p>
										<div class="mt-4 flex items-center justify-between">
											<span class="text-sm text-gray-500">
												{proyecto.beneficiarios || 0} beneficiarios
											</span>
											<span class="text-sm text-green-600 font-medium">En curso</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{:else}
					<div class="text-center py-12">
						<div class="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-medium text-gray-900">No hay proyectos activos</h3>
						<p class="mt-2 text-gray-500">Cuando crees proyectos, aparecerán aquí.</p>
					</div>
				{/if}
			{:else if seccionActiva === 'historial'}
				<!-- Sección de historial -->
				{#if proyectosCompletados.length > 0}
					<section class="mb-8">
						<div class="mb-6">
							<h3 class="text-2xl font-bold text-gray-900">Historial de Proyectos</h3>
							<p class="text-gray-600">Resultados alcanzados en iniciativas anteriores</p>
						</div>
						<div class="space-y-4">
							{#each proyectosCompletados as proyecto}
								<div class="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
									{#if proyecto.url_portada}
										<img src={proyecto.url_portada} alt={proyecto.titulo} class="h-20 w-20 rounded-lg object-cover" />
									{/if}
									<div class="flex-1">
										<h4 class="font-semibold text-gray-900">{proyecto.titulo}</h4>
										<p class="mt-1 text-sm text-gray-600">{proyecto.descripcion}</p>
										<div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
											<span>Impacto: {proyecto.beneficiarios || 0} beneficiarios</span>
											<span>Finalizado: {proyecto.created_at ? new Date(proyecto.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>
	{:else}
					<div class="text-center py-12">
						<div class="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-medium text-gray-900">No hay proyectos completados</h3>
						<p class="mt-2 text-gray-500">Los proyectos finalizados aparecerán aquí.</p>
					</div>
				{/if}
	{/if}
		</div>
	</main>
{:else}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<h2 class="text-xl font-semibold text-gray-900">Cargando perfil...</h2>
			<p class="text-gray-600 mt-2">Redirigiendo al login...</p>
		</div>
	</div>
{/if}

<!-- Modal de edición -->
{#if mostrarModalEdicion}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" on:click={cerrarModalEdicion}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" on:click|stopPropagation>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Editar dirección</h3>
				<button
					on:click={cerrarModalEdicion}
					aria-label="Cerrar modal"
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
</div>

			<DireccionForm 
				calle={$usuarioStore?.direccion?.calle || ''}
				numero={$usuarioStore?.direccion?.numero || ''}
				piso={$usuarioStore?.direccion?.piso || ''}
				departamento={$usuarioStore?.direccion?.departamento || ''}
				referencia={$usuarioStore?.direccion?.referencia || ''}
				idProvincia={$usuarioStore?.direccion?.localidad?.provincia?.id_provincia?.toString() || ''}
				idLocalidad={$usuarioStore?.direccion?.localidad?.id_localidad?.toString() || ''}
				on:submit={handleDireccionSubmit} 
			/>
		</div>
	</div>
{/if}
