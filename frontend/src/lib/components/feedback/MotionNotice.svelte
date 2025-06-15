<!--
* Componente: MotionNotice
  -*- Descripción: aviso que informa cuando las animaciones se deshabilitan automáticamente.
  -*- Funcionalidad: permite al usuario habilitar o deshabilitar animaciones y minimizar el aviso.
-->

<script lang="ts">
  import { reducedMotion, motionNoticeVisible } from '$lib/stores/reducedMotion';
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { Motion } from '@motionone/svelte';

	let show = false;
	let expanded = false;
	let animateIcon = true;
	let previousScrollY = 0;

	const unsubscribe = motionNoticeVisible.subscribe((v) => (show = v));
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
        <Motion.div
                class="fixed bottom-5 left-5 z-[130] cursor-pointer"
                role="button"
                tabindex="0"
                aria-live="polite"
                on:click={handleClick}
                on:keydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                                handleClick(e);
                                e.preventDefault();
                        }
                }}
        >
                <Motion.div
                        class={`flex items-center gap-3 overflow-hidden
                        ${expanded ? 'max-w-[calc(100vw-2.5rem)] pr-4 sm:max-w-[24rem]' : 'h-14 w-14 justify-center'}
                        border-2 border-red-200 bg-gradient-to-br from-white/90 to-red-50 p-2 shadow-xl ring-1 ring-red-300 backdrop-blur-sm
                        hover:shadow-red-pulse`}
                        animate={{ borderRadius: expanded ? '0.75rem' : '9999px' }}
                        transition={{ duration: 0.7, easing: 'ease-in-out' }}
                >
			<!-- Ícono de advertencia -->
                        <Motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="h-5 w-5 shrink-0 text-red-600"
                                whileHover={!expanded ? { rotate: [0,-5,3,-2,0], scale:[1,1.08,1.05,1.02,1] } : undefined}
                                transition={{ duration: 0.6 }}
                        >
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.665 1.732-3L13.732 4c-.77-1.335-2.694-1.335-3.464 0L3.34 17c-.77 1.335.192 3 1.732 3z"
                                />
                        </Motion.svg>

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
                </Motion.div>
        </Motion.div>
{/if}

<style>
        /* Animaciones reemplazadas por MotionOne */
</style>
