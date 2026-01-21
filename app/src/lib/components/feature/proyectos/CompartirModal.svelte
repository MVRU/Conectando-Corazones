<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		Share,
		CheckCircle,
		ClipboardDocument,
		XMark,
		ChatBubbleLeftRight,
		Envelope,
		EllipsisHorizontal
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { Proyecto } from '$lib/domain/types/Proyecto';

	export let proyecto: Proyecto;
	export let show = false;

	const dispatch = createEventDispatcher();

	let compartido = false;
	let copiado = false;

	function generarTextoCompartir(incluirUrl = true) {
		const url = window.location.href;
		const titulo = proyecto?.titulo || 'Proyecto Solidario';
		let texto = `¡Sumate a este proyecto solidario!\n\n"${titulo}"\n\nTu ayuda puede transformar vidas. Juntos podemos conectar corazones.\n\nCada colaboración cuenta. ¿Te sumás a la causa?`;
		if (incluirUrl) {
			texto += `\n\nConocé más aquí: ${url}`;
		}
		return texto;
	}

	$: textoCompartir = generarTextoCompartir(true);

	async function compartirNativo() {
		const titulo = proyecto?.titulo || 'Proyecto Solidario';
		const textoCompleto = generarTextoCompartir(true);
		try {
			if (navigator.share) {
				await navigator.share({
					title: titulo,
					text: textoCompleto
				});
				compartido = true;
				setTimeout(() => cerrar(), 1500);
			}
		} catch (error) {
			console.log('Compartir cancelado o error:', error);
		}
	}

	function compartirWhatsApp() {
		const texto = generarTextoCompartir(true);
		const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
		window.open(url, '_blank');
		compartido = true;
		setTimeout(() => cerrar(), 1500);
	}

	function compartirEmail() {
		const titulo = proyecto?.titulo || 'Proyecto Solidario';
		const texto = generarTextoCompartir(true);
		const subject = `Te invito a sumarte a: ${titulo}`;
		const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(texto)}`;
		window.location.href = url;
		compartido = true;
		setTimeout(() => cerrar(), 1500);
	}

	async function copiarAlPortapapeles() {
		const texto = generarTextoCompartir(true);
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(texto);
				copiado = true;
				setTimeout(() => {
					copiado = false;
				}, 2000);
			}
		} catch (error) {
			console.error('Error al copiar:', error);
		}
	}

	function cerrar() {
		compartido = false;
		copiado = false;
		dispatch('close');
	}
</script>

{#if show}
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
		on:click={cerrar}
		aria-hidden="true"
	></div>

	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
		<div
			class="pointer-events-auto relative mx-auto w-full max-w-md scale-100 rounded-2xl bg-white opacity-100 shadow-2xl ring-1 ring-gray-200/60 backdrop-blur-xl transition-all duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-compartir-titulo"
			tabindex="-1"
			on:click|stopPropagation
			on:keydown={(e) => {
				if (e.key === 'Escape') cerrar();
			}}
		>
			<div class="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
				<h2
					id="modal-compartir-titulo"
					class="text-lg leading-tight font-semibold text-gray-900 sm:text-xl"
				>
					Compartir proyecto
				</h2>
				<button
					type="button"
					class="rounded-full p-1 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
					on:click={cerrar}
					aria-label="Cerrar modal"
				>
					<Icon src={XMark} class="h-5 w-5" />
				</button>
			</div>

			<div class="space-y-5 px-6 pt-5 pb-6">
				{#if !compartido && !copiado}
					<div class="rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 ring-1 ring-sky-100">
						<div class="flex items-start gap-3">
							<span
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-100"
							>
								<Icon src={Share} class="h-5 w-5 text-sky-600" />
							</span>
							<div class="flex-1">
								<h3 class="text-sm font-semibold text-sky-900">
									¡Tu voz puede marcar la diferencia!
								</h3>
								<p class="mt-1 text-sm leading-relaxed text-sky-800">
									Al compartir este proyecto, ayudás a que más personas se sumen a la causa y juntos
									logremos el objetivo.
								</p>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<button
							type="button"
							class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white shadow-sm transition hover:brightness-105 focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:outline-none active:translate-y-[1px]"
							on:click={compartirWhatsApp}
						>
							<Icon src={ChatBubbleLeftRight} class="h-5 w-5" aria-hidden="true" />
							WhatsApp
						</button>

						<button
							type="button"
							class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none active:translate-y-[1px]"
							on:click={compartirEmail}
						>
							<Icon src={Envelope} class="h-5 w-5" aria-hidden="true" />
							Email
						</button>
					</div>

					<div class="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">
						<button
							type="button"
							class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none active:translate-y-[1px]"
							on:click={copiarAlPortapapeles}
						>
							<Icon src={ClipboardDocument} class="h-4 w-4" aria-hidden="true" />
							Copiar mensaje
						</button>

						{#if typeof navigator !== 'undefined' && 'share' in navigator}
							<button
								type="button"
								class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none active:translate-y-[1px]"
								on:click={compartirNativo}
							>
								<Icon src={EllipsisHorizontal} class="h-4 w-4" aria-hidden="true" />
								Más opciones
							</button>
						{/if}
					</div>
				{:else if compartido}
					<div class="flex flex-col items-center gap-4 py-6 text-center">
						<span
							class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-2 ring-emerald-100"
						>
							<Icon src={CheckCircle} class="h-8 w-8 text-emerald-600" aria-hidden="true" />
						</span>
						<div>
							<h3 class="text-lg font-semibold text-gray-900">¡Gracias por compartir!</h3>
							<p class="mt-1 text-sm text-gray-600">
								Tu ayuda es fundamental para que este proyecto llegue a más personas.
							</p>
						</div>
					</div>
				{:else if copiado}
					<div class="flex flex-col items-center gap-4 py-6 text-center">
						<span
							class="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 ring-2 ring-sky-100"
						>
							<Icon src={CheckCircle} class="h-8 w-8 text-sky-600" aria-hidden="true" />
						</span>
						<div>
							<h3 class="text-lg font-semibold text-gray-900">¡Mensaje copiado!</h3>
							<p class="mt-1 text-sm text-gray-600">
								Ahora podés pegarlo en WhatsApp, redes sociales o donde quieras para compartir este
								proyecto solidario.
							</p>
						</div>
					</div>
				{/if}

				<div class="mt-4 rounded-lg bg-gray-50 p-3">
					<pre class="text-sm whitespace-pre-wrap">{textoCompartir}</pre>
				</div>
			</div>
		</div>
	</div>
{/if}
