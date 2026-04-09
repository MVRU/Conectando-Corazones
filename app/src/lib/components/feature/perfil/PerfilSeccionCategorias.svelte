<script lang="ts">
	import type { Usuario, Institucion, Organizacion } from '$lib/domain/types/Usuario';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { obtenerIconoCategoria } from '$lib/utils/util-proyecto-form';
	import { Pencil, Plus, Tag } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type UsuarioCompleto = Usuario | Institucion | Organizacion;

	let { perfilUsuario, esMiPerfil, onEditarClick } = $props<{
		perfilUsuario: UsuarioCompleto;
		esMiPerfil: boolean;
		onEditarClick: () => void;
	}>();

	let categorias = $derived(perfilUsuario.categorias_preferidas || []);
	let tieneCategorias = $derived(categorias.length > 0);
	let esInstitucion = $derived(perfilUsuario.rol === 'institucion');
	let titulo = $derived(
		esInstitucion
			? esMiPerfil
				? 'Mis causas y proyectos frecuentes'
				: 'Causas y proyectos frecuentes'
			: esMiPerfil
				? 'Mis categorías'
				: 'Categorías'
	);
</script>

<section>
	<div class="mb-4 flex items-center justify-between">
		<h3 class="flex items-center gap-2 text-sm font-bold text-gray-800">
			<Tag class="h-4 w-4 text-[#007FFF]" />
			{titulo}
		</h3>
		{#if esMiPerfil}
			<button
				onclick={onEditarClick}
				class="inline-flex items-center gap-1.5 rounded-xl border border-[#007FFF]/20 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#007FFF] transition-all duration-200 hover:bg-blue-100 hover:shadow-sm"
				aria-label="Editar categorías preferidas"
			>
				<Pencil class="h-3 w-3" />
				Editar
			</button>
		{/if}
	</div>

	{#if tieneCategorias}
		<div class="flex flex-wrap gap-2">
			{#each categorias as categoria, i (categoria.descripcion)}
				<div
					class="group flex cursor-default items-center gap-1.5 rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-50/60 px-3 py-1.5 text-xs font-semibold text-[#007FFF] transition-all duration-200 hover:border-[#007FFF]/30 hover:from-blue-100 hover:to-blue-50 hover:shadow-sm"
					in:fly={{ y: 8, duration: 250, delay: i * 50, easing: cubicOut }}
				>
					<Icon
						src={obtenerIconoCategoria(categoria.descripcion)}
						class="h-3.5 w-3.5 text-[#007FFF] transition-transform duration-200 group-hover:scale-110"
					/>
					{categoria.descripcion}
				</div>
			{/each}
		</div>
	{:else}
		<div class="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 py-10 text-center transition-all duration-300 hover:border-[#007FFF]/30 hover:bg-white hover:shadow-sm">
			<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-[#007FFF]">
				<Tag class="h-7 w-7" />
			</div>

			<h4 class="mb-1 text-sm font-semibold text-gray-800">
				{esInstitucion
					? esMiPerfil
						? 'Sin causas o proyectos frecuentes'
						: 'No hay causas o proyectos frecuentes definidos'
					: esMiPerfil
						? 'Sin categorías personalizadas'
						: 'No hay categorías definidas'}
			</h4>

			<p class="max-w-[200px] text-xs leading-relaxed text-gray-500">
				{esInstitucion
					? esMiPerfil
						? 'Definí las causas que acompañás y los tipos de proyectos que tu institución publica con más frecuencia.'
						: 'Esta institución todavía no definió las causas o los tipos de proyectos que suele impulsar.'
					: esMiPerfil
						? 'Agregá las temáticas que más te interesan para personalizar tu experiencia.'
						: 'Este usuario aún no ha seleccionado sus categorías de interés.'}
			</p>

			{#if esMiPerfil}
				<button
					onclick={onEditarClick}
					class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#007FFF] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:bg-[#42A1FF] hover:shadow-lg active:scale-95"
				>
					<Plus class="h-3.5 w-3.5" />
					{esInstitucion ? 'Configurar perfil institucional' : 'Configurar intereses'}
				</button>
			{/if}
		</div>
	{/if}
</section>
