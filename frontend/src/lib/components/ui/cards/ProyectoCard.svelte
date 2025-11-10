<script lang="ts">
  import type { Proyecto } from '$lib/types/Proyecto';
  import Button from '$lib/components/ui/elementos/Button.svelte';
  import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
  import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
  import type { EstadoDescripcion } from '$lib/types/Estado';
  import type { ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';

  import {
    CheckCircle2,
    Hourglass,
    Search,
    FileSearch,
    XCircle,
    MapPin
  } from 'lucide-svelte';

  export let proyecto!: Proyecto;
  export let mostrarBotones: boolean = false;

  const formatearFechaCorta = (fecha?: string | Date | null): string => {
    if (!fecha) return '—';
    const f = fecha instanceof Date ? fecha : new Date(fecha);
    if (isNaN(f.getTime())) return '—';
    const dd = String(f.getDate()).padStart(2, '0');
    const mm = String(f.getMonth() + 1).padStart(2, '0');
    const aa = f.getFullYear().toString().slice(-2);
    return `${dd}/${mm}/${aa}`;
  };

  // Estado
  const estadoCodigo: EstadoDescripcion = getEstadoCodigo(proyecto.estado, proyecto.estado_id);
  const textoEstado = estadoLabel(estadoCodigo);
  const botonColaborarDeshabilitado = estadoCodigo !== 'en_curso';

  // Icono y color por estado
  function iconoYColorPorEstado(codigo: EstadoDescripcion) {
    switch (codigo) {
      case 'en_curso':
        return { icono: CheckCircle2, color: 'text-sky-600' };
      case 'pendiente_solicitud_cierre':
        return { icono: Hourglass, color: 'text-amber-600' };
      case 'en_revision':
        return { icono: Search, color: 'text-gray-600' };
      case 'en_auditoria':
        return { icono: FileSearch, color: 'text-gray-600' };
      case 'completado':
        return { icono: CheckCircle2, color: 'text-emerald-600' };
      case 'cancelado':
        return { icono: XCircle, color: 'text-red-600' };
      default:
        return { icono: Hourglass, color: 'text-gray-600' };
    }
  }
  const { icono: IconoEstado, color: colorIconoEstado } = iconoYColorPorEstado(estadoCodigo);

  // Ubicaciones
  const ubicaciones: ProyectoUbicacion[] = proyecto.ubicaciones ?? [];

  $: ubicacionPrincipal =
    ubicaciones.find((u) => u?.ubicacion?.tipo_ubicacion === 'principal') ?? ubicaciones[0];

  // esVirtual = true solo si NO hay ubicaciones presenciales
  function esUbicacionPresencial(
    ubicacion: any
  ): ubicacion is import('$lib/types/Ubicacion').UbicacionPresencial {
    return ubicacion?.modalidad === 'presencial';
  }

  $: hayPresenciales = ubicaciones.some((u) => esUbicacionPresencial(u?.ubicacion));
  $: esVirtual = ubicaciones.length > 0 && !hayPresenciales;

  $: ubicacionTexto =
    ubicaciones.length === 0
      ? ''
      : esVirtual
      ? 'Virtual'
      : (() => {
          const u = ubicacionPrincipal?.ubicacion;
          if (esUbicacionPresencial(u)) {
            const localidad = u.localidad?.nombre || 'Ciudad';
            const provincia = u.localidad?.provincia?.nombre;
            return provincia ? `${localidad}, ${provincia}` : localidad;
          }
          return 'Ciudad';
        })();

  $: ubicacionTooltip = ubicacionTexto;
</script>

<a
  href={`/proyectos/${proyecto.id_proyecto}`}
  class="animate-fade-in-up group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
  aria-label={`Abrir proyecto: ${proyecto.titulo}`}
>
  <!-- Imagen destacada -->
  <div class="relative aspect-[4/3] w-full overflow-hidden" aria-label="Imagen de portada del proyecto">
    <img
      src={proyecto.url_portada || '/img/proyecto-default.jpg'}
      alt={proyecto.titulo}
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />

    <!-- Estado y Fechas -->
    <div
      class="absolute bottom-3 left-3 z-50 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-lg backdrop-blur"
      role="status"
      aria-label={`Estado: ${textoEstado}`}
    >
      <span
        class="flex h-5 w-5 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100"
        aria-hidden="true"
      >
        <svelte:component this={IconoEstado} class={`h-3.5 w-3.5 ${colorIconoEstado}`} />
      </span>

      <span class="font-medium">{textoEstado}</span>

      <span class="mx-1 text-gray-300" aria-hidden="true">•</span>

      <span class="text-gray-600" aria-label="Rango de fechas">
        {formatearFechaCorta(proyecto.created_at as any)} – {formatearFechaCorta(proyecto.fecha_fin_tentativa as any)}
      </span>
    </div>

    <!-- Gradiente oscuro -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true"></div>
  </div>

  <!-- Contenido textual -->
  <div class="flex flex-1 flex-col justify-between gap-6 p-6">
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span
          class="font-semibold text-[rgb(var(--color-primary))] truncate max-w-[60%] whitespace-nowrap"
          title={proyecto.institucion?.nombre_legal}
        >
          {proyecto.institucion?.nombre_legal || 'Institución'}
        </span>

        {#if ubicacionTexto}
          <div class="flex min-w-0 items-center gap-1 text-xs text-gray-500 max-w-[40%] whitespace-nowrap truncate">
            <MapPin class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span
              class="truncate"
              title={ubicacionTooltip}
              aria-label={`Ubicación: ${ubicacionTooltip}`}
            >
              {ubicacionTexto}
            </span>
          </div>
        {/if}
      </div>

      <h3 class="line-clamp-2 text-lg font-semibold text-gray-900">
        {proyecto.titulo}
      </h3>

      <p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
        {proyecto.descripcion}
      </p>
    </div>

    <!-- Progreso visual -->
    <div class="mt-2 flex flex-col gap-2">
      <ProyectoProgreso {proyecto} variant="compact" />

      {#if mostrarBotones}
        <div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
          <Button
            label="Ver detalles"
            href={`/proyectos/${proyecto.id_proyecto}`}
            variant="secondary"
            size="sm"
            customClass="flex-1"
            aria-label="Ver detalles del proyecto"
          />
          <Button
            label="Colaborar ahora"
            href={`/proyectos/${proyecto.id_proyecto}#colaborar`}
            size="sm"
            disabled={botonColaborarDeshabilitado}
            customClass="flex-1"
            aria-label="Colaborar en este proyecto"
          />
        </div>
      {/if}
    </div>
  </div>
</a>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(16px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
</style>