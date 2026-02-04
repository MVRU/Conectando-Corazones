<!--
* Componente: Dashboard Institución
	-*- TODO: corregir en PR de dashboard
-->

<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { clsx } from 'clsx';
	import { FileText, FolderPlus, CheckCircle, Upload } from 'lucide-svelte';

	let {
		institucionInfo,
		proyectosActivos = [],
		solicitudesPendientes = 0
	} = $props<{
		institucionInfo: {
			nombre: string;
			tipoInstitucion?: string;
			totalRecaudado: number;
			proyectosPublicados: number;
			proyectosActivos: number;
		};
		proyectosActivos: Proyecto[];
		solicitudesPendientes?: number;
	}>();

	const proyectosRecientes = $derived(proyectosActivos.slice(0, 3));

	function formatearMonto(monto: number): string {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			minimumFractionDigits: 0
		}).format(monto);
	}
</script>

<div class="w-full space-y-8">
	<!-- Header con información de la institución -->
	<div class="text-center lg:text-left">
		<div class="mb-3 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
			<h2 class="text-3xl font-bold text-gray-900">
				{institucionInfo.nombre}
			</h2>
			{#if institucionInfo.tipoInstitucion}
				<span
					class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
				>
					{institucionInfo.tipoInstitucion}
				</span>
			{/if}
		</div>
		<p class="text-gray-600">Panel de gestión de proyectos solidarios</p>
	</div>

	<!-- Tarjetas de estadísticas -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Proyectos Publicados -->
		<div
			class="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:shadow-md"
		>
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-blue-600">Proyectos publicados</p>
					<p class="mt-2 text-3xl font-bold text-blue-900">
						{institucionInfo.proyectosPublicados}
					</p>
				</div>
				<div class="rounded-lg bg-blue-200/50 p-3">
					<FileText class="h-6 w-6 text-blue-700" />
				</div>
			</div>
		</div>

		<!-- Proyectos Activos -->
		<div
			class="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:shadow-md"
		>
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-green-600">Proyectos activos</p>
					<p class="mt-2 text-3xl font-bold text-green-900">
						{institucionInfo.proyectosActivos}
					</p>
				</div>
				<div class="rounded-lg bg-green-200/50 p-3">
					<CheckCircle class="h-6 w-6 text-green-700" />
				</div>
			</div>
		</div>

		<!-- Total Recaudado -->
		<div
			class="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1"
		>
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-purple-600">Total recaudado</p>
					<p class="mt-2 text-2xl font-bold text-purple-900 lg:text-3xl">
						{formatearMonto(institucionInfo.totalRecaudado)}
					</p>
				</div>
				<div class="rounded-lg bg-purple-200/50 p-3">
					<svg
						class="h-6 w-6 text-purple-700"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>

	<!-- Proyectos Recientes -->
	{#if proyectosRecientes.length > 0}
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Proyectos recientes</h3>
				<button
					onclick={() => goto('/proyectos/mis-proyectos')}
					class="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
				>
					Ver todos →
				</button>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each proyectosRecientes as proyecto}
					<button
						onclick={() => goto(`/proyectos/${proyecto.id_proyecto}`)}
						class="group rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
					>
						<div class="mb-3 flex items-start justify-between">
							<span
								class={clsx(
									'inline-block rounded-full px-3 py-1 text-xs font-semibold',
									proyecto.estado === 'en_curso' && 'bg-green-100 text-green-700',
									proyecto.estado === 'pendiente' && 'bg-yellow-100 text-yellow-700',
									proyecto.estado === 'completado' && 'bg-blue-100 text-blue-700',
									proyecto.estado === 'cancelado' && 'bg-red-100 text-red-700'
								)}
							>
								{proyecto.estado === 'en_curso'
									? 'En curso'
									: proyecto.estado === 'pendiente'
										? 'Pendiente'
										: proyecto.estado === 'completado'
											? 'Completado'
											: 'Cancelado'}
							</span>
						</div>
						<h4
							class="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
						>
							{proyecto.titulo}
						</h4>
						<p class="line-clamp-2 text-sm text-gray-600">
							{proyecto.descripcion}
						</p>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Botones de Acción -->
	<div class="space-y-4 rounded-2xl bg-gray-50 p-6">
		<h3 class="text-lg font-semibold text-gray-900">Acciones rápidas</h3>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Solicitudes de Colaboración -->
			<button
				onclick={() => goto('/institucion/solicitudes-colaboracion')}
				class="group relative overflow-hidden rounded-xl border-2 border-blue-200 bg-white p-4 text-left transition-all hover:border-blue-400 hover:shadow-md"
			>
				{#if solicitudesPendientes > 0}
					<span
						class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
					>
						{solicitudesPendientes}
					</span>
				{/if}
				<div class="mb-3 inline-flex rounded-lg bg-blue-100 p-2">
					<FileText class="h-5 w-5 text-blue-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-blue-600">
					Solicitudes de colaboración
				</h4>
				<p class="mt-1 text-sm text-gray-600">
					{solicitudesPendientes > 0
						? `${solicitudesPendientes} pendiente${solicitudesPendientes > 1 ? 's' : ''}`
						: 'Gestionar colaboradores'}
				</p>
			</button>

			<!-- Crear Nuevo Proyecto -->
			<button
				onclick={() => goto('/proyectos/crear')}
				class="group overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 text-left transition-all hover:border-purple-400 hover:shadow-md"
			>
				<div class="mb-3 inline-flex rounded-lg bg-purple-100 p-2">
					<FolderPlus class="h-5 w-5 text-purple-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-purple-600">
					Crear nuevo proyecto
				</h4>
				<p class="mt-1 text-sm text-gray-600">Publica una nueva necesidad</p>
			</button>

			<!-- Solicitar Cierre -->
			<button
				onclick={() => goto('/institucion/solicitar-cierre')}
				class="group overflow-hidden rounded-xl border-2 border-green-200 bg-white p-4 text-left transition-all hover:border-green-400 hover:shadow-md"
			>
				<div class="mb-3 inline-flex rounded-lg bg-green-100 p-2">
					<CheckCircle class="h-5 w-5 text-green-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-green-600">Solicitar cierre</h4>
				<p class="mt-1 text-sm text-gray-600">Finalizar proyecto activo</p>
			</button>

			<!-- Mis Evidencias -->
			<button
				onclick={() => {
					const primerProyecto = proyectosActivos[0];
					if (primerProyecto) {
						goto(`/institucion/proyectos/${primerProyecto.id_proyecto}/aportes/evidencias`);
					} else {
						goto('/proyectos/mis-proyectos');
					}
				}}
				class="group overflow-hidden rounded-xl border-2 border-orange-200 bg-white p-4 text-left transition-all hover:border-orange-400 hover:shadow-md"
				disabled={proyectosActivos.length === 0}
			>
				<div class="mb-3 inline-flex rounded-lg bg-orange-100 p-2">
					<Upload class="h-5 w-5 text-orange-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-orange-600">Mis evidencias</h4>
				<p class="mt-1 text-sm text-gray-600">Evidencias de salida cargadas</p>
			</button>
		</div>
	</div>

	<!-- CTA Principal para crear proyecto (mobile) -->
	<div class="flex justify-center lg:hidden">
		<Button
			label="Crear Nuevo Proyecto"
			variant="primary"
			size="md"
			onclick={() => goto('/proyectos/crear')}
		/>
	</div>
</div>
