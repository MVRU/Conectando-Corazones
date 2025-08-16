<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/ Español-0ea5e9?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://translate.google.com/translate?sl=es&tl=en&u=https://github.com/MVRU/Conectando-Corazones"><img src="https://img.shields.io/badge/English-e63946?style=for-the-badge&logo=google-translate" /></a>
</p>


<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1e293b,100:3b82f6&height=180&section=header&text=Conectando%20Corazones&fontSize=42&fontColor=ffffff&animation=twinkling&fontAlignY=35" />
</p>

<p align="center">
  <em>❤️ Plataforma solidaria, transparente y trazable</em><br/>
  <sub>Conectamos instituciones que necesitan ayuda con personas y organizaciones dispuestas a brindarla.</sub>
</p>


<p align="center">
 <a href="https://conectando-corazones.vercel.app/"><img src="https://img.shields.io/badge/App en vivo-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" /></a>
  <a href="https://mvru.github.io/Conectando-Corazones/"><img src="https://img.shields.io/badge/Documentación-10b981?style=for-the-badge&logo=docusaurus&logoColor=white" /></a>

</p>

<p align="center">
  <a href="https://github.com/MVRU/Conectando-Corazones/issues">
    <img src="https://img.shields.io/badge/Reportar problema-red?style=for-the-badge&logo=github" />
  </a>
</p>


---

## ✨ Highlights

<p align="center">
  <img src="https://img.shields.io/github/stars/MVRU/Conectando-Corazones?color=yellow&style=for-the-badge" />
  <img src="https://img.shields.io/github/contributors/MVRU/Conectando-Corazones?color=green&style=for-the-badge" />
  <img src="https://img.shields.io/github/last-commit/MVRU/Conectando-Corazones?style=for-the-badge&color=blue"/>
  <img src="https://img.shields.io/github/issues/MVRU/Conectando-Corazones?style=for-the-badge&color=red"/>
  <img src="https://img.shields.io/github/license/MVRU/Conectando-Corazones?color=purple&style=for-the-badge" />
</p>

---

## 🍁 Introducción

**Conectando Corazones** es una plataforma digital sin fines de lucro que vincula a instituciones que necesitan ayuda —como escuelas, hospitales y comedores— con personas, ONGs y empresas dispuestas a brindarla en Argentina.

---

## 🎯 Propósito

> **Facilitar la ayuda con trazabilidad total.**  
> Cada proyecto tiene evidencias verificables para garantizar confianza entre instituciones, colaboradores y comunidad.

---

## 🚀 Funcionalidades

<div align="center">

| Característica             | Descripción                                                    |
| -------------------------- | -------------------------------------------------------------- |
| ✅ Registro verificado      | Email institucional, revisión documental, RENAPER (*post-MVP*) |
| 📄 Publicación de proyectos | Solo por instituciones verificadas                             |
| 🤝 Colaboraciones           | Personas, ONGs, empresas                                       |
| 💬 Chat seguro              | Habilitado tras aceptación                                     |
| 📸 Evidencias               | Cierre obligatorio con fotos/documentos                        |
| 📊 Dashboard                | Métricas, seguimiento y recomendaciones                        |
| 💞 Accesibilidad            | Diseño inclusivo y ético                                       |

</div>

> ⚖️ **Aviso legal**: no procesamos pagos, no actuamos como escrow, no garantizamos legitimidad absoluta. La plataforma provee trazabilidad para control ciudadano.

---

## 👥 Usuarios

<div align="center">

| Rol                   | Permisos                                                      | Ejemplos                        |
| --------------------- | ------------------------------------------------------------- | ------------------------------- |
| **🏫 Instituciones**   | Publicar proyectos, gestionar colaboradores, subir evidencias | Escuelas, comedores, hospitales |
| **🤲 Colaboradores**   | Postularse, enviar recursos, participar en chats              | Voluntarios, empresas, ONGs     |
| **🛡️ Administradores** | Verificar cuentas, moderar contenido, auditar proyectos       | Equipo técnico y ético          |

</div>


### Cómo funciona (en 6 pasos)

```mermaid
flowchart LR
  A[Institución publica necesidad] --> B[Define objetivos]
  B --> C[Colaboradores exploran y se postulan]
  C --> D[Institución acepta propuestas]
  D --> E[Chat grupal para coordinar]
  E --> F[Evidencias + Cierre con impacto]

```

---

## 💻 Stack Tecnológico

<div align="center">

