<!--
* Componente: MotionNotice
  -*- Descripción: aviso que informa cuando las animaciones se deshabilitan automáticamente.
  -*- Funcionalidad: permite al usuario habilitar o deshabilitar animaciones y minimizar el aviso.
-->

<script lang="ts">
	import { reducedMotion, motionNoticeVisible } from '$lib/stores/reducedMotion';
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';

	let show = false;
	let expanded = false;
	let animateIcon = true;
	let previousScrollY = 0;

	const unsubscribe = motionNoticeVisible.subscribe((v: boolean) => (show = v));
	onDestroy(unsubscribe);

	function toggle() {
		reducedMotion.toggle();
	}

	function handleClick(event: Event) {
		if ((event.target as HTMLElement).closest('button')) return;
		expanded = !expanded;
	}

	function handleScroll() {
		if (!expanded && window.innerWidth < 640) {
			const currentY = window.scrollY;
			if (currentY > 1000 && show) {
				show = false;
			} else if (currentY < 300 && !show) {
				show = true;
			}
			previousScrollY = currentY;
		}
	}

	onMount(() => {
		if (browser) {
			const scrollListener = () => handleScroll();
			window.addEventListener('scroll', scrollListener);

			tick().then(() => {
				setTimeout(() => {
					animateIcon = false;
				}, 1000);
			});

			return () => {
				window.removeEventListener('scroll', scrollListener);
			};
		}
	});
</script>

{#if show}
	<div
		class="fixed bottom-5 left-5 z-[130] cursor-pointer"
		role="button"
		tabindex="0"
		aria-live="polite"
		aria-label="Aviso de rendimiento"
		on:click={handleClick}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				handleClick(e);
				e.preventDefault();
			}
		}}
	>
		<div
			class={`flex items-center gap-3 overflow-hidden transition-all duration-700 ease-in-out
			${expanded ? 'max-w-[calc(100vw-2.5rem)] pr-4 sm:max-w-[24rem]' : 'h-14 w-14 justify-center'}
			border-2 border-red-200 bg-gradient-to-br from-white/90 to-red-50 p-2 shadow-xl ring-1 ring-red-300 backdrop-blur-sm
			${animateIcon ? 'animate-entry' : ''}
			hover:shadow-red-pulse`}
			style="border-radius: {expanded ? '0.75rem' : '9999px'};"
		>
			<!-- Ícono de advertencia -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class={`h-5 w-5 shrink-0 text-red-600 transition-transform duration-300 ease-out
					${!expanded ? 'motion-icon-hover' : ''}`}
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.665 1.732-3L13.732 4c-.77-1.335-2.694-1.335-3.464 0L3.34 17c-.77 1.335.192 3 1.732 3z"
				/>
			</svg>

			{#if expanded}
				<span
					class="w-full flex-1 whitespace-normal text-balance break-words text-sm leading-snug text-red-900"
				>
					Las animaciones se deshabilitaron para mejorar el rendimiento.
				</span>

				<button
					class="shrink-0 rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-900 transition hover:bg-red-200"
					on:click={toggle}
				>
					{$reducedMotion ? 'Habilitar' : 'Deshabilitar'}
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes entry {
		0% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.1) rotate(-1.5deg);
		}
		50% {
			transform: scale(1.03) rotate(1.5deg);
		}
		100% {
			transform: scale(1);
		}
	}
	.animate-entry {
		animation: entry 0.9s ease-out 1;
	}
	.motion-icon-hover:hover {
		animation: warning-pulse 0.6s ease-in-out 1;
	}
	@keyframes warning-pulse {
		0% {
			transform: rotate(0deg) scale(1);
		}
		25% {
			transform: rotate(-5deg) scale(1.08);
		}
		50% {
			transform: rotate(3deg) scale(1.05);
		}
		75% {
			transform: rotate(-2deg) scale(1.02);
		}
		100% {
			transform: rotate(0deg) scale(1);
		}
	}
</style>
