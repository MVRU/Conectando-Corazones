<!--
* Componente: MotionNotice
        -*- Descripción: aviso que informa cuando las animaciones se deshabilitan automáticamente.
        -*- Funcionalidad: permite al usuario habilitar o deshabilitar animaciones y cerrar el aviso.
-->
<script lang="ts">
    import { reducedMotion, motionNoticeVisible } from '$lib/stores/reducedMotion';
    import { onDestroy } from 'svelte';

    let show = false;
    const unsubscribe = motionNoticeVisible.subscribe((v) => (show = v));
    onDestroy(unsubscribe);

    function toggle() {
        reducedMotion.toggle();
    }

    function close() {
        motionNoticeVisible.set(false);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('hideMotionNotice', '1');
        }
    }
</script>

{#if show}
    <aside
        role="status"
        aria-live="polite"
        class="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-blue-900 px-4 py-2 text-sm text-white shadow-md"
    >
        <span class="mr-4">
            {$reducedMotion
                ? 'Las animaciones se deshabilitaron para mejorar el rendimiento.'
                : 'Las animaciones están habilitadas.'}
        </span>
        <div class="flex gap-3">
            <button
                class="rounded-md bg-white px-3 py-1 text-blue-900 transition-colors hover:bg-blue-100"
                on:click={toggle}
            >
                {$reducedMotion ? 'Habilitar animaciones' : 'Deshabilitar animaciones'}
            </button>
            <button
                aria-label="Cerrar aviso"
                class="text-xl leading-none hover:text-blue-300"
                on:click={close}
            >
                &times;
            </button>
        </div>
    </aside>
{/if}

<style>
    aside {
        animation: slideDown 0.4s ease-out;
    }
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }
</style>
