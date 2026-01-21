<!--
* Componente: Loader
	-*- Descripción: muestra un indicador de carga superpuesto en pantalla.
	-*- Utilidad: bloquea la interfaz y comunica visualmente que algo se está procesando.

* Props:
        -*- loading (boolean): determina si se muestra el loader. Por defecto: false.
        -*- size (number): tamaño del logo/ícono cargando. Por defecto: 50px.
        -*- message (string): texto mostrado debajo del ícono. Por defecto: "Cargando...".
        -*- overlayColor (string): color de fondo del overlay. Por defecto: '#ffffff'.
        -*- overlayOpacity (number): opacidad del overlay. Por defecto: 0.6.

! WARNING:
	-!- Este componente cubre toda el área contenedora. Usar con precaución si no se encuentra en un wrapper de posición relativa.

* DECISIÓN DE DISEÑO:
	-*- Se utiliza una animación tipo "pulse" para transmitir actividad sin ser invasiva.
	-*- Se implementa `backdrop-blur` para suavizar el fondo y centrar la atención.
-->

<script lang="ts">
	export let size: number = 50;
	export let loading = false;
	export let message: string = 'Cargando...';
	export let overlayColor: string = '#ffffff';
	export let overlayOpacity: number = 0.6;
</script>

{#if loading}
	<div
		class="pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-30 flex items-center justify-center backdrop-blur-sm"
		style={`background-color: ${overlayColor}; opacity: ${overlayOpacity};`}
	>
		<div class="pointer-events-auto relative flex flex-col items-center justify-center">
			<img
				src="/logo-2.png"
				alt={message}
				class="animate-pulse-soft"
				style={`width: ${size}px; height: ${size}px; opacity: 0.85; filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));`}
			/>
			<span class="animate-fade-in mt-2 text-sm text-gray-500">{message}</span>
		</div>
	</div>
{/if}

<style>
	@keyframes pulse-soft {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.1);
			opacity: 1;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-pulse-soft {
		animation: pulse-soft 1.8s ease-in-out infinite;
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
	}
</style>
