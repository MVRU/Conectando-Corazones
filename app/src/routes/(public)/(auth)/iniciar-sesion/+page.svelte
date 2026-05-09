<script lang="ts">
	import CampoFormulario from '$lib/components/feature/registro/CampoFormulario.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import { authActions, authError, isLoading } from '$lib/stores/auth';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { validarCorreo } from '$lib/utils/validaciones';
	import { Lock, Eye, EyeOff, Check, Heart, Users, ShieldCheck, Sparkles } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let identificador = $state('');
	let password = $state('');
	let recordarme = $state(false);
	let mostrarPassword = $state(false);
	let erroresValidacion = $state<string[]>([]);
	let montado = $state(false);

	$effect(() => {
		const timer = setTimeout(() => {
			montado = true;
			iniciarContadores();
		}, 50);
		return () => clearTimeout(timer);
	});

	const kpis = [
		{ label: 'Proyectos activos', meta: 2400, prefijo: '+', sufijo: '', delay: 850 },
		{ label: 'Colaboradores', meta: 18000, prefijo: '+', sufijo: 'K', divisor: 1000, delay: 1050 },
		{ label: 'Provincias', meta: 17, prefijo: '', sufijo: '', delay: 1250 }
	];

	let valoresKpi = $state([0, 0, 0]);

	function animarContador(indice: number, meta: number, delay: number, divisor = 1) {
		setTimeout(() => {
			const duracion = 1400;
			const inicio = performance.now();
			function paso(ahora: number) {
				const t = Math.min((ahora - inicio) / duracion, 1);
				const eased = 1 - Math.pow(1 - t, 3);
				valoresKpi[indice] = Math.round((meta / divisor) * eased);
				if (t < 1) requestAnimationFrame(paso);
			}
			requestAnimationFrame(paso);
		}, delay);
	}

	function iniciarContadores() {
		kpis.forEach((kpi, i) => {
			animarContador(i, kpi.meta, kpi.delay, (kpi as { divisor?: number }).divisor ?? 1);
		});
	}

	$effect(() => {
		void identificador;
		void password;
		if (erroresValidacion.length > 0) {
			erroresValidacion = [];
		}
	});

	async function handleLogin(event: Event) {
		event.preventDefault();

		erroresValidacion = [];
		if (!identificador.trim()) erroresValidacion.push('Ingresá tu usuario o correo electrónico');
		if (!password.trim()) erroresValidacion.push('Ingresá tu contraseña');
		if (identificador.includes('@') && !validarCorreo(identificador)) {
			erroresValidacion.push('Ingresá un correo electrónico válido (ej: tu@correo.com)');
		}

		if (erroresValidacion.length > 0) {
			return;
		}

		try {
			const usuario = await authActions.login(identificador, password, recordarme);

			toastStore.show({
				variant: 'success',
				title: '¡Hola de nuevo!',
				message: 'Iniciaste sesión correctamente.'
			});

			if (usuario) {
				switch (usuario.rol) {
					case 'institucion':
						goto('/institucion/mi-panel');
						break;
					case 'colaborador':
						goto('/colaborador/mi-panel');
						break;
					case 'administrador':
						goto('/admin');
						break;
					default:
						goto('/');
				}
			} else {
				goto('/');
			}
		} catch (error) {
			toastStore.show({
				variant: 'error',
				title: 'Error de acceso',
				message:
					error instanceof Error ? error.message : 'Verificá tus credenciales e intentá nuevamente.'
			});
		}
	}

	const beneficios: Array<{ icon: ComponentType; titulo: string; descripcion: string }> = [
		{
			icon: Heart,
			titulo: 'Impacto real',
			descripcion: 'Conectá con proyectos solidarios que transforman vidas.'
		},
		{
			icon: Users,
			titulo: 'Comunidad activa',
			descripcion: 'Miles de colaboradores e instituciones que ya confían en nosotros.'
		},
		{
			icon: ShieldCheck,
			titulo: 'Plataforma segura',
			descripcion: 'Tus datos y transacciones protegidos con los más altos estándares.'
		}
	];
</script>

<svelte:head>
	<title>Iniciar sesión - Conectando Corazones</title>
	<meta
		name="description"
		content="Iniciá sesión en Conectando Corazones para acceder a tu cuenta y gestionar tus proyectos."
	/>
</svelte:head>

