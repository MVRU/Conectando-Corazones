<!-- TODO: implementar recuperar contraseña con Supabase Auth y envío de email -->

<script lang="ts">
	import CampoFormulario from '$lib/components/feature/registro/CampoFormulario.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { validarCorreo } from '$lib/utils/validaciones';
	import { toastStore } from '$lib/stores/toast';
	import { KeyRound, ArrowLeft, Mail, ShieldCheck, Clock, RefreshCw } from 'lucide-svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let email = $state('');
	let cargando = $state(false);
	let erroresValidacion = $state<string[]>([]);
	let mensajeError = $state('');
	let emailEnviado = $state(false);
	let montado = $state(false);

	$effect(() => {
		const timer = setTimeout(() => (montado = true), 50);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		void email;
		if (erroresValidacion.length > 0) {
			erroresValidacion = [];
		}
		if (mensajeError) {
			mensajeError = '';
		}
	});

	async function procesarEnvio(event: Event) {
		event.preventDefault();

		erroresValidacion = [];
		mensajeError = '';

		if (!email.trim()) {
			erroresValidacion = ['El email es requerido'];
			return;
		}

		if (!validarCorreo(email)) {
			erroresValidacion = ['Por favor ingresá un email válido'];
			return;
		}

		cargando = true;

		try {
			await new Promise((resolve) => setTimeout(resolve, 1800));

			const esReenvio = emailEnviado;
			emailEnviado = true;

			if (esReenvio) {
				toastStore.show({
					variant: 'success',
					title: 'Email reenviado',
					message: 'Te enviamos un nuevo correo con las instrucciones.'
				});
			}
		} catch {
			mensajeError = 'Hubo un problema al enviar el email. Por favor intentá nuevamente.';
			toastStore.show({
				variant: 'error',
				message: 'No pudimos enviar el correo. Por favor intentá más tarde.'
			});
		} finally {
			cargando = false;
		}
	}
</script>

<svelte:head>
	<title>Recuperar contraseña - Conectando Corazones</title>
	<meta
		name="description"
		content="Recuperá tu contraseña de Conectando Corazones. Te ayudamos a volver a acceder a tu cuenta."
	/>
</svelte:head>

