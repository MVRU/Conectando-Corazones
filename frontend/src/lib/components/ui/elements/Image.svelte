<!--
* Componente: Image
	-*- Descripción: muestra una imagen configurable con variantes de estilo, animación y envoltorio opcional con enlace.

* Props:
        -*- src (string): URL de la imagen. Obligatoria.
        -*- alt (string): texto alternativo. Recomendado por accesibilidad.
        -*- variant ('default' | 'circle' | 'card' | 'none'): estilo visual de la imagen. Por defecto: 'default'.
        -*- animate ('none' | 'heartbeat' | 'zoom'): tipo de animación aplicada. Por defecto: 'none'.
        -*- width (string): ancho de la imagen (CSS unit). Por defecto: '100%'.
        -*- height (string): alto de la imagen (CSS unit). Por defecto: 'auto'.
        -*- href (string): si se define, la imagen se envuelve en un link hacia esta ruta o URL.
        -*- aspectRatio (string): proporción ancho/alto de la imagen usando la propiedad CSS `aspect-ratio`.
        -*- srcset (string): listado de resoluciones para carga responsiva.
        -*- sizes (string): pistas de tamaño para cada resolución.

! WARNING:
	-!- Si `href` está definido pero es una URL externa, el componente no distingue entre navegación interna y externa.

? CUESTIONES ABIERTAS:
	-?- ¿Conviene ofrecer un wrapper `<figure>` y prop opcional `caption`?
-->

<script lang="ts">
	export let src: string = '';
	export let alt: string = '';
       export let variant: 'default' | 'circle' | 'card' | 'none' = 'default';
       export let animate: 'none' | 'heartbeat' | 'zoom' = 'none';
       export let width: string = '100%';
       export let height: string = 'auto';
       export let href: string = '';
       export let aspectRatio: string = '';
       // -* Propiedades para imágenes responsivas *-
       export let srcset: string = '';
       export let sizes: string = '';
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
                {srcset}
                {sizes}
                style={`width: ${width}; ${height !== 'auto' ? `height: ${height};` : ''} ${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''}`}
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
