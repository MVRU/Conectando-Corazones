<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import { obtenerColorRol } from '$lib/utils/util-ui';
	import BadgeVerificacion from '$lib/components/ui/badges/BadgeVerificacion.svelte';
	import type { EstadoVerificacionDisplay } from '$lib/utils/util-verificacion';
	import { Pencil, Camera } from 'lucide-svelte';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let esMiPerfil: boolean;
	export let estadoVerificacion: EstadoVerificacionDisplay;
	export let onEditarClick: () => void;

	function obtenerNombreCompleto(usuario: UsuarioCompleto): string {
		if (usuario.rol === 'institucion') {
			return (usuario as any).nombre_legal || usuario.nombre;
		}
		if (usuario.rol === 'colaborador' && (usuario as any).tipo_colaborador === 'organizacion') {
			return (usuario as any).razon_social || `${usuario.nombre} ${usuario.apellido}`;
		}
		return `${usuario.nombre} ${usuario.apellido}`;
	}

	function obtenerSubtipoBadge(usuario: UsuarioCompleto): { texto: string; clases: string } | null {
		if (usuario.rol === 'institucion') {
			return {
				texto: (usuario as Institucion).tipo_institucion,
				clases: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10'
			};
		}

		if (usuario.rol === 'colaborador') {
			const tipoColaborador = (usuario as any).tipo_colaborador;

			if (tipoColaborador === 'unipersonal') {
				return {
					texto: 'Unipersonal',
					clases: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
				};
			}

			if (tipoColaborador === 'organizacion') {
				const esConFines = (usuario as Organizacion).con_fines_de_lucro;
				return {
					texto: esConFines ? 'Org. con fines de lucro' : 'Org. sin fines de lucro',
					clases: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
				};
			}
		}

		return null;
	}

	function debeMostrarRepresentante(usuario: UsuarioCompleto): boolean {
		return (
			usuario.rol === 'institucion' ||
			(usuario.rol === 'colaborador' && (usuario as any).tipo_colaborador === 'organizacion')
		);
	}

	$: nombreCompleto = obtenerNombreCompleto(perfilUsuario);
	$: subtipoBadge = obtenerSubtipoBadge(perfilUsuario);
	$: mostrarRepresentante = debeMostrarRepresentante(perfilUsuario);
</script>

<div
	class="flex w-full flex-col items-start gap-6 transition-all duration-300 md:flex-row md:gap-8"
>
	<!-- Foto de perfil con overlay de edición -->
	<div class="group relative mx-auto shrink-0 md:mx-0">
		<div
			class="relative h-28 w-28 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white md:h-32 md:w-32"
		>
			<img
				src={perfilUsuario.url_foto ?? '/logo-1.png'}
				alt="Foto de perfil"
				class="h-full w-full object-cover"
			/>
			{#if esMiPerfil}
				<!-- Overlay con ícono de edición -->
				<button
					class="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 backdrop-blur-[1px] transition-all duration-200 group-hover:opacity-100"
					on:click={onEditarClick}
					aria-label="Cambiar foto de perfil"
				>
					<Camera class="h-8 w-8 text-white drop-shadow-md" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Información del perfil -->
	<div class="w-full min-w-0 flex-1 pt-2 text-center md:text-left">
		<!-- Header superior con nombre y botón -->
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div>
				<h1 class="text-2xl leading-tight font-bold text-gray-900 md:text-3xl">
					{nombreCompleto}
				</h1>

				{#if mostrarRepresentante}
					<p class="mt-1 text-sm text-gray-500">
						Representante Legal: <span class="font-medium text-gray-700"
							>{perfilUsuario.nombre} {perfilUsuario.apellido}</span
						>
					</p>
				{/if}

				<!-- Badges container -->
				<div class="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
					<!-- Badge del rol -->
					{#if perfilUsuario.rol === 'administrador'}
						<span
							class="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 transition-colors ring-inset"
						>
							Administrador
						</span>
					{:else}
						<span
							class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 transition-colors ring-inset {obtenerColorRol(
								perfilUsuario.rol
							)}"
						>
							{perfilUsuario.rol === 'institucion' ? 'Institución' : 'Colaborador'}
						</span>
					{/if}

					<!-- Badge del subtipo -->
					{#if subtipoBadge}
						<span
							class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors {subtipoBadge.clases}"
						>
							{subtipoBadge.texto}
						</span>
					{/if}

					<!-- Badge de verificación (Solo para Instituciones) -->
					{#if perfilUsuario.rol === 'institucion'}
						<BadgeVerificacion estado={estadoVerificacion} />
					{/if}
				</div>
			</div>

			{#if esMiPerfil}
				<button
					class="group hidden shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow md:inline-flex"
					on:click={onEditarClick}
					type="button"
				>
					<Pencil class="h-4 w-4 transition-transform group-hover:scale-110" />
					Editar perfil
				</button>
			{/if}
		</div>

		<!-- Descripción -->
		{#if perfilUsuario.descripcion}
			<p class="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 md:mx-0 md:text-base">
				{perfilUsuario.descripcion}
			</p>
		{/if}

		<!-- Botón editar móvil -->
		{#if esMiPerfil}
			<button
				on:click={onEditarClick}
				class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100 md:hidden"
			>
				<Pencil class="h-4 w-4 text-gray-500" />
				Editar perfil
			</button>
		{/if}
	</div>
</div>