<div class="login-root">
	<!-- Panel izquierdo: visual / branding (idéntico al login) -->
	<aside class="login-panel-visual" aria-hidden="true">
		<div class="panel-visual-bg"></div>
		<div class="panel-visual-content">
			{#if montado}
				<div
					class="panel-logo-wrap"
					in:fly={{ y: -20, duration: 600, delay: 100, easing: cubicOut }}
				>
					<Image
						src="/logo-1.png"
						alt="Logo Conectando Corazones"
						width="72px"
						animate="heartbeat"
					/>
					<span class="panel-brand-name">Conectando Corazones</span>
				</div>

				<div class="panel-headline" in:fly={{ y: 24, duration: 700, delay: 250, easing: cubicOut }}>
					<h1>Sin acceso<br /><em>no es el fin.</em></h1>
					<p>
						Recuperar tu contraseña es simple y seguro. En menos de un minuto vas a estar de vuelta.
					</p>
				</div>

				<ul class="panel-pasos" role="list">
					{#each [{ icon: Mail, titulo: 'Ingresá tu email', descripcion: 'El correo con el que te registraste en la plataforma.' }, { icon: ShieldCheck, titulo: 'Revisá tu bandeja', descripcion: 'Te enviamos un enlace seguro y temporario para restablecer tu acceso.' }, { icon: KeyRound, titulo: 'Creá una nueva contraseña', descripcion: 'Elegí una contraseña segura y volvé a ingresar sin problemas.' }] as paso, i (paso.titulo)}
						<li
							class="panel-paso"
							in:fly={{ x: -30, duration: 600, delay: 400 + i * 120, easing: cubicOut }}
						>
							<div class="paso-numero">{i + 1}</div>
							<div class="paso-icon">
								<paso.icon class="h-5 w-5" />
							</div>
							<div>
								<strong>{paso.titulo}</strong>
								<span>{paso.descripcion}</span>
							</div>
						</li>
					{/each}
				</ul>

				<div class="panel-aviso" in:fade={{ duration: 800, delay: 850 }}>
					<Clock class="h-4 w-4 shrink-0" />
					<p>
						El enlace de recuperación es válido por <strong>24 horas</strong> desde el momento del envío.
					</p>
				</div>
			{/if}
		</div>
	</aside>

	<!-- Panel derecho: formulario -->
	<main class="login-panel-form">
		{#if montado}
			<div class="form-container" in:fly={{ x: 40, duration: 700, delay: 150, easing: cubicOut }}>
				<!-- Header mobile -->
				<div class="form-header-mobile">
					<Image src="/logo-1.png" alt="Logo" width="44px" animate="heartbeat" />
					<span class="brand-mobile">Conectando Corazones</span>
				</div>

				{#if !emailEnviado}
					<!-- ── Vista: formulario ── -->
					<div in:fly={{ y: -16, duration: 500, delay: 300, easing: cubicOut }}>
						<div class="form-header">
							<div class="form-header-icon">
								<KeyRound class="h-5 w-5" />
							</div>
							<div>
								<h2>Restablecer contraseña</h2>
								<p>Te enviamos un enlace a tu correo</p>
							</div>
						</div>
					</div>

					{#if erroresValidacion.length > 0}
						<div class="error-banner" role="alert" in:fly={{ y: -8, duration: 300 }}>
							<p class="error-banner-title">Por favor corregí los siguientes errores:</p>
							<ul>
								{#each erroresValidacion as err (err)}
									<li>{err}</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if mensajeError}
						<div class="error-banner" role="alert" in:fly={{ y: -8, duration: 300 }}>
							<p>{mensajeError}</p>
						</div>
					{/if}

					<form
						onsubmit={procesarEnvio}
						class="login-form"
						aria-label="Formulario de recuperación de contraseña"
						novalidate
					>
						<div in:fly={{ y: 20, duration: 500, delay: 400, easing: cubicOut }}>
							<CampoFormulario
								id="email"
								label="Correo electrónico"
								bind:value={email}
								type="email"
								placeholder="tu.email@ejemplo.com"
								autocomplete="email"
								required
								disabled={cargando}
							/>
							<p class="campo-hint">
								Ingresá el correo con el que creaste tu cuenta en Conectando Corazones.
							</p>
						</div>

						<div in:fly={{ y: 20, duration: 500, delay: 500, easing: cubicOut }}>
							<Button
								type="submit"
								label="Enviar instrucciones"
								loading={cargando}
								loadingLabel="Enviando..."
								customClass="w-full"
							/>
						</div>
					</form>
				{:else}
					<!-- ── Vista: éxito ── -->
					<div
						class="exito-container"
						in:scale={{ start: 0.95, duration: 500, delay: 100, easing: cubicOut }}
					>
						<div
							class="exito-icono"
							in:scale={{ start: 0.7, duration: 600, delay: 200, easing: cubicOut }}
						>
							<Mail class="h-7 w-7" />
						</div>

						<div in:fly={{ y: 16, duration: 500, delay: 300, easing: cubicOut }}>
							<h2 class="exito-titulo">¡Revisá tu correo!</h2>
							<p class="exito-desc">
								Te enviamos las instrucciones a <strong>{email}</strong>. Si no lo encontrás, revisá
								tu carpeta de spam.
							</p>
						</div>

						<div class="exito-acciones" in:fade={{ duration: 400, delay: 500 }}>
							<p class="campo-hint exito-hint">
								¿No llegó el email? Chequeá spam o intentá con otro correo.
							</p>
							<button
								type="button"
								class="reenviar-btn"
								onclick={procesarEnvio}
								disabled={cargando}
							>
								<RefreshCw class={cargando ? 'animando h-3.5 w-3.5' : 'h-3.5 w-3.5'} />
								{cargando ? 'Reenviando...' : 'Reenviar email'}
							</button>
						</div>
					</div>
				{/if}

				<div class="divider" in:fade={{ duration: 400, delay: 700 }}>
					<span>o</span>
				</div>

				<p class="registro-link" in:fade={{ duration: 400, delay: 800 }}>
					¿Recordaste tu contraseña?
					<a href="/iniciar-sesion">
						<ArrowLeft class="h-3.5 w-3.5" />
						Volver al inicio de sesión
					</a>
				</p>

				<p class="registro-link" in:fade={{ duration: 400, delay: 880 }}>
					¿No tenés cuenta?
					<a href="/registrarse">Registrate gratis</a>
				</p>
			</div>
		{/if}
	</main>
</div>

<style>
	/* ─── Layout (idéntico al login) ─────────────────────────── */
	.login-root {
		display: flex;
		min-height: 100dvh;
		background: rgb(var(--gray-color, 243 244 246));
	}

	/* ─── Panel visual izquierdo ─────────────────────────────── */
	.login-panel-visual {
		display: none;
		position: relative;
		flex: 1;
		overflow: hidden;
	}

	@media (min-width: 1024px) {
		.login-panel-visual {
			display: flex;
		}
	}

	.panel-visual-bg {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			145deg,
			rgb(var(--base-color)) 0%,
			color-mix(in srgb, rgb(var(--base-color)) 85%, rgb(var(--color-primary))) 50%,
			color-mix(in srgb, rgb(var(--color-primary)) 70%, #0a0a1a) 100%
		);
		z-index: 0;
	}

	.panel-visual-bg::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0, 127, 255, 0.18) 0%, transparent 60%),
			radial-gradient(ellipse 40% 50% at 10% 90%, rgba(222, 28, 56, 0.1) 0%, transparent 60%);
	}

	.panel-visual-bg::after {
		content: '';
		position: absolute;
		inset: 0;
		background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
			repeat;
		opacity: 0.6;
	}

	.panel-visual-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 3rem 3.5rem;
		gap: 2.5rem;
		width: 100%;
	}

	.panel-logo-wrap {
		display: flex;
		align-items: center;
		gap: 0.875rem;
	}

	.panel-brand-name {
		font-size: 1.125rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}

	.panel-headline h1 {
		font-size: clamp(2.25rem, 4vw, 3.25rem);
		font-weight: 800;
		color: #fff;
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin-bottom: 1rem;
	}

	.panel-headline h1 em {
		font-style: normal;
		color: rgb(var(--color-primary-hover, 66 161 255));
	}

	.panel-headline p {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.72);
		line-height: 1.6;
		max-width: 32ch;
	}

	/* Pasos */
	.panel-pasos {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
	}

	.panel-paso {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.paso-numero {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		margin-top: 0.125rem;
	}

	.paso-icon {
		flex-shrink: 0;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.625rem;
		background: rgba(255, 255, 255, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgb(var(--color-primary-hover, 66 161 255));
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.panel-paso strong {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 0.125rem;
	}

	.panel-paso span {
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.5;
	}

	/* Aviso temporal */
	.panel-aviso {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.875rem;
		backdrop-filter: blur(8px);
		color: rgba(255, 255, 255, 0.65);
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	.panel-aviso strong {
		color: rgba(255, 255, 255, 0.9);
	}

	/* ─── Panel formulario derecho ───────────────────────────── */
	.login-panel-form {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		max-width: 100%;
		padding: 1.5rem;
		background: #fff;
	}

	@media (min-width: 1024px) {
		.login-panel-form {
			max-width: 520px;
			padding: 2rem 2.5rem;
		}
	}

	.form-container {
		width: 100%;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-header-mobile {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	@media (min-width: 1024px) {
		.form-header-mobile {
			display: none;
		}
	}

	.brand-mobile {
		font-size: 1rem;
		font-weight: 700;
		color: rgb(var(--base-color));
	}

	.form-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.form-header-icon {
		flex-shrink: 0;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 0.875rem;
		background: linear-gradient(
			135deg,
			rgb(var(--color-primary)) 0%,
			color-mix(in srgb, rgb(var(--color-primary)) 60%, rgb(var(--base-color))) 100%
		);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		box-shadow: 0 4px 14px rgba(0, 127, 255, 0.35);
	}

	.form-header h2 {
		font-size: 1.375rem;
		font-weight: 700;
		color: rgb(var(--base-color));
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.form-header p {
		font-size: 0.85rem;
		color: #6b7280;
		margin-top: 0.2rem;
	}

	/* Error banner */
	.error-banner {
		border-radius: 0.75rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		padding: 0.875rem 1rem;
	}

	.error-banner-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #b91c1c;
		margin-bottom: 0.375rem;
	}

	.error-banner ul {
		padding-left: 1.25rem;
		margin: 0;
	}

	.error-banner li,
	.error-banner p {
		font-size: 0.8125rem;
		color: #dc2626;
		line-height: 1.5;
	}

	/* Formulario */
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.campo-hint {
		margin-top: 0.375rem;
		font-size: 0.75rem;
		color: #9ca3af;
		line-height: 1.5;
	}

	/* Vista éxito */
	.exito-container {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border: 1px solid #bae6fd;
		border-radius: 1rem;
	}

	.exito-icono {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 1rem;
		background: linear-gradient(
			135deg,
			rgb(var(--color-primary)) 0%,
			color-mix(in srgb, rgb(var(--color-primary)) 60%, rgb(var(--base-color))) 100%
		);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		box-shadow: 0 4px 14px rgba(0, 127, 255, 0.35);
	}

	.exito-titulo {
		font-size: 1.25rem;
		font-weight: 700;
		color: rgb(var(--base-color));
		margin-bottom: 0.5rem;
	}

	.exito-desc {
		font-size: 0.875rem;
		color: #374151;
		line-height: 1.6;
	}

	.exito-desc strong {
		color: rgb(var(--base-color));
		font-weight: 600;
	}

	.exito-acciones {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.exito-hint {
		margin-top: 0;
	}

	.reenviar-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgb(var(--color-primary));
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.reenviar-btn:hover {
		opacity: 0.75;
		text-decoration: underline;
	}

	.reenviar-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.animando) {
		animation: girar 1s linear infinite;
	}

	@keyframes girar {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Divisor */
	.divider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.8125rem;
		color: #9ca3af;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: #e5e7eb;
	}

	/* Links finales */
	.registro-link {
		text-align: center;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.registro-link a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: 600;
		color: rgb(var(--color-primary));
		text-decoration: none;
	}

	.registro-link a:hover {
		text-decoration: underline;
	}
</style>
