<!--
* Componente: InstitutionForm
        -*- Descripción: formulario de registro para instituciones.
        -*- Incluye datos de representante legal y validación mínima.
-->
<script lang="ts">
        import Button from '../ui/Button.svelte';
        import DatePicker from './DatePicker.svelte';
        let sending = false;
        let errors: string[] = [];
        let tipo = 'Escuela';
        let otroTipo = '';

        function esMayorDeEdad(fecha: string) {
                const nacimiento = new Date(fecha);
                const hoy = new Date();
                let edad = hoy.getFullYear() - nacimiento.getFullYear();
                const m = hoy.getMonth() - nacimiento.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
                return edad >= 18;
        }

        function handleSubmit(event: Event) {
                event.preventDefault();
                const data = new FormData(event.target as HTMLFormElement);
                const datos = {
                        nombre: (data.get('nombre') || '').toString().trim(),
                        tipo: (data.get('tipo') || '').toString(),
                        otroTipo: (data.get('otroTipo') || '').toString().trim(),
                        username: (data.get('username') || '').toString().trim(),
                        email: (data.get('email') || '').toString().trim(),
                        cuit: (data.get('cuit') || '').toString().trim(),
                        repNombre: (data.get('repNombre') || '').toString().trim(),
                        repApellido: (data.get('repApellido') || '').toString().trim(),
                        repDocTipo: (data.get('repDocTipo') || '').toString(),
                        repDocNumero: (data.get('repDocNumero') || '').toString().trim(),
                        repNacimiento: (data.get('repNacimiento') || '').toString(),
                        password: (data.get('password') || '').toString(),
                        repassword: (data.get('repassword') || '').toString()
                };
                errors = [];
                if (!datos.nombre) errors.push('El nombre de la institución es obligatorio');
                if (datos.tipo === 'Otro' && !datos.otroTipo) errors.push('Debe especificar el tipo de institución');
                if (!datos.username) errors.push('El nombre de usuario es obligatorio');
                if (!datos.email) errors.push('El email es obligatorio');
                if (!datos.cuit) errors.push('El CUIT es obligatorio');
                if (!datos.repNombre) errors.push('Nombre del representante requerido');
                if (!datos.repApellido) errors.push('Apellido del representante requerido');
                if (!datos.repDocTipo || !datos.repDocNumero) errors.push('Documento del representante requerido');
                if (!datos.repNacimiento || !esMayorDeEdad(datos.repNacimiento)) errors.push('El representante debe ser mayor de 18 años');
                if (datos.password !== datos.repassword) errors.push('Las contraseñas no coinciden');
                if (errors.length > 0) return;
                sending = true;
                setTimeout(() => {
                        sending = false;
                        console.log('Institución registrada', datos);
                }, 1000);
        }
</script>

<form on:submit={handleSubmit} class="space-y-4">
        <div>
                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de la institución *</label>
                <input id="nombre" name="nombre" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de institución *</label>
                <select id="tipo" name="tipo" bind:value={tipo} required class="w-full rounded-md border border-gray-300 px-3 py-2">
                        <option>Escuela</option>
                        <option>Hospital</option>
                        <option>Comedor</option>
                        <option>Otro</option>
                </select>
        </div>
        {#if tipo === 'Otro'}
                <div>
                        <label for="otroTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Especifique *</label>
                        <input id="otroTipo" name="otroTipo" type="text" bind:value={otroTipo} class="w-full rounded-md border border-gray-300 px-3 py-2" required />
                </div>
        {/if}
        <div>
                <label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de usuario *</label>
                <input id="username" name="username" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email *</label>
                <input id="email" name="email" type="email" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIT *</label>
                <input id="cuit" name="cuit" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <fieldset class="border-t pt-4">
                <legend class="mb-2 text-sm font-semibold">Representante legal</legend>
                <div class="grid gap-4 md:grid-cols-2">
                        <div>
                                <label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre *</label>
                                <input id="repNombre" name="repNombre" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="repApellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido *</label>
                                <input id="repApellido" name="repApellido" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="repDocTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento *</label>
                                <select id="repDocTipo" name="repDocTipo" required class="w-full rounded-md border border-gray-300 px-3 py-2">
                                        <option>DNI</option>
                                        <option>Pasaporte</option>
                                        <option>Otro</option>
                                </select>
                        </div>
                        <div>
                                <label for="repDocNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label>
                                <input id="repDocNumero" name="repDocNumero" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div class="md:col-span-2">
                                <label for="repNacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento *</label>
                                <DatePicker id="repNacimiento" name="repNacimiento" required />
                        </div>
                </div>
        </fieldset>
        <div>
                <label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Contraseña *</label>
                <input id="password" name="password" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Confirmar contraseña *</label>
                <input id="repassword" name="repassword" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        {#if errors.length > 0}
                <ul class="text-sm text-red-600">
                        {#each errors as err}
                                <li>{err}</li>
                        {/each}
                </ul>
        {/if}
        <Button label="Crear cuenta" disabled={sending} customClass="w-full" />
</form>
