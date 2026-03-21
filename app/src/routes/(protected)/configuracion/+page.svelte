<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Image from '$lib/components/ui/elementos/Image.svelte';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import type { Contacto } from '$lib/domain/types/Contacto';
	import type { Categoria } from '$lib/domain/types/Categoria';
	import { usuario as currentUser, authActions } from '$lib/stores/auth';
	import { ICONOS_CATEGORIA } from '$lib/utils/constants';
	import type { PageData } from './$types';
	import { Wrench, ExclamationCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;

	$: usuario = $currentUser ?? data.usuario;

	let animate = false;
	onMount(() => {
		animate = true;
	});

	let nombre = `${data.usuario.nombre} ${data.usuario.apellido}`;
	let email = data.usuario.contactos?.find((c) => c.tipo_contacto === 'email')?.valor || '';
	let telefono = data.usuario.contactos?.find((c) => c.tipo_contacto === 'telefono')?.valor || '';
	let perfil = data.usuario.url_foto || '';
	let nuevaFoto: File | null = null;

	function handleFotoChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			nuevaFoto = file;
			const reader = new FileReader();
			reader.onload = (ev) => {
				perfil = ev.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	let preferencias: number[] =
		data.usuario.categorias_preferidas?.map((cat) => cat.id_categoria!) || [];

	function toggleCategoria(categoriaId: number) {
		if (preferencias.includes(categoriaId)) {
			preferencias = preferencias.filter((id) => id !== categoriaId);
		} else {
			preferencias = [...preferencias, categoriaId];
		}
	}

	let notificacionesPush = true;
	let notificacionesMail = true;

	let passActual = '';
	let passNueva = '';
	let passConfirm = '';

	let isLoadingPerfil = false;
	let isLoadingPassword = false;
	let isLoadingDelete = false;

	async function guardarCambios() {
		isLoadingPerfil = true;
		try {
			if (nuevaFoto) {
				const fd = new FormData();
				fd.append('archivo', nuevaFoto);
				const res = await fetch('/api/usuarios/me/foto', { method: 'POST', body: fd });
				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					throw new Error(data.error ?? 'Error al subir la foto');
				}
				const { url } = await res.json();
				if (url) perfil = url;
				nuevaFoto = null;
			}
			const contactosActualizados: Contacto[] = [
				...(usuario.contactos?.filter((c) => c.tipo_contacto !== 'telefono') ?? [])
			];
			if (telefono.trim()) {
				contactosActualizados.push({
					tipo_contacto: 'telefono' as const,
					valor: telefono.trim()
				} as Contacto);
			}
			await authActions.actualizarPerfil(usuario.id_usuario!, {
				contactos: contactosActualizados,
				categorias_preferidas: preferencias.map((id) => {
					const cat = data.categorias.find((c: Categoria) => c.id_categoria === id);
					return { id_categoria: id, descripcion: cat?.descripcion || '' };
				})
			});

			toastStore.show({
				variant: 'success',
				title: 'Datos actualizados',
				message: 'Tus preferencias se guardaron correctamente.'
			});
		} catch (err) {
			toastStore.show({
				variant: 'error',
				title: 'Error al guardar',
				message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
			});
		} finally {
			isLoadingPerfil = false;
		}
	}

	async function cambiarPassword() {
		if (!passActual.trim()) {
			toastStore.show({
				variant: 'error',
				title: 'Falta contraseña actual',
				message: 'Para tu seguridad, ingresá tu contraseña actual.'
			});
			return;
		}
		if (!passNueva.trim()) {
			toastStore.show({
				variant: 'error',
				title: 'Campo requerido',
				message: 'Por favor, ingresá una contraseña nueva.'
			});
			return;
		}
		if (passNueva.length < 8) {
			toastStore.show({
				variant: 'error',
				title: 'Contraseña muy corta',
				message: 'La nueva contraseña debe tener al menos 8 caracteres.'
			});
			return;
		}
		if (passNueva !== passConfirm) {
			toastStore.show({
				variant: 'error',
				title: 'Error de validación',
				message: 'Las contraseñas nuevas no coinciden.'
			});
			return;
		}

		isLoadingPassword = true;
		try {
			const res = await fetch('/api/usuarios/me/contrasena', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nuevaContrasena: passNueva })
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? 'Error al cambiar la contraseña');
			}
			passActual = '';
			passNueva = '';
			passConfirm = '';
			toastStore.show({
				variant: 'success',
				title: 'Contraseña actualizada',
				message: 'Tu contraseña se cambió con éxito.'
			});
		} catch (err) {
			toastStore.show({
				variant: 'error',
				title: 'Error',
				message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
			});
		} finally {
			isLoadingPassword = false;
		}
	}

	let showDeleteModal = false;

	function eliminarCuenta() {
		showDeleteModal = true;
	}

	function cancelarEliminarCuenta() {
		if (!isLoadingDelete) showDeleteModal = false;
	}

	async function confirmarEliminarCuenta() {
		isLoadingDelete = true;
		try {
			const res = await fetch('/api/usuarios/me', { method: 'DELETE' });
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? 'No se pudo eliminar la cuenta');
			}
			showDeleteModal = false;
			await authActions.logout();
			goto('/');
		} catch (err) {
			isLoadingDelete = false;
			toastStore.show({
				variant: 'error',
				title: 'Error',
				message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
			});
		}
	}
