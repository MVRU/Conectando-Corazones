<!--
* Página: Postulaciones recibidas
  -*- Descripción: Interfaz para que las instituciones gestionen las postulaciones recibidas
  -*- Funcionalidad: Ver, aceptar y rechazar postulaciones, ver colaboradores activos
-->

<script lang="ts">
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import PostulacionesList from '$lib/components/institucion/PostulacionesList.svelte';
	import ColaboradoresActivos from '$lib/components/institucion/ColaboradoresActivos.svelte';
	import ProjectSelector from '$lib/components/institucion/ProjectSelector.svelte';
	import type { ProyectoConPostulaciones, Postulacion, ColaboradorActivo } from '$lib/types/Postulacion';

	// Datos de ejemplo - en una implementación real vendrían del backend
	let proyectos: ProyectoConPostulaciones[] = [
		{
			id: 1,
			titulo: 'Un libro, un sueño',
			descripcion: 'Proyecto para llevar libros educativos a escuelas rurales de la provincia.',
			estado: 'activo',
			fechaCreacion: '2025-01-01',
			postulaciones: [
				{
					id: 1,
					nombre: 'María González',
					tipo: 'persona',
					fecha: '2025-01-15',
					estado: 'pendiente',
					email: 'maria.gonzalez@email.com',
					telefono: '+54 11 1234-5678',
					mensaje: 'Me interesa mucho colaborar con este proyecto. Tengo experiencia en educación y puedo ayudar con la organización de los libros.'
				},
				{
					id: 2,
					nombre: 'Fundación Educar',
					tipo: 'organizacion',
					fecha: '2025-01-14',
					estado: 'pendiente',
					email: 'contacto@fundacioneducar.org',
					telefono: '+54 11 9876-5432',
					mensaje: 'Nuestra fundación está interesada en colaborar con la donación de libros de texto y material didáctico.'
				},
				{
					id: 3,
					nombre: 'Juan Pérez',
					tipo: 'persona',
					fecha: '2025-01-13',
					estado: 'pendiente',
					email: 'juan.perez@email.com',
					mensaje: 'Soy maestro jubilado y me gustaría ayudar con mi experiencia en el área educativa.'
				}
			],
			colaboradoresActivos: [
				{
					id: 4,
					nombre: 'Biblioteca Municipal',
					tipo: 'organizacion',
					fechaAceptacion: '2025-01-10',
					email: 'biblioteca@municipio.gov.ar',
					telefono: '+54 11 5555-0000'
				}
			]
		},
		{
			id: 2,
			titulo: 'Comedores con alma',
			descripcion: 'Apoyo alimentario para familias en situación de vulnerabilidad.',
			estado: 'activo',
			fechaCreacion: '2024-12-15',
			postulaciones: [
				{
					id: 5,
					nombre: 'Supermercado Central',
					tipo: 'organizacion',
					fecha: '2025-01-12',
					estado: 'pendiente',
					email: 'responsabilidad@supermercadocentral.com',
					telefono: '+54 11 4444-3333',
					mensaje: 'Nos interesa donar alimentos no perecederos y productos de primera necesidad semanalmente.'
				}
			],
			colaboradoresActivos: [
				{
					id: 6,
					nombre: 'Ana Rodriguez',
					tipo: 'persona',
					fechaAceptacion: '2024-12-20',
					email: 'ana.rodriguez@email.com',
					telefono: '+54 11 7777-8888'
				},
				{
					id: 7,
					nombre: 'Club de Barrio Norte',
					tipo: 'organizacion',
					fechaAceptacion: '2025-01-05',
					email: 'club@barrionorte.org'
				}
			]
		}
	];

	let proyectoSeleccionado = proyectos[0];
	let postulaciones = proyectoSeleccionado.postulaciones;
	let colaboradoresActivos = proyectoSeleccionado.colaboradoresActivos;

	// Configurar breadcrumbs
	setBreadcrumbs([
		BREADCRUMB_ROUTES.home,
		{ label: 'Postulaciones recibidas' }
	]);

	function cambiarProyecto(proyecto: ProyectoConPostulaciones) {
		proyectoSeleccionado = proyecto;
		postulaciones = proyecto.postulaciones;
		colaboradoresActivos = proyecto.colaboradoresActivos;
	}

	function aceptarPostulacion(event: CustomEvent<number>) {
		const postulacionId = event.detail;
		const postulacion = postulaciones.find(p => p.id === postulacionId);
		if (postulacion) {
			// Mover a colaboradores activos
			colaboradoresActivos = [
				...colaboradoresActivos,
				{
					id: postulacion.id,
					nombre: postulacion.nombre,
					tipo: postulacion.tipo,
					fechaAceptacion: new Date().toISOString().split('T')[0],
					email: postulacion.email,
					telefono: postulacion.telefono
				}
			];
			
			// Remover de postulaciones pendientes
			postulaciones = postulaciones.filter(p => p.id !== postulacionId);
			
			// Actualizar el proyecto en la lista
			const proyectoIndex = proyectos.findIndex(p => p.id === proyectoSeleccionado.id);
			if (proyectoIndex !== -1) {
				proyectos[proyectoIndex].postulaciones = postulaciones;
				proyectos[proyectoIndex].colaboradoresActivos = colaboradoresActivos;
			}

			// Forzar la reactividad
			proyectos = [...proyectos];
		}
	}

	function rechazarPostulacion(event: CustomEvent<number>) {
		const postulacionId = event.detail;
		// Remover de postulaciones pendientes
		postulaciones = postulaciones.filter(p => p.id !== postulacionId);
		
		// Actualizar el proyecto en la lista
		const proyectoIndex = proyectos.findIndex(p => p.id === proyectoSeleccionado.id);
		if (proyectoIndex !== -1) {
			proyectos[proyectoIndex].postulaciones = postulaciones;
		}

		// Forzar la reactividad
		proyectos = [...proyectos];
	}

	// Estadísticas generales
	$: totalPostulaciones = proyectos.reduce((acc, proyecto) => acc + proyecto.postulaciones.length, 0);
	$: totalColaboradores = proyectos.reduce((acc, proyecto) => acc + proyecto.colaboradoresActivos.length, 0);
