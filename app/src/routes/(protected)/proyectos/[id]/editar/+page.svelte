<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';

	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import ProyectoInfoBasica from '$lib/components/feature/institucion/ProyectoInfoBasica.svelte';
	import ProyectoParticipaciones from '$lib/components/feature/institucion/ProyectoParticipaciones.svelte';
	import ProyectoUbicaciones from '$lib/components/feature/institucion/ProyectoUbicaciones.svelte';
	import type { PageData } from './$types';
	import type { Categoria } from '$lib/domain/entities/Categoria';
	import type { TipoParticipacion } from '$lib/domain/entities/TipoParticipacion';

	import { MENSAJES_ERROR, esFechaFutura } from '$lib/utils/validaciones';
	import {
		validarBeneficiariosValor,
		validarTituloProyecto,
		validarDescripcionProyecto,
		esFechaDemasiadoLejana,
		validarUrlImagen,
		validarExtensionFecha,
		validarAumentoBeneficiarios,
		validarAumentoObjetivo
	} from '$lib/utils/util-proyecto-form';

	import { usuario } from '$lib/stores/auth';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ShieldExclamation } from '@steeze-ui/heroicons';

	export let data: PageData & {
		categorias: Categoria[];
		tiposParticipacion: TipoParticipacion[];
	};

	const { form, originales, categorias, tiposParticipacion } = data;
	const idProyecto = Number($page.params.id);

	let titulo = form.titulo;
	let descripcion = form.descripcion;
	let urlPortada = form.urlPortada;
	let fechaFinTentativa = form.fechaFinTentativa;
	let beneficiarios = form.beneficiarios;
	let categoriasSeleccionadas = form.categoriasSeleccionadas;
	let categoriaOtraDescripcion = form.categoriaOtraDescripcion;
	let ubicaciones = form.ubicaciones;
	let tiposParticipacionSeleccionados = form.tiposParticipacionSeleccionados;
	let participacionesPermitidas = form.participacionesPermitidas;

	let errores: Record<string, string> = {};
	const fechaMinima = new Date().toISOString().split('T')[0];

	$: esAdmin = $usuario?.rol === 'administrador';

	function limpiarError(campo: string) {
		if (errores[campo]) {
			const { [campo]: _, ...resto } = errores;
			errores = resto;
		}
	}

	// Validaciones reactivas
	$: if (titulo && !validarTituloProyecto(titulo)) limpiarError('titulo');
	$: if (descripcion && !validarDescripcionProyecto(descripcion)) limpiarError('descripcion');
	$: if (urlPortada) {
		const errUrl = validarUrlImagen(urlPortada);
		if (!errUrl) limpiarError('urlPortada');
		else errores = { ...errores, urlPortada: errUrl };
	}

	$: if (fechaFinTentativa) {
		const errExtension = validarExtensionFecha(fechaFinTentativa, originales.fechaFin);
		if (errExtension && !esAdmin) {
			errores = { ...errores, fechaFinTentativa: errExtension };
		} else if (esFechaFutura(fechaFinTentativa)) {
			limpiarError('fechaFinTentativa');
		}
	}

	$: if (beneficiarios != null && beneficiarios > 0) {
		const errAumento = validarAumentoBeneficiarios(beneficiarios, originales.beneficiarios);
		if (errAumento && !esAdmin) {
			errores = { ...errores, beneficiarios: errAumento };
		} else {
			limpiarError('beneficiarios');
		}
	}

	function validarFormulario(): boolean {
		errores = {};

		const errDesc = validarDescripcionProyecto(descripcion);
		if (errDesc) errores.descripcion = errDesc;

		if (urlPortada) {
			const errImg = validarUrlImagen(urlPortada);
			if (errImg) errores.urlPortada = errImg;
		}

		// Fecha
		if (!fechaFinTentativa) errores.fechaFinTentativa = MENSAJES_ERROR.fechaFinObligatoria;
		else if (!esFechaFutura(fechaFinTentativa))
			errores.fechaFinTentativa = MENSAJES_ERROR.fechaFinFutura;
		else if (esFechaDemasiadoLejana(fechaFinTentativa) && !esAdmin)
			errores.fechaFinTentativa = MENSAJES_ERROR.fechaLejana;
		else {
			const errExt = validarExtensionFecha(fechaFinTentativa, originales.fechaFin);
			if (errExt && !esAdmin) errores.fechaFinTentativa = errExt;
		}

		// Beneficiarios
		const errBenVal = beneficiarios != null ? validarBeneficiariosValor(beneficiarios) : null;
		if (errBenVal) errores.beneficiarios = errBenVal;
		else {
			const errAumento = validarAumentoBeneficiarios(beneficiarios, originales.beneficiarios);
			if (errAumento && !esAdmin) errores.beneficiarios = errAumento;
		}
		ubicaciones.forEach((ubicacion, index) => {
			const prefix = 'ubicacion_' + index;
			const tipoTrim = (ubicacion.tipo_ubicacion || '').trim();

			if (!tipoTrim) errores[prefix + '_tipo'] = MENSAJES_ERROR.obligatorio;

			if (ubicacion.modalidad === 'presencial') {
				const d = ubicacion.direccion_presencial;
				if (!d?.calle) errores[prefix + '_calle'] = MENSAJES_ERROR.obligatorio;
				if (!d?.numero) errores[prefix + '_numero'] = MENSAJES_ERROR.obligatorio;
				if (!d?.provincia) errores[prefix + '_provincia'] = MENSAJES_ERROR.obligatorio;
				if (!d?.localidad_id) errores[prefix + '_localidad'] = MENSAJES_ERROR.obligatorio;
			}
		});
		// Validar participaciones
		participacionesPermitidas.forEach((p, index) => {
			if (p.objetivo === undefined || p.objetivo <= 0) {
				errores[`participacion_${index}_objetivo`] =
					'El objetivo es obligatorio y tiene que ser > 0.';
			} else {
				if (p.id_participacion_permitida) {
					const original = originales.participacionesOriginales.find(
						(op) => op.id_participacion_permitida === p.id_participacion_permitida
					);
					const errAumento = validarAumentoObjetivo(p.objetivo, original?.objetivo);
					if (errAumento && !esAdmin) {
						errores[`participacion_${index}_objetivo`] = errAumento;
					}
				}
			}
			if (p.tipo_participacion?.descripcion === 'Especie' && !p.especie) {
				errores[`participacion_${index}_especie`] = MENSAJES_ERROR.especieObligatoria;
			}
		});

		return Object.keys(errores).length === 0;
	}

	let mostrarModalConfirmacion = false;
	let enviando = false;

	async function intentarEnviar() {
		if (!validarFormulario()) {
			toastStore.show({
				variant: 'error',
				title: 'Error de validación',
				message: 'Por favor revisá los campos con errores.'
			});
			return;
		}
		mostrarModalConfirmacion = true;
	}

	async function confirmarEnvio() {
		mostrarModalConfirmacion = false;
		enviando = true;

		// Simular request
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('Update payload:', {
			idProyecto,
			descripcion,
			urlPortada,
			fechaFinTentativa,
			beneficiarios,
			ubicaciones,
			participaciones: participacionesPermitidas
		});

		enviando = false;
		toastStore.show({
			variant: 'success',
			title: 'Proyecto actualizado',
			message: 'Los cambios se han guardado exitosamente.'
		});
		goto('/proyectos?tab=mis-proyectos');
	}
