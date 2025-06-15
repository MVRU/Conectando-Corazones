<!--
* Componente: Ticker
	-*- Descripción: carrusel horizontal que muestra logos de instituciones de forma animada.
	-*- Funcionalidad: los logos se deslizan en bucle de derecha a izquierda; al hacer hover el logo individual recupera su color original y se agranda ligeramente.

* Props:
        -*- logos (Array<string | { src: string; href?: string }>): lista de imágenes o
           objetos con la ruta y un enlace opcional.

! WARNING:
	-!- Las imágenes deben tener fondo transparente o adaptarse visualmente al color `--base-color`.
-->

<script lang="ts">
        import clsx from 'clsx';
        import { onMount } from 'svelte';
        import { Motion } from '@motionone/svelte';
        export let logos: Array<string | { src: string; href?: string }> = [];
	let visible = false;
	let tickerRef: HTMLElement;
	export let customClass: string = '';

	onMount(() => {
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.12 });
		if (tickerRef) io.observe(tickerRef);
		return () => io.disconnect();
	});
</script>

<Motion.div
        bind:this={tickerRef}
        class="group relative h-20 w-full overflow-hidden"
        animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 32 }}
        transition={{ duration: 0.9 }}
>
	<!-- *Contenedor deslizante -->
        <Motion.div
                class={clsx(
                        'ticker-track group-hover:pause-animation flex h-full w-max items-center gap-32',
                        customClass
                )}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
                {#each Array(6).fill(logos).flat() as logo, i}
                        {#if typeof logo === 'string'}
                                <img
                                        src={logo}
                                        alt="Logo institución"
                                        class="h-12 w-auto cursor-pointer object-contain grayscale transition-all duration-300 ease-in-out hover:scale-110 hover:grayscale-0"
                                        loading="lazy"
                                />
                        {:else}
                                {#if logo.href}
                                        <a href={logo.href} class="outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300">
                                                <img
                                                        src={logo.src}
                                                        alt="Logo institución"
                                                        class="h-12 w-auto cursor-pointer object-contain grayscale transition-all duration-300 ease-in-out hover:scale-110 hover:grayscale-0"
                                                        loading="lazy"
                                                />
                                        </a>
                                {:else}
                                        <img
                                                src={logo.src}
                                                alt="Logo institución"
                                                class="h-12 w-auto cursor-pointer object-contain grayscale transition-all duration-300 ease-in-out hover:scale-110 hover:grayscale-0"
                                                loading="lazy"
                                        />
                                {/if}
                        {/if}
                {/each}
        </Motion.div>
</Motion.div>

<style>
	/*Animaciones*/

        /* Animaciones reemplazadas por MotionOne */
</style>
