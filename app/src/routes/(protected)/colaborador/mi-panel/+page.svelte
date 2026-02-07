<script lang="ts">
	import { onMount } from 'svelte';
	import DashboardColaborador from '$lib/components/dashboard/DashboardColaborador.svelte';
	import type { ColaboradorDashboardData } from '$lib/components/dashboard/colaborador/types';

	let animate = false;

	onMount(() => {
		animate = true;
	});

	// Mocks de prueba
	const mockData: ColaboradorDashboardData = {
		info: {
			nombre: 'María González',
			tipo: 'Voluntaria', // Voluntario, ONG, Empresa
			fecha: new Date().toLocaleDateString('es-AR', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}),
			ubicacion: 'Rosario, Santa Fe'
		},
		metricas: {
			proyectosTotales: 12,
			institucionesAlcanzadas: 5,
			nuevasInstituciones: 2,
			diasProximoCierre: 4,
			solicitudesPendientes: 3,
			mensajesNoLeidos: 2,
			proyectosPendienteCierre: 1,
			proyectosParaCierre: [
				{
					id: '2',
					titulo: 'Comedor comunitario',
					fechaFin: '2026-02-14',
					estado: 'En revisión'
				},
				{
					id: '4',
					titulo: 'Taller de Oficios',
					fechaFin: '2026-01-30',
					estado: 'En revisión'
				}
			],
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
			},
			estadisticasInstituciones: {
				institucionesAyudadas: [
					{
						id: '1',
						nombre: 'Hospital de Pediatría Prof. Dr. Juan P. Garrahan',
						cantidadProyectos: 8,
						ranking: 1
					},
					{
						id: '2',
						nombre: 'Fundación Banco de Alimentos',
						cantidadProyectos: 6,
						ranking: 2
					},
					{
						id: '3',
						nombre: 'Cáritas Argentina',
						cantidadProyectos: 5,
						ranking: 3
					},
					{
						id: '4',
						nombre: 'Cruz Roja Argentina',
						cantidadProyectos: 4
					},
					{
						id: '5',
						nombre: 'UNICEF Argentina',
						cantidadProyectos: 3
					},
					{
						id: '6',
						nombre: 'Fundación Huésped',
						cantidadProyectos: 2
					}
				],
				colaboraciones: {
					pendientes: 3,
					aprobadas: 45,
					rechazadas: 2,
					total: 50
				}
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
		ultimasResenas: [
			{
				id: '1',
				usuario: 'Fundación Siempre',
				calificacion: 5,
				comentario: 'María es un excelente voluntaria, siempre está dispuesta a ayudar.',
				fecha: '2026-01-28',
				avatarUrl:
					'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '2',
				usuario: 'Hospital de Pediatría Prof. Dr. Juan P. Garrahan',
				calificacion: 5,
				comentario: 'Muy profesional y respetuosa.',
				fecha: '2026-01-25',
				avatarUrl:
					'https://images.pexels.com/photos/7579130/pexels-photo-7579130.jpeg?auto=compress&cs=tinysrgb&w=800'
			}
		],
		estadisticasAyuda: {
			voluntariado: 120,
			monetaria: 45000,
			especie: 15,
			totalProyectos: 12,
			distribucion: {
				voluntariado: 6,
				monetaria: 4,
				especie: 2
			}
		},
		heatmapActividad: [
			{ fecha: '2026-01-01', intensidad: 2 },
			{ fecha: '2026-01-02', intensidad: 5 },
			{ fecha: '2026-01-03', intensidad: 3 },
			{ fecha: '2026-01-04', intensidad: 0 },
			{ fecha: '2026-01-05', intensidad: 4 },
			{ fecha: '2026-01-06', intensidad: 7 },
			{ fecha: '2026-01-07', intensidad: 1 },
			{ fecha: '2026-01-08', intensidad: 6 },
			{ fecha: '2026-01-09', intensidad: 3 },
			{ fecha: '2026-01-10', intensidad: 8 },
			{ fecha: '2026-01-11', intensidad: 2 },
			{ fecha: '2026-01-12', intensidad: 0 },
			{ fecha: '2026-01-13', intensidad: 5 },
			{ fecha: '2026-01-14', intensidad: 4 },
			{ fecha: '2026-02-03', intensidad: 3 }
		],
		proyectosComunidad: [
			{
				id: '1',
				titulo: 'Huerta Comunitaria en Villa Allende',
				institucion: 'EcoSolidario',
				categoria: 'Medio Ambiente',
				ubicacion: 'Villa Allende, Córdoba',
				coincidencia: 95,
				imagen:
					'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '2',
				titulo: 'Apoyo Escolar en Barrio Güemes',
				institucion: 'Fundación Educativa',
				categoria: 'Educación',
				ubicacion: 'Barrio Güemes, Córdoba',
				coincidencia: 88,
				imagen:
					'https://images.pexels.com/photos/8500700/pexels-photo-8500700.jpeg?auto=compress&cs=tinysrgb&w=800'
			},
			{
				id: '3',
				titulo: 'Donación de Alimentos - Comedor Los Pekes',
				institucion: 'Comedor Los Pekes',
				categoria: 'Alimentación',
				ubicacion: 'Nueva Córdoba, Córdoba',
				coincidencia: 82,
				imagen:
					'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800'
			}
		]
	};
</script>

<svelte:head>
	<title>Panel de colaborador - Conectando Corazones</title>
</svelte:head>

<div
	class="w-full transition-opacity duration-700 ease-out"
	class:opacity-0={!animate}
	class:opacity-100={animate}
>
	<DashboardColaborador data={mockData} />
</div>
