<script lang="ts">
	export let src: string = '';
	export let alt: string = '';
	export let variant: 'default' | 'circle' | 'card' | 'none' = 'default';
	export let animate: 'none' | 'heartbeat' | 'zoom' = 'none';
	export let width: string = '100%';
	export let height: string = 'auto';
	export let href: string = '';
</script>

{#if href}
	<a {href} class="cursor-pointer">
		<img
			{src}
			{alt}
			style={`width: ${width}; height: ${height};`}
			class="
         block cursor-pointer object-cover
        {variant === 'default' ? ' rounded-lg shadow-md' : ''}
        {variant === 'circle' ? 'rounded-full' : ''}
        {variant === 'card' ? 'rounded-xl shadow-sm' : ''}
        {animate === 'heartbeat' ? 'animate-heartbeat' : ''}
        {animate === 'zoom' ? 'zoom-on-hover' : ''}
      "
			decoding="async"
			loading="lazy"
		/>
	</a>
{:else}
	<img
		{src}
		{alt}
		style={`width: ${width}; height: ${height};`}
		class="
       block object-cover
      {variant === 'default' ? ' rounded-lg shadow-md' : ''}
      {variant === 'circle' ? 'rounded-full' : ''}
      {variant === 'card' ? 'rounded-xl shadow-sm' : ''}
      {animate === 'heartbeat' ? 'animate-heartbeat' : ''}
      {animate === 'zoom' ? 'zoom-on-hover' : ''}
    "
		decoding="async"
		loading="lazy"
	/>
{/if}

<style>
	img {
		display: block;
		max-width: 100%;
		height: auto;
		border-radius: 12px;
		transition: all 0.3s ease-in-out;
	}

	/* Para imágenes con forma de "círculo" (imagen de perfil, por ejemplo) */
	.rounded-full {
		border-radius: 9999px;
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	/* Imágenes con animación de latido */
	.animate-heartbeat:hover {
		animation: heartbeat 0.8s infinite ease-in-out;
	}

	/* Imágenes con zoom al hacer hover */
	.zoom-on-hover:hover {
		transform: scale(1.05);
		transition: transform 0.3s ease-in-out;
	}
</style>
