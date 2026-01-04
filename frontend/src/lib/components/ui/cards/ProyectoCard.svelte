<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Usuario } from '$lib/types/Usuario';
	import { ArrowRight, MapPin, GlobeAlt, Photo, XMark, XCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import usuarioPorDefecto from '$lib/assets/user-default.png';

	import {
		getParticipacionVisual,
		getUbicacionCorta,
		formatearFechaBadge
	} from '$lib/utils/util-proyectos';
	import StatusBadge from '$lib/components/ui/badges/StatusBadge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ProyectoProgreso from '$lib/components/proyectos/ProyectoProgreso.svelte';
	import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';

	export let proyecto: Proyecto;
	export let usuario: Usuario | null = null;
	export let mostrarBotones: boolean = false;
	export let variante: 'default' | 'mis-proyectos' = 'default';
	export let esInstitucion: boolean = false;

	// Obtener colaboración del usuario desde el mock global
	$: colaboracionUsuario =
		usuario &&
		mockColaboraciones.find(
			(c) => c.proyecto_id === proyecto.id_proyecto && c.colaborador_id === usuario.id_usuario
		);

	// Detectar roles
	$: esCreador = usuario?.id_usuario === proyecto.institucion_id;

	$: esParticipante =
		!esCreador &&
		!!usuario &&
		usuario.rol === 'colaborador' &&
		colaboracionUsuario?.estado === 'aprobada';

	// Detectar si el usuario ya envió una solicitud (pendiente, rechazada, etc) pero NO está aprobada (ya cubierto por esParticipante)
	$: yaColaboro =
		!esCreador &&
		!esParticipante &&
		!!usuario &&
		usuario.rol === 'colaborador' &&
		!!colaboracionUsuario;

	$: esRechazada = colaboracionUsuario?.estado === 'rechazada';

	let mostrarJustificacion = false;

	function manejarClickColaborar(e: Event) {
		if (esRechazada) {
			e.preventDefault();
			e.stopPropagation();
			mostrarJustificacion = true;
		}
	}

	$: participaciones = (proyecto.participacion_permitida || []).map(getParticipacionVisual);
	$: botonColaborarDeshabilitado = proyecto.estado !== 'en_curso' || yaColaboro;
	$: ubicacionCorta = getUbicacionCorta(proyecto);
	$: esVirtual = ubicacionCorta === 'Virtual';
	$: estaInactivo = proyecto.estado === 'completado' || proyecto.estado === 'cancelado';
</script>

<div
	class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
	class:border-l-4={esCreador || esParticipante}
	class:border-l-blue-100={esCreador || esParticipante}
	class:hover:border-l-blue-200={esCreador || esParticipante}
	on:click={() => goto(`/proyectos/${proyecto.id_proyecto}`)}
	on:keydown={(e) =>
		(e.key === 'Enter' || e.key === ' ') && goto(`/proyectos/${proyecto.id_proyecto}`)}
	role="button"
	tabindex="0"
>
	<!-- Imagen Cover -->
	<div class="relative h-48 overflow-hidden bg-gray-100">
		{#if proyecto.url_portada}
			<img
				src={proyecto.url_portada}
				alt={proyecto.titulo}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				class:opacity-90={estaInactivo}
				class:grayscale-[0.8]={estaInactivo}
				loading="lazy"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center text-gray-300">
				<Icon src={Photo} class="h-12 w-12" />
			</div>
		{/if}

		<!-- Badges flotantes -->
		<div class="absolute left-3 top-3 flex items-center gap-2">
			{#if esCreador || esParticipante}
				<div
					class="relative h-8 w-8 overflow-hidden rounded-full border-2 bg-white shadow-sm"
					class:border-blue-100={esCreador || esParticipante}
					class:hover:border-blue-200={esCreador || esParticipante}
					title={esCreador
						? 'Es mi proyecto'
						: estaInactivo
							? 'Participaste en este proyecto'
							: 'Estás participando en este proyecto'}
				>
					<img
						src={usuario?.url_foto}
						alt="Tu perfil"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			{/if}

			<StatusBadge estado={proyecto.estado} />
		</div>

		<!-- Badge de ubicación -->
		<div class="absolute right-3 top-3">
			<span
				class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm"
			>
				{#if esVirtual}
					<Icon src={GlobeAlt} class="h-3.5 w-3.5" />
				{:else}
					<Icon src={MapPin} class="h-3.5 w-3.5" />
				{/if}
				{ubicacionCorta}
			</span>
		</div>
		<!-- Rango de fechas -->
		<div
			class="absolute bottom-0 left-0 right-0 flex items-end justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-12"
		>
			<span
				class="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:bg-black/20"
			>
				{formatearFechaBadge(proyecto.created_at)} — {formatearFechaBadge(
					proyecto.fecha_fin_tentativa
				)}
			</span>
		</div>

		<!-- Justificación de rechazo (Modal) -->
		<Modal
			bind:abierto={mostrarJustificacion}
			titulo="Solicitud Rechazada"
			ocultarEncabezado={true}
			anchoMaximo="max-w-sm"
		>
			<div class="flex flex-col items-center gap-3 px-6 pb-4 pt-6 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100"
				>
					<Icon src={XCircle} class="h-6 w-6 text-red-600" aria-hidden="true" />
				</span>
				<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Solicitud rechazada</h3>
				<p class="text-sm text-gray-500">
					{colaboracionUsuario?.justificacion || 'No se proporcionó una justificación.'}
				</p>
			</div>

			<div class="flex items-center justify-center border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
					on:click={() => (mostrarJustificacion = false)}
				>
					Cerrar
				</button>
			</div>
		</Modal>
	</div>

	<!-- Contenido -->
	<div class="flex flex-grow flex-col p-3 sm:p-4">
		<div class="mb-3">
			<h3
				class="mb-1.5 line-clamp-2 break-words text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-600"
				title={proyecto.titulo}
			>
				{proyecto.titulo}
			</h3>

			{#if proyecto.institucion?.nombre_legal && !(variante === 'mis-proyectos' && esCreador)}
				<div class="flex items-center gap-2 text-sm text-gray-500">
					<img
						src={proyecto.institucion?.url_foto || usuarioPorDefecto}
						alt={proyecto.institucion.nombre_legal}
						class="h-5 w-5 rounded-full object-cover shadow-sm"
						loading="lazy"
					/>
					<span class="truncate font-medium text-gray-700">{proyecto.institucion.nombre_legal}</span
					>
				</div>
			{/if}
		</div>

		<p class="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600" title={proyecto.descripcion}>
			{proyecto.descripcion}
		</p>

		<!-- Progreso visual -->
		<div class="mt-auto flex flex-col gap-2.5 border-t border-gray-100 pt-3">
			<ProyectoProgreso
				{proyecto}
				variant="compact"
				ocultarEtiquetaObjetivo={variante === 'mis-proyectos'}
			/>

			{#if variante === 'mis-proyectos'}
				<!-- Botones específicos para Mis Proyectos -->
				<div
					class="flex flex-col-reverse gap-2 pt-2 sm:flex-row"
					on:click|stopPropagation={() => {}}
					on:keydown|stopPropagation={() => {}}
					role="presentation"
				>
					{#if esInstitucion && proyecto.estado === 'en_curso'}
						<!-- Institución: Editar + Ver panel -->
						<Button
							label="Editar"
							href={`/proyectos/${proyecto.id_proyecto}/editar`}
							variant="secondary"
							size="sm"
							customClass="flex-1"
							customAriaLabel="Editar proyecto"
						/>
						<Button
							label="Ver panel"
							href={`/proyectos/${proyecto.id_proyecto}/panel`}
							size="sm"
							customClass="flex-1"
							customAriaLabel="Ver panel del proyecto"
						/>
					{:else}
						<!-- Institución (completado) o Colaborador: Solo Ver panel -->
						<Button
							label="Ver panel"
							href={`/proyectos/${proyecto.id_proyecto}/panel`}
							size="sm"
							customClass="w-full"
							customAriaLabel="Ver panel del proyecto"
						/>
					{/if}
				</div>
			{:else if mostrarBotones}
				<div
					class="flex flex-col-reverse gap-2 pt-2 sm:flex-row"
					on:click|stopPropagation={() => {}}
					on:keydown|stopPropagation={() => {}}
					role="presentation"
				>
					{#if esCreador}
						<Button
							label="Editar"
							href={`/proyectos/${proyecto.id_proyecto}/editar`}
							variant="secondary"
							size="sm"
							customClass="flex-1"
							customAriaLabel="Editar proyecto"
						/>
						<Button
							label="Ver panel"
							href={`/proyectos/${proyecto.id_proyecto}/panel`}
							size="sm"
							customClass="flex-1"
							customAriaLabel="Ver panel del proyecto"
						/>
					{:else if esParticipante}
						<Button
							label="Abrir chat"
							href={`/proyectos/${proyecto.id_proyecto}/chat`}
							variant="secondary"
							size="sm"
							customClass="flex-1"
							customAriaLabel="Abrir chat del proyecto"
						/>
						<Button
							label="Ver panel"
							href={`/proyectos/${proyecto.id_proyecto}/panel`}
							size="sm"
							customClass="flex-1"
							customAriaLabel="Ver panel de participación"
						/>
					{:else}
						<Button
							label="Ver detalles"
							href={`/proyectos/${proyecto.id_proyecto}`}
							variant={botonColaborarDeshabilitado && !esRechazada ? 'primary' : 'secondary'}
							size="sm"
							customClass="flex-1"
							customAriaLabel="Ver detalles del proyecto"
						/>
						<Button
							label={esRechazada
								? 'Solicitud rechazada'
								: yaColaboro
									? 'Solicitud enviada'
									: 'Colaborar ahora'}
							href={esRechazada ? undefined : `/proyectos/${proyecto.id_proyecto}#colaborar`}
							size="sm"
							variant={esRechazada
								? 'danger'
								: botonColaborarDeshabilitado
									? 'secondary'
									: 'primary'}
							disabled={esRechazada ? false : botonColaborarDeshabilitado}
							customClass={'flex-1 cursor-pointer'}
							customAriaLabel={esRechazada
								? 'Ver justificación del rechazo'
								: yaColaboro
									? 'Solicitud de colaboración enviada'
									: 'Colaborar en este proyecto'}
							on:click={manejarClickColaborar}
						/>
					{/if}
				</div>
			{:else}
				<Button
					label="Ver detalles"
					href={`/proyectos/${proyecto.id_proyecto}`}
					variant="secondary"
					size="sm"
					customClass="flex-1"
					customAriaLabel="Ver detalles del proyecto"
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
