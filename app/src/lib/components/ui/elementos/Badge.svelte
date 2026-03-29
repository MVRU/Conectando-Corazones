<!--
* Componente: Badge
	-*- Descripción: muestra una insignia con un ícono de color y un texto asociado.
	-*- Utilidad: para representar estados, roles o categorías.

* Props:
        -*- text (string): texto que se mostrará.
        -*- shape ('square' | 'circle'): forma del ícono (cuadrado/círculo). Por defecto: 'square'.
        -*- customColor (string): color del texto e ícono.
-->

<script lang="ts">
	import clsx from 'clsx';

	let {
		text,
		shape = 'square',
		customClass = '',
		customColor = 'rgb(var(--color-primary))'
	} = $props<{
		text: string;
		shape?: 'square' | 'circle';
		customClass?: string;
		customColor?: string;
	}>();
</script>

<div class={clsx('flex items-center gap-2', customClass)}>
	<span
		class={clsx('h-3 w-3', shape === 'square' ? 'rounded-sm' : 'rounded-full')}
		style={`background-color: ${customColor};`}
	></span>
	<p class="text-m font-semibold" style={`color: ${customColor};`}>{text}</p>
</div>
