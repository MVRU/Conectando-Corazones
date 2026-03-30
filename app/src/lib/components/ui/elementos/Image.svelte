<script lang="ts">
	let {
		src = '',
		alt = '',
		variant = 'default',
		animate = 'none',
		width = '100%',
		height = 'auto',
		href = '',
		aspectRatio = '',
		/** Propiedades para imágenes responsivas */
		srcset = '',
		sizes = ''
	} = $props<{
		src?: string;
		alt?: string;
		variant?: 'default' | 'circle' | 'card' | 'none';
		animate?: 'none' | 'heartbeat' | 'zoom';
		width?: string;
		height?: string;
		href?: string;
		aspectRatio?: string;
		srcset?: string;
		sizes?: string;
	}>();
</script>

{#if href}
	<a {href} class="cursor-pointer">
		<img
			{src}
			{alt}
			{srcset}
			{sizes}
			style={`width: ${width}; ${height !== 'auto' ? `height: ${height};` : ''} ${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''}`}
			class="
         block cursor-pointer object-cover
        {variant === 'default' ? ' rounded-lg' : ''}
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
		{srcset}
		{sizes}
		style={`width: ${width}; ${height !== 'auto' ? `height: ${height};` : ''} ${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''}`}
		class="
       block object-cover
      {variant === 'default' ? ' rounded-lg' : ''}
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

	/* Animación de latido */
	@keyframes heartbeat {
		from {
			transform: scale(1);
			transform-origin: center center;
			animation-timing-function: ease-out;
		}
		10% {
			transform: scale(0.91);
			animation-timing-function: ease-in;
		}
		17% {
			transform: scale(0.98);
			animation-timing-function: ease-out;
		}
		33% {
			transform: scale(0.87);
			animation-timing-function: ease-in;
		}
		45% {
			transform: scale(1);
			animation-timing-function: ease-out;
		}
	}

	/* Imágenes con animación de latido */
	.animate-heartbeat:hover {
		animation: heartbeat 1.5s ease-in-out infinite both;
	}

	/* Imágenes con zoom al hacer hover */
	.zoom-on-hover:hover {
		transform: scale(1.05);
		transition: transform 0.3s ease-in-out;
	}
</style>
