<script lang="ts">
	import { onMount } from 'svelte';
	import DashboardInstitucion from '$lib/components/dashboard/DashboardInstitucion.svelte';
	import type { PageData } from './$types';
	import type { InstitucionDashboardData } from '$lib/components/dashboard/institucion/types';

	export let data: PageData;
	const { usuario } = data;

	let animate = false;

	onMount(() => {
		animate = true;
	});

	// Mocks de prueba
	const mockData: InstitucionDashboardData = {
		info: {
			nombre: (usuario as any).nombre_legal || 'Fundación Esperanza',
			tipo: (usuario as any).tipo_institucion || 'Escuela',
			fecha: new Date().toLocaleDateString('es-AR', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}),
			ubicacion: (usuario as any).domicilio_legal || 'Rosario, Santa Fe'
		},
		metrics: {
			proyectosTotales: 12,
			colaboradoresActivos: 48,
			diasProximoCierre: 4
		},
		seguimientoObjetivos: [
			{
				id: '1',
				nombre: 'Comedor comunitario',
				fechaFin: '2026-03-01',
				objetivos: [
					{
						id: '1-1',
						descripcion: 'Voluntarios de cocina',
						tipo: 'voluntariado',
						progreso: 75,
						actual: 15,
						meta: 20,
						unidad: 'pers.'
					},
					{
						id: '1-2',
						descripcion: 'Alimentos',
						tipo: 'especie',
						progreso: 40,
						actual: 200,
						meta: 500,
						unidad: 'kg'
					}
				]
			},
			{
				id: '2',
				nombre: 'Recolección de útiles',
				fechaFin: '2026-02-28',
				objetivos: [
					{
						id: '2-1',
						descripcion: 'Donaciones de kits',
						tipo: 'especie',
						progreso: 45,
						actual: 45,
						meta: 100,
						unidad: 'kits'
					},
					{
						id: '2-2',
						descripcion: 'Fondos logística',
						tipo: 'monetaria',
						progreso: 80,
						actual: 40000,
						meta: 50000,
						unidad: 'ARS'
					}
				]
			},
			{
				id: '3',
				nombre: 'Taller digital',
				fechaFin: '2026-04-15',
				objetivos: [
					{
						id: '3-1',
						descripcion: 'Tutores de Python',
						tipo: 'voluntariado',
						progreso: 20,
						actual: 2,
						meta: 10,
						unidad: 'tutores'
					}
				]
			}
		],
		estadisticasAyuda: {
			voluntariado: 45,
			monetaria: 30,
			especie: 25,
			totalBeneficiarios: 1250
		},
		topColaboradores: [
			{ id: '1', nombre: 'María González', rol: 'Voluntaria experta', aportes: 156, avatarUrl: '' },
			{ id: '2', nombre: 'Juan Pérez', rol: 'Donante recurrente', aportes: 89, avatarUrl: '' },
			{ id: '3', nombre: 'Lucía Méndez', rol: 'Facilitadora', aportes: 45, avatarUrl: '' },
			{ id: '4', nombre: 'Carlos Ruiz', rol: 'Logística', aportes: 32, avatarUrl: '' },
			{ id: '5', nombre: 'Ana Torres', rol: 'Comunicación', aportes: 28, avatarUrl: '' }
		],
		actividadReciente: [
			{
				id: '1',
				titulo: 'Nuevo proyecto creado',
				descripcion: 'Se ha publicado correctamente "Campaña de Frio".',
				fecha: 'Hace 2 horas',
				tipo: 'proyecto'
			},
			{
				id: '2',
				titulo: 'Colaboración recibida',
				descripcion: 'Juan Pérez ha enviado una donación monetaria.',
				fecha: 'Hace 5 horas',
				tipo: 'colaboracion'
			},
			{
				id: '3',
				titulo: 'Evidencia cargada',
				descripcion: 'Se subieron 5 fotos al proyecto "Comedor".',
				fecha: 'Ayer',
				tipo: 'sistema'
			},
			{
				id: '4',
				titulo: 'Proyecto finalizado',
				descripcion: 'El proyecto "Taller de Verano" ha concluido.',
				fecha: 'Hace 2 días',
				tipo: 'proyecto'
			}
		],
		ultimasResenas: [
			{
				id: '1',
				usuario: 'Pedro Gomez',
				calificacion: 5,
				comentario: 'Excelente organización, muy transparentes.',
				fecha: '2026-01-28'
			},
			{
				id: '2',
				usuario: 'Sofía L.',
				calificacion: 4,
				comentario: 'Gran experiencia de voluntariado!',
				fecha: '2026-01-25'
			}
		],
		aspectosMejorar: [
			{
				id: '1',
				proyecto: 'Comedor comunitario',
				sugerencias: [
					'Actualizar estado al menos una vez por semana.',
					'Subir fotos de los voluntarios trabajando.',
					'Responder consultas pendientes en el chat.'
				]
			},
			{
				id: '2',
				proyecto: 'Recolección de útiles',
				sugerencias: [
					'Especificar puntos de entrega exactos.',
					'Agradecer a los últimos 5 donantes.'
				]
			}
		]
	};
</script>

<svelte:head>
	<title>Panel de Institución - Conectando Corazones</title>
</svelte:head>

<div
	class="w-full transition-opacity duration-700 ease-out"
	class:opacity-0={!animate}
	class:opacity-100={animate}
>
	<DashboardInstitucion data={mockData} />
</div>
