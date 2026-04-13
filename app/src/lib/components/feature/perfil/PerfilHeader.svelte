<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import { obtenerColorRol } from '$lib/utils/util-ui';
	import BadgeVerificacion from '$lib/components/ui/badges/BadgeVerificacion.svelte';
	import type { EstadoVerificacionDisplay } from '$lib/utils/util-verificacion';
	import { Pencil, Camera, CheckCircle2 } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { IMAGEN_USUARIO_FALLBACK } from '$lib/utils/util-usuarios';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

let { perfilUsuario, esMiPerfil, estadoVerificacion, requiereCargaInicialDocumentacion, onEditarClick } = $props<{
		perfilUsuario: UsuarioCompleto;
		esMiPerfil: boolean;
		estadoVerificacion: EstadoVerificacionDisplay;
		requiereCargaInicialDocumentacion: boolean;
		onEditarClick: () => void;
	}>();

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
			const tipo = (usuario as any).tipo_colaborador;
			if (tipo === 'unipersonal') {
				return { texto: 'Unipersonal', clases: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' };
			}
			if (tipo === 'organizacion') {
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

	let nombreCompleto = $derived(obtenerNombreCompleto(perfilUsuario));
	let subtipoBadge = $derived(obtenerSubtipoBadge(perfilUsuario));
	let mostrarRepresentante = $derived(debeMostrarRepresentante(perfilUsuario));
let enlaceGestionVerificacion = $derived(
	esMiPerfil &&
		perfilUsuario.rol === 'institucion' &&
		(requiereCargaInicialDocumentacion ||
			estadoVerificacion === 'verificacion_pendiente' ||
			estadoVerificacion === 'verificacion_rechazada')
		? '/institucion/verificacion'
		: null
);
let textoBadgeVerificacion = $derived(
	requiereCargaInicialDocumentacion ? 'Verificar' : null
);
</script>

<div class="flex w-full flex-col items-start gap-6 md:flex-row md:gap-8">
	<!-- Avatar con overlay de edición -->
	<div class="group relative mx-auto shrink-0 md:mx-0" in:fly={{ x: -20, y: 10, duration: 400, easing: cubicOut }}>
		<div class="relative h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-lg ring-4 ring-white sm:h-28 sm:w-28 md:h-32 md:w-32">
			<img
				src={perfilUsuario.url_foto || IMAGEN_USUARIO_FALLBACK}
				alt="Foto de perfil de {nombreCompleto}"
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				onerror={(event) => {
					const target = event.currentTarget as HTMLImageElement;
					if (target.src.endsWith(IMAGEN_USUARIO_FALLBACK)) return;
					target.src = IMAGEN_USUARIO_FALLBACK;
				}}
			/>
			{#if esMiPerfil}
				<button
					class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/50 opacity-0 backdrop-blur-[2px] transition-all duration-250 group-hover:opacity-100"
					onclick={onEditarClick}
					aria-label="Cambiar foto de perfil"
				>
					<div class="rounded-full bg-white/20 p-2">
						<Camera class="h-6 w-6 text-white drop-shadow-md" />
					</div>
				</button>
			{/if}
		</div>
		<!-- Indicador de verificado para instituciones -->
		{#if perfilUsuario.rol === 'institucion' && estadoVerificacion?.tipo === 'verificado'}
			<div class="absolute -right-1 -bottom-1 rounded-full bg-white p-0.5 shadow-md">
				<CheckCircle2 class="h-5 w-5 text-emerald-500" />
			</div>
		{/if}
	</div>

	<!-- Información del perfil -->
	<div class="w-full min-w-0 flex-1 text-center md:text-left" in:fly={{ y: 10, duration: 400, delay: 80, easing: cubicOut }}>
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div class="flex-1">
				<h1 class="text-2xl leading-tight font-bold text-gray-900 md:text-3xl">
					{nombreCompleto}
				</h1>

				{#if mostrarRepresentante}
					<p class="mt-1 text-sm text-gray-500">
						Representante Legal: <span class="font-medium text-gray-700">{perfilUsuario.nombre} {perfilUsuario.apellido}</span>
					</p>
				{/if}

				<!-- Badges -->
				<div class="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
					{#if perfilUsuario.rol === 'administrador'}
						<span class="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-700/10 ring-inset">
							Administrador
						</span>
					{:else}
						<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset {obtenerColorRol(perfilUsuario.rol)}">
							{perfilUsuario.rol === 'institucion' ? 'Institución' : 'Colaborador'}
						</span>
					{/if}

					{#if subtipoBadge}
						<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium {subtipoBadge.clases}">
							{subtipoBadge.texto}
						</span>
					{/if}

					{#if perfilUsuario.rol === 'institucion'}
						<BadgeVerificacion
							estado={estadoVerificacion}
							href={enlaceGestionVerificacion}
							textoAccion={textoBadgeVerificacion}
						/>
					{/if}
				</div>
			</div>

			<!-- Botón editar (desktop) -->
			{#if esMiPerfil}
				<button
					class="group hidden shrink-0 items-center gap-2 rounded-xl border border-[#007FFF]/20 bg-gradient-to-r from-[#007FFF] to-[#42A1FF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-[#42A1FF] hover:to-[#007FFF] hover:shadow-md md:inline-flex"
					onclick={onEditarClick}
					type="button"
				>
					<Pencil class="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
					Editar perfil
				</button>
			{/if}
		</div>

		<!-- Descripción -->
		{#if perfilUsuario.descripcion}
			<p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 md:mx-0 md:text-base">
				{perfilUsuario.descripcion}
			</p>
		{/if}

		<!-- Botón editar (mobile) -->
		{#if esMiPerfil}
			<button
				onclick={onEditarClick}
				class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-[#007FFF]/40 hover:bg-blue-50 hover:text-[#007FFF] active:scale-[0.98] md:hidden"
			>
				<Pencil class="h-4 w-4" />
				Editar perfil
			</button>
		{/if}
	</div>
</div>
