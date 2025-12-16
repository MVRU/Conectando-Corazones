<script lang="ts">
	import { usuario as usuarioStore, isAuthenticated, authActions } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	// import DireccionForm eliminado: ubicación ahora está asociada a proyectos
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { EditarPerfilForm } from '$lib/types/forms/EditarPerfilForm';
	import { crearFormularioVacio } from '$lib/types/forms/EditarPerfilForm';
	import MetodosContactoForm from '$lib/components/forms/MetodosContactoForm.svelte';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import ResenaCard from '$lib/components/ui/cards/ResenaCard.svelte';
	import ResenaModal from '$lib/components/modals/ResenaModal.svelte';
	import EditarCategoriasModal from '$lib/components/modals/EditarCategoriasModal.svelte';
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Resena } from '$lib/types/Resena';
	import type { Categoria } from '$lib/types/Categoria';
	import { mockTestimonios } from '$lib/mocks/mock-testimonios';
	import { yaReseno, filtrarResenasPorTipo, obtenerPlaceholderResena, obtenerTituloResena } from '$lib/utils/resenas';
	import { obtenerColorContacto, obtenerColorRol, formatearContacto, formatearEtiquetaContacto, obtenerIconoContacto } from '$lib/utils/util-ui';
	import { obtenerIconoCategoria } from '$lib/utils/util-proyecto-form';
	// import obtenerUbicacionUtil eliminado: ubicación ahora está asociada a proyectos

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

	// Estado del modal de reseñas
	let mostrarModalResena = false;

	// Estado del modal de categorías
	let mostrarModalCategorias = false;

	// Estado de la sección activa
	let seccionActiva = 'informacion';

    // Estado para el formulario de edición
    let datosEdicion: EditarPerfilForm = crearFormularioVacio();

	function abrirModalEdicion() {
		if (!$usuarioStore) return;
		
		// Inicializar datos con los valores actuales del usuario
        datosEdicion = {
            nombre: $usuarioStore.nombre || '',
            apellido: $usuarioStore.apellido || '',
            url_foto: $usuarioStore.url_foto || '',
            contactos: $usuarioStore.contactos ?? []
			// direccion eliminada: ahora está asociada a proyectos
		};
		mostrarModalEdicion = true;
	}

	function cerrarModalEdicion() {
		mostrarModalEdicion = false;
	}

	function handleGuardarPerfil() {
		// Aquí iría la llamada a la API para guardar todos los datos del perfil
		console.log('Perfil guardado:', datosEdicion);
		cerrarModalEdicion();
	}

	function handleCambioFoto(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		
		if (!file) return;
		
		// Validar tipo de archivo
		const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		if (!tiposPermitidos.includes(file.type)) {
			alert('Por favor selecciona un archivo JPG, PNG o GIF válido.');
			return;
		}
		
		// Validar tamaño (5MB máximo)
		const maxSize = 5 * 1024 * 1024; // 5MB en bytes
		if (file.size > maxSize) {
			alert('El archivo es demasiado grande. Máximo 5MB.');
			return;
		}
		
		// Crear URL local para previsualización
		datosEdicion.url_foto = URL.createObjectURL(file);
		
		// TODO: Aquí iría la subida real del archivo a un servicio de almacenamiento
		// y la actualización de la URL en el servidor
	}

	function obtenerContacto(tipo: string): string {
		const contacto = $usuarioStore?.contactos?.find(c => c.tipo_contacto === tipo);
		return contacto?.valor || 'No disponible';
	}

	// TODO: Ubicación eliminada - ahora está asociada a proyectos, no usuarios



	// Funciones para reseñas
	function abrirModalResena() {
		mostrarModalResena = true;
	}

	function cerrarModalResena() {
		mostrarModalResena = false;
	}

	function handleGuardarResena(event: CustomEvent<Resena>) {
		// TODO: Aquí iría la llamada a la API para guardar la reseña
		console.log('Reseña guardada:', event.detail);
		cerrarModalResena();
	}

	// Funciones para categorías
	function abrirModalCategorias() {
		mostrarModalCategorias = true;
	}

	function cerrarModalCategorias() {
		mostrarModalCategorias = false;
	}

	function handleGuardarCategorias(event: CustomEvent<Categoria[]>) {
		// TODO: Aquí iría la llamada a la API para guardar las categorías favoritas
		if ($usuarioStore) {
			// Actualizar el store con las nuevas categorías usando el método del store
			authActions.updateUsuario({
				...$usuarioStore,
				categorias_preferidas: event.detail
			} as any);
			console.log('Categorías guardadas:', event.detail);
		}
		cerrarModalCategorias();
	}

	// Verificar si el usuario actual ya reseñó a este perfil
	$: yaResenoUsuario = yaReseno($usuarioStore?.username || '', mockTestimonios, 'usuario', $usuarioStore?.id_usuario);
	$: reseñasUsuario = filtrarResenasPorTipo(mockTestimonios, 'usuario', $usuarioStore?.id_usuario);
