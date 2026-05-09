<script lang="ts">
	import { ShieldCheck } from 'lucide-svelte';
	import type { Mensaje } from '$lib/domain/types/Chat';
	import { IMAGEN_USUARIO_FALLBACK } from '$lib/utils/util-usuarios';

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
		return autor?.nombreVisible || autor?.username || `Usuario #${mensaje.remitente_id}`;
	});
	const autorRol = $derived(
		mensaje.autor?.rolVisible || (mensaje.autor?.rol === 'institucion' ? 'Institución' : 'Colaborador')
	);
	const autorPerfilHref = $derived(mensaje.autor?.perfilHref || null);
	const avatarUrl = $derived(mensaje.autor?.url_foto || IMAGEN_USUARIO_FALLBACK);
	const inicialesAutor = $derived.by(() =>
		autorNombre
			.split(/\s+/)
			.filter((parte: string) => Boolean(parte))
			.slice(0, 2)
			.map((parte: string) => parte[0]?.toUpperCase() ?? '')
			.join('') || 'U'
	);
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

	function renderAvatar(node: HTMLImageElement) {
		const fallback = node.nextElementSibling as HTMLSpanElement | null;

		const applyFallback = () => {
			node.style.display = 'none';
			fallback?.classList.remove('hidden');
			fallback?.classList.add('flex');
		};

		if (!avatarUrl) {
			applyFallback();
			return;
		}

		node.onerror = () => {
			if (node.src.endsWith(IMAGEN_USUARIO_FALLBACK)) {
				applyFallback();
				return;
			}

			node.src = IMAGEN_USUARIO_FALLBACK;
		};
	}
</script>

<div class="mb-3 flex w-full gap-2.5 {esPropio ? 'justify-end' : 'justify-start'}">
	{#if !esPropio}
		<div class="mt-1 h-9 w-9 shrink-0">
			<div class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-inset ring-slate-700">
				<img
					use:renderAvatar
					src={avatarUrl}
					alt="Avatar de {autorNombre}"
					class="h-full w-full object-cover"
				/>
				<span class="hidden h-full w-full items-center justify-center text-[11px] font-semibold text-slate-200">
					{inicialesAutor}
				</span>
			</div>
		</div>
	{/if}

	<div
		class="group relative w-full max-w-[calc(100%-3rem)] rounded-3xl px-3.5 py-3 shadow-sm backdrop-blur-sm sm:max-w-[85%] md:max-w-[72%] md:px-4 {esPropio
			? 'rounded-br-md border border-[#42A1FF]/20 bg-[#007FFF] text-white shadow-[#007FFF]/20'
			: 'rounded-bl-md border border-white/5 bg-white/[0.03] text-slate-100 shadow-black/20'} {estadoLocal === 'pendiente'
			? 'ring-2 ring-amber-200'
			: ''}"
	>
		<div class="mb-2 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
			<div class="min-w-0">
				{#if autorPerfilHref}
					<a
						href={autorPerfilHref}
						class="inline-flex max-w-full items-center text-sm font-semibold tracking-tight transition-colors hover:underline {esPropio
							? 'text-white/95 hover:text-white'
							: 'text-slate-50 hover:text-blue-300'}"
					>
						<span class="truncate">{autorNombre}</span>
					</a>
				{:else}
					<p class="truncate text-sm font-semibold tracking-tight {esPropio ? 'text-white/95' : 'text-slate-50'}">
						{autorNombre}
					</p>
				{/if}

				<span
					class="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium {esPropio
						? 'bg-white/10 text-white/90 ring-1 ring-inset ring-white/20'
						: 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10'}"
				>
					<ShieldCheck class="mr-1 h-3 w-3" />
					{autorRol}
				</span>
			</div>

			<div class="flex shrink-0 items-center gap-2 text-[11px] {esPropio ? 'text-white/70' : 'text-slate-500'}">
				{#if etiquetaEstado}
					<span class={esPropio ? 'text-white/80' : 'text-amber-500'}>{etiquetaEstado}</span>
				{/if}
				<span>{hora}</span>
			</div>
		</div>

		<p class="text-sm leading-6 break-words whitespace-pre-wrap md:text-[15px]">{mensaje.contenido}</p>

		{#if esPropio}
			<div
				class="absolute right-0 -bottom-px h-3 w-3 bg-[#007FFF]"
				style="clip-path: polygon(100% 0, 0 100%, 100% 100%);"
			></div>
		{:else}
			<div
				class="absolute left-0 -bottom-px h-3 w-3 border-b border-l border-white/5 bg-white/[0.03] backdrop-blur-sm"
				style="clip-path: polygon(0 0, 0 100%, 100% 100%);"
			></div>
		{/if}
	</div>

	{#if esPropio}
		<div class="mt-1 h-9 w-9 shrink-0">
			<div class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-inset ring-slate-700">
				<img
					use:renderAvatar
					src={avatarUrl}
					alt="Avatar de {autorNombre}"
					class="h-full w-full object-cover"
				/>
				<span class="hidden h-full w-full items-center justify-center text-[11px] font-semibold text-slate-200">
					{inicialesAutor}
				</span>
			</div>
		</div>
	{/if}
</div>
