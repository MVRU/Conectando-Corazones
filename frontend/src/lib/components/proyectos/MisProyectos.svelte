<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Usuario } from '$lib/types/Usuario';
	import { mockProyectos as proyectosPorDefecto } from '$lib/mocks/mock-proyectos';
	import { mockCategorias } from '$lib/mocks/mock-categorias';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { writable } from 'svelte/store';
	import { Plus, Search } from 'lucide-svelte';
	import {
		obtenerProvinciasDisponibles,
		obtenerLocalidadesDisponibles,
		filtrarPorLocalidad
	} from '$lib/utils/util-ubicaciones';
	import { calcularProgresoTotal } from '$lib/utils/util-progreso';
	import {
		filtrarProyectos,
		filtrarProyectosPorUsuario,
		filtrarPorTipoUbicacion,
		filtrarPorRangoFechas
	} from '$lib/utils/util-proyectos';
	import {
		TIPO_PARTICIPACION_LABELS,
		type TipoParticipacionDescripcion
	} from '$lib/types/TipoParticipacion';
	import { type EstadoDescripcion, ESTADO_LABELS } from '$lib/types/Estado';
	import ProyectosFiltro from './ProyectosFiltro.svelte';
	import ProyectosLista from './ProyectosLista.svelte';

	export let usuario: Usuario | null = null;
	export let proyectos: Proyecto[] = proyectosPorDefecto;

	let pestanaActiva: 'todos' | 'activos' | 'completados' = 'activos';
	let mostrarFiltros = false;
	let consultaBusqueda = writable('');

	// Filtros
	let filtroParticipacion: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let categoriaSeleccionada = 'Todas';
	let tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	let provinciaSeleccionada = 'Todas';
	let localidadSeleccionada = 'Todas';
	let fechaDesde = '';
	let fechaHasta = '';
	let estadoSeleccionado: 'Todos' | EstadoDescripcion = 'Todos';
	let criterioOrden: 'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso' = 'recientes';

	// Datos derivados para filtros
	let proyectosUsuario: Proyecto[] = [];
	let estadosDisponibles: string[] = [];
	let provinciasDisponibles: string[] = [];
	let localidadesDisponibles: string[] = [];
	let tiposParticipacion: string[] = [];
	let categoriasDisponibles: string[] = ['Todas', ...mockCategorias.map(c => c.descripcion)].sort();

	$: {
		// Filtrar por usuario (Institución o Colaborador)
		proyectosUsuario = filtrarProyectosPorUsuario(proyectos, usuario);

		// Obtener listas para los selects de filtros basadas en los proyectos del usuario
		const estadosSet = new Set<string>();
		const tiposSet = new Set<string>();

		proyectosUsuario.forEach((p) => {
			if (p.estado) estadosSet.add(ESTADO_LABELS[p.estado]);
			p.participacion_permitida?.forEach((pp) => {
				if (pp.tipo_participacion?.descripcion) {
					tiposSet.add(pp.tipo_participacion.descripcion);
				}
			});
		});

		estadosDisponibles = ['Todos', ...Array.from(estadosSet)];
		tiposParticipacion = ['Todos', ...Array.from(tiposSet)];
		provinciasDisponibles = obtenerProvinciasDisponibles(proyectosUsuario);
	}

	// Actualizar localidades cuando cambia la provincia
	$: localidadesDisponibles = obtenerLocalidadesDisponibles(
		proyectosUsuario,
		provinciaSeleccionada
	);

	// Lógica de filtrado principal
	$: proyectosFiltrados = filtrarProyectos(
		proyectosUsuario,
		[filtroParticipacion],
		$consultaBusqueda,
		estadoSeleccionado,
		provinciaSeleccionada,
		categoriaSeleccionada
	);

	// Filtros adicionales encadenados
	$: proyectosFiltradosUbicacion = filtrarPorTipoUbicacion(proyectosFiltrados, tipoUbicacion);
	$: proyectosFiltradosFechas = filtrarPorRangoFechas(
		proyectosFiltradosUbicacion,
		fechaDesde,
		fechaHasta
	);
	$: proyectosFinales = filtrarPorLocalidad(
		proyectosFiltradosFechas,
		localidadSeleccionada,
		tipoUbicacion
	);

	// Clasificación por pestañas (Activos vs Completados)
	$: proyectosActivos = proyectosFinales.filter(
		(p) => p.estado !== 'completado' && p.estado !== 'cancelado'
	);
	$: proyectosCompletados = proyectosFinales.filter(
		(p) => p.estado === 'completado' || p.estado === 'cancelado'
	);

	// Selección de proyectos a mostrar según pestaña
	$: proyectosVisibles =
		pestanaActiva === 'todos'
			? proyectosFinales
			: pestanaActiva === 'activos'
				? proyectosActivos
				: proyectosCompletados;

	// Ordenamiento
	$: {
		proyectosVisibles = [...proyectosVisibles].sort((a, b) => {
			if (criterioOrden === 'recientes' || criterioOrden === 'antiguos') {
				const fechaA = new Date(a.created_at || '').getTime();
				const fechaB = new Date(b.created_at || '').getTime();
				return criterioOrden === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
			} else {
				const progA = calcularProgresoTotal(a);
				const progB = calcularProgresoTotal(b);
				return criterioOrden === 'mayor_progreso' ? progB - progA : progA - progB;
			}
		});
	}

	// Textos dinámicos
	$: tituloSeccion =
		pestanaActiva === 'todos'
			? 'Todos mis proyectos'
			: pestanaActiva === 'activos'
				? 'Proyectos activos'
				: 'Historial de proyectos';

	$: etiquetaEstado =
		pestanaActiva === 'activos' ? 'activos' : pestanaActiva === 'completados' ? 'completados' : '';

	$: tituloVacio =
		$consultaBusqueda.trim() !== ''
			? 'No se encontraron resultados'
			: pestanaActiva === 'activos'
				? 'No tenés proyectos activos'
				: pestanaActiva === 'completados'
					? 'No tenés proyectos en el historial'
					: 'No hay proyectos';

	$: descripcionVacia =
		$consultaBusqueda.trim() !== ''
			? `No hay proyectos que coincidan con "${$consultaBusqueda}" y los filtros seleccionados.`
			: pestanaActiva === 'activos'
				? 'Los proyectos en curso o pendientes aparecerán acá.'
				: pestanaActiva === 'completados'
					? 'Los proyectos que finalicen o se cancelen aparecerán acá.'
					: 'No tenés ningún proyecto asociado a tu cuenta.';

	function restablecerFiltros() {
		filtroParticipacion = 'Todos';
		categoriaSeleccionada = 'Todas';
		tipoUbicacion = 'Todas';
		provinciaSeleccionada = 'Todas';
		localidadSeleccionada = 'Todas';
		fechaDesde = '';
		fechaHasta = '';
		estadoSeleccionado = 'Todos';
		consultaBusqueda.set('');
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-8 sm:px-10 lg:px-20">
	<!-- TABS -->
	<div class="mb-8 flex justify-center">
		<div class="inline-flex rounded-lg bg-gray-100 p-1">
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-colors {pestanaActiva === 'todos'
					? 'bg-white text-gray-900 shadow'
					: 'text-gray-500 hover:text-gray-900'}"
				on:click={() => (pestanaActiva = 'todos')}
			>
				Todos
			</button>
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-colors {pestanaActiva ===
				'activos'
					? 'bg-white text-gray-900 shadow'
					: 'text-gray-500 hover:text-gray-900'}"
				on:click={() => (pestanaActiva = 'activos')}
			>
				Activos
			</button>
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-colors {pestanaActiva ===
				'completados'
					? 'bg-white text-gray-900 shadow'
					: 'text-gray-500 hover:text-gray-900'}"
				on:click={() => (pestanaActiva = 'completados')}
			>
				Completados
			</button>
		</div>
	</div>

	<ProyectosLista
		proyectos={proyectosVisibles}
		bind:consultaBusqueda={$consultaBusqueda}
		titulo={tituloSeccion}
		esHistorial={pestanaActiva === 'completados'}
		{usuario}
		{etiquetaEstado}
		{tituloVacio}
		{descripcionVacia}
	>
		<ProyectosFiltro
			slot="filtros-content"
			prefijoId="mis-proyectos"
			bind:mostrar={mostrarFiltros}
			bind:participacion={filtroParticipacion}
			bind:categoria={categoriaSeleccionada}
			{categoriasDisponibles}
			bind:tipoUbicacion
			bind:provincia={provinciaSeleccionada}
			bind:localidad={localidadSeleccionada}
			bind:fechaDesde
			bind:fechaHasta
			{provinciasDisponibles}
			{localidadesDisponibles}
			{tiposParticipacion}
			mostrarEstado={pestanaActiva === 'todos'}
			bind:estado={estadoSeleccionado}
			{estadosDisponibles}
			bind:criterioOrden
			on:reset={restablecerFiltros}
			on:ubicacionChange={() => {
				provinciaSeleccionada = 'Todas';
				localidadSeleccionada = 'Todas';
			}}
			on:toggle={() => (mostrarFiltros = !mostrarFiltros)}
		/>

		<Button slot="empty-action" label="Limpiar filtros" on:click={restablecerFiltros} />
	</ProyectosLista>

	{#if usuario?.rol === 'institucion'}
		<a
			href="/proyectos/crear"
			class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#007fff] px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#55aaff] hover:shadow-xl sm:bottom-8 sm:right-8"
			aria-label="Crear nuevo proyecto"
		>
			<Plus size={24} />
			<span class="font-medium">Crear proyecto</span>
		</a>
	{:else if usuario?.rol === 'colaborador'}
		<a
			href="/proyectos"
			class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#007fff] px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#55aaff] hover:shadow-xl sm:bottom-8 sm:right-8"
			aria-label="Descubrir proyectos"
		>
			<Search size={24} />
			<span class="font-medium">Descubrir proyectos</span>
		</a>
	{/if}
</section>
