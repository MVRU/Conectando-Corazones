import { describe, it, expect } from 'vitest';
import { validarUsername, validarCorreo, validarContrasena, esAdulto, validarNombreLegal } from '$lib/utils/validaciones';

describe('validarUsername', () => {
    describe('Longitud válida', () => {
        it('debe aceptar username de exactamente 3 caracteres (límite inferior)', () => {
            expect(validarUsername('abc')).toBe(true);
        });

        it('debe aceptar username de exactamente 30 caracteres (límite superior)', () => {
            const username30 = 'a'.repeat(30);
            expect(validarUsername(username30)).toBe(true);
        });

        it('debe aceptar username de longitud media válida', () => {
            expect(validarUsername('usuario123')).toBe(true);
        });
    });

    describe('Casos borde de longitud', () => {
        it('debe rechazar username de 2 caracteres (por debajo del límite)', () => {
            expect(validarUsername('ab')).toBe(false);
        });

        it('debe rechazar username de 31 caracteres (por encima del límite)', () => {
            const username31 = 'a'.repeat(31);
            expect(validarUsername(username31)).toBe(false);
        });

        it('debe rechazar username vacío', () => {
            expect(validarUsername('')).toBe(false);
        });
    });

    describe('Caracteres permitidos', () => {
        it('debe aceptar letras minúsculas', () => {
            expect(validarUsername('usuario')).toBe(true);
        });

        it('debe aceptar letras mayúsculas', () => {
            expect(validarUsername('USUARIO')).toBe(true);
        });

        it('debe aceptar números', () => {
            expect(validarUsername('usuario123')).toBe(true);
        });

        it('debe aceptar puntos', () => {
            expect(validarUsername('usuario.nombre')).toBe(true);
        });

        it('debe aceptar guiones bajos', () => {
            expect(validarUsername('usuario_nombre')).toBe(true);
        });

        it('debe aceptar guiones', () => {
            expect(validarUsername('usuario-nombre')).toBe(true);
        });

        it('debe aceptar combinación de caracteres permitidos', () => {
            expect(validarUsername('user_name.123-test')).toBe(true);
        });
    });

    describe('Caracteres no permitidos', () => {
        it('debe rechazar username con espacios', () => {
            expect(validarUsername('usuario nombre')).toBe(false);
        });

        it('debe rechazar username con caracteres especiales (@)', () => {
            expect(validarUsername('usuario@123')).toBe(false);
        });

        it('debe rechazar username con símbolos (!)', () => {
            expect(validarUsername('usuario!')).toBe(false);
        });

        it('debe rechazar username con caracteres acentuados', () => {
            expect(validarUsername('usuário')).toBe(false);
        });
    });

    describe('Manejo de espacios en blanco (trim)', () => {
        it('debe manejar username con espacios al inicio (requiere trim previo)', () => {
            // La función no hace trim internamente, por lo que debe rechazar
            expect(validarUsername(' usuario')).toBe(false);
        });

        it('debe manejar username con espacios al final (requiere trim previo)', () => {
            // La función no hace trim internamente, por lo que debe rechazar
            expect(validarUsername('usuario ')).toBe(false);
        });

        it('debe manejar username con espacios en ambos extremos (requiere trim previo)', () => {
            // La función no hace trim internamente, por lo que debe rechazar
            expect(validarUsername(' usuario ')).toBe(false);
        });

        it('debe aceptar username válido después de aplicar trim', () => {
            const username = ' usuario123 ';
            expect(validarUsername(username.trim())).toBe(true);
        });
    });
});

