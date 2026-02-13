<script lang="ts">
	import { onMount, tick } from 'svelte';
	import RegistroCuentaForm from '$lib/components/feature/registro/RegistroCuentaForm.svelte';
	import RolCard from '$lib/components/feature/registro/RolCard.svelte';
	import Loader from '$lib/components/ui/feedback/Loader.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';
	import Stepper from '$lib/components/ui/Stepper.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ValidacionInstitucion from '$lib/validation/components/ValidacionInstitucion.svelte';
	import DireccionForm from '$lib/components/ui/forms/DireccionForm.svelte';
	import MetodosContactoForm from '$lib/components/ui/forms/MetodosContactoForm.svelte';
	import PreferenciasForm from '$lib/components/feature/registro/PreferenciasForm.svelte';
	import { goto } from '$app/navigation';
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { RegistroCuentaSubmitDetail } from '$lib/domain/types/forms/registro';
	import { authActions, isAuthenticated } from '$lib/stores/auth';
	import {
		obtenerSiguienteEtapaCuenta,
		type RegistroEtapa,
		type RegistroRol
	} from '$lib/domain/use-cases/auth/registroFlow';
	import {
		mapearFormularioColaboradorAInputRegistro,
		mapearFormularioInstitucionAInputRegistro
	} from '$lib/adapters/registration.mapper';
	import {
		REGISTRO_STORAGE_KEY,
		REGISTRO_PAGE_STORAGE_KEY,
		REGISTRO_STORAGE_TTL_MS,
		REGISTRO_STORAGE_VERSION
	} from '$lib/domain/types/constants/registro';
	import { toastStore } from '$lib/stores/toast';
	import { env } from '$lib/infrastructure/config/env';

	export let data;

	let cargada = false; // para saber si la página terminó de cargar

	const TOTAL_PASOS = 5;
	let etapa: RegistroEtapa = 'seleccion';

	let rol: RegistroRol = 'institucion';
	let registrando = false;
	let errorRegistro: string | null = null;

	type RegistroPageSnapshot = {
		version: number;
		timestamp: number;
		etapa: RegistroEtapa;
		rol: RegistroRol;
		usuarioId?: number;
	};

	let storageRegistroDisponible = false;
	let persistenciaPaginaLista = false;
	let notificacionEtapaMostrada = false;
	let usuarioRegistradoId: number | null = null;

	$: procesandoFormulario = registrando;

	// Redirección si ya está autenticado y en el paso inicial
	$: if ($isAuthenticated && etapa === 'seleccion') {
		if (typeof window !== 'undefined') {
			toastStore.show({
				variant: 'info',
				message: 'Ya iniciaste sesión. Te redirigimos a tu panel.'
			});
			goto('/mi-panel');
		}
	}

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Registro' }]);
		if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
			storageRegistroDisponible = true;
			const snapshot = leerProgresoRegistro();
			if (snapshot) {
				rol = snapshot.rol;
				etapa = snapshot.etapa;
				usuarioRegistradoId = snapshot.usuarioId ?? null;
				guardarProgresoRegistro({
					...snapshot,
					timestamp: Date.now()
				});
			}
			persistenciaPaginaLista = true;
		}
		cargada = true;
	});

	function resetFeedback() {
		errorRegistro = null;
	}

	function elegir(r: RegistroRol) {
		rol = r;
		resetFeedback();
		setEtapaConPersistencia('formulario', { limpiarFormulario: true });
	}

	function manejarError(error: unknown, fallback: string): string {
		if (error instanceof Error) {
			const mensaje = error.message?.trim();
			if (mensaje) {
				return mensaje;
			}
		}
		return fallback;
	}

	async function manejarRegistroCuenta(event: CustomEvent<RegistroCuentaSubmitDetail>) {
		if (procesandoFormulario) {
			return;
		}
		resetFeedback();

		const detalle = event.detail;
		rol = detalle.rol;

		registrando = true;
		try {
			if (detalle.rol === 'colaborador') {
				const mapping = mapearFormularioColaboradorAInputRegistro(detalle);
				await authActions.registerColaborador(mapping.input);
			} else {
				const mapping = mapearFormularioInstitucionAInputRegistro(detalle);
				const usuario = await authActions.registerInstitucion(mapping.input);
				if (usuario && usuario.id_usuario) {
					usuarioRegistradoId = usuario.id_usuario;
				}
			}

			// Subir foto de perfil si existe
			if (detalle.archivoFoto) {
				await subirFotoPerfil(detalle.archivoFoto);
			}

			const siguienteEtapa = obtenerSiguienteEtapaCuenta(detalle.rol);
			setEtapaConPersistencia(siguienteEtapa, { limpiarFormulario: true });
		} catch (error) {
			errorRegistro = manejarError(
				error,
				'No pudimos completar el registro. Intentá nuevamente en unos instantes.'
			);
		} finally {
			registrando = false;
		}
	}

	async function subirFotoPerfil(archivo: File) {
		try {
			const response = await fetch('/api/storage/upload-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nombre_archivo: archivo.name,
					tipo_mime: archivo.type,
					bucket: 'avatars'
				})
			});

			const { uploadUrl, fullPath, error } = await response.json();
			if (error) throw new Error(error);

			const uploadRes = await fetch(uploadUrl, {
				method: 'PUT',
				body: archivo,
				headers: { 'Content-Type': archivo.type }
			});

			if (!uploadRes.ok) throw new Error('Error al subir la imagen');

			const baseUrl = env.SUPABASE_URL.replace(/\/$/, '');
			const publicUrl = `${baseUrl}/storage/v1/object/public/${fullPath}`;

			if (usuarioRegistradoId) {
				const updateRes = await fetch('/api/usuarios/me/foto', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						url: publicUrl,
						nombreArchivo: archivo.name,
						tipoMime: archivo.type,
						tamanio: archivo.size
					})
				});

				if (!updateRes.ok) throw new Error('Error al actualizar el perfil con la foto');
			}
		} catch (e) {
			console.error('Error subiendo foto de perfil:', e);
			toastStore.show({
				variant: 'warning',
				message:
					'Tu cuenta se creó, pero hubo un problema al subir tu foto. Podrás intentarlo luego.'
			});
		}
	}

	async function manejarSubidaVerificacion(event: CustomEvent<{ files: File[] }>) {
		if (!usuarioRegistradoId) {
			toastStore.show({
				variant: 'warning',
				message: 'No se identificó al usuario. Por favor, contactanos si persiste el problema.'
			});
			setEtapaConPersistencia('contacto');
			return;
		}

		try {
			const files = event.detail.files;
			const formData = new FormData();
			formData.append('id_usuario', usuarioRegistradoId.toString());
			files.forEach((f) => formData.append('files', f));

			const res = await fetch('/api/registro/verificacion', {
				method: 'POST',
				body: formData
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Error al subir archivos');
			}

			toastStore.show({
				variant: 'success',
				title: 'Documentación recibida',
				message: 'Tu verificación quedó en proceso de revisión.'
			});
			setEtapaConPersistencia('contacto');
		} catch (error) {
			console.error('Error subiendo verificación:', error);
			toastStore.show({
				variant: 'error',
				title: 'Error de carga',
				message: 'No pudimos subir los archivos. Podrás intentarlo luego desde tu perfil.'
			});
			setEtapaConPersistencia('contacto');
		}
	}

	function manejarFormularioInvalido() {
		errorRegistro = 'Revisá los campos marcados en rojo antes de continuar.';
		// Scroll al tope para ver errores
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function volverASeleccion() {
		resetFeedback();
		setEtapaConPersistencia('seleccion');
	}

	function obtenerEtapaAnterior(actual: RegistroEtapa): RegistroEtapa | null {
		switch (actual) {
			case 'formulario':
				return 'seleccion';
			case 'verificacion':
				return 'formulario';
			case 'contacto':
				return rol === 'institucion' ? 'verificacion' : 'formulario';
			case 'direccion':
				return 'contacto';
			case 'preferencias':
				return 'direccion';
			case 'exito':
				return 'preferencias';
			default:
				return null;
		}
	}

	function retrocederEtapa(actual: RegistroEtapa) {
		const anterior = obtenerEtapaAnterior(actual);
		if (!anterior) {
			return;
		}
		resetFeedback();
		setEtapaConPersistencia(anterior);
	}

	function leerProgresoRegistro(): RegistroPageSnapshot | null {
		if (!storageRegistroDisponible) {
			return null;
		}
		try {
			const raw = window.sessionStorage.getItem(REGISTRO_PAGE_STORAGE_KEY);
			if (!raw) {
				return null;
			}
			const snapshot = JSON.parse(raw) as RegistroPageSnapshot;
			if (!snapshot || snapshot.version !== REGISTRO_STORAGE_VERSION) {
				window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
				return null;
			}
			if (Date.now() - snapshot.timestamp > REGISTRO_STORAGE_TTL_MS) {
				window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
				return null;
			}
			return snapshot;
		} catch (error) {
			console.warn('No se pudo recuperar el progreso del registro', error);
			window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
			return null;
		}
	}

	function guardarProgresoRegistro(snapshot: RegistroPageSnapshot) {
		if (!storageRegistroDisponible) {
			return;
		}
		try {
			window.sessionStorage.setItem(REGISTRO_PAGE_STORAGE_KEY, JSON.stringify(snapshot));
		} catch (error) {
			console.warn('No se pudo guardar el progreso del registro', error);
		}
	}

	function limpiarProgresoRegistro() {
		if (!storageRegistroDisponible) {
			return;
		}
		window.sessionStorage.removeItem(REGISTRO_PAGE_STORAGE_KEY);
	}

	function limpiarFormularioPersistido() {
		if (!storageRegistroDisponible) {
			return;
		}
		window.sessionStorage.removeItem(REGISTRO_STORAGE_KEY);
	}

	function limpiarProgresoTotal() {
		limpiarProgresoRegistro();
		limpiarFormularioPersistido();
	}

	function setEtapaConPersistencia(
		nueva: RegistroEtapa,
		opciones: { limpiarFormulario?: boolean; limpiarTodo?: boolean } = {}
	) {
		// Animación suave de scroll al cambiar de etapa
		window.scrollTo({ top: 0, behavior: 'smooth' });

		etapa = nueva;

		if (!storageRegistroDisponible || !persistenciaPaginaLista) {
			if (opciones.limpiarTodo) {
				limpiarProgresoTotal();
			} else if (opciones.limpiarFormulario) {
				limpiarFormularioPersistido();
			}
			return;
		}

		if (opciones.limpiarTodo || nueva === 'exito') {
			limpiarProgresoTotal();
			notificacionEtapaMostrada = false;
			if (nueva === 'exito') {
				notificacionEtapaMostrada = false;
				return;
			}
			return;
		}

		if (nueva === 'seleccion') {
			limpiarProgresoRegistro();
			if (opciones.limpiarFormulario ?? true) {
				limpiarFormularioPersistido();
			}
			notificacionEtapaMostrada = false;
			return;
		}

		if (opciones.limpiarFormulario) {
			limpiarFormularioPersistido();
		}

		guardarProgresoRegistro({
			version: REGISTRO_STORAGE_VERSION,
			timestamp: Date.now(),
			rol,
			etapa: nueva,
			usuarioId: usuarioRegistradoId ?? undefined
		});
		notificarProgresoGuardado();
	}

	function notificarProgresoGuardado() {
		if (notificacionEtapaMostrada || !storageRegistroDisponible) {
			return;
		}
		notificacionEtapaMostrada = true;
		toastStore.show({
			variant: 'info',
			title: 'Progreso guardado',
			message: 'Podés continuar tu registro más tarde si lo necesitás. Guardamos tu avance.'
		});
	}

	function obtenerEtiquetaRetroceso(actual: RegistroEtapa): string {
		switch (actual) {
			case 'contacto':
				return rol === 'institucion' ? 'Volver a validación' : 'Volver a credenciales';
			case 'direccion':
				return 'Volver a contacto';
			default:
				return 'Volver';
		}
	}

	async function manejarEnvioContactos(event: CustomEvent<any>) {
		if (!usuarioRegistradoId) {
			toastStore.show({ variant: 'error', message: 'No se identificó al usuario.' });
			return;
		}
		const contactos = event.detail;
		try {
			const res = await fetch('/api/registro/completar-perfil', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_usuario: usuarioRegistradoId,
					contactos
				})
			});
			if (!res.ok) throw new Error('Error al guardar contactos');

			setEtapaConPersistencia('direccion');
		} catch (error) {
			console.error(error);
			toastStore.show({ variant: 'error', message: 'Error guardando contactos.' });
		}
	}

	async function manejarEnvioDireccion(event: CustomEvent<any>) {
		if (!usuarioRegistradoId) {
			toastStore.show({ variant: 'error', message: 'No se identificó al usuario.' });
			return;
		}
		const direccion = event.detail;
		try {
			const res = await fetch('/api/registro/completar-perfil', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_usuario: usuarioRegistradoId,
					direccion
				})
			});
			if (!res.ok) throw new Error('Error al guardar ubicación');

			setEtapaConPersistencia('preferencias');
		} catch (error) {
			console.error(error);
			toastStore.show({ variant: 'error', message: 'Error guardando ubicación.' });
		}
	}

	async function manejarPreferencias(
		event: CustomEvent<{ categorias: number[]; tiposParticipacion: number[] }>
	) {
		if (!usuarioRegistradoId) return;
		procesandoFormulario = true;
		try {
			const res = await fetch('/api/registro/completar-perfil', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_usuario: usuarioRegistradoId,
					categorias: event.detail.categorias,
					tiposParticipacion: event.detail.tiposParticipacion
				})
			});

			if (!res.ok) throw new Error('Error guardando preferencias');

			setEtapaConPersistencia('exito', { limpiarTodo: true });
		} catch (error) {
			console.error(error);
			toastStore.show({
				variant: 'warning',
				message: 'No pudimos guardar tus preferencias, pero tu cuenta está lista.'
			});
			setEtapaConPersistencia('exito', { limpiarTodo: true });
		} finally {
			procesandoFormulario = false;
		}
	}

	function irAlPanel() {
		const rutaPanel = rol === 'institucion' ? '/institucion/mi-panel' : '/colaborador/mi-panel';
		goto(rutaPanel);
	}
