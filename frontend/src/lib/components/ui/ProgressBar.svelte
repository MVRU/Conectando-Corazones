<!--
* Componente: ProgressBar
* Descripción : Barra de progreso con color configurable.
* Props       :
*   - percent  : número 0-100
*   - color    : 'green' | 'blue' | 'purple'
-->

<script lang="ts">
	export let percent = 0;
	export let color: 'blue' | 'green' | 'purple' = 'blue';
	const track = 'bg-gray-200';
	const fill =
		color === 'green' ? 'bg-green-500' : color === 'purple' ? 'bg-purple-500' : 'bg-blue-500';
</script>

<div class={`h-2 w-full overflow-hidden rounded-full ${track}`}>
	<div class={`${fill} h-full transition-all duration-700`} style={`width:${percent}%`}></div>
</div>
