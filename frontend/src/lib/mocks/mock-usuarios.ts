import type {
    Usuario,
    Administrador,
    Institucion,
    Colaborador,
    Organizacion,
    Unipersonal
} from '$lib/types/Usuario';

import type { Direccion } from '$lib/types/Direccion';

export const mockUsuarios = {
    // Administrador del sistema
    admin1: {
        id_usuario: 1,
        username: 'alexis_sklate',
        password: '123456',
        nombre: 'Alexis',
        apellido: 'Sklate',
        tipo_documento: 'DNI',
        numero_documento: '45258963',
        fecha_nacimiento: new Date('2005-03-15'),
        estado: 'activo',
        created_at: new Date('2020-01-01'),
        rol: 'administrador',
        url_foto: '/users/admin-default.jpg',
        direccion: {
            calle: 'Av. Corrientes',
            numero: '1234',
            piso: '5',
            departamento: 'A',
            referencia: 'Edificio Torre Central, entre Callao y Uruguay',
            localidad: {
                codigo_postal: 'C1043AAZ',
                nombre: 'Buenos Aires',
                provincia: {
                    codigo_iso: 'AR-C',
                    nombre: 'Ciudad Autónoma de Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'admin@conectandocorazones.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [
            {
                id_resena: 1,
                tipo_objeto: 'Proyecto',
                id_objeto: 1,
                contenido: 'Excelente gestión del proyecto de infraestructura escolar. Se cumplieron todos los objetivos en tiempo y forma.',
                puntaje: 5,
                aprobado: true,
                username: 'admin_conectando'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 1,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-01-01')
            },
            {
                id_consentimiento: 2,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-01-01')
            },
            {
                id_consentimiento: 3,
                tipo: 'conducta',
                version: '1.0',
                created_at: new Date('2024-01-01')
            }
        ],
    } satisfies Administrador,

    // Institución educativa
    escuela_esperanza: {
        id_usuario: 2,
        username: 'escuela_esperanza',
        password: '123456',
        nombre: 'María Elena',
        apellido: 'Rodríguez',
        tipo_documento: 'DNI',
        numero_documento: '25678432',
        fecha_nacimiento: new Date('1970-06-10'),
        estado: 'activo',
        created_at: new Date('2024-01-15'),
        rol: 'institucion',
        url_foto: '/users/escuela-esperanza.jpg',
        cuit: '30-71234567-8',
        nombre_legal: 'Escuela Primaria Esperanza',
        tipo_institucion: 'educacion_publica',
        direccion: {
            calle: 'San Martín',
            numero: '456',
            referencia: 'Frente a la plaza principal',
            localidad: {
                codigo_postal: '2000',
                nombre: 'Rosario',
                provincia: {
                    codigo_iso: 'AR-S',
                    nombre: 'Santa Fe'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'direccion@escuelaesperanza.edu.ar',
                etiqueta: 'principal'
            },
            {
                tipo_contacto: 'telefono',
                valor: '341 XXXXXXX',
                etiqueta: 'celular'
            }
        ],
        resenas: [
            {
                id_resena: 2,
                tipo_objeto: 'Usuario',
                id_objeto: 3,
                contenido: 'Colaborador muy comprometido, ayudó mucho en la organización del proyecto de biblioteca.',
                puntaje: 4,
                aprobado: true,
                username: 'escuela_esperanza'
            },
            {
                id_resena: 3,
                tipo_objeto: 'Proyecto',
                id_objeto: 2,
                contenido: 'El proyecto de huerta escolar fue un éxito total. Los niños aprendieron mucho y ahora tenemos alimentos frescos.',
                puntaje: 5,
                aprobado: true,
                username: 'escuela_esperanza'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 4,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-01-15')
            },
            {
                id_consentimiento: 5,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-01-15')
            },
            {
                id_consentimiento: 6,
                tipo: 'evidencia',
                version: '1.0',
                created_at: new Date('2024-01-15')
            }
        ],
    } satisfies Institucion,

    // Hospital público
    hospital_garrahan: {
        id_usuario: 3,
        username: 'hospital_garrahan',
        password: '123456',
        nombre: 'Dr. Roberto',
        apellido: 'García',
        tipo_documento: 'DNI',
        numero_documento: '22456789',
        fecha_nacimiento: new Date('1965-11-20'),
        estado: 'activo',
        created_at: new Date('2024-02-10'),
        rol: 'institucion',
        url_foto: '/users/hospital-garrahan.jpg',
        cuit: '30-54789123-4',
        nombre_legal: 'Hospital de Pediatría Prof. Dr. Juan P. Garrahan',
        tipo_institucion: 'salud_publica',
        direccion: {
            calle: 'Combate de los Pozos',
            numero: '1881',
            referencia: 'Hospital Garrahan - Sector Administrativo',
            localidad: {
                codigo_postal: 'C1245AAM',
                nombre: 'Buenos Aires',
                provincia: {
                    codigo_iso: 'AR-C',
                    nombre: 'Ciudad Autónoma de Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'proyectos@garrahan.gov.ar',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [
            {
                id_consentimiento: 7,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-02-10')
            },
            {
                id_consentimiento: 8,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-02-10')
            }
        ]
    } satisfies Institucion,

    // Colaborador individual 1
    maria_gonzalez: {
        id_usuario: 4,
        username: 'maria_g',
        password: '123456',
        nombre: 'María',
        apellido: 'González',
        tipo_documento: 'DNI',
        numero_documento: '32456789',
        fecha_nacimiento: new Date('1988-07-22'),
        estado: 'activo',
        created_at: new Date('2024-02-01'),
        rol: 'colaborador',
        url_foto: '/users/maria-gonzalez.jpg',
        cuit_cuil: '27-32456789-1',
        tipo_colaborador: 'unipersonal',
        direccion: {
            calle: 'Mitre',
            numero: '789',
            piso: '2',
            departamento: 'B',
            localidad: {
                codigo_postal: '5000',
                nombre: 'Córdoba',
                provincia: {
                    codigo_iso: 'AR-X',
                    nombre: 'Córdoba'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'maria.gonzalez@gmail.com',
                etiqueta: 'principal'
            }
        ],
        resenas: [
            {
                id_resena: 4,
                tipo_objeto: 'Proyecto',
                id_objeto: 1,
                contenido: 'Muy buena organización del proyecto, aunque faltó más comunicación sobre los avances.',
                puntaje: 3,
                aprobado: true,
                username: 'maria_g'
            },
            {
                id_resena: 5,
                tipo_objeto: 'Usuario',
                id_objeto: 2,
                contenido: 'La institución fue muy transparente con el uso de los recursos. Recomiendo colaborar con ellos.',
                puntaje: 5,
                aprobado: true,
                username: 'maria_g'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 9,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-02-01')
            },
            {
                id_consentimiento: 10,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-02-01')
            }
        ],
    } satisfies Unipersonal,

    // Colaborador individual 2
    carlos_rodriguez: {
        id_usuario: 5,
        username: 'carlos_r',
        password: '123456',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        tipo_documento: 'DNI',
        numero_documento: '18765432',
        fecha_nacimiento: new Date('1975-12-08'),
        estado: 'activo',
        created_at: new Date('2024-02-15'),
        rol: 'colaborador',
        url_foto: '/users/carlos-rodriguez.jpg',
        cuit_cuil: '20-18765432-9',
        tipo_colaborador: 'unipersonal',
        direccion: {
            calle: 'Rivadavia',
            numero: '2341',
            referencia: 'Casa con portón verde',
            localidad: {
                codigo_postal: '4000',
                nombre: 'San Miguel de Tucumán',
                provincia: {
                    codigo_iso: 'AR-T',
                    nombre: 'Tucumán'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'carlos.rodriguez@hotmail.com',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [
            {
                id_consentimiento: 11,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-02-15')
            }
        ],
    } satisfies Unipersonal,

    // Organización sin fines de lucro
    fundacion_manos_unidas: {
        id_usuario: 6,
        username: 'fundacion_manos',
        password: '123456',
        nombre: 'Patricia',
        apellido: 'Morales',
        tipo_documento: 'DNI',
        numero_documento: '30987654',
        fecha_nacimiento: new Date('1975-04-15'),
        estado: 'activo',
        created_at: new Date('2024-01-20'),
        rol: 'colaborador',
        url_foto: '/users/fundacion-manos-unidas.jpg',
        cuit_cuil: '30-98765432-1',
        tipo_colaborador: 'organizacion',
        razon_social: 'Fundación Manos Unidas Argentina',
        con_fines_de_lucro: false,
        direccion: {
            calle: 'Av. Santa Fe',
            numero: '1456',
            piso: '3',
            departamento: 'C',
            referencia: 'Edificio Libertador, oficina 302',
            localidad: {
                codigo_postal: 'C1060ABR',
                nombre: 'Buenos Aires',
                provincia: {
                    codigo_iso: 'AR-C',
                    nombre: 'Ciudad Autónoma de Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'contacto@manosunidas.org.ar',
                etiqueta: 'principal'
            }
        ],
        resenas: [
            {
                id_resena: 6,
                tipo_objeto: 'Proyecto',
                id_objeto: 3,
                contenido: 'Excelente proyecto de asistencia alimentaria. Muy bien coordinado y con gran impacto social.',
                puntaje: 5,
                aprobado: true,
                username: 'fundacion_manos'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 12,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-01-20')
            },
            {
                id_consentimiento: 13,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-01-20')
            },
            {
                id_consentimiento: 14,
                tipo: 'evidencia',
                version: '1.0',
                created_at: new Date('2024-01-20')
            },
            {
                id_consentimiento: 15,
                tipo: 'conducta',
                version: '1.0',
                created_at: new Date('2024-01-20')
            }
        ],
    } satisfies Organizacion,

    // Empresa con fines de lucro
    empresa_solidaria_sa: {
        id_usuario: 7,
        username: 'empresa_solidaria',
        password: '123456',
        nombre: 'Juan Carlos',
        apellido: 'Mendoza',
        tipo_documento: 'DNI',
        numero_documento: '28567890',
        fecha_nacimiento: new Date('1978-03-22'),
        estado: 'activo',
        created_at: new Date('2024-02-05'),
        rol: 'colaborador',
        url_foto: '/users/empresa-solidaria.jpg',
        cuit_cuil: '30-56789012-3',
        tipo_colaborador: 'organizacion',
        razon_social: 'Empresa Solidaria S.A.',
        con_fines_de_lucro: true,
        direccion: {
            calle: 'Av. del Libertador',
            numero: '5678',
            piso: '12',
            departamento: 'A',
            referencia: 'Torre Empresarial Norte',
            localidad: {
                codigo_postal: 'B1636DSR',
                nombre: 'Olivos',
                provincia: {
                    codigo_iso: 'AR-B',
                    nombre: 'Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'rse@empresasolidaria.com.ar',
                etiqueta: 'principal'
            }
        ],
        resenas: [
            {
                id_resena: 7,
                tipo_objeto: 'Proyecto',
                id_objeto: 5,
                contenido: 'Proyecto bien estructurado pero podría mejorar la comunicación con los beneficiarios.',
                puntaje: 3,
                aprobado: true,
                username: 'empresa_solidaria'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 16,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-02-05')
            },
            {
                id_consentimiento: 17,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-02-05')
            }
        ],
    } satisfies Organizacion,

    // Colaborador individual 3
    ana_martinez: {
        id_usuario: 8,
        username: 'ana_m',
        password: '123456',
        nombre: 'Ana',
        apellido: 'Martínez',
        tipo_documento: 'DNI',
        numero_documento: '24567890',
        fecha_nacimiento: new Date('1982-09-14'),
        estado: 'activo',
        created_at: new Date('2024-03-01'),
        rol: 'colaborador',
        url_foto: '/users/ana-martinez.jpg',
        cuit_cuil: '27-24567890-2',
        tipo_colaborador: 'unipersonal',
        direccion: {
            calle: 'San Juan',
            numero: '1122',
            localidad: {
                codigo_postal: '3100',
                nombre: 'Paraná',
                provincia: {
                    codigo_iso: 'AR-E',
                    nombre: 'Entre Ríos'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'ana.martinez@outlook.com',
                etiqueta: 'principal'
            }
        ],
        resenas: [
            {
                id_resena: 8,
                tipo_objeto: 'Usuario',
                id_objeto: 1,
                contenido: 'Administración muy eficiente y rápida respuesta a consultas.',
                puntaje: 4,
                aprobado: true,
                username: 'ana_m'
            },
            {
                id_resena: 9,
                tipo_objeto: 'Proyecto',
                id_objeto: 6,
                contenido: 'Proyecto muy necesario pero faltó mejor planificación en la logística.',
                puntaje: 2,
                aprobado: false,
                username: 'ana_m'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 18,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-03-01')
            },
            {
                id_consentimiento: 19,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-03-01')
            },
            {
                id_consentimiento: 20,
                tipo: 'conducta',
                version: '1.0',
                created_at: new Date('2024-03-01')
            }
        ],
    } satisfies Unipersonal,

    // Institución de salud privada
    clinica_san_jorge: {
        id_usuario: 9,
        username: 'clinica_sj',
        password: '123456',
        nombre: 'Dra. Carmen',
        apellido: 'Vega',
        tipo_documento: 'DNI',
        numero_documento: '26789123',
        fecha_nacimiento: new Date('1972-07-18'),
        estado: 'activo',
        created_at: new Date('2024-02-20'),
        rol: 'institucion',
        url_foto: '/users/clinica-san-jorge.jpg',
        cuit: '30-87654321-9',
        nombre_legal: 'Clínica San Jorge S.A.',
        tipo_institucion: 'salud_privada',
        direccion: {
            calle: 'Av. 9 de Julio',
            numero: '3456',
            referencia: 'Edificio principal, planta baja',
            localidad: {
                codigo_postal: '1425',
                nombre: 'Buenos Aires',
                provincia: {
                    codigo_iso: 'AR-C',
                    nombre: 'Ciudad Autónoma de Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'responsabilidad.social@clinicasanjorge.com.ar',
                etiqueta: 'principal'
            }
        ],
        resenas: [
            {
                id_resena: 10,
                tipo_objeto: 'Usuario',
                id_objeto: 4,
                contenido: 'Colaboración excepcional de esta organización. Muy profesionales y comprometidos.',
                puntaje: 5,
                aprobado: true,
                username: 'clinica_sj'
            }
        ],
        consentimientos: [
            {
                id_consentimiento: 21,
                tipo: 'terminos',
                version: '1.0',
                created_at: new Date('2024-02-20')
            },
            {
                id_consentimiento: 22,
                tipo: 'privacidad',
                version: '1.0',
                created_at: new Date('2024-02-20')
            },
            {
                id_consentimiento: 23,
                tipo: 'evidencia',
                version: '1.0',
                created_at: new Date('2024-02-20')
            }
        ],
    } satisfies Institucion,


    // Fundación Siempre
    fundacion_siempre: {
        id_usuario: 10,
        username: 'fundacion_siempre',
        password: '123456',
        nombre: 'Gabriela',
        apellido: 'López',
        tipo_documento: 'DNI',
        numero_documento: '31234567',
        fecha_nacimiento: new Date('1980-04-12'),
        estado: 'activo',
        created_at: new Date('2024-03-10'),
        rol: 'institucion',
        url_foto: '/users/fundacion-siempre.jpg',
        cuit: '30-99887766-4',
        nombre_legal: 'Fundación Siempre',
        tipo_institucion: 'fundacion',
        direccion: {
            calle: 'Av. Belgrano',
            numero: '123',
            referencia: 'Frente a la plaza central',
            localidad: {
                codigo_postal: '1406',
                nombre: 'Buenos Aires',
                provincia: {
                    codigo_iso: 'AR-C',
                    nombre: 'Ciudad Autónoma de Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'info@fundacionsiempre.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [],
    } satisfies Institucion,

    // Comedor Los Pinos
    comedor_los_pinos: {
        id_usuario: 11,
        username: 'comedor_los_pinos',
        password: '123456',
        nombre: 'Silvia',
        apellido: 'Pineda',
        tipo_documento: 'DNI',
        numero_documento: '28765432',
        fecha_nacimiento: new Date('1975-09-15'),
        estado: 'activo',
        created_at: new Date('2024-02-20'),
        rol: 'institucion',
        url_foto: '/users/comedor-los-pinos.jpg',
        cuit: '30-87654321-2',
        nombre_legal: 'Comedor Los Pinos',
        tipo_institucion: 'comedor',
        direccion: {
            calle: 'Calle 8',
            numero: '456',
            referencia: 'Barrio Norte',
            localidad: {
                codigo_postal: '1900',
                nombre: 'La Plata',
                provincia: {
                    codigo_iso: 'AR-B',
                    nombre: 'Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'contacto@comedoreslospinos.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [],
    } satisfies Institucion,

    // Hospital General San José
    hospital_sanjose: {
        id_usuario: 12,
        username: 'hospital_sanjose',
        password: '123456',
        nombre: 'Ricardo',
        apellido: 'Martínez',
        tipo_documento: 'DNI',
        numero_documento: '29876543',
        fecha_nacimiento: new Date('1968-12-05'),
        estado: 'activo',
        created_at: new Date('2024-04-01'),
        rol: 'institucion',
        url_foto: '/users/hospital-sanjose.jpg',
        cuit: '30-11223344-5',
        nombre_legal: 'Hospital General San José',
        tipo_institucion: 'hospital',
        direccion: {
            calle: 'Av. San Martín',
            numero: '789',
            referencia: 'Esquina con Av. Rivadavia',
            localidad: {
                codigo_postal: '5000',
                nombre: 'Córdoba',
                provincia: {
                    codigo_iso: 'AR-X',
                    nombre: 'Córdoba'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'info@hospitalsanjose.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [],
    } satisfies Institucion,

    // Instituto de Formación Laboral
    instituto_formacion: {
        id_usuario: 13,
        username: 'instituto_formacion',
        password: '123456',
        nombre: 'Patricia',
        apellido: 'Suárez',
        tipo_documento: 'DNI',
        numero_documento: '31223344',
        fecha_nacimiento: new Date('1972-07-22'),
        estado: 'activo',
        created_at: new Date('2024-05-01'),
        rol: 'institucion',
        url_foto: '/users/instituto-formacion.jpg',
        cuit: '30-22334455-6',
        nombre_legal: 'Instituto de Formación Laboral',
        tipo_institucion: 'instituto',
        direccion: {
            calle: 'Av. Independencia',
            numero: '321',
            referencia: 'Cerca de la estación',
            localidad: {
                codigo_postal: '3100',
                nombre: 'Paraná',
                provincia: {
                    codigo_iso: 'AR-E',
                    nombre: 'Entre Ríos'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'info@institutoformacion.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [],
    } satisfies Institucion,

    // Fundación Calor Humano
    fundacion_calor: {
        id_usuario: 14,
        username: 'fundacion_calor',
        password: '123456',
        nombre: 'Esteban',
        apellido: 'Moreno',
        tipo_documento: 'DNI',
        numero_documento: '30998877',
        fecha_nacimiento: new Date('1978-10-30'),
        estado: 'activo',
        created_at: new Date('2024-06-01'),
        rol: 'institucion',
        url_foto: '/users/fundacion-calor.jpg',
        cuit: '30-33445566-7',
        nombre_legal: 'Fundación Calor Humano',
        tipo_institucion: 'fundacion',
        direccion: {
            calle: 'Av. Mitre',
            numero: '654',
            referencia: 'A metros del hospital',
            localidad: {
                codigo_postal: '8000',
                nombre: 'Bahía Blanca',
                provincia: {
                    codigo_iso: 'AR-B',
                    nombre: 'Buenos Aires'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'info@fundacioncalor.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [],
    } satisfies Institucion,

    // Hogar Santa Teresa
    hogar_santa_teresa: {
        id_usuario: 15,
        username: 'hogar_santa_teresa',
        password: '123456',
        nombre: 'Teresa',
        apellido: 'Giménez',
        tipo_documento: 'DNI',
        numero_documento: '32233445',
        fecha_nacimiento: new Date('1962-03-18'),
        estado: 'activo',
        created_at: new Date('2024-07-01'),
        rol: 'institucion',
        url_foto: '/users/hogar-santa-teresa.jpg',
        cuit: '30-44556677-8',
        nombre_legal: 'Hogar Santa Teresa',
        tipo_institucion: 'hogar',
        direccion: {
            calle: 'Calle 25',
            numero: '789',
            referencia: 'Barrio Sur',
            localidad: {
                codigo_postal: '4000',
                nombre: 'San Miguel de Tucumán',
                provincia: {
                    codigo_iso: 'AR-T',
                    nombre: 'Tucumán'
                }
            }
        },
        contactos: [
            {
                tipo_contacto: 'email',
                valor: 'info@hogarsantateresa.org',
                etiqueta: 'principal'
            }
        ],
        resenas: [],
        consentimientos: [],
    } satisfies Institucion,

} as const;

export type MockUsuarios = typeof mockUsuarios;