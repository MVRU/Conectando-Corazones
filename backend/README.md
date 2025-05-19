<!-- Agregar estructura de carpetas, scripts, variables de entorno, configuración avanzada, tests, deploy, etc. -->

# 🧠 Backend – Conectando Corazones

Este directorio contiene el código fuente del backend del proyecto **Conectando Corazones**.

<details open>
<summary><h2>🇪🇸 Español</h2></summary>

## ✅ Requisitos previos

Antes de comenzar, asegurate de tener instalado lo siguiente:

| Software                                             | Requerido     | Enlace oficial                   |
| ---------------------------------------------------- | ------------- | -------------------------------- |
| [Git](https://git-scm.com/)                          | ✅ Sí          | https://git-scm.com/download/win |
| [Node.js](https://nodejs.org/es/) (LTS)              | ✅ Sí          | https://nodejs.org/es/           |
| [npm](https://www.npmjs.com/)                        | ✅ Sí          | Viene incluido con Node.js       |
| [Visual Studio Code](https://code.visualstudio.com/) | 🔄 Recomendado | https://code.visualstudio.com/   |

## 🛠️ Instalación y ejecución del backend

### 1. Clonar el repositorio

```bash
git clone https://github.com/MVRU/Conectando-Corazones.git
cd Conectando-Corazones/backend
````

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear el archivo `.env`

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

Completar con las variables necesarias (base de datos, Firebase, claves de API externas, etc.).

## 🚀 Ejecutar el servidor en modo desarrollo

```bash
npm run dev
```

El backend debería iniciar en:
👉 `http://localhost:3000`

## 📂 Estructura principal del proyecto

```plaintext
backend/
├── src/
│   ├── controllers/     # Lógica de control por entidad
│   ├── routes/          # Endpoints de la API
│   ├── services/        # Lógica de negocio
│   ├── repositories/    # Acceso a datos con Prisma
│   ├── firebase/        # Inicialización de Firebase
│   ├── config/          # Configuración de entorno y CORS
│   ├── middlewares/     # Middleware de errores y autenticación
│   └── __tests__/       # Pruebas unitarias, de integración y E2E
│   └── index.ts         # Punto de entrada del servidor
├── prisma/              # Esquema y migraciones de base de datos
├── .env.example         # Variables de entorno requeridas
└── README.md            # Documentación del backend
```

## 🧪 Scripts útiles

```bash
npm run dev       # Ejecutar servidor en modo desarrollo
npm run build     # Transpilar el proyecto a JavaScript (outDir: dist/)
npm start         # Ejecutar build en producción
npm test          # Ejecutar pruebas unitarias con Vitest
```

## 💡 Consejos

* Usá [Prisma Studio](https://www.prisma.io/studio) para explorar la base de datos visualmente:

  ```bash
  npx prisma studio
  ```

* El backend está preparado para integrarse con:

  * Firebase (auth, storage, notificaciones)
  * PostgreSQL (vía Prisma)
  * APIs externas (RENAPER, ARCA, SendGrid)

</details>

<details>
<summary><h2>🌐 English</h2></summary>

## ✅ Requirements

Make sure you have the following software installed:

| Software                                             | Required      | Official link                                                        |
| ---------------------------------------------------- | ------------- | -------------------------------------------------------------------- |
| [Git](https://git-scm.com/)                          | ✅ Yes         | [https://git-scm.com/download/win](https://git-scm.com/download/win) |
| [Node.js](https://nodejs.org/en/) (LTS)              | ✅ Yes         | [https://nodejs.org/en/](https://nodejs.org/en/)                     |
| [npm](https://www.npmjs.com/)                        | ✅ Yes         | Included with Node.js                                                |
| [Visual Studio Code](https://code.visualstudio.com/) | 🔄 Recommended | [https://code.visualstudio.com/](https://code.visualstudio.com/)     |

## 🛠️ Install and run the backend

### 1. Clone the repository

```bash
git clone https://github.com/MVRU/Conectando-Corazones.git
cd Conectando-Corazones/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Copy the example file:

```bash
cp .env.example .env
```

Fill in the required environment variables (database, Firebase, APIs, etc.).

## 🚀 Start the development server

```bash
npm run dev
```

The backend should run at:
👉 `http://localhost:3000`

## 📂 Project structure

```plaintext
backend/
├── src/
│   ├── controllers/     # Logic by entity
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── repositories/    # Data access via Prisma
│   ├── firebase/        # Firebase setup
│   ├── config/          # Environment & CORS config
│   ├── middlewares/     # Error and auth middleware
│   └── __tests__/       # Unit, integration, and E2E tests
│   └── index.ts         # App entry point
├── prisma/              # DB schema and migrations
├── .env.example         # Required environment variables
└── README.md            # Backend documentation
```

## 🧪 Useful scripts

```bash
npm run dev       # Run dev server with ts-node
npm run build     # Compile to JavaScript (output to dist/)
npm start         # Run the production build
npm test          # Run unit tests with Vitest
```

## 💡 Tips

* Use [Prisma Studio](https://www.prisma.io/studio) to visualize the DB:

  ```bash
  npx prisma studio
  ```

* This backend is ready to integrate with:

  * Firebase (auth, storage, notifications)
  * PostgreSQL (via Prisma)
  * External APIs (RENAPER, ARCA, SendGrid)

</details>
```