![Conectando Corazones – Plataforma solidaria](https://github.com/user-attachments/assets/99a5686b-6cb8-48f8-a468-c2cd612cfa9c)

> **Idioma:** [Español](README.md) · [English (auto-translate)](https://translate.google.com/translate?sl=es&tl=en&u=https://github.com/MVRU/Conectando-Corazones)

<h1 align="center">Conectando Corazones</h1>

**Conectando Corazones** es una plataforma digital sin fines de lucro que vincula a instituciones que necesitan ayuda —como escuelas, hospitales y comedores comunitarios— con personas, organizaciones y empresas dispuestas a brindarla en Argentina.

Promueve la solidaridad, la transparencia y la trazabilidad en cada proyecto, mediante herramientas digitales seguras, accesibles y responsables.

## 🌍 Propósito

Facilitar el encuentro entre quienes desean ayudar y quienes más lo necesitan, organizando las necesidades sociales en proyectos visibles, trazables y verificables.  

El objetivo es potenciar el impacto colectivo y construir una red de colaboración confiable y sostenible.

## 🔑 Características principales

- ✅ Registro con validación oficial mediante APIs gubernamentales (**[RENAPER](https://www.argentina.gob.ar/interior/renaper)** y **[ARCA](https://www.afip.gob.ar/landing/default.asp)**).
- 📄 Publicación estructurada de proyectos por instituciones verificadas.
- 🤲 Postulación de colaboradores solidarios (personas, empresas u ONGs).
- 💬 Chat seguro habilitado una vez aceptada la colaboración.
- 📸 Cierre con evidencia obligatoria para garantizar transparencia.
- 📊 Dashboard con métricas personalizadas.
- ♿ Enfoque inclusivo, ético y orientado al bien común.

## 👥 Tipos de usuarios

- 🏫 **Instituciones**  
  Comedores, escuelas, hospitales, fundaciones u otras entidades que necesiten ayuda.

- 🤝 **Colaboradores**  
  Personas físicas o jurídicas que deseen colaborar con recursos, tiempo o donaciones.

- 🛠️ **Administradores del sistema**  
  Responsables del control de calidad, moderación, validaciones y monitoreo.

## ⚙️ Tecnologías utilizadas

El sistema está desarrollado con tecnologías modernas, arquitectura desacoplada y servicios de despliegue en la nube.

### 🔸 Lenguaje principal
- **TypeScript** (sobre JavaScript)

### 🔹 Backend
- Node.js + Express.js
- Arquitectura en capas (routes, controllers, services, repositories)
- Prisma ORM (PostgreSQL)
- Axios (consumo de APIs externas)
- Firebase: Authentication, Storage y Realtime Database
- Integraciones: RENAPER, ARCA y SendGrid

### 🔹 Base de datos
- PostgreSQL (servicio en la nube a través de Render)

### 🔸 Frontend
- SvelteKit
- Tailwind CSS + clsx

### 🧪 Testing
- Vitest + Testing Library (unitarias e integración)
- Playwright (end-to-end)
- Supertest (simulación de peticiones HTTP)

### ☁️ Despliegue y servicios
- Vercel (frontend)
- Render (backend y base de datos)
- Firebase (auth, almacenamiento, mensajería en tiempo real)

### 🧠 Recomendaciones inteligentes
- PostgreSQL: filtrado por historial, categorías y geolocalización
- Librerías de apoyo: lodash, fastest-levenshtein, geo-distance

### 🛡️ Seguridad y buenas prácticas
- Helmet, CORS, express-rate-limit (seguridad en Express)
- Validación oficial con APIs del Estado Argentino
- Documentación técnica con Swagger y [GitHub Wiki](../../wiki)

> La estructura del proyecto se encuentra organizada en `/frontend`, `/backend` y `/docs`.

## 📖 Documentación

La documentación técnica y funcional del sistema está disponible en la carpeta [`/docs`](./docs), tanto en inglés como en español siguiendo estándares profesionales. 

**Incluye:** arquitectura del sistema, modelos de base de datos, flujos de datos, configuración y más.

## 📚 Manuales de usuario

Encontrá guías prácticas, manuales para instituciones y colaboradores, preguntas frecuentes y más en la **[Wiki del proyecto](../../wiki)**.

## 🚀 Cómo contribuir

**¡Conectando Corazones es un proyecto abierto a la comunidad!**  
Podés colaborar como desarrollador/a, diseñador/a, tester, redactor/a o mentor/a técnico.

### ✍️ Pasos para colaborar:

1. Hacé un fork del repositorio.
2. Cloná tu copia:  
   `git clone https://github.com/MVRU/Conectando-Corazones.git`
3. Instalá las dependencias necesarias en `/frontend` y `/backend`.
4. Creá una rama descriptiva:  
   `git checkout -b feature/mejora-validacion-apirest`
5. Realizá tus cambios y abrí un Pull Request.

> Consultá el archivo [`CONTRIBUTING.md`](./CONTRIBUTING.md) para conocer las normas y pautas de colaboración.

## 🛡️ Políticas y comunidad

- 📜 [Código de Conducta](./.github/CODE_OF_CONDUCT.md) – Basado en Contributor Covenant v2.1  
- 🔐 [Política de Seguridad](./.github/SECURITY.md) – Para reportar vulnerabilidades de forma responsable  
- 🧾 [Licencia AGPL-3.0](./LICENSE) – Uso libre con código abierto obligatorio para derivaciones

## 👨‍🎓 Créditos

Este proyecto fue desarrollado como trabajo final de la carrera de **Ingeniería en Sistemas de Información** en la **Universidad Tecnológica Nacional – Facultad Regional Rosario (UTN FRRo)**.

**Autores:**  
- Martín Tomás Álvarez  
- Marina Ana Milo  
- Alexis Julián Sklate

## 📬 Contacto

Para consultas, propuestas de colaboración o reportes técnicos, escribinos a:  
📩 **Crear un email...**