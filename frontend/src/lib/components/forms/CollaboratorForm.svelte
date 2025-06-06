<!--
* Componente: CollaboratorForm
        -*- Descripción: formulario de registro para colaboradores.
        -*- Soporta registro de personas u organizaciones con representante legal.
-->
<script lang="ts">
        import Button from '../ui/Button.svelte';
        import DatePicker from './DatePicker.svelte';
        let sending = false;
        let errors: string[] = [];
        let tipo: 'persona' | 'organizacion' = 'persona';

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
                errors = [];

                const comunes = {
                        username: (data.get('username') || '').toString().trim(),
                        email: (data.get('email') || '').toString().trim(),
                        password: (data.get('password') || '').toString(),
                        repassword: (data.get('repassword') || '').toString()
                };
                if (!comunes.username) errors.push('El nombre de usuario es obligatorio');
                if (!comunes.email) errors.push('El email es obligatorio');
                if (comunes.password !== comunes.repassword) errors.push('Las contraseñas no coinciden');

                if (tipo === 'persona') {
                        const persona = {
                                nombre: (data.get('nombre') || '').toString().trim(),
                                apellido: (data.get('apellido') || '').toString().trim(),
                                docTipo: (data.get('docTipo') || '').toString(),
                                docNumero: (data.get('docNumero') || '').toString().trim(),
                                nacimiento: (data.get('nacimiento') || '').toString(),
                                cuil: (data.get('cuil') || '').toString().trim()
                        };
                        if (!persona.nombre) errors.push('El nombre es obligatorio');
                        if (!persona.apellido) errors.push('El apellido es obligatorio');
                        if (!persona.docTipo || !persona.docNumero) errors.push('Documento obligatorio');
                        if (!persona.nacimiento || !esMayorDeEdad(persona.nacimiento)) errors.push('Debe ser mayor de 18 años');
                        if (!persona.cuil) errors.push('El CUIL es obligatorio');
                } else {
                        const org = {
                                razonSocial: (data.get('razonSocial') || '').toString().trim(),
                                cuit: (data.get('cuit') || '').toString().trim(),
                                repNombre: (data.get('repNombre') || '').toString().trim(),
                                repApellido: (data.get('repApellido') || '').toString().trim(),
                                repDocTipo: (data.get('repDocTipo') || '').toString(),
                                repDocNumero: (data.get('repDocNumero') || '').toString().trim(),
                                repNacimiento: (data.get('repNacimiento') || '').toString()
                        };
                        if (!org.razonSocial) errors.push('La razón social es obligatoria');
                        if (!org.cuit) errors.push('El CUIT es obligatorio');
                        if (!org.repNombre) errors.push('Nombre del representante obligatorio');
                        if (!org.repApellido) errors.push('Apellido del representante obligatorio');
                        if (!org.repDocTipo || !org.repDocNumero) errors.push('Documento del representante obligatorio');
                        if (!org.repNacimiento || !esMayorDeEdad(org.repNacimiento)) errors.push('El representante debe ser mayor de 18 años');
                }
                if (errors.length > 0) return;
                sending = true;
                setTimeout(() => {
                        sending = false;
                        console.log('Colaborador registrado');
                }, 1000);
        }
</script>

<form on:submit={handleSubmit} class="space-y-4">
        <div>
                <label for="tipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de colaborador *</label>
                <select id="tipo" bind:value={tipo} class="w-full rounded-md border border-gray-300 px-3 py-2">
                        <option value="persona">Persona</option>
                        <option value="organizacion">Organización / ONG</option>
                </select>
        </div>
        {#if tipo === 'persona'}
                <div class="grid gap-4 md:grid-cols-2">
                        <div>
                                <label for="nombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre *</label>
                                <input id="nombre" name="nombre" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="apellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido *</label>
                                <input id="apellido" name="apellido" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="docTipo" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Tipo de documento *</label>
                                <select id="docTipo" name="docTipo" required class="w-full rounded-md border border-gray-300 px-3 py-2">
                                        <option>DNI</option>
                                        <option>Pasaporte</option>
                                        <option>Otro</option>
                                </select>
                        </div>
                        <div>
                                <label for="docNumero" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Número *</label>
                                <input id="docNumero" name="docNumero" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="nacimiento" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Fecha de nacimiento *</label>
                                <DatePicker id="nacimiento" name="nacimiento" required />
                        </div>
                        <div>
                                <label for="cuil" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIL *</label>
                                <input id="cuil" name="cuil" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                </div>
        {:else}
                <div class="grid gap-4 md:grid-cols-2">
                        <div class="md:col-span-2">
                                <label for="razonSocial" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Razón social *</label>
                                <input id="razonSocial" name="razonSocial" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div class="md:col-span-2">
                                <label for="cuit" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">CUIT *</label>
                                <input id="cuit" name="cuit" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="repNombre" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre representante *</label>
                                <input id="repNombre" name="repNombre" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                        </div>
                        <div>
                                <label for="repApellido" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Apellido representante *</label>
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
        {/if}
        <div>
                <label for="username" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Nombre de usuario *</label>
                <input id="username" name="username" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
                <label for="email" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Email *</label>
                <input id="email" name="email" type="email" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
                <div>
                        <label for="password" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Contraseña *</label>
                        <input id="password" name="password" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                        <label for="repassword" class="mb-1 block text-sm font-medium text-[rgb(var(--base-color))]">Confirmar contraseña *</label>
                        <input id="repassword" name="repassword" type="password" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
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