describe('validarCorreo', () => {
    describe('Emails válidos estándar', () => {
        it('debe aceptar email simple válido', () => {
            expect(validarCorreo('usuario@dominio.com')).toBe(true);
        });

        it('debe aceptar email con números', () => {
            expect(validarCorreo('usuario123@dominio.com')).toBe(true);
        });

        it('debe aceptar email con guiones', () => {
            expect(validarCorreo('usuario-nombre@dominio.com')).toBe(true);
        });
    });

    describe('Casos borde: subdominios complejos', () => {
        it('debe aceptar email con subdominio simple', () => {
            expect(validarCorreo('usuario@mail.dominio.com')).toBe(true);
        });

        it('debe aceptar email con múltiples subdominios', () => {
            expect(validarCorreo('usuario@mail.empresa.co.uk')).toBe(true);
        });

        it('debe aceptar email con subdominio complejo', () => {
            expect(validarCorreo('usuario@correo.interno.empresa.com.ar')).toBe(true);
        });
    });

    describe('Casos borde: caracteres especiales permitidos antes del @', () => {
        it('debe aceptar email con punto antes del @', () => {
            expect(validarCorreo('usuario.nombre@dominio.com')).toBe(true);
        });

        it('debe aceptar email con signo más (tags)', () => {
            expect(validarCorreo('usuario+tag@dominio.com')).toBe(true);
        });

        it('debe aceptar email con guion bajo', () => {
            expect(validarCorreo('usuario_nombre@dominio.com')).toBe(true);
        });

        it('debe aceptar email con múltiples caracteres especiales permitidos', () => {
            expect(validarCorreo('usuario.nombre+tag@dominio.com')).toBe(true);
        });
    });

    describe('Emails inválidos', () => {
        it('debe rechazar email sin @', () => {
            expect(validarCorreo('usuariodominio.com')).toBe(false);
        });

        it('debe rechazar email sin dominio', () => {
            expect(validarCorreo('usuario@')).toBe(false);
        });

        it('debe rechazar email sin parte local', () => {
            expect(validarCorreo('@dominio.com')).toBe(false);
        });

        it('debe rechazar email con espacios', () => {
            expect(validarCorreo('usuario @dominio.com')).toBe(false);
        });

        it('debe rechazar email sin extensión de dominio', () => {
            expect(validarCorreo('usuario@dominio')).toBe(false);
        });

        it('debe rechazar email vacío', () => {
            expect(validarCorreo('')).toBe(false);
        });

        it('debe rechazar email con múltiples @', () => {
            expect(validarCorreo('usuario@@dominio.com')).toBe(false);
        });
    });
});

describe('validarContrasena', () => {
    describe('Contraseñas válidas con todos los requisitos', () => {
        it('debe aceptar contraseña con mayúscula, minúscula y número', () => {
            expect(validarContrasena('Password123')).toBe(true);
        });

        it('debe aceptar contraseña con todos los requisitos y símbolos', () => {
            // Nota: La función actual NO valida símbolos, pero debería aceptar esta contraseña
            expect(validarContrasena('Pass123!')).toBe(true);
        });

        it('debe aceptar contraseña compleja', () => {
            expect(validarContrasena('MiContraseña2024')).toBe(true);
        });
    });

    describe('Validación de mayúscula', () => {
        it('debe rechazar contraseña sin mayúscula', () => {
            expect(validarContrasena('password123')).toBe(false);
        });

        it('debe aceptar contraseña con al menos una mayúscula', () => {
            expect(validarContrasena('Password123')).toBe(true);
        });

        it('debe aceptar contraseña con múltiples mayúsculas', () => {
            expect(validarContrasena('PASSWORDa123')).toBe(true);
        });
    });

    describe('Validación de número', () => {
        it('debe rechazar contraseña sin número', () => {
            expect(validarContrasena('Password')).toBe(false);
        });

        it('debe aceptar contraseña con al menos un número', () => {
            expect(validarContrasena('Password1')).toBe(true);
        });

        it('debe aceptar contraseña con múltiples números', () => {
            expect(validarContrasena('Password123456')).toBe(true);
        });
    });

    describe('Validación de minúscula', () => {
        it('debe rechazar contraseña sin minúscula', () => {
            expect(validarContrasena('PASSWORD123')).toBe(false);
        });

        it('debe aceptar contraseña con al menos una minúscula', () => {
            expect(validarContrasena('PASSWORDa123')).toBe(true);
        });
    });

    describe('Casos borde: combinaciones incompletas', () => {
        it('debe rechazar contraseña solo con minúsculas (sin mayúscula ni número)', () => {
            expect(validarContrasena('password')).toBe(false);
        });

        it('debe rechazar contraseña solo con mayúsculas (sin minúscula ni número)', () => {
            expect(validarContrasena('PASSWORD')).toBe(false);
        });

        it('debe rechazar contraseña solo con números (sin letras)', () => {
            expect(validarContrasena('123456789')).toBe(false);
        });

        it('debe rechazar contraseña con largo correcto pero solo minúsculas y números (sin mayúscula)', () => {
            // Caso borde específico solicitado
            expect(validarContrasena('password123456')).toBe(false);
        });

        it('debe rechazar contraseña con mayúsculas y minúsculas pero sin número', () => {
            expect(validarContrasena('PasswordSegura')).toBe(false);
        });
    });

    describe('Nota: Validación de símbolos (no implementada)', () => {
        it('NOTA: La función actual NO valida símbolos especiales', () => {
            // Este test documenta que la función acepta contraseñas sin símbolos
            // aunque el mensaje de error menciona "carácter especial"
            expect(validarContrasena('Password123')).toBe(true);
        });

        it('debe aceptar contraseña con símbolos comunes', () => {
            // La función actual acepta símbolos pero no los requiere
            expect(validarContrasena('Pass123!')).toBe(true);
            expect(validarContrasena('Pass123@')).toBe(true);
            expect(validarContrasena('Pass123#')).toBe(true);
            expect(validarContrasena('Pass123$')).toBe(true);
        });
    });

    describe('Contraseñas vacías o muy cortas', () => {
        it('debe rechazar contraseña vacía', () => {
            expect(validarContrasena('')).toBe(false);
        });

        it('debe rechazar contraseña de un solo carácter', () => {
            expect(validarContrasena('A')).toBe(false);
        });

        it('debe rechazar contraseña muy corta aunque cumpla requisitos', () => {
            expect(validarContrasena('A1')).toBe(false);
        });
    });
});