</script>

<svelte:head>
	<title>Editar Proyecto - {titulo}</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 pb-20">
	{#if esAdmin}
		<div class="border-b border-amber-200 bg-amber-50 px-4 py-3">
			<div class="mx-auto flex max-w-4xl items-start gap-3">
				<Icon src={ShieldExclamation} class="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
				<div class="text-sm text-amber-800">
					<p class="font-medium">Modo Superadmin</p>
					<p>
						Estás editando este proyecto con privilegios de administrador. Tené cuidado, ya que
						podés modificar o eliminar datos que normalmente están protegidos para garantizar la
						integridad del proyecto.
					</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Editar proyecto</h1>
			<p class="mt-2 text-gray-600">Actualizá la información de tu proyecto activo.</p>
		</div>

		<form on:submit|preventDefault={intentarEnviar} class="space-y-8">
			<ProyectoInfoBasica
				bind:titulo
				bind:descripcion
				bind:urlPortada
				bind:fechaFinTentativa
				{fechaMinima}
				bind:beneficiarios
				bind:categoriasSeleccionadas
				bind:categoriaOtraDescripcion
				{errores}
				{limpiarError}
				modoEdicion={true}
				{esAdmin}
				beneficiariosOriginales={originales.beneficiarios}
				{categorias}
			/>

			<ProyectoParticipaciones
				bind:tiposParticipacionSeleccionados
				bind:participacionesPermitidas
				bind:errores
				{limpiarError}
				modoEdicion={true}
				{esAdmin}
				participacionesOriginales={originales.participacionesOriginales}
				{tiposParticipacion}
			/>

			<ProyectoUbicaciones bind:ubicaciones {errores} modoEdicion={true} />

			<div class="flex justify-end gap-3">
				<Button
					label="Cancelar"
					variant="secondary"
					href="/proyectos?tab=mis-proyectos"
					customClass="border border-gray-300 bg-white"
				/>
				<Button
					type="submit"
					label="Guardar cambios"
					loading={enviando}
					loadingLabel="Guardando..."
				/>
			</div>
		</form>
	</div>

	<Modal bind:abierto={mostrarModalConfirmacion} titulo="Confirmar cambios" anchoMaximo="max-w-md">
		<div class="p-6 pt-2">
			<p class="mb-6 text-gray-600">
				¿Estás seguro de que querés guardar los cambios realizados en el proyecto? Esta acción
				actualizará la información visible para todos los usuarios.
			</p>

			<div class="flex justify-end gap-3">
				<Button
					label="Cancelar"
					variant="secondary"
					on:click={() => (mostrarModalConfirmacion = false)}
				/>
				<Button
					label="Confirmar y guardar"
					variant="primary"
					on:click={confirmarEnvio}
					loading={enviando}
				/>
			</div>
		</div>
	</Modal>
</main>
