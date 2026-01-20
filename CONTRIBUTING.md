![Conectando Corazones – Plataforma solidaria](./public/img/banner.png)

<h1 align="center">🤝 Contributing to Conectando Corazones</h1>

<details open>
<summary><h2>🇪🇸 Español</h2></summary>

Gracias por tu interés en colaborar con este proyecto. ¡Toda ayuda suma!

## 💡 ¿Cómo podés colaborar?

- 🐛 Reportando errores o bugs
- 📚 Mejorando la documentación
- 🎨 Proponiendo mejoras en diseño o usabilidad
- 🧪 Escribiendo pruebas (tests)
- 🚀 Añadiendo nuevas funcionalidades
- 🤝 Participando en las discusiones de issues o propuestas

## ⚙️ Requisitos básicos

**Antes de contribuir, por favor:**

1. Leé nuestro [Código de Conducta](./.github/CODE_OF_CONDUCT.md)  
2. Revisá los issues abiertos o proponé uno nuevo  
3. Seguí el formato de rama: `tipo-descripcion` (por ejemplo: `fix-login-error`, `feat-dashboard-kpis`)  
4. Asegurate de que tu código esté limpio y bien documentado  
5. Escribí tests si corresponde

## 🛠️ Instalación local (para desarrollo)

```bash
git clone https://github.com/MVRU/Conectando-Corazones.git
cd Conectando-Corazones
````

```bash
# Entrar a la carpeta de la aplicación (Monorepo)
cd app

# Instalar dependencias
npm install
```

Configurá el archivo `.env` (ver `.env.example` en cada carpeta).
Usá `npm run dev` para iniciar los servidores de frontend y backend en desarrollo.

## 📥 Cómo hacer un Pull Request

1. Forkeá este repositorio
2. Creá una rama desde `main`:
   `git checkout -b fix-nombre-error`
3. Hacé tus cambios y commiteá con un mensaje claro
4. Hacé push a tu rama:
   `git push origin fix-nombre-error`
5. Abrí un Pull Request (PR) desde GitHub
6. Esperá feedback y/o aprobación del equipo

## 📦 Estilo de código

* Usamos **JavaScript / TypeScript**, con preferencia por buenas prácticas funcionales y modulares
* Utilizá **nombres descriptivos**, comentarios solo cuando aporten valor
* El código debe pasar linters y pruebas antes de integrarse a producción
* Respeto por la arquitectura en capas: `controllers`, `services`, `repositories`, etc.

## 🙌 Gracias

Este es un proyecto académico con impacto social real.
Tu contribución es valiosa y ayuda a construir una plataforma solidaria, segura y transparente.

</details>

<details>
<summary><h2>🌐 English</h2></summary>

Thank you for your interest in contributing to this project!

## 💡 How You Can Contribute

* 🐛 Reporting bugs
* 📚 Improving documentation
* 🎨 Enhancing UI/UX or accessibility
* 🧪 Writing tests
* 🚀 Adding new features
* 🤝 Participating in issue discussions


## ⚙️ Before You Start

**Please:**

1. Read our [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
2. Check open issues or propose a new one
3. Use descriptive branch names like: `fix-login-error`, `feat-dashboard-kpis`
4. Keep your code clean and well-documented
5. Add tests when applicable

## 🛠️ Local Setup (for development)

```bash
git clone https://github.com/MVRU/Conectando-Corazones.git
cd Conectando-Corazones
```

Install dependencies:

```bash
cd app
npm install
```

Create your `.env` file based on `.env.example` in each folder.
Run both servers with `npm run dev` for development mode.

## 📥 Pull Request Guidelines

1. Fork this repository
2. Create a branch from `main`:
   `git checkout -b fix-login-error`
3. Commit your changes with a clear message
4. Push your branch:
   `git push origin fix-login-error`
5. Open a Pull Request (PR) on GitHub
6. Wait for review and approval

## 📦 Code Style

* We use **JavaScript / TypeScript**, following modular and layered architecture
* Use **clear and meaningful names**, comment only when necessary
* Code should pass linters and tests before merging
* Respect the separation into `controllers`, `services`, `repositories`, etc.

## 🙌 Thank You

This is an academic project with a real social impact.
Your contribution helps us build a trustworthy, accessible and community-driven platform.
</details>