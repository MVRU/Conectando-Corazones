<!--
* Componente: DatePicker
        -*- Descripción: selector de fecha reutilizable.
        -*- Utiliza Input para mantener consistencia visual.
-->
<script lang="ts">
	import Input from '../Input.svelte';
	export let id = '';
	export let name = '';
	export let required = false;
	export let value = '';
	export let error = '';
</script>

<Input {id} {name} bind:value type="date" {required} {error} />
