<script lang="ts">
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { usuario } from '$lib/stores/auth';
	import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ProyectoInfoBasica from './ProyectoInfoBasica.svelte';
	import ProyectoParticipaciones from './ProyectoParticipaciones.svelte';
	import ProyectoUbicaciones from './ProyectoUbicaciones.svelte';
	import type {
		ParticipacionForm,
		UbicacionFormulario
	} from '$lib/domain/types/forms/CrearProyectoForm';
	import type { TipoUbicacion, ModalidadUbicacion } from '$lib/domain/types/Ubicacion';

	import {
		MENSAJES_ERROR,
		validarUrl,
		validarCalle,
		validarNumeroCalle,
		esFechaFutura
	} from '$lib/utils/validaciones';
	import {
		validarBeneficiariosValor,
		validarTituloProyecto,
		validarDescripcionProyecto,
		validarUrlImagen,
		esFechaDemasiadoLejana,
		validarUnidadLibre,
		validarReferencia,
		validarPiso,
		crearValidadorCategoria
	} from '$lib/utils/util-proyecto-form';
	import type { Categoria } from '$lib/domain/types/Categoria';
	import type { TipoParticipacion } from '$lib/domain/types/TipoParticipacion';
	import type { ProyectoCreate } from '$lib/domain/types/dto/ProyectoCreate';
	import type { UbicacionCreate } from '$lib/domain/types/dto/UbicacionCreate';
	import type { ParticipacionPermitidaCreate } from '$lib/domain/types/dto/ParticipacionPermitidaCreate';
	import Alert from '$lib/components/ui/feedback/Alert.svelte';

	export let limiteProyectosAlcanzado: boolean = false;
	export let categorias: Categoria[] = [];
	export let tiposParticipacion: TipoParticipacion[] = [];
	export let estaVerificado: boolean = false;

	// Props para edición
	export let edicion: boolean = false;
	export let proyectoId: number | undefined = undefined;
	export let initialData: any = null;

	let titulo = initialData?.titulo || '';
	let descripcion = initialData?.descripcion || '';
	let urlPortada = initialData?.urlPortada || '';
	let fechaFinTentativa = initialData?.fechaFinTentativa || '';
	let beneficiarios: number | undefined = initialData?.beneficiarios;

	let categoriasSeleccionadas: number[] = initialData?.categoriasSeleccionadas || [];
	let categoriaOtraDescripcion = initialData?.categoriaOtraDescripcion || '';

	let ubicaciones: UbicacionFormulario[] = initialData?.ubicaciones || [
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

	let tiposParticipacionSeleccionados: TipoParticipacionDescripcion[] =
		initialData?.tiposParticipacionSeleccionados || [];
	let participacionesPermitidas: ParticipacionForm[] = initialData?.participacionesPermitidas || [];

	let errores: Record<string, string> = {};

	$: esAdmin = $usuario?.rol === 'administrador';

	const fechaMinima = new Date().toISOString().split('T')[0];

	$: descripcionesCategorias = categorias.map((c) => c.descripcion || '');

	$: validadorCategoria = crearValidadorCategoria(descripcionesCategorias);

	$: idCategoriaOtra = categorias.find(
		(c) => c.descripcion?.toLowerCase() === 'otro' || c.descripcion?.toLowerCase() === 'otra'
	)?.id_categoria;

	$: seleccionoOtra =
		idCategoriaOtra != null && categoriasSeleccionadas.includes(idCategoriaOtra ?? -1);

	$: if (seleccionoOtra) {
		const err = validadorCategoria.validarCategoriaOtraDescripcion(categoriaOtraDescripcion || '');
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
	$: if (fechaFinTentativa && (edicion || esFechaFutura(fechaFinTentativa)))
		limpiarError('fechaFinTentativa');
	$: if (beneficiarios && beneficiarios > 0) limpiarError('beneficiarios');
	$: if (categoriasSeleccionadas.length > 0) limpiarError('categorias');
	$: if (ubicaciones.length > 0) limpiarError('ubicaciones');
	$: if (tiposParticipacionSeleccionados.length > 0) limpiarError('participacion');

	// --- Lógica de Borradores Locales ---
	const DRAFT_KEY = `proyecto_borrador_local`;

	function guardarBorradorLocal() {
		try {
			const data = {
				titulo,
				descripcion,
				urlPortada,
				fechaFinTentativa,
				beneficiarios,
				categoriasSeleccionadas,
				categoriaOtraDescripcion,
				ubicaciones,
				tiposParticipacionSeleccionados,
				participacionesPermitidas,
				timestamp: new Date().toISOString()
			};
			localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
			toastStore.show({
				variant: 'success',
				title: 'Borrador guardado localmente',
				message:
					'Tu progreso se guardó en este navegador. No se ha generado un registro en la base de datos.'
			});
		} catch (e) {
			console.error('Error al guardar borrador local:', e);
			toastStore.show({
				variant: 'error',
				title: 'Error al guardar borrador',
				message: 'No pudimos guardar el borrador en tu navegador.'
			});
		}
	}

	function cargarBorradorLocal() {
		const saved = localStorage.getItem(DRAFT_KEY);
		if (!saved) return;
		try {
			const data = JSON.parse(saved);
			titulo = data.titulo || '';
			descripcion = data.descripcion || '';
			urlPortada = data.urlPortada || '';
			fechaFinTentativa = data.fechaFinTentativa || '';
			beneficiarios = data.beneficiarios;
			categoriasSeleccionadas = data.categoriasSeleccionadas || [];
			categoriaOtraDescripcion = data.categoriaOtraDescripcion || '';
			ubicaciones = data.ubicaciones || [];
			tiposParticipacionSeleccionados = data.tiposParticipacionSeleccionados || [];
			participacionesPermitidas = data.participacionesPermitidas || [];

			toastStore.show({
				variant: 'info',
				title: 'Borrador recuperado',
				message: 'Se cargaron los datos guardados en tu navegador.'
			});
		} catch (e) {
			console.error('Error al cargar borrador local:', e);
		}
	}

	onMount(() => {
		if (edicion || initialData) return;

		const saved = localStorage.getItem(DRAFT_KEY);
		if (saved && !titulo && !descripcion) {
			cargarBorradorLocal();
		}
	});

	function eliminarBorradorLocal() {
		localStorage.removeItem(DRAFT_KEY);
	}

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
		} else if (!edicion && !esFechaFutura(fechaFinTentativa)) {
			// En edición permitimos la fecha original aunque ya no sea futura si no se cambió
			errores.fechaFinTentativa = 'La fecha de fin debe ser al menos a partir de mañana.';
		} else if (esFechaDemasiadoLejana(fechaFinTentativa)) {
			errores.fechaFinTentativa = 'La fecha es demasiado lejana (máximo 2 años).';
		}
		const errBen = beneficiarios != null ? validarBeneficiariosValor(beneficiarios) : null;
		if (errBen) errores.beneficiarios = errBen;
		if (categoriasSeleccionadas.length === 0)
			errores.categorias = 'Debe seleccionar al menos una categoría.';

		const errCatOtra = categoriaOtraDescripcion
			? validadorCategoria.validarCategoriaOtraDescripcion(categoriaOtraDescripcion)
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
				}
				if (!direccion.localidad_id) {
					errores[prefix + '_localidad'] = MENSAJES_ERROR.obligatorio;
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

		if (ubicaciones.length === 0) {
			errores.ubicaciones = 'Debe definir al menos una ubicación.';
			toastStore.show({
				variant: 'error',
				title: 'Faltan datos',
				message: 'Debe definir al menos una ubicación para el proyecto.'
			});
		}

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

	async function enviarFormulario(estado: 'borrador' | 'en_curso' = 'en_curso') {
		if (limiteProyectosAlcanzado && !edicion && estado === 'en_curso') return;

		if (!validarFormulario()) {
			console.log('Formulario inválido', errores);
			return;
		}

		enviando = true;

		const participaciones: ParticipacionPermitidaCreate[] = participacionesPermitidas.map((p) => ({
			id_participacion_permitida: p.id_participacion_permitida,
			tipo_participacion: (p.tipo_participacion?.descripcion ||
				'Voluntariado') as TipoParticipacionDescripcion,
			objetivo: Number(p.objetivo) || 0,
			actual: Number(p.actual) || 0,
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
			beneficiarios: beneficiarios ? Number(beneficiarios) : undefined,
			institucion_id: 0, // Se inyecta en el servidor
			categoria_ids: categoriasSeleccionadas.filter((id) => Number.isFinite(id) && id > 0),
			participaciones: participaciones,
			ubicaciones: ubicacionesCargadas,
			estado: edicion ? undefined : estado
		};

		// --- Manejo de Borrador Local vs Publicación ---
		// Un proyecto en edición no debe guardarse como borrador local.
		if (estado === 'borrador' && !edicion) {
			guardarBorradorLocal();
			enviando = false;
			goto('/proyectos?tab=mis-proyectos');
			return;
		}

		// Envío al backend
		try {
			const url = edicion ? `/api/proyectos/${proyectoId}` : '/api/proyectos';
			const method = edicion ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || `No se pudo ${edicion ? 'editar' : 'crear'} el proyecto.`);
			}

			// Si se publicó con éxito, eliminamos el borrador local
			eliminarBorradorLocal();

			toastStore.show({
				variant: 'success',
				title: edicion ? '¡Proyecto actualizado!' : '¡Proyecto creado!',
				message: edicion
					? 'Los cambios se han guardado exitosamente.'
					: 'El proyecto se ha publicado exitosamente. Ahora es visible para todos.'
			});
			goto('/proyectos?tab=mis-proyectos');
		} catch (error: any) {
			console.error('Error al enviar formulario:', error);
			toastStore.show({
				variant: 'error',
				title: `Error al ${edicion ? 'editar' : 'crear'} proyecto`,
				message: error.message || 'Ocurrió un error inesperado. Por favor, intentá nuevamente.'
			});
		} finally {
			enviando = false;
		}
	}
</script>

<svelte:head>
	<title>Crear Proyecto - Conectando Corazones</title>
	<meta name="description" content="Creá un nuevo proyecto para tu institución" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-[rgb(var(--base-color))]">
				{edicion ? 'Editar proyecto' : 'Crear nuevo proyecto'}
			</h1>
			<p class="mt-2 text-gray-600">
				{edicion
					? 'Actualizá la información de tu proyecto'
					: 'Completá la información para crear tu proyecto'}
			</p>
		</div>

		{#if limiteProyectosAlcanzado && !edicion}
			<div class="mb-6">
				<Alert
					variant="warning"
					title="Límite de proyectos alcanzado"
					message="Ya superaste la cantidad máxima de proyectos en curso (5). No podés publicar un nuevo proyecto hasta que finalices o interrumpas alguno de los actuales."
				/>
			</div>
		{/if}

		{#if !estaVerificado && !edicion}
			<div class="mb-6">
				<Alert
					variant="info"
					title="Institución no verificada"
					message="Tu institución aún no ha sido verificada. Podés guardar el proyecto como Borrador, pero solo podrás publicarlo (En curso) una vez que tu identidad sea aprobada."
				/>
			</div>
		{/if}

		<form
			on:submit|preventDefault={() => enviarFormulario(estaVerificado ? 'en_curso' : 'borrador')}
			class="space-y-8"
		>
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
				{categorias}
				modoEdicion={edicion}
				{esAdmin}
			/>

			<ProyectoParticipaciones
				bind:tiposParticipacionSeleccionados
				bind:participacionesPermitidas
				bind:errores
				{limpiarError}
				{tiposParticipacion}
				modoEdicion={edicion}
				{esAdmin}
				participacionesOriginales={initialData?.participacion_permitida || []}
				estaPublicado={initialData?.estado !== 'borrador' && initialData?.estado != null}
				tieneColaboradoresAprobados={initialData?.colaboraciones?.some(
					(c: any) => c.estado === 'aprobada'
				) || false}
			/>

			<ProyectoUbicaciones bind:ubicaciones {errores} modoEdicion={edicion} {esAdmin} />

			<div class="flex flex-col justify-end gap-4 border-t border-gray-200 pt-6 sm:flex-row">
				{#if !edicion}
					<Button
						type="button"
						variant="secondary"
						label="Guardar como Borrador"
						loading={enviando}
						disabled={enviando}
						onclick={() => enviarFormulario('borrador')}
					/>
				{/if}

				<Button
					type="submit"
					label={edicion ? 'Guardar cambios' : 'Publicar proyecto'}
					loading={enviando}
					loadingLabel={edicion ? 'Guardando...' : 'Publicando...'}
					disabled={enviando ||
						(limiteProyectosAlcanzado && !edicion) ||
						(!estaVerificado && !edicion)}
					title={!estaVerificado && !edicion ? 'Debés estar verificado para publicar' : ''}
				/>
			</div>
		</form>
	</div>
</main>
