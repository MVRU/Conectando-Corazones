<!--
* Componente: TextField
        -*- Descripción: Campo de texto genérico reutilizable.
        -*- Simplifica estilos y uso de inputs.
-->
<script lang="ts">
        export let id = '';
        export let name = '';
        export let type: string = 'text';
        export let required = false;
        export let value = '';
</script>
<input
        {id}
        {name}
        bind:value
        {type}
        class="w-full rounded-md border border-gray-300 px-3 py-2"
        {required}
/>