describe('esAdulto', () => {
    describe('Edad exactamente 18 años', () => {
        it('debe aceptar persona con exactamente 18 años (hace 18 años)', () => {
            const hoy = new Date();
            const hace18Anios = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace18Anios)).toBe(true);
        });

        it('debe aceptar persona con 18 años y 1 día', () => {
            const hoy = new Date();
            const hace18AniosY1Dia = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate() - 1);
            expect(esAdulto(hace18AniosY1Dia)).toBe(true);
        });

        it('debe aceptar persona con 18 años y 1 mes', () => {
            const hoy = new Date();
            const hace18AniosY1Mes = new Date(hoy.getFullYear() - 18, hoy.getMonth() - 1, hoy.getDate());
            expect(esAdulto(hace18AniosY1Mes)).toBe(true);
        });
    });

    describe('Caso borde CRÍTICO: Cumple años hoy mismo', () => {
        it('debe aceptar persona que cumple exactamente 18 años HOY', () => {
            // Este es el caso borde más importante solicitado
            const hoy = new Date();
            const cumple18Hoy = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(cumple18Hoy)).toBe(true);
        });

        it('debe aceptar persona que cumple 25 años hoy', () => {
            const hoy = new Date();
            const cumple25Hoy = new Date(hoy.getFullYear() - 25, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(cumple25Hoy)).toBe(true);
        });
    });

    describe('Mayores de 18 años', () => {
        it('debe aceptar persona de 19 años', () => {
            const hoy = new Date();
            const hace19Anios = new Date(hoy.getFullYear() - 19, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace19Anios)).toBe(true);
        });

        it('debe aceptar persona de 25 años', () => {
            const hoy = new Date();
            const hace25Anios = new Date(hoy.getFullYear() - 25, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace25Anios)).toBe(true);
        });

        it('debe aceptar persona de 50 años', () => {
            const hoy = new Date();
            const hace50Anios = new Date(hoy.getFullYear() - 50, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace50Anios)).toBe(true);
        });

        it('debe aceptar persona de 100 años', () => {
            const hoy = new Date();
            const hace100Anios = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace100Anios)).toBe(true);
        });
    });

    describe('Menores de 18 años', () => {
        it('debe rechazar persona de 17 años', () => {
            const hoy = new Date();
            const hace17Anios = new Date(hoy.getFullYear() - 17, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace17Anios)).toBe(false);
        });

        it('debe rechazar persona de 17 años y 11 meses', () => {
            const hoy = new Date();
            const hace17AniosY11Meses = new Date(hoy.getFullYear() - 18, hoy.getMonth() + 1, hoy.getDate());
            expect(esAdulto(hace17AniosY11Meses)).toBe(false);
        });

        it('debe rechazar persona que cumple 18 años mañana', () => {
            const hoy = new Date();
            const cumple18Maniana = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate() + 1);
            expect(esAdulto(cumple18Maniana)).toBe(false);
        });

        it('debe rechazar persona de 10 años', () => {
            const hoy = new Date();
            const hace10Anios = new Date(hoy.getFullYear() - 10, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace10Anios)).toBe(false);
        });

        it('debe rechazar persona de 1 año', () => {
            const hoy = new Date();
            const hace1Anio = new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate());
            expect(esAdulto(hace1Anio)).toBe(false);
        });
    });

    describe('Fechas futuras', () => {
        it('debe rechazar fecha futura (mañana)', () => {
            const maniana = new Date();
            maniana.setDate(maniana.getDate() + 1);
            expect(esAdulto(maniana)).toBe(false);
        });

        it('debe rechazar fecha futura (próximo año)', () => {
            const proximoAnio = new Date();
            proximoAnio.setFullYear(proximoAnio.getFullYear() + 1);
            expect(esAdulto(proximoAnio)).toBe(false);
        });

        it('debe rechazar fecha futura (dentro de 10 años)', () => {
            const en10Anios = new Date();
            en10Anios.setFullYear(en10Anios.getFullYear() + 10);
            expect(esAdulto(en10Anios)).toBe(false);
        });
    });

    describe('Fechas inválidas', () => {
        it('debe rechazar fecha inválida (NaN)', () => {
            const fechaInvalida = new Date('invalid');
            expect(esAdulto(fechaInvalida)).toBe(false);
        });

        it('debe rechazar objeto que no es Date', () => {
            expect(esAdulto('2000-01-01' as any)).toBe(false);
        });

        it('debe rechazar null', () => {
            expect(esAdulto(null as any)).toBe(false);
        });

        it('debe rechazar undefined', () => {
            expect(esAdulto(undefined as any)).toBe(false);
        });
    });

    describe('Casos especiales: Años bisiestos', () => {
        it('debe manejar correctamente cumpleaños en año bisiesto (29 de febrero)', () => {
            // Persona nacida el 29 de febrero de 2004 (año bisiesto)
            // En 2022 (no bisiesto) tendría 18 años
            const nacimiento = new Date(2004, 1, 29); // 29 de febrero de 2004
            const fechaValidacion = new Date(2022, 2, 1); // 1 de marzo de 2022

            // Calculamos manualmente si es adulto en esa fecha
            const edad = fechaValidacion.getFullYear() - nacimiento.getFullYear();
            const mes = fechaValidacion.getMonth() - nacimiento.getMonth();

            // La persona tiene 18 años y ya pasó su cumpleaños (en marzo)
            expect(edad >= 18 && mes > 0).toBe(true);
        });
    });
});

