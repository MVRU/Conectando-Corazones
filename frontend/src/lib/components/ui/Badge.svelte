<!--
* Componente: Badge
	-*- Descripción: muestra una insignia con un ícono de color y un texto asociado.
	-*- Utilidad: para representar estados, roles o categorías.

* Props:
	-*- text (string): texto que se mostrará.
	-*- shape ('square' | 'circle'): forma del ícono (cuadrado/círculo). Por defecto: 'square'.

TODO:
	- [ ] Permitir pasar un color personalizado mediante prop.
-->

<script lang="ts">
	export let text: string;
	export let shape: 'square' | 'circle' = 'square';
</script>

<div class="flex items-center gap-2">
	<span
		class="h-3 w-3 bg-[rgb(var(--color-primary))]"
		class:rounded-sm={shape === 'square'}
		class:rounded-full={shape === 'circle'}
	></span>
	<p class="text-sm font-semibold text-[rgb(var(--color-primary))]">{text}</p>
</div>
