<script lang="ts">
	import { Star } from 'lucide-svelte';
	import type { Resena } from '$lib/domain/types/Resena';
	import type {
		Usuario,
		Institucion,
		Organizacion,
		Unipersonal,
		Administrador
	} from '$lib/domain/types/Usuario';
	import { obtenerColorRol } from '$lib/utils/util-ui';

	export let resena: Resena;
	export let mostrarAutor: boolean = true;
	export let variante: 'default' | 'compacta' = 'default';
	export let onEditar: (() => void) | null = null;
	export let onEliminar: (() => void) | null = null;

	type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;

	export let autor: UsuarioCompleto | undefined = undefined;

	function obtenerNombreAutor(usuario: UsuarioCompleto): string {
		if (usuario.rol === 'institucion') {
			return (usuario as Institucion).nombre_legal || usuario.nombre;
		} else if (usuario.rol === 'colaborador') {
			if ('razon_social' in usuario) {
				return (usuario as Organizacion).razon_social;
			}
			return `${usuario.nombre} ${usuario.apellido}`;
		}
		return `${usuario.nombre} ${usuario.apellido}`;
	}

	$: nombreMostrar = autor ? obtenerNombreAutor(autor) : resena.username;
	$: roleLabel = autor?.rol === 'institucion' ? 'Institución' : 'Colaborador';
	$: roleClass = autor ? obtenerColorRol(autor.rol) : 'bg-gray-100 text-gray-800';
</script>

<div
	class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md {variante ===
	'compacta'
		? 'p-4'
		: ''} flex h-full flex-col"
>
	<div class="mb-3 flex items-center gap-1">
		{#each Array(5).keys() as i}
			<Star
				class="h-4 w-4 {i < resena.puntaje ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}"
			/>
		{/each}
	</div>

	<p
		class="mb-4 flex-grow leading-relaxed text-gray-600 {variante === 'compacta'
			? 'text-sm'
			: ''} text-pretty"
	>
		"{resena.contenido}"
	</p>

	{#if mostrarAutor && resena.username}
		<div
			class="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4"
		>
			<a href="/perfil/{resena.username}" class="group flex items-center gap-3">
				{#if autor?.url_foto}
					<img
						src={autor.url_foto}
						alt={nombreMostrar}
						class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 transition-all group-hover:ring-blue-100"
					/>
				{:else}
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 ring-2 ring-gray-50"
					>
						{(nombreMostrar?.[0] || '?').toUpperCase()}
					</div>
				{/if}
				<div class="flex flex-col">
					<span
						class="line-clamp-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
					>
						{nombreMostrar}
					</span>
				</div>
			</a>
			{#if autor}
				<span
					class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {roleClass}"
				>
					{roleLabel}
				</span>
			{/if}
		</div>
	{/if}

	{#if onEditar || onEliminar}
		<div class="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
			{#if onEditar}
				<button
					type="button"
					class="text-sm font-medium text-sky-600 hover:text-sky-700"
					on:click={onEditar}
				>
					Editar
				</button>
			{/if}
			{#if onEliminar}
				<button
					type="button"
					class="text-sm font-medium text-red-600 hover:text-red-700"
					on:click={onEliminar}
				>
					Eliminar
				</button>
			{/if}
		</div>
	{/if}
</div>