<table>
  <tr>
    <td align="center" width="33%">
      <h3>Frontend</h3>
      <img src="https://skillicons.dev/icons?i=svelte,ts,tailwind" alt="Svelte, TypeScript, Tailwind" />
    </td>
    <td align="center" width="33%">
      <h3>Backend</h3>
      <img src="https://skillicons.dev/icons?i=nodejs,express,ts,prisma,postgres" alt="Node.js, Express, Prisma, PostgreSQL" />
    </td>
    <td align="center" width="33%">
      <h3>Infraestructura</h3>
      <img src="https://skillicons.dev/icons?i=vercel,firebase" alt="Vercel, Firebase" />
    </td>
  </tr>
</table>

</div>

---

## 📖 Documentación

<p align="center">
  <a href="https://mvru.github.io/Conectando-Corazones/">
    <img src="https://img.shields.io/badge/Docusaurus-3ECC5F?logo=docusaurus&logoColor=white&style=for-the-badge" />
  </a>
</p>

<div align="center">

| Sección         | Contenido                                   |
| --------------- | ------------------------------------------- |
| 📘 Guía Usuarios | Cómo publicar, colaborar y subir evidencias |
| 🤝 Guía Devs     | Diagramas, ADRs y decisones técnicas        |
| 🔐 Marco Legal   | Datos y políticas de privacidad             |

</div>

---

## 📂 Estructura del Repositorio

```plaintext
📦 Conectando-Corazones
├── 🟦 frontend/       → SvelteKit + TailwindCSS
├── ⬛ backend/         → Express + Prisma + PostgreSQL
├── 🟨 docs-site/       → Documentación con Docusaurus
├── 📂 .github/         → Workflows, issues, CODE_OF_CONDUCT
├── 📄 CONTRIBUTING.md  → Guía de contribución
├── 📄 LICENSE          → AGPL-3.0
└── 📄 SECURITY.md      → Política de seguridad
```

---

## 🤝 Contribuir

<p align="center">
  <img src="https://contrib.rocks/image?repo=MVRU/Conectando-Corazones" alt="Contribuidores" />
</p>

### 🛠️ Comenzá así:

```bash
# 1. Clonar el repositorio
git clone https://github.com/MVRU/Conectando-Corazones.git

# 2. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# 3. Crear una rama
git checkout -b feature/descripcion-clara
```

> 👉 **Guía completa** → [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## 🛡️ Comunidad y Seguridad

- 📜 [Código de Conducta](./.github/CODE_OF_CONDUCT.md)  
- 🔐 [Política de Seguridad](./.github/SECURITY.md)  
- 🧾 [Licencia AGPL-3.0](./LICENSE)

### 🔒 Datos y privacidad

<div align="center">

| Política            | Acciones                                                     |
| ------------------- | ------------------------------------------------------------ |
| **Privacidad**      | Datos mínimos, cifrado en Firebase, eliminación de metadatos |
| **Acceso**          | Restringido a roles autorizados                              |
| **Responsabilidad** | Control total del usuario sobre su información               |
| **Ética**           | Difuminado de rostros, protección de menores                 |

</div>

---

## 🎓 Créditos

Proyecto desarrollado como trabajo final de **Ingeniería en Sistemas de Información** – **UTN FRRo**.

<div align="center">

|                     Alexis Julián Sklate                      |                   Marina Ana Milo                    |                     Martín Tomás Álvarez                      |
| :-----------------------------------------------------------: | :--------------------------------------------------: | :-----------------------------------------------------------: |
| <img src="https://github.com/AleSklate0807.png" width="80" /> | <img src="https://github.com/MVRU.png" width="80" /> | <img src="https://github.com/TomasAlvarez0.png" width="80" /> |
|      [@AleSklate0807](https://github.com/AleSklate0807)       |           [@MVRU](https://github.com/MVRU)           |      [@TomasAlvarez0](https://github.com/TomasAlvarez0)       |

</div>

---

## 📬 Contacto

<p align="center">
  <a href="https://github.com/MVRU/Conectando-Corazones/issues"><img src="https://img.shields.io/badge/Reportar%20Bug-f59e0b?style=for-the-badge&logo=github" /></a>
  <a href="https://github.com/MVRU/Conectando-Corazones/discussions"><img src="https://img.shields.io/badge/Discutir-3b82f6?style=for-the-badge&logo=github" /></a>
  <a href="mailto:conectando.corazones.contacto@gmail.com"><img src="https://img.shields.io/badge/Email-ef4444?style=for-the-badge&logo=gmail" /></a>
</p>

---

<div align="center">
  <sub>❤️ Hecho con propósito, código limpio y mucho corazón.</sub>
</div>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1e293b,100:3b82f6&height=120&section=footer"/>
</p>