<!--
* Componente: ProjectCard
	-*- Descripción: Tarjeta que muestra información de un proyecto
	-*- Funcionalidad: Muestra detalles, progreso y botones de acción

* Props:
	-*- proyecto (object): objeto con información del proyecto
	-*- mostrarBotones (boolean): si mostrar botones de acción

TODO:
	- [ ] Agregar animaciones de hover
	- [ ] Implementar estados de carga
	- [ ] Optimizar para diferentes tamaños de pantalla
-->

<script lang="ts">
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';

	export let proyecto: {
		id: number;
		nombre: string;
		descripcion: string;
		institucion: string;
		fechaInicio: string;
		fechaCierre: string;
		provincia: string;
		ciudad: string;
		tipoParticipacion: 'Monetaria' | 'Voluntariado' | 'Materiales';
		objetivo: string; // ej: "34 colchones", "$33.000", "15 voluntarios"
		progreso: number; // cantidad actual conseguida
		objetivoNumerico: number; // número objetivo (34, 33000, 15)
		unidadMedida: string; // "colchones", "pesos", "voluntarios"
		estado: string;
		urgencia: string;
		beneficiarios: number;
		solicitudesColaboracion?: number; // cantidad de solicitudes pendientes
	};
	
	export let mostrarBotones: boolean = true;

	// Función para formatear fechas
	function formatearFecha(fecha: string) {
		return new Date(fecha).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Función para calcular el porcentaje de progreso
	function calcularPorcentajeProgreso() {
		return Math.min((proyecto.progreso / proyecto.objetivoNumerico) * 100, 100);
	}

	// Función para formatear montos monetarios
	function formatearMonto(cantidad: number) {
		if (proyecto.tipoParticipacion === 'Monetaria') {
			return `$${cantidad.toLocaleString()}`;
		}
		return cantidad.toString();
	}

	// Función para obtener color del badge según urgencia
	function getColorUrgencia(urgencia: string) {
		switch (urgencia) {
			case 'Alta': return 'text-red-600 bg-red-100';
			case 'Media': return 'text-yellow-600 bg-yellow-100';
			case 'Baja': return 'text-green-600 bg-green-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	// Función para obtener color del estado
	function getColorEstado(estado: string) {
		switch (estado) {
			case 'Activo': return 'text-green-600 bg-green-100';
			case 'Próximo a cerrar': return 'text-orange-600 bg-orange-100';
			case 'Cerrado': return 'text-gray-600 bg-gray-100';
			case 'Completado': return 'text-blue-600 bg-blue-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	// Función para obtener color de la barra de progreso según tipo
	function getColorProgreso(tipo: string) {
		switch (tipo) {
			case 'Monetaria': return 'bg-[rgb(var(--color-primary))]';
			case 'Voluntariado': return 'bg-purple-500';
			case 'Materiales': return 'bg-green-500';
			default: return 'bg-gray-400';
		}
	}

	// Función para obtener icono según tipo de participación
	function getIconoTipo(tipo: string) {
		switch (tipo) {
			case 'Monetaria': return '💰';
			case 'Voluntariado': return '🙋‍♀️';
			case 'Materiales': return '📦';
			default: return '🤝';
		}
	}

	// Función para obtener texto de llamada a la acción
	function getTextoBoton(tipo: string) {
		switch (tipo) {
			case 'Monetaria': return 'Enviar donación';
			case 'Voluntariado': return 'Postularme como voluntario';
			case 'Materiales': return 'Donar materiales';
			default: return 'Colaborar';
		}
	}
</script>

<article class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300 hover:shadow-xl transition-shadow duration-300">
	<!-- Header del proyecto -->
	<div class="p-6 border-b border-gray-100">
		<div class="flex justify-between items-start mb-3 ">
			<h4 class="text-[rgb(var(--base-color))] font-semibold text-xl leading-tight">
				{proyecto.nombre}
			</h4>
			<div class="flex gap-2">
				<span class="px-2 py-2 rounded-full text-xs font-medium flex items-center justify-center {getColorUrgencia(proyecto.urgencia)}">
					{proyecto.urgencia}
				</span>
				<span class="px-2 py-1 rounded-full text-xs font-medium {getColorEstado(proyecto.estado)}">
					{proyecto.estado}
				</span>
			</div>
		</div>
		
		<div class="flex items-center gap-3 mb-3">
			<Badge text={proyecto.tipoParticipacion} shape="square" />
			<span class="text-sm text-gray-500">
				📍 {proyecto.ciudad}, {proyecto.provincia}
			</span>
		</div>
	</div>

	<!-- Contenido del proyecto -->
	<div class="p-6">
		<p class="text-gray-600 mb-4 line-clamp-3">
			{proyecto.descripcion}
		</p>

		<!-- Información de la institución -->
		<div class="mb-4 p-3 bg-gray-50 rounded-lg">
			<h5 class="font-medium text-[rgb(var(--base-color))] mb-1">Institución</h5>
			<p class="text-sm text-gray-600">{proyecto.institucion}</p>
		</div>

		<!-- Objetivo y progreso -->
		<div class="mb-4">
			<div class="flex justify-between items-center mb-2">
				<span class="font-medium text-[rgb(var(--base-color))] text-sm">
					{getIconoTipo(proyecto.tipoParticipacion)} Objetivo
				</span>
				<span class="text-[rgb(var(--color-primary))] font-semibold">
					{formatearMonto(proyecto.progreso)} / {proyecto.objetivo}
				</span>
			</div>
			<div class="w-full bg-gray-200 rounded-full h-3">
				<div 
					class="h-3 rounded-full transition-all duration-300 {getColorProgreso(proyecto.tipoParticipacion)}" 
					style="width: {calcularPorcentajeProgreso()}%"
				></div>
			</div>
			<div class="flex justify-between items-center mt-2">
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
		<div class="grid grid-cols-2 gap-4 mb-4 text-sm">
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
			<div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
				<p class="text-sm text-blue-700">
					💰 Este proyecto necesita <strong>donaciones monetarias</strong>. Tu contribución ayudará a alcanzar el objetivo de {proyecto.objetivo}.
				</p>
			</div>
		{:else if proyecto.tipoParticipacion === 'Materiales'}
			<div class="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
				<p class="text-sm text-green-700">
					📦 Este proyecto necesita <strong>donaciones de materiales específicos</strong>: {proyecto.objetivo}.
				</p>
			</div>
		{:else if proyecto.tipoParticipacion === 'Voluntariado'}
			<div class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
				<p class="text-sm text-purple-700">
					🙋‍♀️ Este proyecto necesita <strong>{proyecto.objetivo}</strong> para actividades específicas.
				</p>
			</div>
		{/if}

		<!-- Fecha de cierre -->
		<div class="mb-6">
			<span class="font-medium text-[rgb(var(--base-color))] text-sm">Cierre:</span>
			<p class="text-gray-600 text-sm">{formatearFecha(proyecto.fechaCierre)}</p>
		</div>

		<!-- Botones de acción -->
		{#if mostrarBotones}
			<div class="flex gap-3">
				<Button 
					label="Ver detalles" 
					href="/projects/{proyecto.id}"
					disabled={false}
				/>
				{#if proyecto.estado === 'Activo'}
					<button class="px-4 py-2 border-2 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] rounded-lg hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors duration-200 font-medium text-sm">
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