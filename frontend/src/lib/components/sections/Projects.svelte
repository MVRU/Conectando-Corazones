<!--
* Componente: Projects
	-*- Descripción: Muestra una lista de proyectos con información detallada y filtros
	-*- Funcionalidad: Filtros por tipo de participación, búsqueda y paginación

* Props:
	-*- proyectos (array): lista de proyectos a mostrar

TODO:
	- [ ] Implementar paginación
	- [ ] Agregar búsqueda por texto
	- [ ] Conectar con backend para datos reales
	- [ ] Implementar ordenamiento por diferentes criterios
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ui/ProjectCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Tipos de participación disponibles
	const tiposParticipacion = [
		'Todos',
		'Monetaria',
		'Voluntariado',
		'Materiales'
	];

	// Estado reactivo para el filtro
	let filtroSeleccionado = 'Todos';
	let proyectosVisibles: any[] = [];

	// Datos de ejemplo de proyectos con estructura argentina
	const proyectos = [
		{
			id: 1,
			nombre: 'Centro de Rehabilitación Infantil',
			descripcion: 'Construcción de un centro especializado para la rehabilitación de niños con discapacidades motoras. Necesitamos fondos para equipamiento médico y acondicionamiento de las instalaciones.',
			institucion: 'Fundación Sonrisas',
			fechaInicio: '2024-01-15',
			fechaCierre: '2024-06-30',
			provincia: 'Buenos Aires',
			ciudad: 'La Plata',
			tipoParticipacion: 'Monetaria',
			objetivo: '$50.000.000',
			progreso: 32000000,
			objetivoNumerico: 50000000,
			unidadMedida: 'pesos',
			estado: 'Activo',
			urgencia: 'Alta',
			beneficiarios: 150,
			solicitudesColaboracion: 12
		},
		{
			id: 2,
			nombre: 'Colchones para Refugio Temporal',
			descripcion: 'Se necesitan colchones nuevos y en buen estado para el refugio de familias desplazadas por la emergencia climática.',
			institucion: 'ONG Manos Solidarias',
			fechaInicio: '2024-02-01',
			fechaCierre: '2024-04-30',
			provincia: 'Santa Fe',
			ciudad: 'Rosario',
			tipoParticipacion: 'Materiales',
			objetivo: '25 colchones',
			progreso: 18,
			objetivoNumerico: 25,
			unidadMedida: 'colchones',
			estado: 'Activo',
			urgencia: 'Media',
			beneficiarios: 75,
			solicitudesColaboracion: 8
		},
		{
			id: 3,
			nombre: 'Programa de Alfabetización Digital',
			descripcion: 'Enseñanza de habilidades digitales básicas para adultos mayores. Buscamos voluntarios con conocimientos en informática para dictar clases personalizadas.',
			institucion: 'Centro Educativo Digital',
			fechaInicio: '2024-03-01',
			fechaCierre: '2024-08-15',
			provincia: 'Córdoba',
			ciudad: 'Córdoba Capital',
			tipoParticipacion: 'Voluntariado',
			objetivo: '12 instructores voluntarios',
			progreso: 7,
			objetivoNumerico: 12,
			unidadMedida: 'voluntarios',
			estado: 'Activo',
			urgencia: 'Baja',
			beneficiarios: 80,
			solicitudesColaboracion: 5
		},
		{
			id: 4,
			nombre: 'Equipamiento Médico Hospitalario',
			descripcion: 'Adquisición de equipos médicos esenciales para el hospital público de la comunidad: desfibrilador, monitor multiparamétrico y bomba de infusión.',
			institucion: 'Hospital General San José',
			fechaInicio: '2024-01-01',
			fechaCierre: '2024-05-31',
			provincia: 'Mendoza',
			ciudad: 'Mendoza Capital',
			tipoParticipacion: 'Monetaria',
			objetivo: '$75.000.000',
			progreso: 68000000,
			objetivoNumerico: 75000000,
			unidadMedida: 'pesos',
			estado: 'Próximo a cerrar',
			urgencia: 'Alta',
			beneficiarios: 500,
			solicitudesColaboracion: 25
		},
		{
			id: 5,
			nombre: 'Apoyo Escolar Comunitario',
			descripcion: 'Necesitamos docentes y estudiantes universitarios para dar clases de apoyo en matemática, lengua y ciencias a niños en situación de vulnerabilidad social.',
			institucion: 'Instituto de Formación Laboral',
			fechaInicio: '2024-04-01',
			fechaCierre: '2024-10-30',
			provincia: 'Tucumán',
			ciudad: 'San Miguel de Tucumán',
			tipoParticipacion: 'Voluntariado',
			objetivo: '8 docentes voluntarios',
			progreso: 3,
			objetivoNumerico: 8,
			unidadMedida: 'voluntarios',
			estado: 'Activo',
			urgencia: 'Media',
			beneficiarios: 60,
			solicitudesColaboracion: 3
		},
		{
			id: 6,
			nombre: 'Alimentos No Perecederos',
			descripcion: 'Recolección de alimentos no perecederos (arroz, fideos, aceite, conservas) para abastecer comedores comunitarios durante el invierno.',
			institucion: 'Red de Comedores Unidos',
			fechaInicio: '2024-02-15',
			fechaCierre: '2024-12-31',
			provincia: 'Buenos Aires',
			ciudad: 'Quilmes',
			tipoParticipacion: 'Materiales',
			objetivo: '500 kg de alimentos',
			progreso: 320,
			objetivoNumerico: 500,
			unidadMedida: 'kilogramos',
			estado: 'Activo',
			urgencia: 'Alta',
			beneficiarios: 200,
			solicitudesColaboracion: 15
		},
		{
			id: 7,
			nombre: 'Ropa de Abrigo Invernal',
			descripcion: 'Se solicitan camperas, buzos, mantas y frazadas en buen estado para personas en situación de calle durante los meses de frío.',
			institucion: 'Fundación Calor Humano',
			fechaInicio: '2024-03-15',
			fechaCierre: '2024-06-30',
			provincia: 'Buenos Aires',
			ciudad: 'CABA',
			tipoParticipacion: 'Materiales',
			objetivo: '100 prendas de abrigo',
			progreso: 45,
			objetivoNumerico: 100,
			unidadMedida: 'prendas',
			estado: 'Activo',
			urgencia: 'Alta',
			beneficiarios: 100,
			solicitudesColaboracion: 7
		},
		{
			id: 8,
			nombre: 'Cuidadores de Adultos Mayores',
			descripcion: 'Buscamos voluntarios para acompañar y brindar cuidados básicos a adultos mayores en hogar geriátrico. Se requiere disponibilidad de tiempo y paciencia.',
			institucion: 'Hogar Santa Teresa',
			fechaInicio: '2024-01-20',
			fechaCierre: '2024-12-20',
			provincia: 'Santa Fe',
			ciudad: 'Santa Fe Capital',
			tipoParticipacion: 'Voluntariado',
			objetivo: '15 cuidadores voluntarios',
			progreso: 9,
			objetivoNumerico: 15,
			unidadMedida: 'voluntarios',
			estado: 'Activo',
			urgencia: 'Media',
			beneficiarios: 45,
			solicitudesColaboracion: 4
		},
		{
			id: 9,
			nombre: 'Computadoras para Escuela Rural',
			descripcion: 'La escuela rural necesita equipos informáticos para que los alumnos puedan acceder a herramientas digitales. Buscamos computadoras en buen estado.',
			institucion: 'Escuela Rural N° 123',
			fechaInicio: '2024-03-10',
			fechaCierre: '2024-07-15',
			provincia: 'Salta',
			ciudad: 'Cafayate',
			tipoParticipacion: 'Materiales',
			objetivo: '20 computadoras',
			progreso: 6,
			objetivoNumerico: 20,
			unidadMedida: 'computadoras',
			estado: 'Activo',
			urgencia: 'Media',
			beneficiarios: 85,
			solicitudesColaboracion: 3
		},
		{
			id: 10,
			nombre: 'Becas Universitarias',
			descripcion: 'Programa de becas para estudiantes de bajos recursos que desean acceder a la educación superior. Cada beca cubre matrícula y materiales por un año.',
			institucion: 'Fundación Educación para Todos',
			fechaInicio: '2024-02-20',
			fechaCierre: '2024-11-30',
			provincia: 'Neuquén',
			ciudad: 'Neuquén Capital',
			tipoParticipacion: 'Monetaria',
			objetivo: '$12.000.000',
			progreso: 4500000,
			objetivoNumerico: 12000000,
			unidadMedida: 'pesos',
			estado: 'Activo',
			urgencia: 'Baja',
			beneficiarios: 24,
			solicitudesColaboracion: 18
		}
	];

	// Función para filtrar proyectos
	function filtrarProyectos() {
		if (filtroSeleccionado === 'Todos') {
			proyectosVisibles = proyectos;
		} else {
			proyectosVisibles = proyectos.filter(proyecto => proyecto.tipoParticipacion === filtroSeleccionado);
		}
	}

	// Inicializar al montar el componente
	onMount(() => {
		filtrarProyectos();
	});

	// Reactividad para el filtro
	$: if (filtroSeleccionado) {
		filtrarProyectos();
	}
