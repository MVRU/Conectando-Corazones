<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';

	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ProyectoInfoBasica from '$lib/components/institucion/ProyectoInfoBasica.svelte';
	import ProyectoParticipaciones from '$lib/components/institucion/ProyectoParticipaciones.svelte';
	import ProyectoUbicaciones from '$lib/components/institucion/ProyectoUbicaciones.svelte';
	import type { PageData } from './$types';

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

	export let data: PageData;

	const { form, originales } = data;
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
		if (errExtension) {
			errores = { ...errores, fechaFinTentativa: errExtension };
		} else if (esFechaFutura(fechaFinTentativa)) {
			limpiarError('fechaFinTentativa');
		}
	}

	$: if (beneficiarios != null && beneficiarios > 0) {
		const errAumento = validarAumentoBeneficiarios(beneficiarios, originales.beneficiarios);
		if (errAumento) {
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
		else if (esFechaDemasiadoLejana(fechaFinTentativa))
			errores.fechaFinTentativa = MENSAJES_ERROR.fechaLejana;
		else {
			const errExt = validarExtensionFecha(fechaFinTentativa, originales.fechaFin);
			if (errExt) errores.fechaFinTentativa = errExt;
		}

		// Beneficiarios
		const errBenVal = beneficiarios != null ? validarBeneficiariosValor(beneficiarios) : null;
		if (errBenVal) errores.beneficiarios = errBenVal;
		else {
			const errAumento = validarAumentoBeneficiarios(beneficiarios, originales.beneficiarios);
			if (errAumento) errores.beneficiarios = errAumento;
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
				errores[`participacion_${index}_objetivo`] = 'El objetivo es obligatorio y debe ser > 0.';
			} else {
				if (p.id_participacion_permitida) {
					const original = originales.participacionesOriginales.find(
						(op) => op.id_participacion_permitida === p.id_participacion_permitida
					);
					const errAumento = validarAumentoObjetivo(p.objetivo, original?.objetivo);
					if (errAumento) {
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

	let enviando = false;

	async function enviarFormulario() {
		if (!validarFormulario()) {
			toastStore.show({
				variant: 'error',
				title: 'Error de validación',
				message: 'Por favor revisá los campos con errores.'
			});
			return;
		}

		enviando = true;
		await new Promise((resolve) => setTimeout(resolve, 1500)); // Simular request

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
	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Editar proyecto</h1>
			<p class="mt-2 text-gray-600">Actualizá la información de tu proyecto activo.</p>
		</div>

		<form on:submit|preventDefault={enviarFormulario} class="space-y-8">
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
				beneficiariosOriginales={originales.beneficiarios}
			/>

			<ProyectoParticipaciones
				bind:tiposParticipacionSeleccionados
				bind:participacionesPermitidas
				bind:errores
				{limpiarError}
				modoEdicion={true}
				participacionesOriginales={originales.participacionesOriginales}
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
</main>
