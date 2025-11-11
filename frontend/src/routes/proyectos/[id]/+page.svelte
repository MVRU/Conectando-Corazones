<script lang="ts">
  import type { Proyecto } from '$lib/types/Proyecto';
  import type { EstadoDescripcion } from '$lib/types/Estado';
  import type { Colaboracion } from '$lib/types/Colaboracion';
  import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
  import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';
  import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
  import { mockProyectos } from '$lib/mocks/mock-proyectos';
  import { page } from '$app/stores';
  import { 
    esUbicacionPresencial, 
    esUbicacionVirtual,
    construirDireccionCompleta,
    generarUrlGoogleMaps
  } from '$lib/utils/util-ubicaciones';
  import { error } from '@sveltejs/kit';

  import ProyectoHeader from '$lib/components/proyectos/ProyectoHeader.svelte';
  import DetallesProyecto from '$lib/components/proyectos/DetallesProyecto.svelte';
  import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
  import { getEstadoCodigo, estadoLabel } from '$lib/utils/util-estados';
  import { colaboracionesVisibles, obtenerNombreColaborador } from '$lib/utils/util-colaboraciones';
  import { ordenarPorProgreso } from '$lib/utils/util-progreso';

  import {
    CheckCircle2,
    Hourglass,
    Package,
    CircleDot,
    MapPin,
    Globe,
    Link as LinkIcon,
    Heart,
    Share2
  } from 'lucide-svelte';

  let proyecto: Proyecto;
  let colaboracionesActivas: Colaboracion[] = [];
  let participacionesOrdenadas: ParticipacionPermitida[] = [];
  let ubicacionesOrdenadas: ProyectoUbicacion[] = [];

  $: colaboracionesActivas = colaboracionesVisibles(proyecto?.colaboraciones ?? []);
  $: participacionesOrdenadas = ordenarPorProgreso(proyecto?.participacion_permitida ?? []);

  $: {
    const id = $page.params.id;
    const encontrado = mockProyectos.find((p) => p.id_proyecto?.toString() === id);
    if (encontrado) {
      proyecto = encontrado;
      setBreadcrumbs([BREADCRUMB_ROUTES.home, BREADCRUMB_ROUTES.proyectos, { label: proyecto.titulo }]);
    } else {
      throw error(404, 'Proyecto no encontrado');
    }
  }

  function aFecha(fecha: string | Date | undefined | null): Date | null {
    if (!fecha) return null;
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return isNaN(d.getTime()) ? null : d;
  }

  function diasRestantes(fechaFin: string | Date | undefined | null): number {
    const fin = aFecha(fechaFin);
    if (!fin) return 0;
    const hoy = new Date();
    return Math.max(Math.ceil((fin.getTime() - hoy.getTime()) / 86_400_000), 0);
  }

  function formatearFechaLocal(fecha: string | Date | undefined | null): string {
    const d = aFecha(fecha);
    return d ? d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha no disponible';
  }

  function clasesEstado(estado: EstadoDescripcion) {
    return (
      {
        en_curso: 'text-green-600 bg-green-100',
        pendiente_solicitud_cierre: 'text-orange-600 bg-orange-100',
        en_revision: 'text-gray-600 bg-gray-100',
        en_auditoria: 'text-gray-600 bg-gray-100',
        completado: 'text-blue-600 bg-blue-100',
        cancelado: 'text-gray-600 bg-gray-100'
      }[estado] || 'text-gray-600 bg-gray-100'
    );
  }

  $: estadoCodigo = proyecto ? getEstadoCodigo(proyecto.estado, proyecto.estado_id) : 'en_curso';
  $: clasesChipEstado = clasesEstado(estadoCodigo);

  function estadoObjetivo(actual: number, objetivo: number): 'completo' | 'parcial' | 'pendiente' {
    if (actual >= objetivo) return 'completo';
    if (actual > 0) return 'parcial';
    return 'pendiente';
  }



  function capitalizar(s?: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }



  function ordenarUbicaciones(ubs?: ProyectoUbicacion[]): ProyectoUbicacion[] {
    if (!ubs?.length) return [];
    const prioridad = new Map(PRIORIDAD_TIPO.map((t, i) => [t, i]));
    return [...ubs].sort((a, b) => {
      const ta = a.ubicacion?.tipo_ubicacion ?? '';
      const tb = b.ubicacion?.tipo_ubicacion ?? '';
      const pa = prioridad.get(ta as any) ?? Number.MAX_SAFE_INTEGER;
      const pb = prioridad.get(tb as any) ?? Number.MAX_SAFE_INTEGER;
      if (pa !== pb) return pa - pb;
      const ma = a.ubicacion?.modalidad === 'presencial' ? 0 : 1;
      const mb = b.ubicacion?.modalidad === 'presencial' ? 0 : 1;
      return ma - mb;
    });
  }

  $: ubicacionesOrdenadas = ordenarUbicaciones(proyecto?.ubicaciones);

  $: colaboradoresAprobados = (colaboracionesActivas ?? []).filter((c) => c.estado === 'aprobada');

  function clasesChipColaborador(tipo?: string) {
    const t = (tipo || '').toLowerCase();
    return t.includes('org') ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700';
  }

  function etiquetaTipoColaborador(tipo?: string) {
    const t = (tipo || '').toLowerCase();
    if (t.includes('org')) return 'Organización';
    if (t.includes('uni') || t.includes('persona')) return 'Voluntario/a';
    return 'Voluntario/a';
  }

  function irAColaborar() {
    document.getElementById('colaborar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function compartirProyecto() {
    const url = window.location.href;
    const titulo = proyecto?.titulo || 'Conectando Corazones';
    const texto = 'Sumate a este proyecto solidario';
    try {
      if (navigator.share) await navigator.share({ title: titulo, text: texto, url });
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
    } catch {
      /* cancelado por la persona usuaria */
    }
  }

  function iniciales(nombre?: string): string {
    if (!nombre) return 'CC';
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  }
</script>

<svelte:head>
  <title>{proyecto?.titulo || 'Proyecto'} - Conectando Corazones</title>
  <meta name="description" content={proyecto?.descripcion || 'Detalle del proyecto'} />
</svelte:head>

{#if proyecto}
  <main class="min-h-screen bg-gray-50 pt-10 pb-24 text-gray-800" aria-label="Detalle del proyecto">
    <div class="animate-fade-up mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
      <ProyectoHeader {proyecto} getColorEstado={clasesEstado} />

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <!-- Columna principal -->
        <div class="animate-fade-up order-2 space-y-10 lg:order-1 lg:col-span-2">
          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg" aria-labelledby="titulo-progreso">
            <h2 id="titulo-progreso" class="mb-4 text-2xl font-semibold">Progreso del proyecto</h2>

            <ProyectoProgreso {proyecto} variant="extended" />

            <div class="mt-8">
              <h3 class="mb-4 flex flex-wrap items-center justify-between text-lg font-medium text-gray-900" id="titulo-objetivos">
                <span>{(proyecto.participacion_permitida?.length || 0) === 1 ? 'Objetivo' : 'Objetivos'}</span>
                {#if proyecto.fecha_fin_tentativa}
                  <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 md:mt-0">
                    <div class="rounded-full bg-blue-50 px-3 py-1.5" aria-label="Días restantes">
                      <span class="text-xs font-semibold text-blue-700">
                        {diasRestantes(proyecto.fecha_fin_tentativa)} días restantes
                      </span>
                    </div>
                  </div>
                {/if}
              </h3>

              {#if proyecto.participacion_permitida?.length}
                <ul class="space-y-4" aria-labelledby="titulo-objetivos">
                  {#each participacionesOrdenadas as p (p.id_participacion_permitida)}
                    {@const porcentaje = Math.round(((p.actual || 0) / p.objetivo) * 100)}
                    <li
                      class="flex items-start gap-4 rounded-xl border border-gray-100 p-5 shadow-sm transition hover:border-gray-200"
                      role="group"
                      aria-label={`Progreso de ${p.unidad_medida}`}
                    >
                      <div class="flex-shrink-0" aria-hidden="true">
                        {#if estadoObjetivo(p.actual || 0, p.objetivo) === 'completo'}
                          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                            <CheckCircle2 class="h-4 w-4 text-emerald-700" />
                          </span>
                        {:else if estadoObjetivo(p.actual || 0, p.objetivo) === 'parcial'}
                          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                            <Hourglass class="h-4 w-4 text-amber-700" />
                          </span>
                        {:else}
                          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            <Package class="h-4 w-4 text-gray-600" />
                          </span>
                        {/if}
                      </div>

                      <div class="flex w-full flex-col">
                        <p class="font-medium text-gray-800">
                          {p.unidad_medida === 'dinero'
                            ? `$${(p.actual || 0).toLocaleString('es-AR')} / $${p.objetivo.toLocaleString('es-AR')}`
                            : `${p.actual || 0} / ${p.objetivo} ${p.unidad_medida === 'personas' ? 'voluntarios' : p.unidad_medida}`}
                        </p>
                        <div class="mt-1 flex justify-between text-xs text-gray-500" aria-label="Porcentaje alcanzado">
                          <span>{porcentaje}% alcanzado</span>
                        </div>
                      </div>
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="text-sm text-gray-500">No hay participaciones definidas para este proyecto.</p>
              {/if}
            </div>
          </section>

          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg" aria-label="Detalles del proyecto">
            <DetallesProyecto {proyecto} formatearFecha={formatearFechaLocal} />
          </section>
        </div>

        <!-- Columna lateral -->
        <div class="animate-fade-up order-1 space-y-6 lg:order-2" style="animation-delay: 100ms">
          <div
            class="sticky top-6 z-[1] rounded-2xl bg-white/60 p-1 backdrop-blur supports-[backdrop-filter]:bg-white/40"
            role="group"
            aria-label="Acciones principales del proyecto"
          >
            <div class="flex gap-2 sm:gap-3">
              <button
                type="button"
                on:click={irAColaborar}
                class="flex-1 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white font-semibold shadow-[0_8px_24px_rgba(2,132,199,.35)] hover:brightness-110 active:translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 inline-flex items-center justify-center gap-2"
                aria-label="Colaborar ahora en este proyecto"
              >
                <Heart class="h-4 w-4" aria-hidden="true" />
                Colaborar ahora
              </button>

              <button
                type="button"
                on:click={compartirProyecto}
                class="flex-1 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 active:translate-y-[1px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 inline-flex items-center justify-center gap-2"
                aria-label="Compartir este proyecto"
              >
                <Share2 class="h-4 w-4" aria-hidden="true" />
                Compartir
              </button>
            </div>

            <p class="px-1 pt-2 text-center text-xs text-gray-500">
              Tu ayuda se refleja en tiempo real en el progreso del proyecto.
            </p>
          </div>

          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow" aria-label="Información del proyecto">
            <h3 class="mb-5 text-lg font-semibold text-gray-900">Información básica</h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                <span class="text-sm text-gray-600">Estado actual del proyecto</span>
                <span
                  class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${clasesChipEstado}`}
                  aria-label={`Estado: ${estadoLabel(estadoCodigo)}`}
                >
                  <CircleDot class="h-3.5 w-3.5" />
                  {estadoLabel(estadoCodigo)}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-gray-200 bg-gray-100 flex items-center justify-center" aria-label="Identidad visual de la institución">
                    {#if proyecto.institucion?.url_foto}
                      <img src={proyecto.institucion.url_foto} alt="Logo o foto de la institución" class="h-full w-full object-cover" loading="lazy" />
                    {:else}
                      <span class="text-[11px] font-semibold text-gray-600">{iniciales(proyecto.institucion?.nombre_legal)}</span>
                    {/if}
                  </div>

                  <div class="min-w-0">
                    <span
                      class="max-w-[210px] truncate text-sm font-medium text-gray-900"
                      title={proyecto.institucion?.nombre_legal || 'Institución organizadora'}
                      aria-label="Institución organizadora"
                    >
                      {proyecto.institucion?.nombre_legal || 'Institución organizadora'}
                    </span>
                    <div class="mt-1">
                      <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                        {proyecto.institucion?.tipo_institucion || 'Institución'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-gray-200 bg-white p-6 shadow" aria-label="Ubicaciones del proyecto">
            <h3 class="mb-5 text-lg font-semibold text-gray-900">Ubicaciones</h3>

            {#if ubicacionesOrdenadas.length}
              <ul class="rounded-lg">
                {#each ubicacionesOrdenadas as pu (pu.id_proyecto_ubicacion)}
                  <li class="py-3 first:pt-0 last:pb-0 border-b border-gray-100 last:border-b-0">
                    <div class="flex items-start gap-3">
                      {#if esUbicacionPresencial(pu.ubicacion)}
                        <span class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-100">
                          <MapPin class="h-4 w-4 text-sky-700" aria-hidden="true" />
                        </span>
                      {:else if esUbicacionVirtual(pu.ubicacion)}
                        <span class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 ring-1 ring-violet-100">
                          <Globe class="h-4 w-4 text-violet-700" aria-hidden="true" />
                        </span>
                      {/if}

                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="truncate text-sm font-semibold text-gray-900">
                            {capitalizar(pu.ubicacion?.tipo_ubicacion || 'Ubicación')}
                          </span>

                          {#if esUbicacionPresencial(pu.ubicacion)}
                            <span class="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100">
                              Presencial
                            </span>
                          {:else if esUbicacionVirtual(pu.ubicacion)}
                            <span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-100">
                              Virtual
                            </span>
                          {/if}
                        </div>

                        {#if esUbicacionPresencial(pu.ubicacion)}
                          {@const dir = construirDireccionCompleta(pu.ubicacion)}
                          <p class="mt-1 text-sm text-gray-700">{dir || 'Dirección no disponible'}</p>

                          {#if generarUrlGoogleMaps(pu.ubicacion)}
                            <a
                              class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline"
                              href={generarUrlGoogleMaps(pu.ubicacion)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Ver en Google Maps"
                            >
                              <LinkIcon class="h-4 w-4" />
                              Ver en Google Maps
                            </a>
                          {/if}
                        {:else if esUbicacionVirtual(pu.ubicacion)}
                          {#if pu.ubicacion.url_virtual}
                            <a
                              class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline"
                              href={pu.ubicacion.url_virtual}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Abrir enlace virtual"
                            >
                              <LinkIcon class="h-4 w-4" />
                              Abrir enlace
                            </a>
                          {:else}
                            <p class="mt-1 text-sm text-gray-500">Enlace virtual no especificado</p>
                          {/if}
                        {:else}
                          <p class="mt-1 text-sm text-gray-500">Información de la ubicación no disponible</p>
                        {/if}
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="text-sm text-gray-500">Este proyecto aún no tiene ubicaciones cargadas.</p>
            {/if}
          </section>

          <section class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100" aria-label="Colaboradores aprobados">
            <h3 class="mb-5 text-lg font-semibold text-gray-900">Colaboradores aprobados</h3>

            {#if colaboradoresAprobados.length}
              <ul class="space-y-3">
                {#each colaboradoresAprobados as colab (colab.id_colaboracion)}
                  <li class="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0">
                    <span class="text-sm text-gray-700">{obtenerNombreColaborador(colab.colaborador)}</span>
                    <span
                      class={`rounded-full px-2.5 py-1 text-xs font-semibold ${clasesChipColaborador(colab.colaborador?.tipo_colaborador)}`}
                      aria-label={`Tipo de colaborador: ${etiquetaTipoColaborador(colab.colaborador?.tipo_colaborador)}`}
                    >
                      {etiquetaTipoColaborador(colab.colaborador?.tipo_colaborador)}
                    </span>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="text-sm text-gray-500">No hay colaboradores aprobados.</p>
            {/if}
          </section>
        </div>
      </div>
    </div>
  </main>
{:else}
  <main class="min-h-screen bg-gray-50 pt-10 pb-24 text-gray-800">
    <div class="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
      <p>Cargando proyecto...</p>
    </div>
  </main>
{/if}

<style>
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up { animation: fade-up 0.5s ease-out both; }
</style>