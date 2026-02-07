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
		metricas: {
			proyectosTotales: 12,
			colaboradoresActivos: 48,
			diasProximoCierre: 4,
			solicitudesPendientes: 3,
			mensajesNoLeidos: 2,
			proyectosPendienteCierre: 1,
			estadisticasProyectos: {
				totalDineroRecaudado: 1250000,
				totalBeneficiarios: 1250,
				promedioProgreso: 68,
				proyectosEnAuditoria: [
					{
						id: '99',
						titulo: 'Colecta anual 2024',
						motivo: 'Reporte de usuario por inactividad',
						fecha: '04/02/2026'
					}
				],
				distribucionEstado: [
					{ label: 'En curso', count: 8, percentage: 67, color: '#3b82f6' },
					{ label: 'En revisión', count: 3, percentage: 25, color: '#f59e0b' },
					{ label: 'Completado', count: 1, percentage: 8, color: '#10b981' },
					{ label: 'Cancelado', count: 0, percentage: 0, color: '#ef4444' }
				],
				distribucionCategoria: [
					{ label: 'Educación', count: 5, percentage: 45 },
					{ label: 'Salud', count: 4, percentage: 35 },
					{ label: 'Ambiente', count: 3, percentage: 20 }
				],
				proyectosDestacados: [
					{
						id: '1',
						titulo: 'Campaña de alfabetización',
						estado: 'En curso',
						progreso: 75,
						beneficiarios: 200,
						imagen:
							'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800'
					},
					{
						id: '2',
						titulo: 'Comedor comunitario',
						estado: 'En revisión',
						progreso: 100,
						beneficiarios: 450,
						imagen:
							'https://images.pexels.com/photos/6995244/pexels-photo-6995244.jpeg?auto=compress&cs=tinysrgb&w=800'
					},
					{
						id: '3',
						titulo: 'Huerta escolar',
						estado: 'En curso',
						progreso: 45,
						beneficiarios: 120,
						imagen:
							'https://images.pexels.com/photos/289323/pexels-photo-289323.jpeg?auto=compress&cs=tinysrgb&w=800'
					}
				]
			},
			estadisticasCalendario: {
				verificacion: {
					estado: 'verificada',
					fechaRenovacion: '2026-11-15',
					diasRestantes: 280
				},
				projectTimeline: [
					{
						id: '1',
						titulo: 'Campaña de alfabetización',
						fechaInicio: '2026-01-10',
						fechaFin: '2026-06-30',
						estado: 'En curso',
						color: '#3b82f6'
					},
					{
						id: '2',
						titulo: 'Comedor comunitario',
						fechaInicio: '2025-11-01',
						fechaFin: '2026-02-10',
						estado: 'En revisión',
						color: '#f59e0b'
					},
					{
						id: '3',
						titulo: 'Huerta escolar',
						fechaInicio: '2026-02-01',
						fechaFin: '2026-08-01',
						estado: 'En curso',
						color: '#3b82f6'
					},
					{
						id: '4',
						titulo: 'Taller de oficios',
						fechaInicio: '2026-03-01',
						fechaFin: '2026-09-01',
						estado: 'Planificado',
						color: '#8b5cf6'
					}
				],
				proximosVencimientos: [
					{
						id: '2',
						titulo: 'Cierre: Comedor comunitario',
						fecha: '2026-02-10',
						tipo: 'finalizacion_proyecto'
					},
					{
						id: '5',
						titulo: 'Cierre: Taller de oficios',
						fecha: '2026-02-28',
						tipo: 'finalizacion_proyecto'
					},
					{
						id: '1',
						titulo: 'Cierre: Alfabetización digital',
						fecha: '2026-04-01',
						tipo: 'finalizacion_proyecto'
					}
				]
			},
			estadisticasColaboradores: {
				totalActivos: 48,
				nuevosEsteMes: 5,
				retencion: 92,
				distribucionCategorias: [
					{ label: 'Educación', count: 20, percentage: 42 },
					{ label: 'Salud', count: 12, percentage: 25 },
					{ label: 'Tecnología', count: 8, percentage: 17 },
					{ label: 'Logística', count: 5, percentage: 10 },
					{ label: 'Otros', count: 3, percentage: 6 }
				],
				distribucionUbicacion: [
					{ label: 'CABA', count: 25, percentage: 52 },
					{ label: 'Córdoba', count: 10, percentage: 21 },
					{ label: 'Rosario', count: 8, percentage: 17 },
					{ label: 'Mendoza', count: 5, percentage: 10 }
				],
				topColaboradores: [
					{
						id: '1',
						nombre: 'María González',
						rol: 'Voluntaria',
						avatarUrl:
							'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
						aportes: 'Voluntaria experta',
						proyectos: 5
					},
					{
						id: '2',
						nombre: 'Rotaract Club Arrecifes',
						rol: 'ONG',
						avatarUrl:
							'https://i.pinimg.com/736x/e6/d0/a6/e6d0a617869e30477924328e5e0b94d9.jpg?auto=compress&cs=tinysrgb&w=800',
						aportes: 'Donante recurrente',
						proyectos: 3
					},
					{
						id: '3',
						nombre: 'Lumina Cooperativa',
						rol: 'Empresa eléctrica',
						avatarUrl:
							'https://cdn.dribbble.com/userupload/42833063/file/original-40c78be94d66557b30e5c68b1cc295ce.jpg?auto=compress&cs=tinysrgb&w=800',
						aportes: 'Donante recurrente',
						proyectos: 3
					}
				]
			}
		},
		seguimientoObjetivos: [
			{
				id: '1',
				nombre: 'Comedor comunitario',
				fechaFin: '2026-02-10',
				objetivos: [
					{
						id: '1-1',
						descripcion: 'Voluntarios de cocina',
						tipo: 'voluntariado',
						progreso: 75,
						actual: 15,
						meta: 20,
						unidad: 'personas'
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
						descripcion: 'Fondos de logística',
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
			{
				id: '1',
				nombre: 'María González',
				rol: 'Voluntaria experta',
				aportes: 156,
				avatarUrl:
					'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '2',
				nombre: 'Rotaract Club Arrecifes',
				rol: 'Donante recurrente',
				aportes: 89,
				avatarUrl:
					'https://i.pinimg.com/736x/e6/d0/a6/e6d0a617869e30477924328e5e0b94d9.jpg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '3',
				nombre: 'Lumina Cooperativa',
				rol: 'Empresa eléctrica',
				aportes: 45,
				avatarUrl:
					'https://cdn.dribbble.com/userupload/42833063/file/original-40c78be94d66557b30e5c68b1cc295ce.jpg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '4',
				nombre: 'Carlos Ruiz',
				rol: 'Logística',
				aportes: 32,
				avatarUrl:
					'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '5',
				nombre: 'Ana Torres',
				rol: 'Comunicación',
				aportes: 28,
				avatarUrl:
					'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800'
			}
		],
		actividadReciente: [
			{
				id: '1',
				titulo: 'Nuevo proyecto creado',
				descripcion: 'Se ha publicado correctamente "Campaña de frío".',
				fecha: 'Hace 2 horas',
				tipo: 'proyecto'
			},
			{
				id: '2',
				titulo: 'Colaboración recibida',
				descripcion: 'María González ha enviado una donación monetaria.',
				fecha: 'Hace 5 horas',
				tipo: 'colaboracion'
			},
			{
				id: '3',
				titulo: 'Evidencia cargada',
				descripcion: 'Se subieron 5 fotos al proyecto "Comedor comunitario".',
				fecha: 'Ayer',
				tipo: 'evidencia'
			},
			{
				id: '4',
				titulo: 'Proyecto finalizado',
				descripcion: 'El proyecto "Taller de verano" ha concluido.',
				fecha: 'Hace 2 días',
				tipo: 'proyecto'
			}
		],
		ultimasResenas: [
			{
				id: '1',
				usuario: 'Carlos Ruiz',
				calificacion: 5,
				comentario: 'Excelente organización, muy transparentes.',
				fecha: '2026-01-28',
				avatarUrl:
					'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '2',
				usuario: 'María González',
				calificacion: 5,
				comentario: '¡Siempre es un placer ayudar a Pato y su escuela!',
				fecha: '2026-01-25',
				avatarUrl:
					'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800'
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
					'Agradecer a los últimos 5 donantes.',
					'Publicar más fotos del proyecto.'
				]
			}
		]
	};
</script>

<svelte:head>
	<title>Panel de institución - Conectando Corazones</title>
</svelte:head>

<div
	class="w-full transition-opacity duration-700 ease-out"
	class:opacity-0={!animate}
	class:opacity-100={animate}
>
	<DashboardInstitucion data={mockData} />
</div>
