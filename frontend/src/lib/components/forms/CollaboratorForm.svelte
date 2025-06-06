<!--
* Componente: CollaboratorForm
        -*- Descripción: formulario de registro de colaboradores.
        -*- Soporta registro individual u organización con representante.
        -*- Usa funciones compartidas para validaciones (email y mayoría de edad).
-->
<script lang="ts">
        // Datos persona
        let nombre = '';
        let apellido = '';
        let docTipo = 'DNI';
        let docOtro = '';
        let docNumero = '';
        let nacimiento = '';
        let cuil = '';

        // Datos organización
        let razonSocial = '';
        let cuit = '';
        let repNombre = '';
        let repApellido = '';
        let repDocTipo = 'DNI';
        let repDocOtro = '';
        let repDocNumero = '';
        let repNacimiento = '';
        // Datos comunes
        let username = '';
        let email = '';
        let password = '';
        let repassword = '';

        let errors: Record<string, string> = {};

        $: errors = tipo === 'persona'
                ? {
                                nombre: nombre.trim() ? '' : 'Requerido',
                                apellido: apellido.trim() ? '' : 'Requerido',
                                docOtro: docTipo === 'Otro' && !docOtro.trim() ? 'Especifique el documento' : '',
                                docNumero: docNumero.trim() ? '' : 'Documento obligatorio',
                                nacimiento: nacimiento && isAdult(nacimiento) ? '' : 'Debe ser mayor de 18 años',
                                cuil: cuil.trim() ? '' : 'CUIL obligatorio',
                                username: username.trim() ? '' : 'Requerido',
                                email: email && isValidEmail(email) ? '' : 'Email inválido',
                                password: password ? '' : 'Requerido',
                                repassword: repassword && repassword === password ? '' : 'Las contraseñas no coinciden'
                        }
                : {
                                razonSocial: razonSocial.trim() ? '' : 'Requerido',
                                cuit: cuit.trim() ? '' : 'CUIT obligatorio',
                                repNombre: repNombre.trim() ? '' : 'Requerido',
                                repApellido: repApellido.trim() ? '' : 'Requerido',
                                repDocOtro: repDocTipo === 'Otro' && !repDocOtro.trim() ? 'Especifique el documento' : '',
                                repDocNumero: repDocNumero.trim() ? '' : 'Documento obligatorio',
                                repNacimiento: repNacimiento && isAdult(repNacimiento) ? '' : 'Debe ser mayor de 18 años',
                                username: username.trim() ? '' : 'Requerido',
                                email: email && isValidEmail(email) ? '' : 'Email inválido',
                                password: password ? '' : 'Requerido',
                                repassword: repassword && repassword === password ? '' : 'Las contraseñas no coinciden'
                        };
        function handleSubmit(event: Event) {
                event.preventDefault();
                if (Object.values(errors).some(Boolean)) return;
                <label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de colaborador <span class="text-red-600">*</span></label>
                                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre <span class="text-red-600">*</span></label>
                                <Input id="nombre" name="nombre" bind:value={nombre} required error={errors.nombre} />
                                <label for="apellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido <span class="text-red-600">*</span></label>
                                <Input id="apellido" name="apellido" bind:value={apellido} required error={errors.apellido} />
                                <label for="docTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento <span class="text-red-600">*</span></label>
                                <select id="docTipo" bind:value={docTipo} class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                        {#if docTipo === 'Otro'}
                                <div>
                                        <label for="docOtro" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Especifique <span class="text-red-600">*</span></label>
                                        <Input id="docOtro" name="docOtro" bind:value={docOtro} required error={errors.docOtro} />
                                </div>
                        {/if}
                                <label for="docNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número <span class="text-red-600">*</span></label>
                                <Input id="docNumero" name="docNumero" bind:value={docNumero} required error={errors.docNumero} />
                                <label for="nacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento <span class="text-red-600">*</span></label>
                                <DatePicker id="nacimiento" name="nacimiento" bind:value={nacimiento} required error={errors.nacimiento} />
                                <label for="cuil" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIL <span class="text-red-600">*</span></label>
                                <Input id="cuil" name="cuil" bind:value={cuil} required error={errors.cuil} />
                                <label for="razonSocial" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Razón social <span class="text-red-600">*</span></label>
                                <Input id="razonSocial" name="razonSocial" bind:value={razonSocial} required error={errors.razonSocial} />
                                <label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIT <span class="text-red-600">*</span></label>
                                <Input id="cuit" name="cuit" bind:value={cuit} required error={errors.cuit} />
                <fieldset class="mt-4 space-y-4">
                        <legend class="mb-2 text-sm font-semibold">Representante legal</legend>
                        <div class="grid gap-4 md:grid-cols-2">
                                <div>
                                <label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre <span class="text-red-600">*</span></label>
                                <Input id="repNombre" name="repNombre" bind:value={repNombre} required error={errors.repNombre} />
                                <label for="repApellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido <span class="text-red-600">*</span></label>
                                <Input id="repApellido" name="repApellido" bind:value={repApellido} required error={errors.repApellido} />
                                <label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento <span class="text-red-600">*</span></label>
                                <select id="repDocTipo" bind:value={repDocTipo} class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]">
                        {#if repDocTipo === 'Otro'}
                                <div>
                                        <label for="repDocOtro" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Especifique <span class="text-red-600">*</span></label>
                                        <Input id="repDocOtro" name="repDocOtro" bind:value={repDocOtro} required error={errors.repDocOtro} />
                                </div>
                        {/if}
                                <label for="repDocNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número <span class="text-red-600">*</span></label>
                                <Input id="repDocNumero" name="repDocNumero" bind:value={repDocNumero} required error={errors.repDocNumero} />
                                <label for="repNacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento <span class="text-red-600">*</span></label>
                                <DatePicker id="repNacimiento" name="repNacimiento" bind:value={repNacimiento} required error={errors.repNacimiento} />
                        </div>
                </fieldset>
                <label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de usuario <span class="text-red-600">*</span></label>
                <Input id="username" name="username" bind:value={username} required error={errors.username} />
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email <span class="text-red-600">*</span></label>
                <Input id="email" name="email" type="email" bind:value={email} required error={errors.email} />
                        <label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Contraseña <span class="text-red-600">*</span></label>
                        <Input id="password" name="password" type="password" bind:value={password} required error={errors.password} />
                        <label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Confirmar contraseña <span class="text-red-600">*</span></label>
                        <Input id="repassword" name="repassword" type="password" bind:value={repassword} required error={errors.repassword} />
			<div>
				<label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Nombre *</label
				>
				<Input id="nombre" name="nombre" required error={errors.nombre} />
			</div>
			<div>
				<label for="apellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Apellido *</label
				>
				<Input id="apellido" name="apellido" required error={errors.apellido} />
			</div>
			<div>
				<label for="docTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Tipo de documento *</label
				>
				<select
					id="docTipo"
					name="docTipo"
					required
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			<div>
				<label for="docNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Número *</label
				>
				<Input id="docNumero" name="docNumero" required error={errors.docNumero} />
			</div>
			<div>
				<label for="nacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Fecha de nacimiento *</label
				>
				<DatePicker id="nacimiento" name="nacimiento" required error={errors.nacimiento} />
			</div>
			<div>
				<label for="cuil" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>CUIL *</label
				>
				<Input id="cuil" name="cuil" required error={errors.cuil} />
			</div>
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">
			<div class="md:col-span-2">
				<label
					for="razonSocial"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Razón social *</label
				>
				<Input id="razonSocial" name="razonSocial" required error={errors.razonSocial} />
			</div>
			<div class="md:col-span-2">
				<label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>CUIT *</label
				>
				<Input id="cuit" name="cuit" required error={errors.cuit} />
			</div>
			<div>
				<label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Nombre de representante *</label
				>
				<Input id="repNombre" name="repNombre" required error={errors.repNombre} />
			</div>
			<div>
				<label
					for="repApellido"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Apellido de representante *</label
				>
				<Input id="repApellido" name="repApellido" required error={errors.repApellido} />
			</div>
			<div>
				<label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Tipo de documento *</label
				>
				<select
					id="repDocTipo"
					name="repDocTipo"
					required
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
				>
					<option>DNI</option>
					<option>Pasaporte</option>
					<option>Otro</option>
				</select>
			</div>
			<div>
				<label
					for="repDocNumero"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label
				>
				<Input id="repDocNumero" name="repDocNumero" required error={errors.repDocNumero} />
			</div>
			<div class="md:col-span-2">
				<label
					for="repNacimiento"
					class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
					>Fecha de nacimiento *</label
				>
				<DatePicker id="repNacimiento" name="repNacimiento" required error={errors.repNacimiento} />
			</div>
		</div>
	{/if}
	<div>
		<label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Nombre de usuario *</label
		>
		<Input id="username" name="username" required error={errors.username} />
	</div>
	<div>
		<label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
			>Email *</label
		>
		<Input id="email" name="email" type="email" required error={errors.email} />
	</div>
	<div class="grid gap-4 md:grid-cols-2">
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
				>Contraseña *</label
			>
			<Input id="password" name="password" type="password" required error={errors.password} />
		</div>
		<div>
			<label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]"
				>Confirmar contraseña *</label
			>
			<Input id="repassword" name="repassword" type="password" required error={errors.repassword} />
		</div>
	</div>
	<Button label="Continuar" disabled={sending} customClass="w-full" />
</form>
