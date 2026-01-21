<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import StatusBadge from '$lib/components/ui/badges/StatusBadge.svelte';
	import LocationDisplay from '$lib/components/ui/badges/LocationDisplay.svelte';
	import { Photo, EllipsisHorizontal, Flag } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';
	import { pushState } from '$app/navigation';
	import { clickOutside } from '$lib/utils/util-click-outside';
	import { haReportado } from '$lib/utils/util-reportes';
	import { usuario } from '$lib/stores/auth';

	export let proyecto: Proyecto;
	export let esAdministrador: boolean = false;
	export let esCreador: boolean = false;

	let mostrarMenuReportar = false;
	let yaReporto = false;

	$: if ($usuario && proyecto?.id_proyecto) {
		yaReporto = haReportado($usuario.id_usuario, proyecto.id_proyecto);
	}

	function reportarIrregularidad() {
		mostrarMenuReportar = false;
		pushState(`/proyectos/${proyecto.id_proyecto}/reportar`, {
			showReportModal: true
		});
	}
</script>

<div class="group relative h-48 w-full overflow-hidden rounded-xl shadow-lg md:h-64 lg:h-80">
	{#if proyecto.url_portada}
		<img
			src={proyecto.url_portada}
			alt={proyecto.titulo}
			class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
		/>
	{:else}
		<div
			class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100"
		>
			<Icon src={Photo} class="h-16 w-16 text-blue-300" />
		</div>
	{/if}

	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

	<!-- Menú de más acciones -->
	{#if $usuario && !esCreador && !esAdministrador}
		<div class="absolute top-4 right-4 z-10">
			<div class="relative" use:clickOutside={() => (mostrarMenuReportar = false)}>
				<button
					type="button"
					class="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:ring-2 focus:ring-white/50 focus:outline-none"
					on:click={() => (mostrarMenuReportar = !mostrarMenuReportar)}
					aria-label="Más acciones"
					aria-expanded={mostrarMenuReportar}
				>
					<Icon src={EllipsisHorizontal} class="h-6 w-6" />
				</button>

				{#if mostrarMenuReportar}
					<div
						class="absolute top-full right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu-button"
						tabindex="-1"
					>
						<button
							type="button"
							class={yaReporto
								? 'flex w-full cursor-not-allowed items-center px-4 py-2 text-sm text-gray-400'
								: 'flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'}
							role="menuitem"
							tabindex="-1"
							on:click={reportarIrregularidad}
							disabled={yaReporto}
						>
							<Icon
								src={Flag}
								class="mr-3 h-4 w-4 {yaReporto ? 'text-gray-400' : 'text-gray-500'}"
							/>
							{yaReporto ? 'Reporte pendiente' : 'Reportar irregularidad'}
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class="absolute bottom-0 left-0 w-full p-4 text-white sm:p-6">
		<div class="flex flex-col gap-2">
			<div class="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
				<StatusBadge estado={proyecto.estado} />
				<LocationDisplay {proyecto} variant="badge" />
			</div>

			<h1
				class="flex flex-wrap items-center gap-2 text-2xl leading-tight font-bold text-shadow-sm sm:text-3xl lg:text-4xl"
			>
				{proyecto.titulo}
				{#if esAdministrador}
					<span
						class="inline-flex items-center rounded-md bg-slate-900/80 px-2 py-1 text-sm font-normal text-white ring-1 ring-white/20 backdrop-blur-sm"
					>
						ID: {proyecto.id_proyecto}
					</span>
				{/if}
			</h1>

			{#if proyecto.institucion?.nombre_legal}
				{#if obtenerUrlPerfil(proyecto.institucion)}
					<a
						href={obtenerUrlPerfil(proyecto.institucion)}
						class="text-lg font-medium text-white/90 transition-colors hover:text-white hover:underline"
					>
						{proyecto.institucion.nombre_legal}
					</a>
				{:else}
					<p class="text-lg font-medium text-white/90">
						{proyecto.institucion.nombre_legal}
					</p>
				{/if}
			{/if}

			{#if esAdministrador}
				<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-white/80">
					<span>
						Creado: {proyecto.created_at
							? new Date(proyecto.created_at).toLocaleDateString('es-AR')
							: '-'}
					</span>
					<span>•</span>
					<span>
						Actualizado: {proyecto.updated_at
							? new Date(proyecto.updated_at).toLocaleDateString('es-AR')
							: '-'}
					</span>
				</div>
			{/if}
		</div>
	</div>
</div>

