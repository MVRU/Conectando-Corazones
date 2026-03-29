<script lang="ts">
	import type { Resena } from '$lib/domain/types/Resena';
	import ResenaCard from '$lib/components/ui/cards/ResenaCard.svelte';
	import { usuario as usuarioStore } from '$lib/stores/auth';
	import { MessageSquare, Plus, Info } from 'lucide-svelte';

	export let resenas: Resena[];
	export let esMiPerfil: boolean;
	export let puedeAgregarResena: boolean;
	export let yaResenoUsuario: boolean;
	export let onAgregarResenaClick: () => void;
	export let onEliminar: (resena: Resena) => void = () => {};
	export let limiteMostrar: number = 4;

	$: resenasMostradas = resenas.slice(0, limiteMostrar);
	$: tieneResenas = resenas.length > 0;
	$: mostrarBotonAgregar = !esMiPerfil && puedeAgregarResena && !yaResenoUsuario;
	$: mostrarMensajeNoPermitido = !esMiPerfil && !yaResenoUsuario && !puedeAgregarResena;
</script>

<section>
	<div class="mb-5 flex items-center justify-between">
		<h3 class="flex items-center gap-2 text-base font-bold text-gray-900">
			<MessageSquare class="h-5 w-5 text-[#007FFF]" />
			Reseñas
			{#if tieneResenas}
				<span class="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#007FFF]">
					{resenas.length}
				</span>
			{/if}
		</h3>

		{#if mostrarBotonAgregar}
			<button
				onclick={onAgregarResenaClick}
				class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#007FFF] to-[#42A1FF] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:from-[#42A1FF] hover:to-[#007FFF] hover:shadow-md"
			>
				<Plus class="h-3.5 w-3.5" />
				Añadir reseña
			</button>
		{:else if mostrarMensajeNoPermitido}
			<div class="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5 text-xs text-gray-400">
				<Info class="h-3.5 w-3.5 shrink-0" />
				<span>Colaborá para dejar una reseña</span>
			</div>
		{/if}
	</div>

	{#if tieneResenas}
		<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
			{#each resenasMostradas as resena (resena.id_resena || resena.contenido)}
				<div class="w-full">
					<ResenaCard
						{resena}
						autor={resena.autor}
						onEliminar={resena.autor_id === $usuarioStore?.id_usuario || $usuarioStore?.rol === 'administrador'
							? () => onEliminar(resena)
							: null}
					/>
				</div>
			{/each}
		</div>
	{:else}
		<div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center">
			<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
				<MessageSquare class="h-6 w-6 text-gray-400" />
			</div>
			<h4 class="text-sm font-semibold text-gray-700">Sin reseñas todavía</h4>
			<p class="mt-1 text-xs text-gray-400">Las reseñas aparecerán aquí cuando otros usuarios las dejen.</p>
		</div>
	{/if}
</section>