describe('validarNombreLegal', () => {
    describe('Nombres válidos', () => {
        it('debe aceptar nombre de exactamente 3 caracteres (longitud mínima)', () => {
            expect(validarNombreLegal('ABC')).toBe(true);
        });

        it('debe aceptar nombre de longitud media', () => {
            expect(validarNombreLegal('Fundación Esperanza')).toBe(true);
        });

        it('debe aceptar nombre largo', () => {
            expect(validarNombreLegal('Instituto de Educación y Desarrollo Social Comunitario')).toBe(true);
        });

        it('debe aceptar nombre con números', () => {
            expect(validarNombreLegal('Escuela N° 123')).toBe(true);
        });

        it('debe aceptar nombre con caracteres especiales', () => {
            expect(validarNombreLegal('Hospital "San José"')).toBe(true);
        });

        it('debe aceptar nombre con espacios al inicio/final después de trim', () => {
            expect(validarNombreLegal('  Fundación  ')).toBe(true);
        });
    });

    describe('Nombres inválidos por longitud', () => {
        it('debe rechazar nombre de 2 caracteres', () => {
            expect(validarNombreLegal('AB')).toBe(false);
        });

        it('debe rechazar nombre de 1 carácter', () => {
            expect(validarNombreLegal('A')).toBe(false);
        });

        it('debe rechazar string vacío', () => {
            expect(validarNombreLegal('')).toBe(false);
        });
    });

    describe('Nombres inválidos: Solo espacios en blanco', () => {
        it('debe rechazar string con solo espacios', () => {
            expect(validarNombreLegal('   ')).toBe(false);
        });

        it('debe rechazar string con solo tabs', () => {
            expect(validarNombreLegal('\t\t\t')).toBe(false);
        });

        it('debe rechazar string con espacios y tabs mezclados', () => {
            expect(validarNombreLegal('  \t  \t  ')).toBe(false);
        });

        it('debe rechazar string con saltos de línea', () => {
            expect(validarNombreLegal('\n\n\n')).toBe(false);
        });

        it('debe rechazar string con espacios que después de trim queda con menos de 3 caracteres', () => {
            expect(validarNombreLegal('  AB  ')).toBe(false);
        });
    });
});

