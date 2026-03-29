<script lang="ts">
	import { onMount } from 'svelte';
	import RegistroCuentaForm from '$lib/components/feature/registro/RegistroCuentaForm.svelte';
	import RolCard from '$lib/components/feature/registro/RolCard.svelte';
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
	import { authActions, isAuthenticated, usuario } from '$lib/stores/auth';
	import { clsx } from 'clsx';
	import { type Contacto } from '$lib/domain/types/Contacto';
	import type { DireccionPayload } from '$lib/components/ui/forms/DireccionForm.svelte';

	function urlPanelPorRolRegistro(
		r: 'institucion' | 'colaborador' | 'administrador' | string | undefined
	): string {
		switch (r) {
			case 'institucion':
				return '/institucion/mi-panel';
			case 'colaborador':
				return '/colaborador/mi-panel';
			case 'administrador':
				return '/admin';
			default:
				return '/';
		}
	}
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

	let { data } = $props();

	const PASOS_REGISTRO = [
		{
			label: 'Tipo de cuenta',
			etapa: 'seleccion',
			opcional: false,
			titulo: '¿Cómo querés *participar*?',
			descripcion: 'Elegí el rol que mejor se adapte a tu intención en la plataforma.'
		},
		{
			label: 'Datos de acceso',
			etapa: 'formulario',
			opcional: false,
			titulo: 'Crea tus *credenciales*',
			descripcion: 'Configurá tu cuenta de acceso para empezar a usar la plataforma.'
		},
		{
			label: 'Verificación',
			etapa: 'verificacion',
			opcional: true,
			soloInstitucion: true,
			titulo: 'Validá tu *identidad*',
			descripcion:
				'Como institución, necesitamos verificar tus datos oficiales para habilitar publicaciones.'
		},
		{
			label: 'Contacto',
			etapa: 'contacto',
			opcional: true,
			titulo: 'Información de *contacto*',
			descripcion: 'Dejanos tus datos para que otros puedan comunicarse con vos fácilmente.'
		},
		{
			label: 'Ubicación',
			etapa: 'direccion',
			opcional: true,
			titulo: '¿Dónde te *encontrás*?',
			descripcion: 'La ubicación ayuda a conectar con colaboradores y proyectos en tu zona.'
		},
		{
			label: 'Preferencias',
			etapa: 'preferencias',
			opcional: true,
			titulo: 'Tus *intereses*',
			descripcion: 'Personalizá tu experiencia eligiendo las causas que más te importan.'
		}
	];

	let etapa: RegistroEtapa = $state('seleccion');
	let rol: RegistroRol | null = $state(null);

	const pasosFiltrados = $derived(
		PASOS_REGISTRO.filter((p) => !p.soloInstitucion || rol === 'institucion')
	);
	const TOTAL_PASOS = $derived(pasosFiltrados.length);

	// Determinar el número de paso actual (1-indexed) basado en la etapa y los pasos filtrados
	const pasoActualSecuencial = $derived.by(() => {
		if (etapa === 'exito') return TOTAL_PASOS + 1;
		const idx = pasosFiltrados.findIndex((p) => p.etapa === etapa);
		return idx === -1 ? 1 : idx + 1;
	});

	const infoPasoActual = $derived(pasosFiltrados[pasoActualSecuencial - 1] || pasosFiltrados[0]);
	let registrando = $state(false);
	let errorRegistro: string | null = $state(null);

	type RegistroPageSnapshot = {
		version: number;
		timestamp: number;
		etapa: RegistroEtapa;
		rol: RegistroRol;
		usuarioId?: number;
	};

	let storageRegistroDisponible = $state(false);
	let persistenciaPaginaLista = $state(false);
	let notificacionEtapaMostrada = $state(false);
	let usuarioRegistradoId: number | null = $state(null);

	let procesandoFormulario = $derived(registrando);

	$effect(() => {
		if ($isAuthenticated && etapa === 'seleccion' && $usuario?.rol) {
			if (typeof window !== 'undefined') {
				toastStore.show({
					variant: 'info',
					message: 'Ya iniciaste sesión. Te redirigimos a tu panel.'
				});
				goto(urlPanelPorRolRegistro($usuario.rol));
			}
		}
	});

	onMount(() => {
		// No breadcrumbs on registration page
		if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
			storageRegistroDisponible = true;
			const snapshot = leerProgresoRegistro();
			if (snapshot) {
				rol = snapshot.rol ?? null;
				etapa = snapshot.etapa;
				usuarioRegistradoId = snapshot.usuarioId ?? null;
				guardarProgresoRegistro({
					...snapshot,
					timestamp: Date.now()
				});
			}
			persistenciaPaginaLista = true;
		}
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

	async function manejarRegistroCuenta(detalle: RegistroCuentaSubmitDetail) {
		if (procesandoFormulario) {
			return;
		}
		resetFeedback();

		if (detalle.rol) {
			rol = detalle.rol;
		}

		registrando = true;
		try {
			if (detalle.rol === 'colaborador') {
				const mapping = mapearFormularioColaboradorAInputRegistro(detalle);
				const usuario = await authActions.registerColaborador(mapping.input);
				if (usuario && usuario.id_usuario) {
					usuarioRegistradoId = usuario.id_usuario;
				}
			} else {
				const mapping = mapearFormularioInstitucionAInputRegistro(detalle);
				const usuario = await authActions.registerInstitucion(mapping.input);
				if (usuario && usuario.id_usuario) {
					usuarioRegistradoId = usuario.id_usuario;
				}
			}

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

	async function manejarSubidaVerificacion(detail: { files: File[] }) {
		try {
			const files = detail.files;
			const formData = new FormData();
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
				return usuarioRegistradoId ? null : 'formulario';
			case 'contacto':
				if (usuarioRegistradoId) return null;
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
			rol: rol as RegistroRol,
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

	async function manejarEnvioContactos(contactos: Contacto[]) {
		if (!usuarioRegistradoId) {
			toastStore.show({ variant: 'error', message: 'No se identificó al usuario.' });
			return;
		}
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

	async function manejarEnvioDireccion(direccion: DireccionPayload | undefined) {
		if (!usuarioRegistradoId) {
			toastStore.show({ variant: 'error', message: 'No se identificó al usuario.' });
			return;
		}
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

	async function manejarPreferencias(detail: {
		categorias: number[];
		tiposParticipacion: number[];
	}) {
		if (!usuarioRegistradoId) return;
		procesandoFormulario = true;
		try {
			const res = await fetch('/api/registro/completar-perfil', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_usuario: usuarioRegistradoId,
					categorias: detail.categorias,
					tiposParticipacion: detail.tiposParticipacion
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

<div class="flex min-h-screen w-full flex-col bg-slate-50/50 selection:bg-blue-100 lg:flex-row">
	{#snippet TextHighlight(text: string)}
		{#each text.split(/(\*.*?\*)/g) as segment}
			{#if segment.startsWith('*') && segment.endsWith('*')}
				<span class="text-[rgb(var(--color-primary))]">{segment.slice(1, -1)}</span>
			{:else}
				{segment}
			{/if}
		{/each}
	{/snippet}

	<!-- Panel Lateral (Desktop) -->
	<aside
		in:fly={{ x: -50, duration: 800, easing: cubicOut }}
		class="sticky top-0 hidden h-screen w-full flex-col bg-[rgb(var(--base-color))] p-12 text-white lg:flex lg:w-[450px]"
	>
		<div class="relative z-10 flex h-full flex-col justify-center">
			<div>
				<div class="mt-20">
					<h1 class="text-4xl leading-tight font-extrabold tracking-tight text-white">
						{#if etapa === 'seleccion'}
							Elegí cómo querés <span class="text-[rgb(var(--color-primary-hover))]">ayudar</span>
						{:else if etapa === 'exito'}
							¡Todo <span class="text-green-400">listo</span>!
						{:else}
							Completá tu <span class="text-[rgb(var(--color-primary-hover))]">perfil</span>
						{/if}
					</h1>
					<p class="mt-4 text-lg text-slate-300">
						{#if etapa === 'seleccion'}
							Somos la comunidad donde la ayuda encuentra su destino.
						{:else if etapa === 'exito'}
							Tu viaje solidario comienza ahora mismo.
						{:else}
							Estás a solo unos pasos de ser parte del cambio.
						{/if}
					</p>
				</div>

				<!-- Stepper Vertical (Desktop) -->
				<nav class="mt-16 space-y-6">
					{#each pasosFiltrados as step, i (step.etapa)}
						{@const stepNum = i + 1}
						{@const isCompletado = pasoActualSecuencial > stepNum}
						{@const isActive = pasoActualSecuencial === stepNum}

						<div
							in:fly={{ x: -20, duration: 600, delay: 400 + i * 100, easing: cubicOut }}
							class="group flex items-center gap-4"
						>
							<div
								class={clsx(
									'flex h-10 w-10 items-center justify-center rounded-xl border-2 text-sm font-black transition-all duration-500',
									isCompletado
										? 'border-green-400 bg-green-400 text-white shadow-lg shadow-green-500/20'
										: isActive
											? 'border-[rgb(var(--color-primary-hover))] bg-[rgb(var(--color-primary-hover))] text-white shadow-[0_0_20px_rgba(66,161,255,0.3)]'
											: 'border-white/10 text-slate-500'
								)}
							>
								{#if isCompletado}
									<svg
										class="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="3"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								{:else}
									{stepNum}
								{/if}
							</div>
							<div class="flex flex-col">
								<span
									class={clsx(
										'text-sm font-bold tracking-tight transition-all duration-300',
										isActive ? 'text-white' : 'text-slate-400'
									)}
								>
									{step.label}
								</span>
								{#if step.opcional}
									<div class="mt-1.5 flex">
										<span
											class="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-black tracking-widest text-slate-400 uppercase backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-slate-200"
										>
											Opcional
										</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Elementos decorativos de fondo -->
		<div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
		<div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
	</aside>

	<!-- Área Principal / Formulario -->
	<main class="relative flex flex-1 flex-col">
		<div class="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
			<div class="w-full max-w-2xl lg:max-w-7xl">
				{#if etapa === 'seleccion'}
					{#key etapa}
						<div in:fade={{ duration: 400 }} class="flex flex-col items-center space-y-16">
							<!-- Encabezado Estilo Referencia (Centrado y Premium) -->
							<div class="mx-auto max-w-xl space-y-6 text-center">
								<div
									in:fly={{ y: 15, duration: 600, delay: 200, easing: cubicOut }}
									class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[rgb(var(--color-primary))] uppercase shadow-xs"
								>
									<span class="relative flex h-2 w-2">
										<span
											class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
										></span>
										<span
											class="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--color-primary))]"
										></span>
									</span>
									Comencemos
								</div>

								<h2
									in:fly={{ y: 20, duration: 800, delay: 400, easing: cubicOut }}
									class="text-4xl leading-tight font-black tracking-tighter text-slate-900 md:text-5xl"
								>
									{@render TextHighlight(infoPasoActual.titulo)}
								</h2>

								<p
									in:fly={{ y: 20, duration: 800, delay: 600, easing: cubicOut }}
									class="text-lg leading-relaxed font-medium text-slate-500"
								>
									Elegí el rol que mejor se adapte a tu intención en la plataforma para personalizar
									tu experiencia.
								</p>
							</div>

							<div class="lg:hidden">
								<Stepper pasoActual={pasoActualSecuencial} pasosTotales={TOTAL_PASOS} />
							</div>

							<div class="grid w-full gap-8 px-4 sm:grid-cols-2 lg:max-w-6xl">
								<div in:fly={{ y: 30, duration: 800, delay: 800, easing: cubicOut }}>
									<RolCard
										seleccionado={rol === 'institucion'}
										icono="institucion"
										titulo="Institución"
										descripcion="Publicá proyectos, solicitá ayuda y gestioná el impacto social de tu organización en la comunidad."
										onSelect={() => elegir('institucion')}
									/>
								</div>
								<div in:fly={{ y: 30, duration: 800, delay: 950, easing: cubicOut }}>
									<RolCard
										seleccionado={rol === 'colaborador'}
										icono="colaborador"
										titulo="Colaborador/a"
										descripcion="Encontrá proyectos afines, doná recursos o postulate como voluntario para ayudar a causas nobles."
										onSelect={() => elegir('colaborador')}
									/>
								</div>
							</div>
						</div>
					{/key}
				{:else if etapa === 'formulario'}
					<div
						in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
						class="flex w-full flex-col items-center px-4 lg:max-w-7xl"
					>
						<!-- Cabecera Central -->
						<div class="mx-auto mb-10 max-w-xl space-y-4 text-center">
							<div
								class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[rgb(var(--color-primary))] uppercase shadow-xs"
							>
								Paso {pasoActualSecuencial} · {infoPasoActual.label}
							</div>
							<h2
								class="text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl"
							>
								{@render TextHighlight(infoPasoActual.titulo)}
							</h2>
							<p class="font-medium text-slate-500">
								{infoPasoActual.descripcion}
							</p>
						</div>

						<div class="mb-8 w-full max-w-md lg:hidden">
							<Stepper pasoActual={pasoActualSecuencial} pasosTotales={TOTAL_PASOS} />
						</div>

						<div in:fly={{ y: 30, duration: 800, delay: 400, easing: cubicOut }} class="w-full">
							<RegistroCuentaForm
								{rol}
								procesando={procesandoFormulario}
								errorGeneral={errorRegistro}
								onsubmit={manejarRegistroCuenta}
								oninvalid={manejarFormularioInvalido}
								onprocessing={(e) => (registrando = e.value)}
								onchange={() => (errorRegistro = null)}
							/>

							<div class="mt-8 flex justify-center">
								{#if !usuarioRegistradoId}
									<button
										class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
										type="button"
										onclick={volverASeleccion}
									>
										<svg
											class="h-3.5 w-3.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
										</svg>
										Cambiar rol y tipo de cuenta
									</button>
								{/if}
							</div>
						</div>
					</div>
				{:else if etapa === 'verificacion'}
					<div
						in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
						class="flex w-full flex-col items-center px-4 lg:max-w-7xl"
					>
						<!-- Cabecera Central -->
						<div class="mx-auto mb-10 max-w-xl space-y-4 text-center">
							<div
								class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[rgb(var(--color-primary))] uppercase shadow-xs"
							>
								Paso {pasoActualSecuencial} · {infoPasoActual.label}
							</div>
							<h2
								class="text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl"
							>
								{@render TextHighlight(infoPasoActual.titulo)}
							</h2>
							<p class="font-medium text-slate-500">
								{infoPasoActual.descripcion}
							</p>
						</div>

						<div class="mb-8 w-full max-w-md lg:hidden">
							<Stepper pasoActual={pasoActualSecuencial} pasosTotales={TOTAL_PASOS} />
						</div>

						<div in:fly={{ y: 30, duration: 800, delay: 400, easing: cubicOut }} class="w-full">
							<ValidacionInstitucion
								onsubmit={manejarSubidaVerificacion}
								onskip={() => setEtapaConPersistencia('contacto')}
								oncancel={() => {
									resetFeedback();
									setEtapaConPersistencia('formulario');
								}}
							/>
						</div>
					</div>
				{:else if etapa === 'contacto'}
					<div
						in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
						class="flex w-full flex-col items-center px-4 lg:max-w-7xl"
					>
						<!-- Cabecera Central -->
						<div class="mx-auto mb-10 max-w-xl space-y-4 text-center">
							<div
								class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[rgb(var(--color-primary))] uppercase shadow-xs"
							>
								Paso {pasoActualSecuencial} · {infoPasoActual.label}
							</div>
							<h2
								class="text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl"
							>
								{@render TextHighlight(infoPasoActual.titulo)}
							</h2>
							<p class="font-medium text-slate-500">
								{infoPasoActual.descripcion}
							</p>
						</div>

						<div class="mb-8 w-full max-w-md lg:hidden">
							<Stepper pasoActual={pasoActualSecuencial} pasosTotales={TOTAL_PASOS} />
						</div>

						<div in:fly={{ y: 30, duration: 800, delay: 400, easing: cubicOut }} class="w-full">
							<MetodosContactoForm
								mostrarOmitir
								bloquearPrimerContacto={false}
								onskip={() => setEtapaConPersistencia('direccion')}
								onsubmit={manejarEnvioContactos}
							>
								{#if !usuarioRegistradoId}
									<button
										type="button"
										class="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
										onclick={() => retrocederEtapa('contacto')}
									>
										<svg
											class="h-3.5 w-3.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
										</svg>
										Volver
									</button>
								{/if}
							</MetodosContactoForm>
						</div>
					</div>
				{:else if etapa === 'direccion'}
					<div
						in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
						class="flex w-full flex-col items-center px-4 lg:max-w-7xl"
					>
						<!-- Cabecera Central -->
						<div class="mx-auto mb-10 max-w-xl space-y-4 text-center">
							<div
								class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[rgb(var(--color-primary))] uppercase shadow-xs"
							>
								Paso {pasoActualSecuencial} · {infoPasoActual.label}
							</div>
							<h2
								class="text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl"
							>
								{@render TextHighlight(infoPasoActual.titulo)}
							</h2>
							<p class="font-medium text-slate-500">
								{infoPasoActual.descripcion}
							</p>
						</div>

						<div class="mb-8 w-full max-w-md lg:hidden">
							<Stepper pasoActual={pasoActualSecuencial} pasosTotales={TOTAL_PASOS} />
						</div>

						<div in:fly={{ y: 30, duration: 800, delay: 400, easing: cubicOut }} class="w-full">
							<DireccionForm
								mostrarOmitir
								onskip={() => setEtapaConPersistencia('preferencias')}
								onsubmit={manejarEnvioDireccion}
							/>

							<div class="mt-6 flex justify-center">
								{#if !usuarioRegistradoId}
									<button
										type="button"
										class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
										onclick={() => retrocederEtapa('direccion')}
									>
										<svg
											class="h-3.5 w-3.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
										</svg>
										Volver al paso anterior
									</button>
								{/if}
							</div>
						</div>
					</div>
				{:else if etapa === 'preferencias'}
					<div
						in:fly={{ y: 20, duration: 800, delay: 200, easing: cubicOut }}
						class="flex w-full flex-col items-center px-4 lg:max-w-7xl"
					>
						<!-- Cabecera Central -->
						<div class="mx-auto mb-10 max-w-xl space-y-4 text-center">
							<div
								class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[rgb(var(--color-primary))] uppercase shadow-xs"
							>
								Paso {pasoActualSecuencial} · {infoPasoActual.label}
							</div>
							<h2
								class="text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl"
							>
								{@render TextHighlight(infoPasoActual.titulo)}
							</h2>
							<p class="font-medium text-slate-500">
								{infoPasoActual.descripcion}
							</p>
						</div>

						<div class="mb-8 w-full max-w-md lg:hidden">
							<Stepper pasoActual={pasoActualSecuencial} pasosTotales={TOTAL_PASOS} />
						</div>

						<div in:fly={{ y: 30, duration: 800, delay: 400, easing: cubicOut }} class="w-full">
							<PreferenciasForm
								categorias={data.categorias}
								tiposParticipacion={data.tiposParticipacion}
								procesando={procesandoFormulario}
								onsubmit={manejarPreferencias}
								onskip={() => setEtapaConPersistencia('exito', { limpiarTodo: true })}
							/>

							<div class="mt-6 flex justify-center">
								{#if !usuarioRegistradoId}
									<button
										type="button"
										class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
										onclick={() => retrocederEtapa('preferencias')}
									>
										<svg
											class="h-3.5 w-3.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
										</svg>
										Volver al paso anterior
									</button>
								{/if}
							</div>
						</div>
					</div>
				{:else if etapa === 'exito'}
					<div
						in:fly={{ y: 40, duration: 1000, easing: cubicOut }}
						class="flex flex-col items-center justify-center py-12 text-center"
					>
						<div
							in:scale={{ duration: 800, delay: 200, start: 0.8, easing: cubicOut }}
							class="relative mb-10 overflow-visible"
						>
							<div
								class="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/20"
							>
								<svg
									class="h-12 w-12"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="3"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<!-- Efectos de partículas decorativas -->
							<div
								class="absolute -top-4 -right-4 h-8 w-8 animate-bounce rounded-full bg-blue-400/20 blur-xl"
							></div>
							<div
								class="absolute -bottom-4 -left-4 h-8 w-8 animate-pulse rounded-full bg-blue-600/20 blur-xl"
							></div>
						</div>

						<div class="max-w-md space-y-6">
							<h2 class="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">
								¡Registro <span class="text-blue-600">exitoso</span>!
							</h2>
							<p class="text-lg leading-relaxed font-medium text-slate-500">
								Tu cuenta está lista. Ya podés empezar a crear impacto real desde tu panel.
							</p>

							<div
								class="mx-auto mt-12 w-full max-w-xs transition-transform hover:scale-105 active:scale-95"
							>
								<Button
									label="Ir a mi panel principal"
									variant="primary"
									size="md"
									customClass="w-full shadow-xl shadow-blue-500/20 py-6 text-lg"
									onclick={irAlPanel}
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>