</script>

<svelte:head>
	<title>Mi Perfil - Conectando Corazones</title>
</svelte:head>

{#if $isAuthenticated && $usuarioStore}
	<main class="min-h-screen bg-gray-50">

		<!-- Contenido principal -->
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div class="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
					<div class="p-8">
						<div class="flex items-start gap-6">
							<div class="relative group">
								<img
									src={$usuarioStore.url_foto ?? '/users/default-avatar.jpg'}
									alt="Foto de perfil"
									class="h-24 w-24 rounded-full object-cover"
								/>
								<!-- Overlay con ícono de edición -->
								<div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
									 on:click={abrirModalEdicion}
									 on:keydown={(e) => e.key === 'Enter' && abrirModalEdicion()}
									 role="button"
									 tabindex="0">
									<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</div>
							</div>
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
									<!-- Tag del rol con color -->
									<span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {obtenerColorRol($usuarioStore.rol)}">
										{$usuarioStore.rol}
									</span>
									
									{#if $usuarioStore.categorias_preferidas}
										{#each $usuarioStore.categorias_preferidas.slice(0, 3) as categoria}
											<span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
												{categoria.descripcion}
											</span>
										{/each}
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
						<div class="mt-8 border-t border-gray-200 pt-8">
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<!-- Columna izquierda: Información de contacto y ubicación -->
								<div class="space-y-6">
									<!-- Ubicación eliminada: ahora está asociada a proyectos -->

									<!-- Contacto -->
									<div>
										<div class="mb-3 flex items-center gap-2">
											<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
											<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Información de Contacto</span>
										</div>
										<div class="ml-7 space-y-3">
											{#each ($usuarioStore?.contactos ?? []).slice(0,5) as c}
												<div class="flex items-start gap-3 border-l-2 border-gray-100 pl-3">
													<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={obtenerIconoContacto(c.tipo_contacto)} />
													</svg>
													<div class="flex-1">
														<div class="text-xs font-medium uppercase tracking-wide text-gray-500">
															{c.tipo_contacto === 'email' ? 'Correo Electrónico' : 
															 c.tipo_contacto === 'telefono' ? 'Teléfono' :
															 c.tipo_contacto === 'web' ? 'Sitio Web' :
															 c.tipo_contacto === 'red_social' ? 'Red Social' : c.tipo_contacto}
															{#if c.etiqueta}
																<span class="ml-1 text-gray-400">({formatearEtiquetaContacto(c.etiqueta)})</span>
															{/if}
														</div>
														<p class="mt-0.5 text-sm font-medium text-gray-900">{c.valor}</p>
													</div>
												</div>
											{/each}
										</div>
									</div>

									{#if $usuarioStore.rol === 'institucion'}
										<div>
											<div class="mb-2 flex items-center gap-2">
												<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Número de Institución</span>
											</div>
											<p class="ml-7 text-base font-semibold text-gray-900">#{($usuarioStore as any).numero_institucion || $usuarioStore.id_usuario}</p>
										</div>
									{/if}
								</div>

								<!-- Columna derecha: Información de cuenta -->
								<div class="space-y-6">
									<div>
										<div class="mb-2 flex items-center gap-2">
											<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
											<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Usuario</span>
										</div>
										<p class="ml-7 text-base text-gray-900">@{$usuarioStore.username}</p>
									</div>
									<div>
										<div class="mb-2 flex items-center gap-2">
											<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Estado</span>
										</div>
										<p class="ml-7 text-base capitalize text-gray-900">{$usuarioStore.estado}</p>
									</div>
									<div>
										<div class="mb-2 flex items-center gap-2">
											<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<span class="text-sm font-semibold uppercase tracking-wide text-gray-600">Miembro desde</span>
										</div>
										<p class="ml-7 text-base text-gray-900">
											{$usuarioStore.created_at ? new Date($usuarioStore.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No disponible'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Sección Mis Categorías Favoritas -->
				<section class="mb-8">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-xl font-semibold text-gray-900">Mis Categorías Favoritas</h3>
						<button
							on:click={abrirModalCategorias}
							class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
							Editar
						</button>
					</div>
					{#if $usuarioStore.categorias_preferidas && $usuarioStore.categorias_preferidas.length > 0}
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{#each $usuarioStore.categorias_preferidas as categoria}
								<div class="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
									<div class="flex items-center gap-3">
										<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
											{obtenerIconoCategoria(categoria.descripcion)}
										</div>
										<div class="flex-1">
											<h4 class="font-medium text-gray-900">{categoria.descripcion}</h4>
											<p class="text-sm text-gray-500">Tipo de proyecto favorito</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-center py-12 rounded-xl border border-gray-200 bg-white">
							<div class="mx-auto h-12 w-12 text-gray-400">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
								</svg>
							</div>
							<h3 class="mt-4 text-lg font-medium text-gray-900">No tenés categorías favoritas</h3>
							<p class="mt-2 text-gray-500">Seleccioná tus categorías favoritas para personalizar tu experiencia.</p>
							<button
								on:click={abrirModalCategorias}
								class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								Agregar Categorías
							</button>
						</div>
					{/if}
				</section>

				<!-- Sección Últimos Proyectos -->
				<section class="mb-8">
					<h3 class="mb-4 text-xl font-semibold text-gray-900">Últimos Proyectos</h3>
					{#if proyectosUsuario.length > 0}
						<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{#each proyectosUsuario.slice(0, 3) as proyecto (proyecto.id_proyecto)}
								<ProyectoCard proyecto={proyecto} />
							{/each}
						</div>
					{:else}
						<div class="text-center py-12">
							<div class="mx-auto h-12 w-12 text-gray-400">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
							<h3 class="mt-4 text-lg font-medium text-gray-900">No hay proyectos</h3>
							<p class="mt-2 text-gray-500">
								{$usuarioStore.rol === 'institucion' 
									? 'Cuando crees proyectos, aparecerán aquí.' 
									: 'Cuando participes en proyectos, aparecerán aquí.'
								}
							</p>
						</div>
					{/if}
				</section>

				<!-- Sección Reseñas -->
				<section class="mb-8">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-semibold text-gray-900">Reseñas</h3>
						{#if !yaResenoUsuario}
							<button
								on:click={abrirModalResena}
								class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								Añadir Reseña
							</button>
						{/if}
					</div>
					
					{#if reseñasUsuario.length > 0}
						<div class="grid gap-6 md:grid-cols-2">
							{#each reseñasUsuario.slice(0, 4) as resena (resena.id_resena || resena.contenido)}
								<ResenaCard {resena} />
							{/each}
						</div>
					{:else}
						<div class="text-center py-12">
							<div class="mx-auto h-12 w-12 text-gray-400">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
							</div>
							<h3 class="mt-4 text-lg font-medium text-gray-900">No hay reseñas</h3>
							<p class="mt-2 text-gray-500">Las reseñas aparecerán aquí cuando otros usuarios las dejen.</p>
						</div>
					{/if}
				</section>
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

<!-- Modal de edición de perfil -->
{#if mostrarModalEdicion}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" on:click={cerrarModalEdicion}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" on:click|stopPropagation>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Editar Perfil</h3>
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

			<form on:submit|preventDefault={handleGuardarPerfil} class="space-y-6">
				<!-- Sección de foto de perfil -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Foto de Perfil</h4>
					<div class="flex items-center gap-6">
						<div class="relative">
							<img
								src={datosEdicion.url_foto || '/users/default-avatar.jpg'}
								alt="Foto de perfil"
								class="h-20 w-20 rounded-full object-cover"
							/>
						</div>
						<div>
							<input
								type="file"
								accept="image/*"
								on:change={handleCambioFoto}
								class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							<p class="text-sm text-gray-500 mt-1">JPG, PNG o GIF. Máximo 5MB.</p>
						</div>
					</div>
				</div>

				<!-- Información personal -->
				<div class="border-b border-gray-200 pb-6">
					<h4 class="text-lg font-medium text-gray-900 mb-4">Información Personal</h4>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
							<input
								type="text"
								id="nombre"
								bind:value={datosEdicion.nombre}
								class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label for="apellido" class="block text-sm font-medium text-gray-700">Apellido</label>
							<input
								type="text"
								id="apellido"
								bind:value={datosEdicion.apellido}
								class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

                <!-- Información de contacto (múltiples) -->
                <div class="border-b border-gray-200 pb-6">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Métodos de Contacto</h4>
                    <MetodosContactoForm
                        valoresIniciales={datosEdicion.contactos}
                        on:submit={(e) => {
                            datosEdicion.contactos = e.detail;
                        }}
                    />
                </div>

				<!-- Dirección -->
				<!-- Sección de dirección eliminada: ubicación ahora está asociada a proyectos -->

				<!-- Botones de acción -->
				<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
					<button
						type="button"
						on:click={cerrarModalEdicion}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Cancelar
					</button>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Guardar Cambios
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal de añadir reseña -->
<ResenaModal
	bind:mostrar={mostrarModalResena}
	titulo={obtenerTituloResena('usuario')}
	placeholder={obtenerPlaceholderResena('usuario')}
	tipoObjeto="usuario"
	idObjeto={$usuarioStore?.id_usuario}
	on:guardar={handleGuardarResena}
	on:cerrar={cerrarModalResena}
/>

<!-- Modal de editar categorías favoritas -->
<EditarCategoriasModal
	bind:mostrar={mostrarModalCategorias}
	categoriasSeleccionadas={$usuarioStore?.categorias_preferidas || []}
	on:guardar={handleGuardarCategorias}
	on:cerrar={cerrarModalCategorias}
/>
