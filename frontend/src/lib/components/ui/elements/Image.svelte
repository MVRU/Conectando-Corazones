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
  import { Motion } from '@motionone/svelte';

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

  const heartbeat = {
    scale: [1, 0.91, 0.98, 0.87, 1],
    transition: { duration: 1.5, repeat: Infinity }
  };
</script>

{#if href}
  <a {href} class="cursor-pointer">
    <Motion.img
      {src}
      {alt}
      {srcset}
      {sizes}
      style={`width: ${width}; ${height !== 'auto' ? `height: ${height};` : ''} ${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''}`}
      class="block cursor-pointer object-cover
        {variant === 'default' ? ' rounded-lg shadow-md' : ''}
        {variant === 'circle' ? 'rounded-full' : ''}
        {variant === 'card' ? 'rounded-xl shadow-sm' : ''}"
      whileHover={animate === 'heartbeat' ? heartbeat : animate === 'zoom' ? { scale: 1.05 } : undefined}
      decoding="async"
      loading="lazy"
    />
  </a>
{:else}
  <Motion.img
    {src}
    {alt}
    {srcset}
    {sizes}
    style={`width: ${width}; ${height !== 'auto' ? `height: ${height};` : ''} ${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''}`}
    class="block object-cover
      {variant === 'default' ? ' rounded-lg shadow-md' : ''}
      {variant === 'circle' ? 'rounded-full' : ''}
      {variant === 'card' ? 'rounded-xl shadow-sm' : ''}"
    whileHover={animate === 'heartbeat' ? heartbeat : animate === 'zoom' ? { scale: 1.05 } : undefined}
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

        /* Animaciones reemplazadas por MotionOne */
</style>
