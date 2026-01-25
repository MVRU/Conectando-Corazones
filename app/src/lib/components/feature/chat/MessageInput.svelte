<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let disabled: boolean = false;
	export let placeholder: string = 'Escribe un mensaje...';

	let mensaje = '';
	let textareaElement: HTMLTextAreaElement;
	const dispatch = createEventDispatcher();

	function enviar() {
		if (!mensaje.trim() || disabled) return;
		dispatch('send', { contenido: mensaje });
		mensaje = '';
		if (textareaElement) {
			textareaElement.style.height = 'auto';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			enviar();
		}
	}

	function autoExpand() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			const newHeight = Math.min(textareaElement.scrollHeight, 200);
			textareaElement.style.height = newHeight + 'px';
		}
	}

	$: if (mensaje !== undefined) {
		setTimeout(autoExpand, 0);
	}
</script>

<div class="flex-shrink-0 border-t border-gray-200 bg-white p-3 shadow-lg md:p-4">
	<div class="flex gap-2 md:gap-3">
		<textarea
			bind:this={textareaElement}
			bind:value={mensaje}
			on:keydown={handleKeydown}
			on:input={autoExpand}
			{disabled}
			{placeholder}
			rows="1"
			class="flex-1 resize-none overflow-y-auto rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 md:text-base"
			style="min-height: 44px; max-height: 200px;"
		></textarea>
		<button
			on:click={enviar}
			disabled={!mensaje.trim() || disabled}
			class="flex items-center justify-center self-end rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none md:px-5"
			style="min-height: 44px;"
		>
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
		</button>
	</div>
	{#if disabled}
		<p class="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-amber-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
				/>
			</svg>
			El chat está deshabilitado para este proyecto
		</p>
	{/if}
</div>
