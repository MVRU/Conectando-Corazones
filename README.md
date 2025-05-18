![Conectando Corazones – Plataforma solidaria](./public/img/banner.png)

<h1 align="center">💞Conectando Corazones</h1>

<details open>
<summary><h2>🇪🇸 Español</h2></summary>

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
- 🧠 Recomendaciones inteligentes de proyectos según perfil.
- ♿ Enfoque inclusivo, ético y orientado al bien común.

## 👥 Tipos de usuarios

- 🏫 **Instituciones**  
  Comedores, escuelas, hospitales, fundaciones u otras entidades que necesiten ayuda.

- 🤝 **Colaboradores**  
  Personas físicas o jurídicas que deseen colaborar con recursos, tiempo o donaciones.

- 🛠️ **Administradores del sistema**  
  Responsables del control de calidad, moderación, validaciones y monitoreo.

## ⚙️ Tecnologías utilizadas

El sistema está construido con herramientas modernas y arquitectura desacoplada:

### 🔸 Frontend
- Next.js  
- Tailwind CSS  
- Chart.js

### 🔹 Backend
- Node.js + Express.js  
- PostgreSQL  
- Firebase (chat, autenticación, archivos)

### 🔧 Servicios externos
- RENAPER + ARCA (validación oficial)  
- SendGrid / Nodemailer (notificaciones)  
- Vercel (frontend) y Render (backend + base de datos)

> La estructura del proyecto se encuentra organizada en `/frontend`, `/backend`, `/docs` y `/public`.

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
   `git checkout -b mejora-validacion-apirest`
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

</details>

<details>
<summary><h2>🌐 English</h2></summary>

**Conectando Corazones** is a non-profit digital platform that connects institutions in need —such as schools, hospitals and community kitchens— with individuals, organizations, and companies willing to help in Argentina.

It promotes solidarity, transparency, and traceability in every project, using secure, accessible and responsible digital tools.

## 🌍 Purpose

To facilitate the connection between those who want to help and those who need it most, by organizing social needs into visible, traceable and verifiable projects.  

Our goal is to maximize collective impact and build a trustworthy and sustainable collaboration network.

## 🔑 Key Features

- ✅ Official identity validation via government APIs (**[RENAPER](https://www.argentina.gob.ar/interior/renaper)** and **[ARCA](https://www.afip.gob.ar/landing/default.asp)**)
- 📄 Structured project posting by verified institutions
- 🤲 Collaboration proposals (donations, time or services)
- 💬 Secure chat enabled once collaboration is accepted
- 📸 Mandatory evidence upload to close projects transparently
- 📊 Personalized metrics dashboard
- 🧠 Smart recommendations based on user profile and history
- ♿ Inclusive and socially-oriented design

## 👥 User Types

- 🏫 **Institutions**  
  Schools, hospitals, food kitchens, foundations, and other verified entities

- 🤝 **Collaborators**  
  Individuals or organizations that want to donate, volunteer or offer services

- 🛠️ **System Administrators**  
  Moderators and maintainers in charge of verification, quality and metrics

## ⚙️ Technologies Used

Built with modern tools and a modular backend/frontend architecture:

### 🔸 Frontend
- Next.js  
- Tailwind CSS  
- Chart.js

### 🔹 Backend
- Node.js + Express.js  
- PostgreSQL  
- Firebase (chat, authentication, file storage)

### 🔧 External Services
- RENAPER + ARCA (identity verification)  
- SendGrid / Nodemailer (email notifications)  
- Vercel (frontend) and Render (backend + database)

> See `/frontend`, `/backend`, `/docs` and `/public` for structure.

## 📖 Documentation

Technical documentation is available in the [`/docs`](./docs) folder.  
Includes system architecture, database models, data flows, configuration and more — in English and Spanish.

## 📚 User Guides

Practical manuals and FAQs are available in the **[Project Wiki](../../wiki)**.

## 🚀 Contributing

**Conectando Corazones is open to community contributions!**  
You can help as a developer, designer, tester or technical reviewer.

### ✍️ How to contribute:

1. Fork the repository  
2. Clone your fork:  
   `git clone https://github.com/MVRU/Conectando-Corazones.git`
3. Install dependencies in `/frontend` and `/backend`
4. Create a branch:  
   `git checkout -b fix-api-validation`
5. Commit your changes and open a Pull Request

> See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for more details.

## 🛡️ Community and Policies

- 📜 [Code of Conduct](./.github/CODE_OF_CONDUCT.md) – Based on Contributor Covenant v2.1  
- 🔐 [Security Policy](./.github/SECURITY.md) – Responsible disclosure instructions  
- 🧾 [AGPL-3.0 License](./LICENSE) – Strong copyleft open source license

## 👨‍🎓 Credits

Developed as the final project of the **Information Systems Engineering** degree at the **Universidad Tecnológica Nacional – Facultad Regional Rosario (UTN FRRo).**

**Authors:**  
- Martín Tomás Álvarez  
- Marina Ana Milo  
- Alexis Julián Sklate

## 📬 Contact

For questions, collaboration proposals or technical reports, email us at:  
📩 **Crear un email...**

</details>
