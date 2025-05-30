<!--
* Componente: StepCard
	-*- Descripción: tarjeta que representa un paso en el proceso de la funcionalidad de Conectando Corazones.
	-*- Funcionalidad: muestra un número, título, resumen y detalles del paso. Incluye una imagen de fondo y un círculo interactivo que revela más información al hacer clic.

* Props:
	-*- stepNumber: número del paso (1-6).
	-*- title: título del paso.
	-*- summary: resumen breve del paso.
	-*- details: descripción detallada del paso.
	-*- image: URL de la imagen de fondo del paso.
	-*- delay: tiempo de retraso para la animación de entrada (opcional, por defecto 0).
-->

<script lang="ts">
	export let stepNumber: number;
	export let title: string;
	export let summary: string;
	export let details: string;
	export let image: string;
	export let delay: number = 0;
	export let animate: boolean = false;

	let showDetails = false;

	function handleStepClick(e: Event) {
		e.stopPropagation();
		showDetails = !showDetails;
	}

	$: initialStyle = `
		opacity: ${animate ? 1 : 0};
		transform: translateY(${animate ? '0px' : '36px'}) scale(${animate ? 1 : 0.97});
	`;

	$: transitionStyle = `
		transition:
			opacity 0.58s cubic-bezier(.4,0,.2,1) ${delay}ms,
			transform 0.63s cubic-bezier(.47,1.54,.51,.82) ${delay}ms;
	`;
</script>

<div
	role="region"
	aria-label="Paso {stepNumber}: {title}"
	class="group relative h-[410px] select-none overflow-hidden rounded-2xl bg-white shadow-lg"
	style={initialStyle + transitionStyle}
>
	<img
		src={image}
		alt={title}
		draggable="false"
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-95"
	/>
	<!-- Overlay con degradado animado -->
	<div
		class="stepcard-overlay relative z-10 flex h-full flex-col justify-end space-y-3 p-5 text-white transition-all duration-500"
		class:stepcard-overlay-expanded={showDetails}
	>
		<!-- Círculo interactivo -->
		<button
			type="button"
			tabindex="0"
			aria-label={showDetails
				? `Ocultar detalle de paso ${stepNumber}`
				: `Ver detalle de paso ${stepNumber}`}
			on:click={handleStepClick}
			on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStepClick(e)}
			class="relative mb-2 flex h-20 w-20 cursor-pointer select-none items-center justify-center rounded-full border-4 border-[#377cff] bg-white shadow-xl ring-pink-400 transition-all duration-300 focus:outline-none focus:ring-2 group-hover:scale-105 {showDetails
				? 'animate-heartbeat'
				: ''} self-start"
			style="box-shadow: 0 2px 18px 0 #377cff11;"
		>
			<span
				class="absolute inset-0 flex items-center justify-center text-[2.1rem] font-bold text-[#19318a] transition-all duration-300
				{showDetails ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}"
			>
				{stepNumber}
			</span>
			<span
				class="absolute inset-0 flex items-center justify-center transition-all duration-300
				{showDetails ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}"
			>
				<svg
					viewBox="0 0 24 24"
					fill={showDetails ? 'url(#heartGradient)' : 'none'}
					stroke="#e64666"
					stroke-width="2"
					class="h-10 w-10 drop-shadow-xl"
					style="filter: drop-shadow(0 0 6px #e6466688);"
				>
					<defs>
						<linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stop-color="#e64666" />
							<stop offset="100%" stop-color="#ff8db5" />
						</linearGradient>
					</defs>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 3.5c-1.74 0-3.41 1.06-4.5 2.73C10.91 4.56 9.24 3.5 7.5 3.5 4.42 3.5 2 6.19 2 9.25c0 5.36 10 11.25 10 11.25s10-5.89 10-11.25c0-3.06-2.42-5.75-5.5-5.75z"
						fill={showDetails ? 'url(#heartGradient)' : 'none'}
					/>
				</svg>
			</span>
		</button>

		<h3 class="text-xl font-semibold leading-tight drop-shadow-sm">{title}</h3>
		<p class="text-base font-medium text-gray-100 drop-shadow">{summary}</p>

		<!-- Detalle oculto -->
		<div
			class="duration-400 pointer-events-none mt-2 overflow-hidden transition-all"
			aria-hidden={!showDetails}
			style="max-height: {showDetails ? '160px' : '0'}; opacity: {showDetails ? 1 : 0};"
		>
			<p class="text-sm text-gray-100 drop-shadow">{details}</p>
		</div>
	</div>
</div>

<style>
	.stepcard-overlay {
		background: linear-gradient(
			to top,
			rgba(15, 16, 41, 0.5) 42%,
			rgba(15, 16, 41, 0.34) 78%,
			rgba(15, 16, 41, 0.01) 100%
		);
		transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.stepcard-overlay-expanded {
		background: linear-gradient(
			to top,
			rgba(15, 16, 41, 0.7) 52%,
			rgba(15, 16, 41, 0.65) 90%,
			rgba(15, 16, 41, 0.01) 100%
		);
	}
	@keyframes heartbeat {
		0% {
			transform: scale(1);
		}
		14% {
			transform: scale(1.16);
		}
		28% {
			transform: scale(1);
		}
		42% {
			transform: scale(1.16);
		}
		70% {
			transform: scale(1);
		}
	}
	.animate-heartbeat {
		animation: heartbeat 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}
	.group:hover {
		box-shadow:
			0 10px 32px 0 #19318a1a,
			0 1.5px 10px 0 #e6466611;
		transform: translateY(-3px) scale(1.02);
	}
</style>
