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

<button
	on:click={scrollToTop}
	aria-label="Volver arriba"
	class="fixed bottom-7 right-5 z-[120] cursor-pointer rounded-full p-[3px] transition-all duration-700"
	style="
		opacity: {isVisible ? 1 : 0};
		pointer-events: {isVisible ? 'auto' : 'none'};
		transform: translateY({isVisible ? '0' : '40px'}) scale({isVisible ? 1 : 0.95});
		transition:
			opacity 0.5s cubic-bezier(.42,0,.19,1),
			transform 0.7s cubic-bezier(.39,0,.21,1);
	"
>
	<span
		class="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-200 bg-gradient-to-br from-white/80 to-blue-100 shadow-xl transition-all
			duration-500
			hover:shadow-[0_8px_28px_0_#60a5fa55,0_0_0_6px_#38bdf855]"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="group-hover:animate-bounceUp h-8 w-8 text-blue-500 transition-all duration-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
		</svg>
	</span>
</button>

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

	@keyframes bounceUp {
		0% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-6px) scale(1.15);
		}
		60% {
			transform: translateY(2px) scale(1.08);
		}
		100% {
			transform: translateY(0);
		}
	}
	.group-hover\:animate-bounceUp:hover {
		animation: bounceUp 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) 1;
	}
</style>
