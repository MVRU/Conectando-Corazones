<script lang="ts">
	import { chatStore } from '$lib/stores/chatStore';
	import { SendHorizontal, Loader2 } from 'lucide-svelte';

	let {
		deshabilitado = false,
		enviando = false,
		placeholder = 'Escribí un mensaje...',
		chatId = undefined,
		onSend
	} = $props<{
		deshabilitado?: boolean;
		enviando?: boolean;
		placeholder?: string;
		chatId?: number;
		onSend?: (event: { contenido: string }) => void | Promise<void>;
	}>();

	let mensaje = $state('');
	let textareaElement = $state<HTMLTextAreaElement | null>(null);
	let procesando = $state(false);

	$effect(() => {
		if (chatId === undefined) {
			return;
		}

		const draft = $chatStore.draftMessages.get(chatId);
		if (draft !== undefined && draft !== mensaje) {
			mensaje = draft;
			queueMicrotask(autoExpand);
		}
	});

	$effect(() => {
		return () => {
			if (chatId !== undefined && mensaje.trim()) {
				chatStore.saveDraft(chatId, mensaje);
			}
		};
	});

	function autoExpand() {
		if (!textareaElement) {
			return;
		}

		textareaElement.style.height = 'auto';
		textareaElement.style.height = `${Math.min(textareaElement.scrollHeight, 200)}px`;
	}

	async function enviar() {
		if (!mensaje.trim() || deshabilitado || procesando || enviando) {
			return;
		}

		const contenido = mensaje;
		procesando = true;

		try {
			await onSend?.({ contenido });
			mensaje = '';
			if (chatId !== undefined) {
				chatStore.clearDraft(chatId);
			}
			autoExpand();
		} finally {
			procesando = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			void enviar();
		}
	}



	$effect(() => {
		queueMicrotask(autoExpand);
	});
</script>

<div class="relative z-10 shrink-0 border-t border-white/5 bg-white/[0.02] px-3 py-3 backdrop-blur-md md:px-5 md:py-4">
	<div class="mx-auto w-full max-w-4xl">
		<div class="flex items-end gap-2 rounded-[1.75rem] border border-white/5 bg-[#0F1029]/80 px-2 py-2 shadow-lg shadow-black/20 ring-1 ring-white/5 md:gap-3 md:px-3">
			<textarea
				bind:this={textareaElement}
				bind:value={mensaje}
				onkeydown={handleKeydown}
				oninput={autoExpand}
				disabled={deshabilitado || procesando || enviando}
				{placeholder}
				rows="1"
				class="no-scrollbar min-h-12 flex-1 resize-none overflow-y-auto rounded-3xl border border-transparent bg-white/5 px-4 py-3 text-sm text-slate-100 transition placeholder:text-slate-500 focus:border-[#007FFF]/30 focus:ring-2 focus:ring-[#007FFF]/20 focus:outline-none disabled:bg-white/[0.02] disabled:text-slate-500 md:text-[15px]"
				style="max-height: 200px;"
			></textarea>

			<button
				onclick={() => void enviar()}
				disabled={!mensaje.trim() || deshabilitado || procesando || enviando}
				class="flex h-12 min-w-12 items-center justify-center self-end rounded-full bg-[#007FFF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42A1FF] focus:outline-none focus:ring-2 focus:ring-[#007FFF]/20 disabled:cursor-not-allowed disabled:bg-[#181A40] disabled:text-slate-500 disabled:shadow-none md:min-w-[7.5rem] md:gap-2 md:px-5"
				aria-label={procesando || enviando ? 'Enviando mensaje' : 'Enviar mensaje'}
			>
				{#if procesando || enviando}
					<Loader2 class="h-5 w-5 animate-spin" />
					<span class="hidden md:inline">Enviando</span>
				{:else}
					<SendHorizontal class="h-5 w-5" />
					<span class="hidden md:inline">Enviar</span>
				{/if}
			</button>
		</div>

		{#if deshabilitado}
			<p class="mt-2 text-center text-xs text-amber-600">
				No podés enviar mensajes en este chat.
			</p>
		{:else}
			<p class="mt-2 px-2 text-center text-[11px] text-slate-500 md:text-right">
				Enter para enviar, Shift + Enter para salto de línea.
			</p>
		{/if}
	</div>
</div>
