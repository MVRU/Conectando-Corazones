<script lang="ts">
	import { chatStore } from '$lib/stores/chatStore';

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

<div class="flex-shrink-0 border-t border-gray-200 bg-white p-3 shadow-lg md:p-4">
	<div class="flex gap-2 md:gap-3">
		<textarea
			bind:this={textareaElement}
			bind:value={mensaje}
			onkeydown={handleKeydown}
			oninput={autoExpand}
			disabled={deshabilitado || procesando || enviando}
			{placeholder}
			rows="1"
			class="no-scrollbar flex-1 resize-none overflow-y-auto rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 md:text-base"
			style="min-height: 44px; max-height: 200px;"
		></textarea>

		<button
			onclick={() => void enviar()}
			disabled={!mensaje.trim() || deshabilitado || procesando || enviando}
			class="flex items-center justify-center self-end rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none md:px-5"
			style="min-height: 44px;"
		>
			{#if procesando || enviando}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-5 w-5 animate-spin md:mr-2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v3m0 9v3m7.5-7.5h-3m-9 0h-3m12.364 5.364l-2.121-2.121m-8.486 0L3.636 17.364m12.728-10.728l-2.121 2.121m-8.486 0L3.636 6.636" />
				</svg>
				<span class="hidden md:inline">Enviando</span>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-5 w-5 md:mr-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
					/>
				</svg>
				<span class="hidden md:inline">Enviar</span>
			{/if}
		</button>
	</div>

	{#if deshabilitado}
		<p class="mt-2 text-center text-xs text-amber-600">
			No podés enviar mensajes en este chat.
		</p>
	{/if}
</div>