</script>

<svelte:head>
	<title>Configuración | Conectando Corazones</title>
</svelte:head>

<div
	class="mx-auto max-w-2xl px-4 py-10 transition-opacity duration-700 ease-out sm:px-6 lg:px-8"
	class:opacity-0={!animate}
	class:opacity-100={animate}
>
	<div class="mb-10 flex items-center gap-5">
		<div
			class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-blue-100 shadow-md"
		>
			<Image src={perfil || '/users/escuela-esperanza.jpg'} alt="Avatar" variant="circle" />
		</div>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{nombre}</h1>
			<span
				class="mt-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-sm font-medium text-blue-700 capitalize"
			>
				{usuario.rol}
			</span>
		</div>
	</div>

	<section class="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
		<h2
			class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-xl font-bold text-transparent sm:text-2xl"
		>
			Información personal
		</h2>
		<p class="mt-1 mb-6 text-sm text-gray-400">Actualizá tu número de teléfono y foto de perfil.</p>

		<form class="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
			<div class="flex flex-col items-center gap-4 md:col-span-1">
				<div
					class="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-blue-100 bg-gray-100 shadow-md"
				>
					<Image
						src={perfil || '/users/escuela-esperanza.jpg'}
						alt="Foto de perfil"
						variant="circle"
					/>
					{#if nuevaFoto}
						<div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
							<span class="text-xs font-medium text-white">Nueva foto</span>
						</div>
					{/if}
				</div>
				<label class="block w-full text-center">
					<span
						class="cursor-pointer rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
					>
						{nuevaFoto ? '✓ ' + nuevaFoto.name.slice(0, 16) + '…' : 'Cambiar foto'}
					</span>
					<input type="file" accept="image/*" class="sr-only" on:change={handleFotoChange} />
				</label>
			</div>

			<div class="grid grid-cols-1 gap-5 md:col-span-2">
				<label class="block">
					<span class="text-sm font-medium text-gray-500">Nombre completo</span>
					<Input
						id="nombre"
						type="text"
						bind:value={nombre}
						customClass="mt-1 block w-full cursor-not-allowed rounded-3xl border border-gray-200 bg-gray-50 px-5 py-3 text-gray-400 shadow-sm"
						readonly
						disabled
					/>
					<span class="mt-1 text-xs text-gray-400">El nombre no puede modificarse desde aquí.</span>
				</label>
				<label class="block">
					<span class="text-sm font-medium text-gray-500">Email</span>
					<Input
						id="email"
						type="email"
						bind:value={email}
						customClass="mt-1 block w-full cursor-not-allowed rounded-3xl border border-gray-200 bg-gray-50 px-5 py-3 text-gray-400 shadow-sm"
						readonly
						disabled
					/>
				</label>
				<label class="block">
					<span class="text-sm font-medium text-gray-700"
						>Teléfono <span class="font-normal text-gray-400">(opcional)</span></span
					>
					<Input
						id="telefono"
						type="tel"
						bind:value={telefono}
						customClass="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
					/>
				</label>
			</div>
		</form>

		<div class="mt-8 flex justify-end">
			<Button
				label="Guardar cambios"
				loadingLabel="Guardando..."
				variant="primary"
				loading={isLoadingPerfil}
				onclick={guardarCambios}
			/>
		</div>
	</section>

	{#if usuario.rol === 'colaborador'}
		<section class="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
			<h2
				class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-xl font-bold text-transparent sm:text-2xl"
			>
				Preferencias de categorías
			</h2>
			<p class="mt-1 mb-6 text-sm text-gray-400">
				Seleccioná las áreas de proyecto que más te interesan.
			</p>

			<div class="mb-6 flex flex-wrap gap-3">
				{#each data.categorias as categoria, i (i)}
					<label
						class="flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-2 transition-all duration-200 select-none"
						class:border-blue-300={preferencias.includes(categoria.id_categoria!)}
						class:bg-blue-50={preferencias.includes(categoria.id_categoria!)}
						class:border-gray-200={!preferencias.includes(categoria.id_categoria!)}
						class:bg-white={!preferencias.includes(categoria.id_categoria!)}
					>
						<input
							type="checkbox"
							checked={preferencias.includes(categoria.id_categoria!)}
							on:change={() => toggleCategoria(categoria.id_categoria!)}
							class="sr-only"
						/>
						<Icon
							src={ICONOS_CATEGORIA[categoria.descripcion] || Wrench}
							class="h-5 w-5 {preferencias.includes(categoria.id_categoria!)
								? 'text-blue-600'
								: 'text-gray-400'}"
						/>
						<span
							class="text-sm font-medium {preferencias.includes(categoria.id_categoria!)
								? 'text-blue-700'
								: 'text-gray-500'}">{categoria.descripcion}</span
						>
					</label>
				{/each}
			</div>

			<div class="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
				<div
					class="h-full rounded-full bg-gradient-to-r from-[#68b4ff] to-[#007fff] transition-all duration-300"
					style="width: {Math.round((preferencias.length / data.categorias.length) * 100)}%;"
				></div>
			</div>
			<p class="text-xs text-gray-400">
				{preferencias.length} de {data.categorias.length} categorías seleccionadas
			</p>
		</section>
	{/if}

	<section class="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
		<h2
			class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-xl font-bold text-transparent sm:text-2xl"
		>
			Notificaciones
		</h2>
		<p class="mt-1 mb-6 text-sm text-gray-400">
			Elegí cómo querés recibir novedades sobre proyectos y actividad.
		</p>

		<div class="flex flex-col gap-5">
			<label
				class="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 select-none"
			>
				<div>
					<p class="font-medium text-gray-700">Notificaciones Push</p>
					<p class="mt-0.5 text-sm text-gray-400">
						Alertas en tiempo real sobre postulaciones y mensajes.
					</p>
				</div>
				<input type="checkbox" bind:checked={notificacionesPush} class="sr-only" />
				<div
					class="relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300"
					class:bg-blue-500={notificacionesPush}
					class:bg-gray-200={!notificacionesPush}
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"
						class:translate-x-0={!notificacionesPush}
						class:translate-x-5={notificacionesPush}
					></div>
				</div>
			</label>

			<label
				class="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 select-none"
			>
				<div>
					<p class="font-medium text-gray-700">Notificaciones por Email</p>
					<p class="mt-0.5 text-sm text-gray-400">
						Resúmenes semanales y novedades importantes por correo.
					</p>
				</div>
				<input type="checkbox" bind:checked={notificacionesMail} class="sr-only" />
				<div
					class="relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300"
					class:bg-blue-500={notificacionesMail}
					class:bg-gray-200={!notificacionesMail}
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"
						class:translate-x-0={!notificacionesMail}
						class:translate-x-5={notificacionesMail}
					></div>
				</div>
			</label>
		</div>
	</section>

	<section class="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
		<h2
			class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-xl font-bold text-transparent sm:text-2xl"
		>
			Seguridad
		</h2>
		<p class="mt-1 mb-6 text-sm text-gray-400">
			Cambiá tu contraseña o gestioná el estado de tu cuenta.
		</p>

		<form class="flex flex-col gap-5 md:grid md:grid-cols-3 md:items-end md:gap-6">
			<label class="block">
				<span class="text-sm font-medium text-gray-700">Contraseña actual</span>
				<Input
					id="passActual"
					type="password"
					bind:value={passActual}
					customClass="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="text-sm font-medium text-gray-700">Nueva contraseña</span>
				<Input
					id="passNueva"
					type="password"
					bind:value={passNueva}
					customClass="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="text-sm font-medium text-gray-700">Confirmar contraseña</span>
				<Input
					id="passConfirm"
					type="password"
					bind:value={passConfirm}
					customClass="mt-1 block w-full rounded-3xl border border-gray-200 px-5 py-3 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
				/>
			</label>
		</form>

		<div class="mt-6 flex justify-end">
			<Button
				label="Cambiar contraseña"
				loadingLabel="Cambiando..."
				variant="secondary"
				loading={isLoadingPassword}
				onclick={cambiarPassword}
			/>
		</div>

		<div class="mt-8 rounded-2xl border border-red-200 bg-red-50/40 p-5 sm:p-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div class="flex items-center gap-2">
						<Icon src={ExclamationCircle} class="h-5 w-5 text-red-500" />
						<span class="font-semibold text-red-600">Zona de peligro</span>
					</div>
					<p class="mt-1 text-sm text-red-400">
						Esta acción es irreversible. Tu cuenta será eliminada permanentemente.
					</p>
				</div>
				<div class="flex-shrink-0">
					<Button label="Eliminar cuenta" variant="danger" size="sm" onclick={eliminarCuenta} />
				</div>
			</div>
		</div>
	</section>
</div>

<Modal
	abierto={showDeleteModal}
	titulo="Eliminar cuenta"
	anchoMaximo="max-w-sm"
	cerrarAlClickearFondo={!isLoadingDelete}
	on:cerrar={cancelarEliminarCuenta}
>
	<div class="flex flex-col items-center py-2 text-center">
		<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
			<Icon src={ExclamationCircle} class="h-9 w-9 text-red-500" />
		</div>
		<p class="text-base font-semibold text-gray-800">¿Eliminar tu cuenta?</p>
		<p class="mt-2 text-sm text-gray-500">
			Esta acción no se puede deshacer. Todos tus datos, historial y configuración serán eliminados
			permanentemente.
		</p>
	</div>

	<svelte:fragment slot="footer">
		<Button
			label="Sí, eliminar"
			loadingLabel="Eliminando..."
			variant="danger"
			loading={isLoadingDelete}
			onclick={confirmarEliminarCuenta}
		/>
		<Button
			label="Cancelar"
			variant="secondary"
			disabled={isLoadingDelete}
			onclick={cancelarEliminarCuenta}
		/>
	</svelte:fragment>
</Modal>
