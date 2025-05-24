<script lang="ts">
	export let size: number = 50;
	export let loading = false;
</script>

{#if loading}
	<div
		class="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm"
	>
		<div class="pointer-events-auto relative flex flex-col items-center justify-center">
			<img
				src="/logo-2.png"
				alt="Cargando..."
				class="animate-pulse-soft"
				style={`width: ${size}px; height: ${size}px; opacity: 0.85; filter: drop-shadow(0 0 5px rgba(0,0,0,0.1));`}
			/>
			<span class="animate-fade-in mt-2 text-sm text-gray-500">Cargando...</span>
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
