<script lang="ts">
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ProyectoInfoBasica from './ProyectoInfoBasica.svelte';
	import ProyectoParticipaciones from './ProyectoParticipaciones.svelte';
	import ProyectoUbicaciones from './ProyectoUbicaciones.svelte';
	import type { ParticipacionForm, UbicacionFormulario } from '$lib/types/forms/CrearProyectoForm';
	import type { TipoUbicacion, ModalidadUbicacion } from '$lib/types/Ubicacion';
	import { provincias } from '$lib/data/provincias';
	import {
		MENSAJES_ERROR,
		validarUrl,
		validarCalle,
		validarNumeroCalle,
		validarCiudadEnProvincia,
		validarProvincia,
		esFechaFutura,
		validarPiso
	} from '$lib/utils/validaciones';
	import {
		validarBeneficiariosValor,
		validarTituloProyecto,
		validarDescripcionProyecto,
		validarUrlImagen,
		unidadEfectiva,
		esFechaDemasiadoLejana,
		validarUnidadLibre,
		validarReferencia
	} from '$lib/utils/util-proyecto-form';
	import { mockCategorias } from '$lib/mocks/mock-categorias';
	import type { ProyectoCreate } from '$lib/types/dto/ProyectoCreate';
	import type { UbicacionCreate } from '$lib/types/dto/UbicacionCreate';
	import type { ParticipacionPermitidaCreate } from '$lib/types/dto/ParticipacionPermitidaCreate';

	let titulo = '';
	let descripcion = '';
	let urlPortada = '';
	let fechaFinTentativa = '';
	let beneficiarios: number | undefined = undefined;

	let categoriasSeleccionadas: number[] = [];
	let categoriaOtraDescripcion = '';

	let ubicaciones: UbicacionFormulario[] = [
		{
			tipo_ubicacion: 'principal',
			modalidad: '',
			direccion_presencial: {
				calle: '',
				numero: '',
				referencia: '',
				localidad_id: undefined,
				provincia: '',
				localidad_nombre: ''
			},
			url_virtual: ''
		}
	];

	let tiposParticipacionSeleccionados: TipoParticipacionDescripcion[] = [];
	let participacionesPermitidas: ParticipacionForm[] = [];

	let errores: Record<string, string> = {};

	const fechaMinima = new Date().toISOString().split('T')[0];

	import { toKey } from '$lib/utils/util-proyecto-form';
	const categoriasKeys = mockCategorias.map((c) => toKey(c.descripcion || '')).filter(Boolean);

	function esCategoriaRepetida(s: string): boolean {
		const key = toKey(s);
		return categoriasKeys.includes(key);
	}

	function validarCategoriaOtraDescripcion(s: string): string | null {
		if (s == null) return 'Este campo es obligatorio';
		const v = s.normalize('NFC').trim().replace(/\s+/g, ' ');
		if (v.length < 3) return 'Debe tener al menos 3 caracteres.';
		if (v.length > 60) return 'Máximo 60 caracteres.';
		const ban = ['n/a', 'na', '-', 'otro', 'otra', 'ninguna', 'ninguno', 'no sé', 'nose'];
		if (ban.includes(v.toLowerCase())) return 'Por favor, especificá una categoría válida.';
		if (!/[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]/u.test(v)) return 'Debe incluir al menos una letra.';
		if (/^\d+$/u.test(v)) return 'No puede ser solo números';
		if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9 .,'’/&()-]+$/u.test(v))
			return 'Usá solo letras, números y signos comunes';
		if (esCategoriaRepetida(v))
			return 'Esa categoría ya existe en el catálogo. Elegíla de la lista.';
		return null;
	}

	const idCategoriaOtra = mockCategorias.find(
		(c) => c.descripcion?.toLowerCase() === 'otro' || c.descripcion?.toLowerCase() === 'otra'
	)?.id_categoria;

	$: seleccionoOtra =
		idCategoriaOtra != null && categoriasSeleccionadas.includes(idCategoriaOtra ?? -1);

	$: if (seleccionoOtra) {
		const err = validarCategoriaOtraDescripcion(categoriaOtraDescripcion || '');
		if (err) {
			errores.categoria_otra = err;
			errores = { ...errores };
		} else {
			limpiarError('categoria_otra');
		}
	} else if (!seleccionoOtra && errores.categoria_otra) {
		limpiarError('categoria_otra');
	}

	function limpiarError(campo: string) {
		if (errores[campo]) {
			delete errores[campo];
			errores = { ...errores };
		}
	}

	$: if (validarTituloProyecto(titulo) === null) limpiarError('titulo');
	$: if (validarDescripcionProyecto(descripcion) === null) limpiarError('descripcion');
	$: if (urlPortada && validarUrl(urlPortada) && !validarUrlImagen(urlPortada))
		limpiarError('urlPortada');
	$: if (fechaFinTentativa && esFechaFutura(fechaFinTentativa)) limpiarError('fechaFinTentativa');
	$: if (beneficiarios && beneficiarios > 0) limpiarError('beneficiarios');
	$: if (categoriasSeleccionadas.length > 0) limpiarError('categorias');
	$: if (ubicaciones.length > 0) limpiarError('ubicaciones');
	$: if (tiposParticipacionSeleccionados.length > 0) limpiarError('participacion');

	function validarFormulario(): boolean {
		errores = {};

		// Campos básicos
		const errTitulo = validarTituloProyecto(titulo);
		if (errTitulo) errores.titulo = errTitulo;
		const errDesc = validarDescripcionProyecto(descripcion);
		if (errDesc) errores.descripcion = errDesc;
		if (urlPortada) {
			if (!validarUrl(urlPortada)) errores.urlPortada = MENSAJES_ERROR.urlInvalida;
			else {
				const errImg = validarUrlImagen(urlPortada);
				if (errImg) errores.urlPortada = errImg;
			}
		}
		if (!fechaFinTentativa) {
			errores.fechaFinTentativa = 'La fecha de fin tentativa es obligatoria.';
		} else if (!esFechaFutura(fechaFinTentativa)) {
			errores.fechaFinTentativa = 'La fecha de fin debe ser al menos a partir de mañana.';
		} else if (esFechaDemasiadoLejana(fechaFinTentativa)) {
			errores.fechaFinTentativa = 'La fecha es demasiado lejana (máximo 2 años).';
		}
		const errBen = beneficiarios != null ? validarBeneficiariosValor(beneficiarios) : null;
		if (errBen) errores.beneficiarios = errBen;
		if (categoriasSeleccionadas.length === 0)
			errores.categorias = 'Debe seleccionar al menos una categoría.';

		const errCatOtra = categoriaOtraDescripcion
			? validarCategoriaOtraDescripcion(categoriaOtraDescripcion)
			: null;
		if (errCatOtra) errores.categoria_otra = errCatOtra;

		if (ubicaciones.length === 0) errores.ubicaciones = 'Debe agregar al menos una ubicación';

		ubicaciones.forEach((ubicacion, index) => {
			const prefix = 'ubicacion_' + index;
			const tipoTrim = (ubicacion.tipo_ubicacion || '').trim();

			if (!tipoTrim) {
				errores[prefix + '_tipo'] = MENSAJES_ERROR.obligatorio;
			} else if (tipoTrim === 'personalizado_input') {
				// Si seleccionó "Otro..." pero no ingresó texto
				errores[prefix + '_tipo'] = 'Por favor, especifique el tipo de ubicación.';
			} else if (
				!['principal', 'alternativa', 'voluntariado', 'reuniones'].includes(tipoTrim.toLowerCase())
			) {
				// Si es un tipo personalizado, verificar que no coincida con la lista oficial
				const existeEnLista = ['principal', 'alternativa', 'voluntariado', 'reuniones'].some(
					(tipo) => tipo.toLowerCase() === tipoTrim.toLowerCase()
				);
				if (existeEnLista) {
					errores[prefix + '_tipo'] = 'Ese tipo de ubicación ya existe en la lista oficial.';
				}
			}

			if (!ubicacion.modalidad) {
				errores[prefix + '_modalidad'] = MENSAJES_ERROR.obligatorio;
				return;
			}

			// URL virtual opcional
			if (ubicacion.modalidad === 'virtual') {
				const url = (ubicacion.url_virtual || '').trim();
				if (url && !validarUrl(url)) {
					errores[prefix + '_url_virtual'] = 'Ingrese una URL válida (ej: https://...).';
				}
				return;
			}

			if (ubicacion.modalidad === 'presencial') {
				const direccion = ubicacion.direccion_presencial;
				if (!direccion) {
					errores[prefix + '_provincia'] = MENSAJES_ERROR.obligatorio;
					return;
				}
				if (!direccion.provincia) {
					errores[prefix + '_provincia'] = MENSAJES_ERROR.obligatorio;
				} else if (!validarProvincia(direccion.provincia)) {
					errores[prefix + '_provincia'] = MENSAJES_ERROR.provinciaInvalida;
				}
				if (!direccion.localidad_id) {
					errores[prefix + '_localidad'] = MENSAJES_ERROR.obligatorio;
				} else {
					const provincia = provincias.find((p) => p.nombre === direccion.provincia);
					if (
						provincia &&
						!validarCiudadEnProvincia(direccion.localidad_id, provincia.id_provincia)
					) {
						errores[prefix + '_localidad'] = MENSAJES_ERROR.ciudadNoPerteneceProvincia;
					}
				}
				if (!direccion.calle) {
					errores[prefix + '_calle'] = MENSAJES_ERROR.obligatorio;
				} else if (!validarCalle(direccion.calle)) {
					errores[prefix + '_calle'] = MENSAJES_ERROR.calleInvalida;
				}
				if (!direccion.numero) {
					errores[prefix + '_numero'] = MENSAJES_ERROR.obligatorio;
				} else if (!validarNumeroCalle(direccion.numero)) {
					errores[prefix + '_numero'] = MENSAJES_ERROR.numeroCalleInvalido;
				}
				const errRef = validarReferencia(direccion.referencia || '');
				if (errRef) {
					errores[prefix + '_referencia'] = errRef;
				}
				const errPiso = validarPiso(direccion.piso || '');
				if (errPiso) {
					errores[prefix + '_piso'] = errPiso;
				}
			}
		});

		const principalCount = ubicaciones.filter(
			(u) => (u.tipo_ubicacion || '').trim() === 'principal'
		).length;
		if (principalCount > 1) {
			errores.ubicaciones_principal = 'Solo puede haber una ubicación de tipo "Principal".';
		}

		// Validar ubicaciones duplicadas
		ubicaciones.forEach((ubicacion, index) => {
			const ubicacionesDuplicadas = ubicaciones.filter((u, i) => {
				if (i === index) return false; // Excluir la misma ubicación

				// Comparar tipo y modalidad
				const mismoTipo =
					(u.tipo_ubicacion || '').trim().toLowerCase() ===
					(ubicacion.tipo_ubicacion || '').trim().toLowerCase();
				const mismaModalidad =
					(u.modalidad || '').trim().toLowerCase() ===
					(ubicacion.modalidad || '').trim().toLowerCase();

				if (!mismoTipo || !mismaModalidad) return false;

				// Si es presencial, comparar dirección
				if (ubicacion.modalidad === 'presencial') {
					const dir1 = ubicacion.direccion_presencial;
					const dir2 = u.direccion_presencial;

					if (!dir1 || !dir2) return false;

					return (
						(dir1.provincia || '').trim().toLowerCase() ===
							(dir2.provincia || '').trim().toLowerCase() &&
						dir1.localidad_id === dir2.localidad_id &&
						(dir1.calle || '').trim().toLowerCase() === (dir2.calle || '').trim().toLowerCase() &&
						(dir1.numero || '').trim().toLowerCase() === (dir2.numero || '').trim().toLowerCase()
					);
				}

				// Si es virtual, comparar URL
				if (ubicacion.modalidad === 'virtual') {
					return (
						(u.url_virtual || '').trim().toLowerCase() ===
						(ubicacion.url_virtual || '').trim().toLowerCase()
					);
				}

				return false;
			});

			if (ubicacionesDuplicadas.length > 0) {
				errores[`ubicacion_${index}_tipo`] = 'Esta ubicación ya ha sido registrada.';
			}
		});

		if (tiposParticipacionSeleccionados.length === 0) {
			errores.participacion = 'Debe seleccionar al menos un tipo de participación.';
		}

		// Validar objetivos de participación
		participacionesPermitidas.forEach((participacion, index) => {
			const tipo = participacion.tipo_participacion?.descripcion;
			const objetivo = participacion.objetivo;

			if (tipo === 'Monetaria' && (objetivo == null || objetivo <= 0)) {
				errores[`participacion_${index}_objetivo`] =
					'El objetivo es obligatorio para participación monetaria.';
			}

			if (tipo === 'Especie') {
				if (objetivo == null || objetivo <= 0) {
					errores[`participacion_${index}_objetivo`] =
						'El objetivo es obligatorio para participación en especie.';
				}
				if (!participacion.especie || !participacion.especie.trim()) {
					errores[`participacion_${index}_especie`] = 'Debe especificar qué necesita en especie.';
				} else {
					// Verificar que no haya especies duplicadas
					const especieNormalizada = participacion.especie.trim().toLowerCase();
					const especiesDuplicadas = participacionesPermitidas.filter(
						(p, i) =>
							i !== index &&
							p.tipo_participacion?.descripcion === 'Especie' &&
							p.especie?.trim().toLowerCase() === especieNormalizada
					);
					if (especiesDuplicadas.length > 0) {
						errores[`participacion_${index}_especie`] =
							'Ya existe una donación en especie con el mismo ítem.';
					}
				}
			}

			if (tipo === 'Voluntariado' && (objetivo == null || objetivo <= 0)) {
				errores[`participacion_${index}_objetivo`] =
					'El objetivo es obligatorio para participación de voluntariado.';
			}

			// Validar unidad_medida_otra cuando se selecciona "Otra"
			if (participacion.unidad_medida === 'Otra') {
				const unidadOtra = participacion.unidad_medida_otra || '';
				const esMonetaria = participacion.tipo_participacion?.descripcion === 'Monetaria';
				const errorUnidad = validarUnidadLibre(unidadOtra, { allowUpperCase: esMonetaria });
				if (errorUnidad) {
					errores[`participacion_${index}_unidad_otra`] = errorUnidad;
				}
			}
		});

		return Object.keys(errores).length === 0;
	}

	let enviando = false;

	async function enviarFormulario() {
		if (!validarFormulario()) {
			console.log('Formulario inválido', errores);
			return;
		}

		enviando = true;

		// Simulación de envío al backend
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const participaciones: ParticipacionPermitidaCreate[] = participacionesPermitidas.map((p) => ({
			tipo_participacion: (p.tipo_participacion?.descripcion || 'Voluntariado') as TipoParticipacionDescripcion,
			objetivo: Number(p.objetivo) || 0,
			unidad_medida: p.unidad_medida === 'Otra' ? p.unidad_medida_otra || '' : p.unidad_medida,
			especie: p.tipo_participacion?.descripcion === 'Especie' ? p.especie || '' : undefined
		}));

		const ubicacionesCargadas: UbicacionCreate[] = ubicaciones
			.filter((u) => (u.tipo_ubicacion || '').trim())
			.map((u) => {
				const tipo = u.tipo_ubicacion as TipoUbicacion;
				const modalidad = (u.modalidad || 'presencial') as ModalidadUbicacion;
				const carga: UbicacionCreate = { tipo_ubicacion: tipo, modalidad };

				if (modalidad === 'presencial' && u.direccion_presencial) {
					const d = u.direccion_presencial;
					carga.direccion_presencial = {
						calle: d.calle,
						numero: d.numero,
						referencia: d.referencia?.trim() || undefined,
						piso: d.piso?.trim() || undefined,
						departamento: d.departamento?.trim() || undefined,
						url_google_maps: d.url_google_maps?.trim() || undefined,
						localidad_id: d.localidad_id
					};
				} else if (modalidad === 'virtual') {
					const url = u.url_virtual?.trim();
					if (url) carga.url_virtual = url;
				}
				return carga;
			});

		const payload: ProyectoCreate = {
			titulo,
			descripcion,
			url_portada: urlPortada || undefined,
			fecha_fin_tentativa: new Date(fechaFinTentativa),
			beneficiarios,
			categoria_ids: categoriasSeleccionadas.filter((id) => Number.isFinite(id) && id > 0),
			participaciones,
			ubicaciones: ubicacionesCargadas
		};

		console.log('Payload listo', payload);
		enviando = false;
		alert('¡Proyecto creado con éxito! (simulación)');
	}
</script>

<svelte:head>
	<title>Crear Proyecto - Conectando Corazones</title>
	<meta name="description" content="Creá un nuevo proyecto para tu institución" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))]">Crear nuevo proyecto</h1>
			<p class="mt-2 text-gray-600">Completá la información para crear tu proyecto</p>
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
			/>

			<ProyectoParticipaciones
				bind:tiposParticipacionSeleccionados
				bind:participacionesPermitidas
				bind:errores
				{limpiarError}
			/>

			<ProyectoUbicaciones bind:ubicaciones {errores} />

			<div class="flex justify-end">
				<Button type="submit" label="Crear proyecto" loading={enviando} loadingLabel="Creando..." />
			</div>
		</form>
	</div>
</main>
