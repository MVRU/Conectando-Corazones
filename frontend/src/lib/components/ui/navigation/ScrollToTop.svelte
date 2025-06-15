<!--
* Componente: ScrollToTop
	-*- Descripción: botón para volver al inicio de la página al hacer scroll hacia abajo.
	-*- Utilidad: mejora la navegación en páginas largas, permitiendo al usuario regresar rápidamente al principio.

* Props:
	-*- `isVisible`: controla la visibilidad del botón según el scroll del usuario.
    -*- `scrollToTop`: función que desplaza la ventana al inicio de la página con un efecto suave.
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { Motion } from '@motionone/svelte';
  let isVisible = false;

	const handleScroll = () => {
		isVisible = window.scrollY > 500;
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<Motion.button
  on:click={scrollToTop}
  aria-label="Volver arriba"
  class="fixed bottom-7 right-5 z-[120] cursor-pointer rounded-full p-[3px]"
  animate={{ opacity: isVisible ? 1 : 0, translateY: isVisible ? 0 : 40, scale: isVisible ? 1 : 0.95 }}
  transition={{ duration: 0.7 }}
  style="pointer-events:{isVisible ? 'auto' : 'none'}"
>
	<span
		class="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-200 bg-gradient-to-br from-white/80 to-blue-100 shadow-xl transition-all
			duration-500
			hover:shadow-[0_8px_28px_0_#60a5fa55,0_0_0_6px_#38bdf855]"
	>
                <Motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-blue-500"
                        whileHover={{ y: [-0, -6, 2, 0], scale: [1,1.15,1.08,1] }}
                        transition={{ duration: 0.5, easing: [.3,1.4,.5,1] }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                >
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
		</svg>
	</span>
</Motion.button>

<style>
	button:hover span,
	button:focus-visible span {
		box-shadow:
			0 8px 28px 0 #60a5fa77,
			0 0 0 8px #38bdf81c;
		transform: translateY(-5px) scale(1.09) rotate(-4deg);
		border-color: #7dd3fc;
	}

	button:focus-visible span {
		outline: 2px solid #38bdf8;
		outline-offset: 3px;
	}

        /* Animaciones reemplazadas por MotionOne */
</style>
