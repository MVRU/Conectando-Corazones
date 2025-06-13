<!--
* Componente: ProjectCard
	-*- Descripción: Tarjeta que muestra información de un proyecto
	-*- Funcionalidad: Muestra detalles, progreso y botones de acción

* Props:
        -*- proyecto (object): objeto con información del proyecto
        -*- mostrarBotones (boolean): si mostrar botones de acción
        -*- DECISIÓN DE DISEÑO: Este componente usa la interfaz `Project` unificada
        para mantener consistencia en toda la aplicación.

TODO:
	- [ ] Agregar animaciones de hover
	- [ ] Implementar estados de carga
	- [ ] Optimizar para diferentes tamaños de pantalla
-->

<script lang="ts">
        import Badge from './Badge.svelte';
        import Button from './Button.svelte';
        import type { Project } from '$lib/models/Project';

        export let proyecto!: Project;

        const labelMap = {
                dinero: 'Monetaria',
                voluntarios: 'Voluntariado',
                materiales: 'Materiales'
        } as const;

        // Función para calcular el porcentaje de progreso
        function calcularPorcentajeProgreso() {
                return Math.min((proyecto.actual / proyecto.objetivo) * 100, 100);
        }
        // Función para formatear montos monetarios
        function formatearMonto(cantidad: number) {
                if (proyecto.unidad === 'dinero') {
                        return `$${cantidad.toLocaleString('es-AR')}`;
                }
                return cantidad.toString();
        }
        function getColorProgreso(tipo: Project['unidad']) {
                switch (tipo) {
                        case 'dinero': return 'bg-[rgb(var(--color-primary))]';
                        case 'voluntarios': return 'bg-purple-500';
                        case 'materiales': return 'bg-green-500';
                        default: return 'bg-gray-400';
                }
        }

        // Función para obtener icono según tipo de participación
        function getIconoTipo(tipo: Project['unidad']) {
                switch (tipo) {
                        case 'dinero': return '💰';
                        case 'voluntarios': return '🙋‍♀️';
                        case 'materiales': return '📦';
                        default: return '🤝';
                }
        }

        // Función para obtener texto de llamada a la acción
        function getTextoBoton(tipo: Project['unidad']) {
                switch (tipo) {
                        case 'dinero': return 'Enviar donación';
                        case 'voluntarios': return 'Postularme como voluntario';
                        case 'materiales': return 'Donar materiales';
                        default: return 'Colaborar';
                }
        }
                        <h4 class="text-[rgb(var(--base-color))] font-semibold text-xl leading-tight">
                                {proyecto.titulo}
                        </h4>
                <div class="flex items-center gap-3 mb-3">
                        <Badge text={labelMap[proyecto.unidad]} shape="square" />
                        <span class="text-sm text-gray-500">
                                📍 {proyecto.ciudad}, {proyecto.provincia}
                        </span>
                </div>
                                <span class="font-medium text-[rgb(var(--base-color))] text-sm">
                                        {getIconoTipo(proyecto.unidad)} Objetivo
                                </span>
                                <span class="text-[rgb(var(--color-primary))] font-semibold">
                                        {formatearMonto(proyecto.actual)} / {proyecto.objetivo}
                                </span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                                <div
                                        class="h-3 rounded-full transition-all duration-300 {getColorProgreso(proyecto.unidad)}"
                                        style="width: {calcularPorcentajeProgreso()}%"
                                ></div>
                <!-- Información específica del tipo de participación -->
                {#if proyecto.unidad === 'dinero'}
                        <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p class="text-sm text-blue-700">
                                        💰 Este proyecto necesita <strong>donaciones monetarias</strong>. Tu contribución ayudará a alcanzar el objetivo de {proyecto.objetivo} {proyecto.especie}.
                                </p>
                        </div>
                {:else if proyecto.unidad === 'materiales'}
                        <div class="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <p class="text-sm text-green-700">
                                        📦 Este proyecto necesita <strong>donaciones de materiales específicos</strong>: {proyecto.objetivo} {proyecto.especie}.
                                </p>
                        </div>
                {:else if proyecto.unidad === 'voluntarios'}
                        <div class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <p class="text-sm text-purple-700">
                                        🙋‍♀️ Este proyecto necesita <strong>{proyecto.objetivo} voluntarios</strong> para actividades específicas.
                                </p>
                        </div>
                {/if}
                                        <button class="px-4 py-2 border-2 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] rounded-lg hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors duration-200 font-medium text-sm">
                                                {getTextoBoton(proyecto.unidad)}
                                        </button>
	function getTextoBoton(tipo: string) {
		switch (tipo) {
			case 'Monetaria':
				return 'Enviar donación';
			case 'Voluntariado':
				return 'Postularme como voluntario';
			case 'Materiales':
				return 'Donar materiales';
			default:
				return 'Colaborar';
		}
	}
</script>

<article
	class="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
>
	<!-- Header del proyecto -->
	<div class="border-b border-gray-100 p-6">
		<div class="mb-3 flex items-start justify-between">
			<h4 class="text-xl font-semibold leading-tight text-[rgb(var(--base-color))]">
				{proyecto.nombre}
			</h4>
			<div class="flex gap-2">
				<span
					class="flex items-center justify-center rounded-full px-2 py-2 text-xs font-medium {getColorUrgencia(
						proyecto.urgencia
					)}"
				>
					{proyecto.urgencia}
				</span>
				<span class="rounded-full px-2 py-1 text-xs font-medium {getColorEstado(proyecto.estado)}">
					{proyecto.estado}
				</span>
			</div>
		</div>

		<div class="mb-3 flex items-center gap-3">
			<Badge text={proyecto.tipoParticipacion} shape="square" />
			<span class="text-sm text-gray-500">
				📍 {proyecto.ciudad}, {proyecto.provincia}
			</span>
		</div>
	</div>

	<!-- Contenido del proyecto -->
	<div class="p-6">
		<p class="mb-4 line-clamp-3 text-gray-600">
			{proyecto.descripcion}
		</p>

		<!-- Información de la institución -->
		<div class="mb-4 rounded-lg bg-gray-50 p-3">
			<h5 class="mb-1 font-medium text-[rgb(var(--base-color))]">Institución</h5>
			<p class="text-sm text-gray-600">{proyecto.institucion}</p>
		</div>

		<!-- Objetivo y progreso -->
		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-medium text-[rgb(var(--base-color))]">
					{getIconoTipo(proyecto.tipoParticipacion)} Objetivo
				</span>
				<span class="font-semibold text-[rgb(var(--color-primary))]">
					{formatearMonto(proyecto.progreso)} / {proyecto.objetivo}
				</span>
			</div>
			<div class="h-3 w-full rounded-full bg-gray-200">
				<div
					class="h-3 rounded-full transition-all duration-300 {getColorProgreso(
						proyecto.tipoParticipacion
					)}"
					style="width: {calcularPorcentajeProgreso()}%"
				></div>
			</div>
			<div class="mt-2 flex items-center justify-between">
				<p class="text-xs text-gray-500">
					{calcularPorcentajeProgreso().toFixed(1)}% del objetivo alcanzado
				</p>
				<!--{#if proyecto.solicitudesColaboracion && proyecto.solicitudesColaboracion > 0}
					<span class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
						{proyecto.solicitudesColaboracion} solicitudes pendientes
					</span>
				{/if}-->
			</div>
		</div>

		<!-- Información adicional -->
		<div class="mb-4 grid grid-cols-2 gap-4 text-sm">
			<div>
				<span class="font-medium text-[rgb(var(--base-color))]">Beneficiarios:</span>
				<p class="text-gray-600">{proyecto.beneficiarios} personas</p>
			</div>
			<div>
				<span class="font-medium text-[rgb(var(--base-color))]">Inicio:</span>
				<p class="text-gray-600">{formatearFecha(proyecto.fechaInicio)}</p>
			</div>
		</div>

		<!-- Información específica del tipo de participación -->
		{#if proyecto.tipoParticipacion === 'Monetaria'}
			<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
				<p class="text-sm text-blue-700">
					💰 Este proyecto necesita <strong>donaciones monetarias</strong>. Tu contribución ayudará
					a alcanzar el objetivo de {proyecto.objetivo}.
				</p>
			</div>
		{:else if proyecto.tipoParticipacion === 'Materiales'}
			<div class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
				<p class="text-sm text-green-700">
					📦 Este proyecto necesita <strong>donaciones de materiales específicos</strong>: {proyecto.objetivo}.
				</p>
			</div>
		{:else if proyecto.tipoParticipacion === 'Voluntariado'}
			<div class="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
				<p class="text-sm text-purple-700">
					🙋‍♀️ Este proyecto necesita <strong>{proyecto.objetivo}</strong> para actividades específicas.
				</p>
			</div>
		{/if}

		<!-- Fecha de cierre -->
		<div class="mb-6">
			<span class="text-sm font-medium text-[rgb(var(--base-color))]">Cierre:</span>
			<p class="text-sm text-gray-600">{formatearFecha(proyecto.fechaCierre)}</p>
		</div>

		<!-- Botones de acción -->
		{#if mostrarBotones}
			<div class="flex gap-3">
				<Button label="Ver detalles" href="/projects/{proyecto.id}" disabled={false} />
				{#if proyecto.estado === 'Activo'}
					<button
						class="rounded-lg border-2 border-[rgb(var(--color-primary))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-primary))] transition-colors duration-200 hover:bg-[rgb(var(--color-primary))] hover:text-white"
					>
						{getTextoBoton(proyecto.tipoParticipacion)}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</article>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
