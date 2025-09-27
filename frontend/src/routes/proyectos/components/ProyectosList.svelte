<!-- 
  Componente específico de proyectos
  Ubicación correcta: src/routes/proyectos/components/
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { proyectosApi } from '$lib/api';
  import Button from '$lib/components/ui/elementos/Button.svelte';

  let proyectos: any[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const response = await proyectosApi.getAll();
      if (response.success) {
        proyectos = response.data || [];
      } else {
        error = response.error || 'Error al cargar proyectos';
      }
    } catch (err) {
      error = 'Error de conexión con el servidor';
      console.error('Error:', err);
    } finally {
      loading = false;
    }
  });

  async function eliminarProyecto(id: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      const response = await proyectosApi.delete(id);
      if (response.success) {
        // Recargar la lista
        proyectos = proyectos.filter(p => p.id_proyecto !== id);
      } else {
        alert('Error al eliminar proyecto: ' + response.error);
      }
    } catch (err) {
      alert('Error de conexión');
      console.error('Error:', err);
    }
  }
</script>

<div class="proyectos-container">
  <h2>Lista de Proyectos</h2>
  
  {#if loading}
    <p>Cargando proyectos...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else if proyectos.length === 0}
    <p>No hay proyectos disponibles</p>
  {:else}
    <div class="proyectos-grid">
      {#each proyectos as proyecto}
        <div class="proyecto-card">
          <h3>{proyecto.titulo}</h3>
          <p>{proyecto.descripcion}</p>
          
          <div class="proyecto-info">
            <span class="estado">Estado: {proyecto.estado?.descripcion}</span>
            <span class="institucion">Institución: {proyecto.institucion?.nombre}</span>
          </div>

          <div class="proyecto-actions">
            <Button 
              label="Eliminar" 
              variant="ghost" 
              size="sm" 
              type="button"
              on:click={() => eliminarProyecto(proyecto.id_proyecto)}
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .proyectos-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  .proyectos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .proyecto-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .proyecto-card h3 {
    margin: 0 0 8px 0;
    color: #333;
  }

  .proyecto-card p {
    margin: 0 0 12px 0;
    color: #666;
    font-size: 14px;
  }

  .proyecto-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }

  .proyecto-info span {
    font-size: 12px;
    color: #888;
  }

  .proyecto-actions {
    display: flex;
    gap: 8px;
  }
</style>
