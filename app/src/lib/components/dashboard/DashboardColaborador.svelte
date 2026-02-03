<!--
* Componente: Dashboard Colaborador
	-*- TODO: corregir en PR de dashboard
-->

<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { clsx } from 'clsx';
	import { Send, CheckSquare, Upload, Heart } from 'lucide-svelte';

	let {
		colaboradorInfo,
		proyectosActivos = [],
		evaluacionesPendientes = 0
	} = $props<{
		colaboradorInfo: {
			nombre: string;
			apellido: string;
			tipoColaborador?: string;
			proyectosColaborando: number;
			aportesRealizados: number;
			evaluacionesPendientes: number;
		};
		proyectosActivos: Proyecto[];
		evaluacionesPendientes?: number;
	}>();

	const proyectosRecientes = $derived(proyectosActivos.slice(0, 3));
	const nombreCompleto = $derived(`${colaboradorInfo.nombre} ${colaboradorInfo.apellido}`);
</script>

<div class="w-full space-y-8">
	<!-- Header con saludo personalizado -->
	<div class="text-center lg:text-left">
		<div class="mb-3 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
			<h2 class="text-3xl font-bold text-gray-900">
				¡Hola, {colaboradorInfo.nombre}!
			</h2>
			{#if colaboradorInfo.tipoColaborador}
				<span
					class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
				>
					{colaboradorInfo.tipoColaborador === 'unipersonal' ? 'Voluntario' : 'Organización'}
				</span>
			{/if}
		</div>
		<p class="text-gray-600">Tu impacto en proyectos solidarios</p>
	</div>

	<!-- Tarjetas de estadísticas -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Proyectos Colaborando -->
		<div
			class="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:shadow-md"
		>
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-blue-600">Proyectos Colaborando</p>
					<p class="mt-2 text-3xl font-bold text-blue-900">
						{colaboradorInfo.proyectosColaborando}
					</p>
				</div>
				<div class="rounded-lg bg-blue-200/50 p-3">
					<Heart class="h-6 w-6 text-blue-700" />
				</div>
			</div>
		</div>

		<!-- Aportes Realizados -->
		<div
			class="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:shadow-md"
		>
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-purple-600">Aportes Realizados</p>
					<p class="mt-2 text-3xl font-bold text-purple-900">
						{colaboradorInfo.aportesRealizados}
					</p>
				</div>
				<div class="rounded-lg bg-purple-200/50 p-3">
					<Upload class="h-6 w-6 text-purple-700" />
				</div>
			</div>
		</div>

		<!-- Evaluaciones Pendientes -->
		<div
			class="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1"
		>
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium text-orange-600">Evaluaciones Pendientes</p>
					<p class="mt-2 text-3xl font-bold text-orange-900">
						{colaboradorInfo.evaluacionesPendientes}
					</p>
				</div>
				<div class="rounded-lg bg-orange-200/50 p-3">
					<CheckSquare class="h-6 w-6 text-orange-700" />
				</div>
			</div>
		</div>
	</div>

	<!-- Proyectos Activos donde Colaboro -->
	{#if proyectosRecientes.length > 0}
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-xl font-semibold text-gray-900">Mis Proyectos Activos</h3>
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
	{:else}
		<!-- Estado vacío si no colabora en ningún proyecto -->
		<div class="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
				<Heart class="h-8 w-8 text-gray-400" />
			</div>
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Aún no colaborás en ningún proyecto</h3>
			<p class="mb-4 text-gray-600">
				Descubrí proyectos que necesitan tu ayuda y comenzá a generar impacto
			</p>
			<Button
				label="Descubrir Proyectos"
				variant="primary"
				size="sm"
				onclick={() => goto('/proyectos')}
			/>
		</div>
	{/if}

	<!-- Botones de Acción -->
	<div class="space-y-4 rounded-2xl bg-gray-50 p-6">
		<h3 class="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Mis Solicitudes -->
			<button
				onclick={() => goto('/colaborador/solicitudes-colaboracion')}
				class="group overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 text-left transition-all hover:border-blue-400 hover:shadow-md"
			>
				<div class="mb-3 inline-flex rounded-lg bg-blue-100 p-2">
					<Send class="h-5 w-5 text-blue-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-blue-600">
					Mis Solicitudes de Colaboración
				</h4>
				<p class="mt-1 text-sm text-gray-600">Ver solicitudes enviadas</p>
			</button>

			<!-- Evaluar Finalización -->
			<button
				onclick={() => {
					const primerProyecto = proyectosActivos[0];
					if (primerProyecto) {
						goto(`/colaborador/proyectos/${primerProyecto.id_proyecto}/evaluar-cierre`);
					} else {
						goto('/proyectos/mis-proyectos');
					}
				}}
				class="group relative overflow-hidden rounded-xl border-2 border-orange-200 bg-white p-4 text-left transition-all hover:border-orange-400 hover:shadow-md"
				disabled={proyectosActivos.length === 0}
			>
				{#if evaluacionesPendientes > 0}
					<span
						class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
					>
						{evaluacionesPendientes}
					</span>
				{/if}
				<div class="mb-3 inline-flex rounded-lg bg-orange-100 p-2">
					<CheckSquare class="h-5 w-5 text-orange-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-orange-600">
					Evaluar Finalización
				</h4>
				<p class="mt-1 text-sm text-gray-600">
					{evaluacionesPendientes > 0
						? `${evaluacionesPendientes} pendiente${evaluacionesPendientes > 1 ? 's' : ''}`
						: 'Revisar cierres de proyectos'}
				</p>
			</button>

			<!-- Mis Aportes -->
			<button
				onclick={() => goto('/colaborador/mis-aportes')}
				class="group overflow-hidden rounded-xl border-2 border-purple-200 bg-white p-4 text-left transition-all hover:border-purple-400 hover:shadow-md"
			>
				<div class="mb-3 inline-flex rounded-lg bg-purple-100 p-2">
					<Upload class="h-5 w-5 text-purple-600" />
				</div>
				<h4 class="font-semibold text-gray-900 group-hover:text-purple-600">Mis Aportes</h4>
				<p class="mt-1 text-sm text-gray-600">Evidencias de entrada cargadas</p>
			</button>
		</div>
	</div>

	<!-- CTA Principal para descubrir proyectos (mobile) -->
	<div class="flex justify-center lg:hidden">
		<Button
			label="Descubrir Proyectos"
			variant="primary"
			size="md"
			onclick={() => goto('/proyectos')}
		/>
	</div>
</div>
