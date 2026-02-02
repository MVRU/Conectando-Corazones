<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PaperAirplane, XMark } from '@steeze-ui/heroicons';
	import { fade, scale } from 'svelte/transition';

	let {
		open = $bindable(false),
		onclose,
		onsubmit
	} = $props<{
		open: boolean;
		onclose?: () => void;
		onsubmit?: (detail: { mensaje: string }) => Promise<void> | void;
	}>();

	let mensajeColaboracion = $state('');
	let textarea = $state<HTMLTextAreaElement>();
	let enviando = $state(false);

	function cerrar() {
		if (enviando) return;
		open = false;
		if (onclose) onclose();
	}

	async function enviar() {
		if (!mensajeColaboracion.trim() && mensajeColaboracion.length === 0) {
		}

		if (mensajeColaboracion.length > 500) return;

		enviando = true;
		try {
			if (onsubmit) {
				await onsubmit({ mensaje: mensajeColaboracion });
			}
			mensajeColaboracion = '';
			cerrar();
		} catch (error) {
		} finally {
			enviando = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') cerrar();
	}

	$effect(() => {
		if (open && textarea) {
			setTimeout(() => textarea?.focus(), 100);
		}
	});

	let caracteresRestantes = $derived(500 - mensajeColaboracion.length);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		onclick={cerrar}
		transition:fade={{ duration: 200 }}
		aria-hidden="true"
	></div>

	<div
		class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-colaborar-titulo"
	>
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div
				class="relative border-b border-gray-100 bg-gradient-to-tr from-sky-50 to-white px-5 pt-6 pb-5 text-center"
			>
				<button
					type="button"
					class="absolute top-4 right-4 rounded-full px-2 py-2 text-gray-400 transition-colors hover:bg-white hover:text-gray-600 focus:ring-2 focus:ring-sky-200 focus:outline-none disabled:opacity-50"
					onclick={cerrar}
					disabled={enviando}
					aria-label="Cerrar modal"
				>
					<Icon src={XMark} class="h-5 w-5" />
				</button>

				<h2
					id="modal-colaborar-titulo"
					class="bg-gradient-to-tr from-sky-600 to-sky-400 bg-clip-text text-xl leading-tight font-extrabold text-transparent sm:text-2xl"
				>
					¡Tu ayuda transforma vidas!
				</h2>
			</div>

			<!-- Contenido -->
			<div class="space-y-4 px-6 py-6 text-sm text-gray-700">
				<p class="text-gray-800">
					Escribí un mensaje a la institución contando por qué querés colaborar, qué te motiva o qué
					podés aportar.
				</p>

				<div>
					<div class="mb-1.5 flex items-center justify-between">
						<label for="mensaje-colaboracion" class="block text-xs font-semibold text-gray-700"
							>Tu mensaje (opcional pero recomendado)</label
						>
						<span
							class="text-[10px] font-medium {caracteresRestantes < 50
								? 'text-red-500'
								: 'text-gray-400'}"
						>
							{caracteresRestantes} caracteres
						</span>
					</div>
					<textarea
						id="mensaje-colaboracion"
						bind:this={textarea}
						class="min-h-[120px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none disabled:opacity-50"
						bind:value={mensajeColaboracion}
						maxlength="500"
						disabled={enviando}
						placeholder="Ej.: Me gustaría sumarme como voluntario los fines de semana..."
					></textarea>
				</div>
			</div>

			<!-- Acciones -->
			<div
				class="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
			>
				<button
					type="button"
					class="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50 sm:w-auto"
					onclick={cerrar}
					disabled={enviando}
				>
					Cancelar
				</button>
				<button
					type="button"
					class="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:brightness-110 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:outline-none active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
					onclick={enviar}
					disabled={enviando || mensajeColaboracion.length > 500}
				>
					{#if enviando}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Enviando...
					{:else}
						<Icon
							src={PaperAirplane}
							class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							aria-hidden="true"
						/>
						Enviar mi solicitud
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
