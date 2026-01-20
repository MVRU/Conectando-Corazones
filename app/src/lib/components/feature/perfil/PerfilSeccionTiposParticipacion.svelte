<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/types/Usuario';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { INFO_TIPOS_PARTICIPACION } from '$lib/utils/constants';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let esMiPerfil: boolean;
	export let onEditarClick: () => void;

	$: tiposParticipacion = perfilUsuario.tipos_participacion_preferidas || [];
	$: tieneTipos = tiposParticipacion.length > 0;
</script>

{#if perfilUsuario.rol === 'colaborador'}
	<section class="mb-8">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-xl font-semibold text-gray-900">
				{esMiPerfil ? 'Mis Tipos de Participación Favoritas' : 'Tipos de Participación Favoritas'}
			</h3>
			{#if esMiPerfil}
				<button
					on:click={onEditarClick}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Editar
				</button>
			{/if}
		</div>

		{#if tieneTipos}
			<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each tiposParticipacion as tipoParticipacion}
					{@const info = INFO_TIPOS_PARTICIPACION[tipoParticipacion.descripcion]}
					<div
						class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
					>
						<div class="flex w-full items-center gap-3">
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-{info.color}-50">
								<Icon src={info.icon} class="h-6 w-6 text-{info.color}-600" />
							</div>
							<h4 class="font-medium text-gray-900">{info.titulo}</h4>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="rounded-xl border border-gray-200 bg-white py-12 text-center">
				<div class="mx-auto h-12 w-12 text-gray-400">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
				</div>
				<h3 class="mt-4 text-lg font-medium text-gray-900">
					No hay tipos de participación favoritas
				</h3>
				<p class="mt-2 text-gray-500">
					{esMiPerfil
						? 'Seleccioná tus formas favoritas de participar en proyectos.'
						: 'Este colaborador aún no ha seleccionado tipos de participación favoritas.'}
				</p>
				{#if esMiPerfil}
					<button
						on:click={onEditarClick}
						class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Agregar Tipos de Participación
					</button>
				{/if}
			</div>
		{/if}
	</section>
{/if}
