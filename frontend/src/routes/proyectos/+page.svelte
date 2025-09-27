<!-- Página principal de proyectos -->
<script lang="ts">
  import ProyectosList from './components/ProyectosList.svelte';
</script>

<svelte:head>
  <title>Proyectos - Conectando Corazones</title>
  <meta name="description" content="Lista de proyectos disponibles en Conectando Corazones" />
</svelte:head>

<div class="proyectos-page">
  <header class="page-header">
    <h1>Proyectos</h1>
    <p>Descubre proyectos que necesitan tu colaboración</p>
  </header>

  <main class="page-content">
    <ProyectosList />
  </main>
</div>

<style>
  .proyectos-page {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .page-header {
    background: white;
    padding: 2rem 0;
    border-bottom: 1px solid #e9ecef;
    text-align: center;
  }

  .page-header h1 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 600;
  }

  .page-header p {
    margin: 0;
    color: #6c757d;
    font-size: 1.1rem;
  }

  .page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>