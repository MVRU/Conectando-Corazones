<!--
* Componente: DatePicker
        -*- Descripción: Input de fecha simple reutilizable.
        -*- Se usa para capturar fechas de nacimiento.
-->
<script lang="ts">
        export let id = '';
        export let name = '';
        export let required = false;
        export let value = '';
</script>
<input
        {id}
        {name}
        bind:value
        type="date"
        class="w-full rounded-md border border-gray-300 px-3 py-2"
        {required}
/>
