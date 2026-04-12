<script lang="ts">
	import type { Mensaje } from '$lib/domain/types/Chat';

	type EstadoLocalMensaje = 'persistido' | 'enviando' | 'pendiente';

	let {
		mensaje,
		esPropio,
		estadoLocal = 'persistido'
	} = $props<{
		mensaje: Mensaje;
		esPropio: boolean;
		estadoLocal?: EstadoLocalMensaje;
	}>();

	const autorNombre = $derived.by(() => {
		const autor = mensaje.autor;
		if (!autor) {
			return `Usuario #${mensaje.remitente_id}`;
		}

		if (autor.nombre_legal?.trim()) {
			return autor.nombre_legal;
		}

		const nombreCompleto = `${autor.nombre} ${autor.apellido}`.trim();
		return nombreCompleto || autor.username || `Usuario #${mensaje.remitente_id}`;
	});

	const autorHref = $derived(mensaje.autor?.username ? `/perfil/${mensaje.autor.username}` : null);
	const fechaHora = $derived(new Date(mensaje.created_at));
	const hora = $derived(
		fechaHora.toLocaleTimeString('es-AR', {
			hour: '2-digit',
			minute: '2-digit'
		})
	);
	const etiquetaEstado = $derived(
		estadoLocal === 'enviando'
			? 'Enviando...'
			: estadoLocal === 'pendiente'
				? 'Pendiente de reintento'
				: ''
	);
</script>

<div class="mb-3 flex flex-col {esPropio ? 'items-end' : 'items-start'}">
	<div
		class="group relative max-w-[85%] rounded-2xl px-3 py-2 shadow-sm md:max-w-[70%] md:px-4 md:py-2.5 {esPropio
			? 'rounded-br-sm bg-blue-600 text-white'
			: 'rounded-bl-sm border border-gray-200 bg-white text-gray-800'} {estadoLocal === 'pendiente'
			? 'ring-2 ring-amber-200'
			: ''}"
	>
		{#if !esPropio}
			{#if autorHref}
				<a
					href={autorHref}
					class="mb-1 block text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
				>
					{autorNombre}
				</a>
			{:else}
				<p class="mb-1 text-xs font-bold text-blue-600">{autorNombre}</p>
			{/if}
		{/if}

		<p class="text-sm leading-relaxed break-words whitespace-pre-wrap">{mensaje.contenido}</p>

		<div class="mt-1.5 flex items-center justify-end gap-2 text-[10px]">
			{#if etiquetaEstado}
				<span class={esPropio ? 'text-blue-100' : 'text-amber-600'}>{etiquetaEstado}</span>
			{/if}
			<span class={esPropio ? 'text-blue-100' : 'text-gray-400'}>{hora}</span>
		</div>

		{#if esPropio}
			<div
				class="absolute right-0 -bottom-0 h-3 w-3 bg-blue-600"
				style="clip-path: polygon(100% 0, 0 100%, 100% 100%);"
			></div>
		{:else}
			<div
				class="absolute -bottom-0 left-0 h-3 w-3 border-b border-l border-gray-200 bg-white"
				style="clip-path: polygon(0 0, 0 100%, 100% 100%);"
			></div>
		{/if}
	</div>
</div>