</script>

<svelte:head>
	<title>Postulaciones recibidas - Conectando Corazones</title>
	<meta name="description" content="Gestiona las postulaciones recibidas para tus proyectos" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))]">
				Postulaciones recibidas
			</h1>
			<p class="mt-2 text-gray-600">
				Gestiona las solicitudes de colaboración para tus proyectos
			</p>
			
			<!-- Estadísticas rápidas -->
			<div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-white rounded-lg p-4 border border-gray-200">
					<div class="flex items-center">
						<div class="text-2xl mr-3">📊</div>
						<div>
							<p class="text-sm text-gray-500">Total proyectos</p>
							<p class="text-2xl font-bold text-gray-900">{proyectos.length}</p>
						</div>
					</div>
				</div>
				
				<div class="bg-white rounded-lg p-4 border border-gray-200">
					<div class="flex items-center">
						<div class="text-2xl mr-3">📥</div>
						<div>
							<p class="text-sm text-gray-500">Postulaciones pendientes</p>
							<p class="text-2xl font-bold text-orange-600">{totalPostulaciones}</p>
						</div>
					</div>
				</div>
				
				<div class="bg-white rounded-lg p-4 border border-gray-200">
					<div class="flex items-center">
						<div class="text-2xl mr-3">🤝</div>
						<div>
							<p class="text-sm text-gray-500">Colaboradores activos</p>
							<p class="text-2xl font-bold text-green-600">{totalColaboradores}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Selector de proyecto -->
		{#if proyectos.length > 1}
			<div class="mb-6">
				<ProjectSelector 
					{proyectos} 
					{proyectoSeleccionado} 
					onChange={cambiarProyecto} 
				/>
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Postulaciones pendientes -->
			<div class="space-y-6">
				<PostulacionesList 
					{postulaciones}
					on:aceptar={aceptarPostulacion}
					on:rechazar={rechazarPostulacion}
				/>
			</div>

			<!-- Colaboradores activos -->
			<div class="space-y-6">
				<ColaboradoresActivos {colaboradoresActivos} />
			</div>
		</div>

		<!-- Sección de acciones adicionales -->
		{#if totalPostulaciones > 0 || totalColaboradores > 0}
			<div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
				<div class="flex flex-wrap gap-3">
					{#if totalPostulaciones > 0}
						<button
							class="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
						>
							📧 Contactar postulantes
						</button>
					{/if}
					
					{#if totalColaboradores > 0}
						<button
							class="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
						>
							📊 Generar reporte
						</button>
					{/if}
					
					<button
						class="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
					>
						⚙️ Configurar notificaciones
					</button>
				</div>
			</div>
		{/if}
	</div>
</main>
