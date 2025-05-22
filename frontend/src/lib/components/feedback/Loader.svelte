<script lang="ts">
	export let size: number = 50; // Tamaño por defecto del logo
	export let loading = false;
</script>

<div class="loader inset-0 z-50 flex items-center justify-center">
	<div class="flex flex-col items-center justify-center space-y-0.5 pt-8 text-center">
		<img
			src="/logo-2.png"
			alt="Cargando..."
			class="loader-logo"
			style={`width: ${size}px; height: ${size}px; opacity: 0.8;`}
		/>

		<!-- Texto -->
		<h5 class="loader-text text-xl font-semibold opacity-80">Cargando...</h5>
	</div>
</div>

<style>
	@keyframes heartbeat {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.6;
		}
		100% {
			transform: scale(1);
			opacity: 0.8;
		}
	}

	.loader-logo,
	.loader-text {
		animation: heartbeat 1s infinite ease-in-out both;
	}

	.loader-text {
		margin-top: 0.8rem;
	}
</style>
