<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/types/Usuario';
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
					texto: esConFines 
						? 'Org. con fines de lucro' 
						: 'Org. sin fines de lucro',
					clases: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
				};
			}
		}
		
		return null;
	}
	
	function debeMostrarRepresentante(usuario: UsuarioCompleto): boolean {
		return usuario.rol === 'institucion' || 
			(usuario.rol === 'colaborador' && (usuario as any).tipo_colaborador === 'organizacion');
	}

	$: nombreCompleto = obtenerNombreCompleto(perfilUsuario);
	$: subtipoBadge = obtenerSubtipoBadge(perfilUsuario);
	$: mostrarRepresentante = debeMostrarRepresentante(perfilUsuario);
</script>

<div class="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full transition-all duration-300">
	<!-- Foto de perfil con overlay de edición -->
	<div class="relative group mx-auto md:mx-0 shrink-0">
		<div class="relative h-28 w-28 md:h-32 md:w-32 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-white">
			<img
				src={perfilUsuario.url_foto ?? '/logo-1.png'}
				alt="Foto de perfil"
				class="h-full w-full object-cover"
			/>
			{#if esMiPerfil}
				<!-- Overlay con ícono de edición -->
				<button 
					class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-[1px]"
					on:click={onEditarClick}
					aria-label="Cambiar foto de perfil"
				>
					<Camera class="h-8 w-8 text-white drop-shadow-md" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Información del perfil -->
	<div class="flex-1 w-full min-w-0 text-center md:text-left pt-2">
		<!-- Header superior con nombre y botón -->
		<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
			<div>
				<h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
					{nombreCompleto}
				</h1>
				
				{#if mostrarRepresentante}
					<p class="text-sm text-gray-500 mt-1">
						Representante Legal: <span class="font-medium text-gray-700">{perfilUsuario.nombre} {perfilUsuario.apellido}</span>
					</p>
				{/if}
				
				<!-- Badges container -->
				<div class="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
					<!-- Badge del rol -->
					{#if perfilUsuario.rol === 'administrador'}
						<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors bg-purple-50 text-purple-700 ring-purple-700/10">
							Administrador
						</span>
					{:else}
						<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors {obtenerColorRol(perfilUsuario.rol)}">
							{perfilUsuario.rol === 'institucion' ? 'Institución' : 'Colaborador'}
						</span>
					{/if}
					
					<!-- Badge del subtipo -->
					{#if subtipoBadge}
						<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors {subtipoBadge.clases}">
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
					class="hidden md:inline-flex px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm hover:shadow transition-all items-center gap-2 shrink-0 group"
					on:click={onEditarClick}
					type="button"
				>
					<Pencil class="h-4 w-4 group-hover:scale-110 transition-transform" />
					Editar perfil
				</button>
			{/if}
		</div>
		
		<!-- Descripción -->
		{#if perfilUsuario.descripcion}
			<p class="mt-4 text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto md:mx-0">
				{perfilUsuario.descripcion}
			</p>
		{/if}

		<!-- Botón editar móvil -->
		{#if esMiPerfil}
			<button
				on:click={onEditarClick}
				class="md:hidden mt-6 w-full inline-flex justify-center items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
			>
				<Pencil class="h-4 w-4 text-gray-500" />
				Editar perfil
			</button>
		{/if}
	</div>
</div>