</script>

<svelte:head>
	<title>Registrarse - Conectando Corazones</title>
	<meta
		name="description"
		content="Creá tu cuenta para comenzar a colaborar o publicar proyectos solidarios."
	/>
</svelte:head>

<div
	class="fixed inset-0 -z-50 min-h-screen w-full overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900"
>
	<!-- Gradient Mesh Background -->
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.08),transparent_25%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_0%_100%,rgba(168,85,247,0.08),transparent_25%)]"
	></div>

	<!-- Subtle grid pattern -->
	<div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]"></div>

	<!-- Floating orbs -->
	<div
		class="animate-float-slow absolute top-20 -left-20 hidden h-96 w-96 rounded-full bg-blue-200/20 blur-3xl filter lg:block"
	></div>
	<div
		class="animate-float-slower absolute -right-20 bottom-20 hidden h-96 w-96 rounded-full bg-purple-200/20 blur-3xl filter lg:block"
	></div>
</div>

<main
	class="relative z-10 mx-auto flex min-h-screen w-full flex-col justify-center px-4 py-8 sm:px-6 lg:px-8"
>
	<!-- Logo / Header Mobile-First -->
	<header class="mb-8 text-center sm:mb-12">
		<h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
			<span class="block">Unite a</span>
			<span
				class="mt-1 block bg-gradient-to-r from-[rgb(var(--color-primary))] via-blue-400 to-[rgb(var(--color-primary))] bg-clip-text text-transparent"
			>
				Conectando Corazones
			</span>
		</h1>
		{#if etapa === 'seleccion'}
			<p
				class="mx-auto mt-4 max-w-lg text-lg text-gray-600"
				in:fade={{ duration: 400, delay: 200 }}
			>
				Donde la ayuda encuentra su destino.
			</p>
		{/if}
	</header>

	<!-- Main Content Card -->
	<section class="mx-auto w-full max-w-4xl transition-all duration-500 ease-out">
		{#if etapa === 'seleccion'}
			<div in:fly={{ y: 20, duration: 500, easing: cubicOut }} out:fade={{ duration: 200 }}>
				<div class="mb-12 hidden sm:block">
					<Stepper pasoActual={1} pasosTotales={TOTAL_PASOS} />
				</div>

				<div
					class="rounded-3xl bg-white/60 p-6 shadow-2xl ring-1 shadow-blue-900/5 ring-gray-900/5 backdrop-blur-xl sm:p-12"
				>
					<p class="mb-8 text-center text-xl font-medium text-gray-800">¿Cómo querés participar?</p>

					<div class="grid gap-6 md:grid-cols-2 lg:gap-8">
						<RolCard
							titulo="Soy una institución"
							descripcion="Busco apoyo, voluntarios y recursos para mis proyectos solidarios."
							icono="institucion"
							onSelect={() => elegir('institucion')}
						/>
						<RolCard
							titulo="Soy colaborador/a"
							descripcion="Quiero ayudar donando mi tiempo, habilidades o recursos a causas nobles."
							icono="colaborador"
							onSelect={() => elegir('colaborador')}
						/>
					</div>

					<div
						class="mt-8 rounded-lg bg-blue-50/50 p-4 text-center text-sm text-gray-600 ring-1 ring-blue-100"
					>
						<p>
							Si sos una organización (ONG, empresa, fundación) que quiere <span
								class="font-semibold text-blue-700">ayudar</span
							>
							a otros, registrate como
							<span class="font-semibold text-blue-700">Colaborador/a</span>.
						</p>
					</div>
				</div>
			</div>
		{:else if etapa === 'formulario'}
			<div in:fly={{ x: 20, duration: 400 }} class="relative">
				<div class="mb-8">
					<Stepper pasoActual={2} pasosTotales={TOTAL_PASOS} />
				</div>

				<div class="mb-6 flex items-center justify-between">
					<button
						class="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
						type="button"
						on:click={volverASeleccion}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform group-hover:-translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Cambiar tipo de cuenta
					</button>
				</div>

				<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-10">
					<RegistroCuentaForm
						{rol}
						procesando={procesandoFormulario}
						errorGeneral={errorRegistro}
						on:submit={manejarRegistroCuenta}
						on:invalid={manejarFormularioInvalido}
						on:back={() => retrocederEtapa('formulario')}
					/>
				</div>
			</div>
		{:else if etapa === 'verificacion'}
			<div in:fly={{ x: 20, duration: 400 }}>
				<ValidacionInstitucion
					pasoActual={3}
					pasosTotales={TOTAL_PASOS}
					on:submit={manejarSubidaVerificacion}
					on:skip={() => setEtapaConPersistencia('contacto')}
					on:cancel={() => {
						resetFeedback();
						setEtapaConPersistencia('formulario');
					}}
				/>
			</div>
		{:else if etapa === 'contacto'}
			<div in:fly={{ x: 20, duration: 400 }}>
				<div class="mb-8">
					<Stepper pasoActual={4} pasosTotales={TOTAL_PASOS} />
				</div>

				<div class="mb-6">
					<button
						type="button"
						class="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
						on:click={() => retrocederEtapa('contacto')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform group-hover:-translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						{obtenerEtiquetaRetroceso('contacto')}
					</button>
				</div>

				<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-10">
					<div class="mb-8 text-center">
						<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Estemos en contacto</h2>
						<p class="mt-2 text-gray-600">
							Agregá medios de contacto para que otros usuarios puedan comunicarse con vos.
						</p>
					</div>

					<MetodosContactoForm
						mostrarOmitir
						bloquearPrimerContacto={false}
						on:skip={() => setEtapaConPersistencia('direccion')}
						on:submit={manejarEnvioContactos}
					/>
				</div>
			</div>
		{:else if etapa === 'direccion'}
			<div in:fly={{ x: 20, duration: 400 }}>
				<div class="mb-8">
					<Stepper pasoActual={5} pasosTotales={TOTAL_PASOS} />
				</div>

				<div class="mb-6">
					<button
						type="button"
						class="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
						on:click={() => retrocederEtapa('direccion')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform group-hover:-translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						{obtenerEtiquetaRetroceso('direccion')}
					</button>
				</div>

				<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-10">
					<div class="mb-8 text-center">
						<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">¿Dónde te encontrás?</h2>
						<p class="mt-2 text-gray-600">
							Esta información nos ayuda a mostrarles proyectos cercanos a tu ubicación.
						</p>
					</div>

					<DireccionForm
						mostrarOmitir
						on:skip={() => setEtapaConPersistencia('preferencias')}
						on:submit={manejarEnvioDireccion}
					/>
				</div>
			</div>
		{:else if etapa === 'preferencias'}
			<div in:fly={{ x: 20, duration: 400 }}>
				<div class="mb-8">
					<Stepper pasoActual={6} pasosTotales={TOTAL_PASOS} />
				</div>

				<div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-10">
					<PreferenciasForm
						categorias={data.categorias}
						tiposParticipacion={data.tiposParticipacion}
						procesando={procesandoFormulario}
						on:submit={manejarPreferencias}
						on:skip={() => setEtapaConPersistencia('exito', { limpiarTodo: true })}
					/>
				</div>
			</div>
		{:else if etapa === 'exito'}
			<div
				in:scale={{ duration: 500, start: 0.9, opacity: 0, easing: cubicOut }}
				class="flex min-h-[50vh] flex-col items-center justify-center text-center"
			>
				<div class="relative mb-8">
					<div
						class="absolute -inset-4 animate-pulse rounded-full bg-green-100 opacity-70 blur-xl"
					></div>
					<div
						class="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-xl ring-1 ring-green-100"
					>
						<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="3"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				</div>

				<h2 class="mb-4 text-4xl font-extrabold text-gray-900">¡Registro exitoso!</h2>
				<p class="mb-8 max-w-md text-lg text-gray-600">
					Tu cuenta está lista para empezar a cambiar el mundo. ¡Gracias por sumarte!
				</p>

				<div class="w-full max-w-xs transition-transform hover:scale-105">
					<Button
						label="Ir a mi panel"
						variant="primary"
						size="md"
						customClass="w-full shadow-lg shadow-blue-500/30"
						onclick={irAlPanel}
					/>
				</div>
			</div>
		{/if}
	</section>

	<Loader size={80} loading={!cargada} />
</main>

<style>
	@keyframes float-slow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}
	@keyframes float-slower {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(20px);
		}
	}
	.animate-float-slow {
		animation: float-slow 8s ease-in-out infinite;
	}
	.animate-float-slower {
		animation: float-slower 12s ease-in-out infinite;
	}
</style>
