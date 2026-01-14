<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/types/Usuario';
	import { obtenerColorRol } from '$lib/utils/util-ui';
	import BadgeVerificacion from '$lib/components/ui/badges/BadgeVerificacion.svelte';
	import type { EstadoVerificacionDisplay } from '$lib/utils/util-verificacion';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	export let perfilUsuario: UsuarioCompleto;
	export let esMiPerfil: boolean;
	export let estadoVerificacion: EstadoVerificacionDisplay;
	export let onEditarClick: () => void;

	function obtenerNombreCompleto(usuario: UsuarioCompleto): string {
		if (usuario.rol === 'institucion') {
			return (usuario as any).nombre_legal || usuario.nombre;
		}
		return `${usuario.nombre} ${usuario.apellido}`;
	}

	function obtenerSubtipoBadge(usuario: UsuarioCompleto): { texto: string; clases: string } | null {
		if (usuario.rol === 'institucion') {
			return {
				texto: (usuario as Institucion).tipo_institucion,
				clases: 'bg-blue-100 text-blue-800'
			};
		}
		
		if (usuario.rol === 'colaborador') {
			const tipoColaborador = (usuario as any).tipo_colaborador;
			
			if (tipoColaborador === 'unipersonal') {
				return {
					texto: 'Unipersonal',
					clases: 'bg-green-100 text-green-800'
				};
			}
			
			if (tipoColaborador === 'organizacion') {
				const esConFines = (usuario as Organizacion).con_fines_de_lucro;
				return {
					texto: esConFines 
						? 'Organización con fines de lucro' 
						: 'Organización sin fines de lucro',
					clases: 'bg-green-100 text-green-800'
				};
			}
		}
		
		return null;
	}

	$: nombreCompleto = obtenerNombreCompleto(perfilUsuario);
	$: subtipoBadge = obtenerSubtipoBadge(perfilUsuario);
</script>

<div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
	<!-- Foto de perfil con overlay de edición -->
	<div class="relative group flex justify-center w-full sm:w-auto">
		<img
			src={perfilUsuario.url_foto ?? '/logo-1.png'}
			alt="Foto de perfil"
			class="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover mx-auto"
		/>
		{#if esMiPerfil}
			<!-- Overlay con ícono de edición solo en perfil propio -->
			<div 
				class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
				on:click={onEditarClick}
				on:keydown={(e) => e.key === 'Enter' && onEditarClick()}
				role="button"
				tabindex="0"
			>
				<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</div>
		{/if}
	</div>

	<!-- Información del perfil -->
	<div class="flex-1 w-full min-w-0">
		<!-- Nombre y botón de editar -->
		<div class="flex items-center justify-between">
			<h2 class="text-3xl font-bold text-gray-900">
				{nombreCompleto}
			</h2>
			   {#if esMiPerfil}
				   <button
					   class="hidden sm:inline-flex ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors items-center gap-2"
					   on:click={onEditarClick}
					   type="button"
				   >
					   <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
					   </svg>
					   Editar
				   </button>
			   {/if}
		</div>
		
		<!-- Tags/Badges -->
		<div class="mt-2 flex flex-wrap justify-center sm:justify-start gap-2 w-full">
			<!-- Badge del rol -->
			<span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {obtenerColorRol(perfilUsuario.rol)}">
				{perfilUsuario.rol === 'institucion' ? 'Institución' : 'Colaborador'}
			</span>
			<!-- Badge del subtipo -->
			{#if subtipoBadge}
				<span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {subtipoBadge.clases}">
					{subtipoBadge.texto}
				</span>
			{/if}
			<!-- Badge de verificación -->
			<BadgeVerificacion estado={estadoVerificacion} />
		</div>
		<!-- Descripción -->
		   {#if perfilUsuario.descripcion}
			   <p class="mt-3 text-gray-700 leading-relaxed text-center sm:text-left w-full break-words max-w-full">{perfilUsuario.descripcion}</p>
		   {/if}
		<!-- El botón Editar se mueve a PerfilInfoContacto en mobile -->
	</div>
</div>
