<script lang="ts">
	import { onMount } from 'svelte';
	import { authActions, user as userStore } from '$lib/stores/auth';
	import type { User, InstitucionUser } from '$lib/models/User';
	import Loader from '$lib/components/feedback/Loader.svelte';
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import { projects } from '$lib/data/projects';
	import { fade } from 'svelte/transition';
	import Pagination from '$lib/components/ui/navigation/Pagination.svelte';

	let user: User | null = null;
	let institucionUser: InstitucionUser | null = null;
	const estadosDisponibles = ['Todos', 'Abierto', 'En ejecución', 'Finalizado'] as const;
	let filtroEstado = 'Todos';
	let busquedaTitulo = '';

	onMount(async () => {
		await authActions.login('escuela@esperanza.edu.ar', '123456');
	});

	$: if ($userStore) {
		user = $userStore;
		if (user?.role === 'institucion') {
			institucionUser = user as InstitucionUser;
		}
	}

	$: proyectosCreados = institucionUser?.proyectosCreados ?? [];

	function generarGoogleMapsUrl(direccion: any): string {
		const query = `${direccion.calle} ${direccion.numero}, ${direccion.ciudad}, ${direccion.provincia}, Argentina`;
		return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
	}

	$: proyectosFiltrados = proyectosCreados
		.map((id) => projects.find((p) => String(p.id) === String(id)))
		.filter((p) => p !== undefined)
		.filter((p) => {
			const coincideEstado = filtroEstado === 'Todos' || p?.estado === filtroEstado;
			const coincideTitulo = p?.titulo.toLowerCase().includes(busquedaTitulo.trim().toLowerCase());
			return coincideEstado && coincideTitulo;
		});

	function limpiarFiltros() {
		busquedaTitulo = '';
		filtroEstado = 'Todos';
	}

	let paginaActual = 1;
	const proyectosPorPagina = 3;

	$: totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);
	$: proyectosPaginados = proyectosFiltrados.slice(
		(paginaActual - 1) * proyectosPorPagina,
		paginaActual * proyectosPorPagina
	);

	function cambiarPagina(nuevaPagina: number) {
		if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
			paginaActual = nuevaPagina;
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	{#if !user}
		<Loader loading />
	{:else}
		<!-- ! Compartir perfil -->
		<div
			class="mb-10 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 md:justify-end"
		>
			<span class="font-medium">Compartir perfil:</span>

			<!-- -!- Facebook -->
			<a
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
				target="_blank"
				rel="noopener noreferrer"
				class="transition-colors hover:text-blue-600"
				aria-label="Compartir en Facebook"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M22 12A10 10 0 1 0 10.375 21.875V14.75H7.25v-2.875h3.125v-2.25c0-3.1 1.75-4.75 4.438-4.75 1.287 0 2.625.23 2.625.23v2.938h-1.48c-1.46 0-1.907.907-1.907 1.837v1.995h3.25l-.52 2.875h-2.73v7.125A10 10 0 0 0 22 12z"
					/>
				</svg>
			</a>

			<!-- -!- X / Twitter -->
			<a
				href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Conectando%20Corazones%20-%20Perfil%20de%20${user?.username ?? ''}`}
				target="_blank"
				rel="noopener noreferrer"
				class="transition-colors hover:text-black"
				aria-label="Compartir en Twitter / X"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M20.88 3H17.7L12.8 9.65 7.4 3H2.62l6.88 8.58L2.25 21h3.17l5.27-6.55L16.8 21h4.95l-7.28-9.1L20.88 3z"
					/>
				</svg>
			</a>

			<!-- -!- Instagram  -->
			<a
				href="https://www.instagram.com/conectandocorazones"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-colors hover:text-pink-500"
				aria-label="Ir al perfil de Instagram"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2.2a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
					/>
				</svg>
			</a>

			<!-- -!- Email -->
			<a
				href={`mailto:?subject=Conectando Corazones - Perfil de ${user?.nombre}&body=Mirá este perfil solidario: ${window.location.href}`}
				class="transition-colors hover:text-slate-800"
				aria-label="Compartir por email"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 7l8-5H4l8 5zm0 2l-8-5v10h16V8l-8 5z"
					/>
				</svg>
			</a>

			<!-- -!- QR (placeholder) -->
			<button
				on:click={() => alert('Próximamente código QR para compartir')}
				class="cursor-pointer transition-colors hover:text-purple-700"
				aria-label="Compartir mediante QR"
			>
				<svg
					class="h-5 w-5"
					fill="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path
							d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z"
						></path>
						<path
							d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z"
						></path>
						<path
							d="M4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H4Z"
						></path>
						<path
							d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11 6C11 5.44772 10.5523 5 10 5H6C5.44772 5 5 5.44772 5 6V10C5 10.5523 5.44772 11 6 11H10C10.5523 11 11 10.5523 11 10V6ZM9 7.5C9 7.22386 8.77614 7 8.5 7H7.5C7.22386 7 7 7.22386 7 7.5V8.5C7 8.77614 7.22386 9 7.5 9H8.5C8.77614 9 9 8.77614 9 8.5V7.5Z"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M18 13C18.5523 13 19 13.4477 19 14V18C19 18.5523 18.5523 19 18 19H14C13.4477 19 13 18.5523 13 18V14C13 13.4477 13.4477 13 14 13H18ZM15 15.5C15 15.2239 15.2239 15 15.5 15H16.5C16.7761 15 17 15.2239 17 15.5V16.5C17 16.7761 16.7761 17 16.5 17H15.5C15.2239 17 15 16.7761 15 16.5V15.5Z"
						></path>
						<path
							d="M14 5C13.4477 5 13 5.44772 13 6C13 6.55229 13.4477 7 14 7H16.5C16.7761 7 17 7.22386 17 7.5V10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H14Z"
						></path>
						<path
							d="M14 8C13.4477 8 13 8.44771 13 9V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V9C15 8.44772 14.5523 8 14 8Z"
						></path>
						<path
							d="M6 13C5.44772 13 5 13.4477 5 14V16C5 16.5523 5.44772 17 6 17C6.55229 17 7 16.5523 7 16V15.5C7 15.2239 7.22386 15 7.5 15H10C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13H6Z"
						></path>
						<path
							d="M10 17C9.44771 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19C10.5523 19 11 18.5523 11 18C11 17.4477 10.5523 17 10 17Z"
						></path>
					</g></svg
				>
			</button>
		</div>

		<div
			class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg"
		>
			<!-- ! Header -->
			<div class="relative bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 p-8 md:p-12">
				<div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
					<div class="flex flex-col items-center gap-4 md:flex-row md:items-center">
						<div
							class="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md"
						>
							<img
								src={user.profile ?? '/user-default.svg'}
								alt="Foto de perfil"
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="text-center md:text-left">
							<h1 class="text-3xl font-bold text-slate-900">
								{user?.role === 'institucion'
									? (institucionUser?.razonSocial ?? user.nombre)
									: ('tipoColaborador' in user && (user as any).tipoColaborador === 'empresa') ||
										  (user as any).tipoColaborador === 'ong'
										? ((user as any).empresa?.razonSocial ??
											(user as any).ong?.razonSocial ??
											user.nombre)
										: user.nombre}
							</h1>

							<div class="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
								<span
									class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-800"
								>
									{user.role}
								</span>
								{#if institucionUser?.tipoInstitucion}
									<span
										class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium capitalize text-indigo-800"
									>
										{institucionUser.tipoInstitucion}
									</span>
								{/if}
								<span
									class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M20.707 6.293a1 1 0 00-1.414 0L11 14.586l-4.293-4.293a1 1 0 10-1.414 1.414l5 5a1 1 0 001.414 0l10-10a1 1 0 000-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
									Verificado
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- ! Contenido Principal -->
			<div class="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
				<!-- -!- Columna Izquierda -->
				<div class="space-y-6">
					<div
						class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
					>
						<h2 class="mb-4 flex items-center gap-3 text-lg font-semibold text-slate-800">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
							Información institucional
						</h2>
						<ul class="space-y-2 text-sm text-gray-700">
							<li>
								<span class="font-medium">Nombre de usuario:</span>
								{user.username ?? 'No disponible'}
							</li>
							<li><span class="font-medium">Razón social:</span> {institucionUser?.razonSocial}</li>
							<li>
								<span class="font-medium">Fecha de creación:</span>
								{user.createdAt?.toLocaleDateString()}
							</li>
						</ul>
					</div>

					<div
						class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
					>
						<h2 class="mb-4 flex items-center gap-3 text-lg font-semibold text-slate-800">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Representante legal
						</h2>
						<ul class="space-y-2 text-sm text-gray-700">
							<li><span class="font-medium">Nombre completo:</span> {user.nombre}</li>
							<li>
								<span class="font-medium">Documento:</span>
								{user.numeroDocumento ?? ''} ({user.tipoDocumento ?? 'DNI'})
							</li>
							<li>
								<span class="font-medium">Nacimiento:</span>
								{user.fechaNacimiento?.toLocaleDateString() ?? 'no especificado'}
							</li>
						</ul>
					</div>
				</div>

				<!-- -!- Columna Derecha -->
				<div class="space-y-6">
					<div
						class="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
					>
						<h2 class="mb-4 flex items-center gap-3 text-lg font-semibold text-slate-800">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Información de contacto
						</h2>
						<div class="mb-6 space-y-2 text-sm text-gray-700">
							<div class="flex items-center gap-x-2">
								<span class="font-medium text-gray-900">Email:</span>
								<span>{user.email}</span>
							</div>
							<div class="flex items-center gap-x-2">
								<span class="font-medium text-gray-900">Teléfono:</span>
								<span>{user.telefono ?? 'No especificado'}</span>
							</div>
							<div class="flex items-center gap-x-2">
								<span class="font-medium text-gray-900">Sitio web:</span>
								{#if institucionUser?.sitioWeb}
									<a
										href={`https://${institucionUser.sitioWeb}`}
										target="_blank"
										class="text-blue-600 hover:underline"
									>
										{institucionUser.sitioWeb}
									</a>
								{:else}
									<span class="text-gray-500">No especificado</span>
								{/if}
							</div>
						</div>

						{#if institucionUser?.direccion}
							<div class="mt-10">
								<h2 class="mb-4 flex items-center gap-3 text-lg font-semibold text-slate-800">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-blue-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Dirección principal
								</h2>
								<p class="text-sm leading-relaxed text-gray-700">
									{institucionUser.direccion.calle}
									{institucionUser.direccion.numero},
									{institucionUser.direccion.ciudad}, {institucionUser.direccion.provincia} ({institucionUser
										.direccion.codigoPostal})
								</p>
								<iframe
									src={generarGoogleMapsUrl(institucionUser.direccion)}
									class="mt-3 h-48 w-full rounded-lg border border-gray-200 shadow-sm"
									loading="lazy"
									referrerpolicy="no-referrer-when-downgrade"
									title="Ubicación de la institución"
								></iframe>
							</div>
						{/if}
					</div>

					{#if institucionUser?.resenia}
						<div class="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5 shadow-inner">
							<h4 class="mb-2 text-base font-semibold text-yellow-800">
								Reseña sobre Conectando Corazones
							</h4>
							<blockquote class="italic text-gray-700">"{institucionUser.resenia}"</blockquote>
						</div>
					{/if}
				</div>
			</div>

			<!-- ! Proyectos Creados -->
			<div
				class="w-full border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-12 sm:px-8 lg:px-12"
			>
				<div class="mx-auto max-w-7xl">
					<!-- Header de sección -->
					<div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h3 class="text-3xl font-bold tracking-tight text-slate-900">Proyectos creados</h3>
							<p class="mt-1 text-sm text-gray-500">
								Filtrá por título o estado para encontrar proyectos fácilmente.
							</p>
						</div>

						<!-- Filtros -->
						<div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
							<!-- Búsqueda -->
							<div class="relative w-full sm:w-64">
								<input
									id="busquedaTitulo"
									type="text"
									bind:value={busquedaTitulo}
									placeholder="Buscar por título..."
									class="peer block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
								<svg
									class="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400 transition-all duration-200 peer-focus:text-blue-500"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
									/>
								</svg>
							</div>

							<!-- Estado -->
							<div class="relative w-full sm:w-48">
								<select
									id="filtroEstado"
									bind:value={filtroEstado}
									class="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								>
									{#each estadosDisponibles as estado}
										<option value={estado}>{estado}</option>
									{/each}
								</select>
								<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
									<svg class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<!-- Resultados -->
					{#if proyectosCreados.length === 0}
						<div
							class="rounded-xl border border-dashed border-blue-200 bg-blue-50 px-6 py-8 text-center shadow-sm"
							in:fade
						>
							<p class="text-base font-medium text-blue-900">
								Esta institución aún no ha creado proyectos.
							</p>
						</div>
					{:else}
						<!-- Contador y botón limpiar -->
						<div
							class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
						>
							{#if proyectosFiltrados.length > 0}
								<p class="text-sm text-gray-500">
									{#if proyectosFiltrados.length === 1}
										Se encontró <strong>1</strong> proyecto.
									{:else}
										Se encontraron <strong>{proyectosFiltrados.length}</strong> proyectos.
									{/if}
								</p>
							{/if}
							{#if filtroEstado !== 'Todos' || busquedaTitulo.trim()}
								<button
									on:click={limpiarFiltros}
									class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-blue-50 hover:shadow-md active:scale-[.98] active:shadow-inner"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="h-4 w-4"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
									Limpiar filtros
								</button>
							{/if}
						</div>

						<!-- Mensaje sin resultados -->
						{#if proyectosFiltrados.length === 0}
							<div
								class="rounded-xl border border-dashed border-red-200 bg-red-50 px-6 py-8 text-center shadow-sm"
								in:fade
							>
								<p class="text-base font-medium text-red-900">
									{#if busquedaTitulo.trim() && filtroEstado !== 'Todos'}
										No se encontraron proyectos con el título "<strong>{busquedaTitulo}</strong>" y
										estado "<strong>{filtroEstado}</strong>".
									{:else if busquedaTitulo.trim()}
										No se encontraron proyectos con el título "<strong>{busquedaTitulo}</strong>".
									{:else if filtroEstado !== 'Todos'}
										No se encontraron proyectos con el estado "<strong>{filtroEstado}</strong>".
									{:else}
										No se encontraron proyectos que coincidan con los filtros aplicados.
									{/if}
								</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{#each proyectosPaginados as proyecto (proyecto.id)}
									<div in:fade>
										<ProjectCard proyecto={{ ...proyecto }} />
									</div>
								{/each}
							</div>

							<!-- Paginación -->
							{#if totalPaginas > 1}
								<Pagination
									totalPages={totalPaginas}
									currentPage={paginaActual}
									onPageChange={(nueva) => cambiarPagina(nueva)}
								/>
							{/if}
						{/if}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