</script>

<section class="w-full px-8 py-12">
	<!-- Título de la sección -->
	<div style="margin-bottom: var(--spacing-3xl);">
		<h2 class="text-[rgb(var(--base-color))]">Proyectos Activos</h2>
		<p class="font-inter text-lg text-gray-600 max-w-3xl">
			Descubrí los proyectos que necesitan tu colaboración. Cada iniciativa busca generar un impacto positivo en nuestra comunidad. Podés participar con donaciones monetarias, materiales específicos o como voluntario.
		</p>
	</div>

	<!-- Filtros -->
	<div style="margin-bottom: var(--spacing-3xl);">
		<h3 class="text-[rgb(var(--base-color))]">Filtrar por tipo de participación</h3>
		<div class="flex flex-wrap" style="gap: var(--spacing-md);">
			{#each tiposParticipacion as tipo}
				<button
					on:click={() => filtroSeleccionado = tipo}
					class="font-inter rounded-lg transition-all duration-200 font-medium border-2"
					style="padding: var(--spacing-md-sm) var(--spacing-lg);"
					class:bg-primary={filtroSeleccionado === tipo}
					class:text-white={filtroSeleccionado === tipo}
					class:border-[rgb(var(--color-primary))]={filtroSeleccionado === tipo}
					class:bg-white={filtroSeleccionado !== tipo}
					class:text-[rgb(var(--base-color))]={filtroSeleccionado !== tipo}
					class:border-gray-200={filtroSeleccionado !== tipo}
					class:hover:border-[rgb(var(--color-primary))]={filtroSeleccionado !== tipo}
					class:hover:text-[rgb(var(--color-primary))]={filtroSeleccionado !== tipo}
				>
					{tipo}
				</button>
			{/each}
		</div>
	</div>

	<!-- Contador de proyectos -->
	<div style="margin-bottom: var(--spacing-2xl);">
		<p class="font-inter text-[rgb(var(--base-color))] font-medium">
			Mostrando {proyectosVisibles.length} proyecto{proyectosVisibles.length !== 1 ? 's' : ''}
			{#if filtroSeleccionado !== 'Todos'}
				de tipo {filtroSeleccionado}
			{/if}
		</p>
	</div>

	<!-- Lista de proyectos -->
	<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each proyectosVisibles as proyecto}
			<ProjectCard {proyecto} mostrarBotones={true} />
		{/each}
	</div>

	<!-- Mensaje cuando no hay proyectos -->
	{#if proyectosVisibles.length === 0}
		<div class="text-center py-12">
			<h3 class="text-[rgb(var(--base-color))] mb-4">No hay proyectos disponibles</h3>
			<p class="font-inter text-gray-600 mb-6">
				No se encontraron proyectos para el filtro seleccionado. 
				Intentá con otro tipo de participación.
			</p>
			<Button 
				label="Ver todos los proyectos" 
				href="/projects"
				disabled={false}
			/>
		</div>
	{/if}
</section>

 