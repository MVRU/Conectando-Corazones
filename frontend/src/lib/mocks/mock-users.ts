// FIX: corregir todo esto luego de corregir el type

import type { User } from '$lib/types/User';

export const mockUsers = {
    admin: {
        id: '1',
        email: 'admin@conectandocorazones.org',
        nombre: 'Administrador',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        verificationStatus: 'verificado', // FIX: dijimos que si usuario se crea, está verificado

        // FIX: dijimos que admin tiene todos los permisos
        permisos: {
            gestionarUsuarios: true,
            gestionarProyectos: true,
            gestionarInstituciones: true,
            verReportes: true,
            gestionarSistema: true
        },
        telefono: '+54 341 123-4567', // FIX: difiere del DER
        departamento: 'Administración'  // FIX: atributo inventado
    },
    institucion: {
        id: '2',
        email: 'escuela@esperanza.edu.ar',
        nombre: 'Escuela Esperanza',
        role: 'institucion',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        verificationStatus: 'verificado', // FIX: dijimos que si usuario se crea, está verificado
        razonSocial: 'Escuela Esperanza',
        cuit: '30-12345678-9',
        telefono: '+54 341 987-6543', // FIX: difiere del DER
        direccion: { // FIX: difiere del DER
            calle: 'San Martín',
            numero: '123',
            ciudad: 'Rosario',
            provincia: 'Santa Fe',
            codigoPostal: '2000'
        },
        descripcion: 'Escuela rural comprometida con la educación de calidad',
        sitioWeb: 'escuelaesperanza.edu.ar', // FIX: difiere del DER
        tipoInstitucion: 'escuela',
        capacidadBeneficiarios: 150, // FIX: atributo inventado
        proyectosCreados: ['1', '2']
    },
    colaborador: {
        id: '3',
        email: 'juan.perez@gmail.com',
        nombre: 'Juan Pérez',
        role: 'colaborador',
        isActive: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        verificationStatus: 'verificado', // FIX: dijimos que si usuario se crea, está verificado
        tipoColaborador: 'persona',
        telefono: '+54 341 555-1234', // FIX: difiere del DER
        direccion: { // FIX: difierente del DER
            calle: 'Belgrano',
            numero: '456',
            ciudad: 'Rosario',
            provincia: 'Santa Fe',
            codigoPostal: '2000'
        },
        persona: { // FIX: difiere del DER
            dni: '12345678', // FIX: difiere del DER
            fechaNacimiento: new Date('1990-05-15'), // FIX: difiere del DER
            genero: 'masculino' // FIX: atributo inventado
        },
        colaboraciones: ['1', '3'],
        preferencias: {
            categorias: ['educacion', 'salud'],
            provincias: ['santa-fe', 'buenos-aires'],
            notificaciones: true
        }
    }
} satisfies Record<string, User>; // Esto garantiza que todo cumpla con User

export type MockUsers = typeof mockUsers;