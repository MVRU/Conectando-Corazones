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
	import clsx from 'clsx';
	export let text: string;
	export let shape: 'square' | 'circle' = 'square';
	export let customClass = '';
	export let customColor: string = 'rgb(var(--color-primary))';
</script>

<div class={clsx('flex items-center gap-2', customClass)}>
	<span
		class={clsx('h-3 w-3', shape === 'square' ? 'rounded-sm' : 'rounded-full')}
		style={`background-color: ${customColor};`}
	></span>
	<p class="text-m font-semibold" style={`color: ${customColor};`}>{text}</p>
</div>