<div class="login-root">
	<!-- Panel izquierdo: visual / branding -->
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
					<h1>Cada gesto<br /><em>cuenta.</em></h1>
					<p>Iniciá sesión y seguí siendo parte de la red solidaria más grande de Argentina.</p>
				</div>

				{#snippet iconoBeneficio(IconComp: ComponentType)}
					<IconComp class="h-5 w-5" />
				{/snippet}

				<ul class="panel-beneficios" role="list">
					{#each beneficios as b, i (b.titulo)}
						<li
							class="panel-beneficio"
							in:fly={{ x: -30, duration: 600, delay: 400 + i * 120, easing: cubicOut }}
						>
							<div class="beneficio-icon">
								{@render iconoBeneficio(b.icon)}
							</div>
							<div>
								<strong>{b.titulo}</strong>
								<span>{b.descripcion}</span>
							</div>
						</li>
					{/each}
				</ul>

				<div class="panel-stats" in:fade={{ duration: 800, delay: 850 }}>
					{#each kpis as kpi, i (kpi.label)}
						{#if i > 0}<div class="stat-divider"></div>{/if}
						<div class="stat">
							<span class="stat-num">
								{kpi.prefijo}{valoresKpi[i]}{kpi.sufijo}
							</span>
							<span class="stat-label">{kpi.label}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</aside>

	<!-- Panel derecho: formulario -->
	<main class="login-panel-form">
		{#if montado}
			<div class="form-container" in:fly={{ x: 40, duration: 700, delay: 150, easing: cubicOut }}>
				<!-- Header mobile (logo + marca) -->
				<div class="form-header-mobile">
					<Image src="/logo-1.png" alt="Logo" width="44px" animate="heartbeat" />
					<span class="brand-mobile">Conectando Corazones</span>
				</div>

				<div class="form-header" in:fly={{ y: -16, duration: 500, delay: 300, easing: cubicOut }}>
					<div class="form-header-icon">
						<Lock class="h-5 w-5" />
					</div>
					<div>
						<h2>Bienvenido/a de vuelta</h2>
						<p>Ingresá con tu usuario o correo</p>
					</div>
				</div>

				<!-- Errores de validación -->
				{#if erroresValidacion.length > 0}
					<div class="error-banner" role="alert" in:fly={{ y: -8, duration: 300 }}>
						<p class="error-banner-title">Verificá los siguientes datos:</p>
						<ul>
							{#each erroresValidacion as err (err)}
								<li>{err}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if $authError}
					<div class="error-banner" role="alert" in:fly={{ y: -8, duration: 300 }}>
						<p>{$authError}</p>
					</div>
				{/if}

				<form
					onsubmit={handleLogin}
					class="login-form"
					aria-label="Formulario de inicio de sesión"
					novalidate
				>
					<div in:fly={{ y: 20, duration: 500, delay: 400, easing: cubicOut }}>
						<CampoFormulario
							id="identificador"
							label="Usuario o correo electrónico"
							bind:value={identificador}
							type="text"
							placeholder="usuario o tu@correo.com"
							autocomplete="username"
							required
						/>
						<p class="campo-hint">
							Demo: <code>admin_conectando</code>, <code>escuela_esperanza</code>,
							<code>maria_g</code>
						</p>
					</div>

					<div in:fly={{ y: 20, duration: 500, delay: 500, easing: cubicOut }}>
						<CampoFormulario
							id="password"
							label="Contraseña"
							bind:value={password}
							type={mostrarPassword ? 'text' : 'password'}
							placeholder="Tu contraseña segura"
							autocomplete="current-password"
							required
						>
							{#snippet suffix()}
								<button
									type="button"
									class="toggle-password"
									onclick={() => (mostrarPassword = !mostrarPassword)}
									aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
									tabindex={0}
								>
									{#if mostrarPassword}
										<EyeOff class="h-4 w-4" />
									{:else}
										<Eye class="h-4 w-4" />
									{/if}
								</button>
							{/snippet}
						</CampoFormulario>
						<p class="campo-hint">Demo: <code>password123</code></p>
					</div>

					<div class="form-options" in:fly={{ y: 20, duration: 500, delay: 600, easing: cubicOut }}>
						<label class="recordar-label">
							<div class="checkbox-wrap">
								<input
									bind:checked={recordarme}
									type="checkbox"
									id="recordarme"
									class="checkbox-hidden"
								/>
								<div class="checkbox-custom" class:checked={recordarme}>
									{#if recordarme}
										<Check class="h-3 w-3 text-white" />
									{/if}
								</div>
							</div>
							<span>Recordar sesión</span>
						</label>

						<a href="/recuperar-contrasena" class="link-olvide">¿Olvidaste tu contraseña?</a>
					</div>

					<div in:fly={{ y: 20, duration: 500, delay: 700, easing: cubicOut }}>
						<Button
							type="submit"
							label="Iniciar sesión"
							loading={$isLoading}
							loadingLabel="Iniciando sesión..."
							customClass="w-full"
						/>
					</div>
				</form>

				<div class="divider" in:fade={{ duration: 400, delay: 800 }}>
					<span>o</span>
				</div>

				<p class="registro-link" in:fade={{ duration: 400, delay: 850 }}>
					¿No tenés cuenta?
					<a href="/registrarse">Registrate gratis</a>
				</p>

				<p class="explorar-link" in:fade={{ duration: 400, delay: 900 }}>
					<a href="/proyectos">
						<Sparkles class="h-3.5 w-3.5" />
						Explorá proyectos sin registrarte
					</a>
				</p>
			</div>
		{/if}
	</main>
</div>

<style>
	/* ─── Layout root ─────────────────────────────────────────── */
	.login-root {
		display: flex;
		min-height: 100dvh;
		background: rgb(var(--gray-color, 243 244 246));
	}

	/* ─── Panel visual (izquierdo) ───────────────────────────── */
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

	/* Beneficios */
	.panel-beneficios {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.125rem;
	}

	.panel-beneficio {
		display: flex;
		align-items: flex-start;
		gap: 0.875rem;
	}

	.beneficio-icon {
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

	.panel-beneficio strong {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 0.125rem;
	}

	.panel-beneficio span {
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.5;
	}

	/* Stats */
	.panel-stats {
		display: flex;
		align-items: center;
		gap: 0;
		padding: 1.25rem 1.5rem;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		backdrop-filter: blur(8px);
	}

	.stat {
		flex: 1;
		text-align: center;
	}

	.stat-num {
		display: block;
		font-size: 1.375rem;
		font-weight: 800;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.stat-label {
		display: block;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-top: 0.125rem;
	}

	.stat-divider {
		width: 1px;
		height: 2.5rem;
		background: rgba(255, 255, 255, 0.15);
	}

	/* ─── Panel formulario (derecho) ─────────────────────────── */
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

	/* Header mobile */
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

	/* Header formulario */
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

	/* Hint de campo */
	.campo-hint {
		margin-top: 0.375rem;
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.campo-hint code {
		background: #f3f4f6;
		border-radius: 0.25rem;
		padding: 0.1rem 0.35rem;
		font-family: monospace;
		color: #374151;
	}

	/* Botón toggle contraseña */
	.toggle-password {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
		background: transparent;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		transition:
			color 0.15s,
			background 0.15s;
	}

	.toggle-password:hover {
		color: rgb(var(--color-primary));
		background: rgba(0, 127, 255, 0.06);
	}

	/* Opciones (recordar + olvide) */
	.form-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.recordar-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		color: #4b5563;
		-webkit-user-select: none;
		user-select: none;
	}

	.checkbox-wrap {
		position: relative;
	}

	.checkbox-hidden {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.checkbox-custom {
		width: 1.125rem;
		height: 1.125rem;
		border-radius: 0.3125rem;
		border: 1.5px solid #d1d5db;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		transition:
			background 0.2s,
			border-color 0.2s;
	}

	.checkbox-custom.checked {
		background: rgb(var(--color-primary));
		border-color: rgb(var(--color-primary));
	}

	/* Forzar foco visible en checkbox via CSS */
	.checkbox-hidden:focus-visible ~ .checkbox-custom {
		outline: 2px solid rgb(var(--color-primary));
		outline-offset: 2px;
	}

	.link-olvide {
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgb(var(--color-primary));
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.link-olvide:hover {
		text-decoration: underline;
		opacity: 0.8;
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
		font-weight: 600;
		color: rgb(var(--color-primary));
		text-decoration: none;
	}

	.registro-link a:hover {
		text-decoration: underline;
	}

	.explorar-link {
		text-align: center;
	}

	.explorar-link a {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		color: #9ca3af;
		text-decoration: none;
		transition: color 0.15s;
	}

	.explorar-link a:hover {
		color: rgb(var(--color-primary));
	}
</style>
