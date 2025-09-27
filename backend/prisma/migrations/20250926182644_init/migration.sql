-- CreateTable
CREATE TABLE "provincias" (
    "id_provincia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombre_corto" TEXT,
    "codigo_iso" TEXT
);

-- CreateTable
CREATE TABLE "localidades" (
    "id_localidad" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigo_postal" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_provincia" INTEGER NOT NULL,
    CONSTRAINT "localidades_id_provincia_fkey" FOREIGN KEY ("id_provincia") REFERENCES "provincias" ("id_provincia") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id_direccion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "piso" TEXT,
    "departamento" TEXT,
    "referencia" TEXT,
    "url_google_maps" TEXT,
    "localidad_id" INTEGER NOT NULL,
    CONSTRAINT "direcciones_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "localidades" ("id_localidad") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" DATETIME,
    "estado" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL,
    "estado_verificacion" TEXT,
    "direccion_id" INTEGER,
    "nombre_legal" TEXT,
    "tipo_institucion" TEXT,
    "tipo_colaborador" TEXT,
    "razon_social" TEXT,
    "con_fines_de_lucro" BOOLEAN,
    CONSTRAINT "usuarios_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direcciones" ("id_direccion") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contactos" (
    "id_contacto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo_contacto" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "etiqueta" TEXT,
    "usuario_id" INTEGER NOT NULL,
    CONSTRAINT "contactos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "consentimientos" (
    "id_consentimiento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    CONSTRAINT "consentimientos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "archivos" (
    "id_archivo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo_mime" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" DATETIME,
    "usuario_id" INTEGER,
    "evidencia_id" INTEGER,
    CONSTRAINT "archivos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "archivos_evidencia_id_fkey" FOREIGN KEY ("evidencia_id") REFERENCES "evidencias" ("id_evidencia") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "estados" (
    "id_estado" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tipos_participacion" (
    "id_tipo_participacion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id_ubicacion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo_ubicacion" TEXT NOT NULL,
    "que_se_hace" TEXT NOT NULL,
    "direccion_id" INTEGER NOT NULL,
    CONSTRAINT "ubicaciones_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direcciones" ("id_direccion") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id_proyecto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url_portada" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre_postulaciones" DATETIME,
    "fecha_fin_tentativa" DATETIME NOT NULL,
    "beneficiarios" INTEGER,
    "id_chat_firebase" INTEGER,
    "estado_id" INTEGER NOT NULL,
    "institucion_id" INTEGER NOT NULL,
    CONSTRAINT "proyectos_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados" ("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "proyectos_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "participaciones_permitidas" (
    "id_participacion_permitida" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_proyecto" INTEGER NOT NULL,
    "id_tipo_participacion" INTEGER NOT NULL,
    "objetivo" INTEGER NOT NULL,
    "actual" INTEGER,
    "unidad_medida" TEXT,
    "especie" TEXT,
    CONSTRAINT "participaciones_permitidas_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyectos" ("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "participaciones_permitidas_id_tipo_participacion_fkey" FOREIGN KEY ("id_tipo_participacion") REFERENCES "tipos_participacion" ("id_tipo_participacion") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "proyecto_categorias" (
    "id_proyecto" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,

    PRIMARY KEY ("id_proyecto", "id_categoria"),
    CONSTRAINT "proyecto_categorias_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyectos" ("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "proyecto_categorias_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias" ("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "proyecto_ubicaciones" (
    "id_proyecto_ubicacion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proyecto_id" INTEGER NOT NULL,
    "ubicacion_id" INTEGER NOT NULL,
    CONSTRAINT "proyecto_ubicaciones_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos" ("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "proyecto_ubicaciones_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones" ("id_ubicacion") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "colaboraciones" (
    "id_colaboracion" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL,
    "justificacion" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensaje" TEXT,
    "proyecto_id" INTEGER NOT NULL,
    "colaborador_id" INTEGER NOT NULL,
    CONSTRAINT "colaboraciones_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos" ("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "colaboraciones_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evidencias" (
    "id_evidencia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proyecto_id" INTEGER,
    CONSTRAINT "evidencias_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos" ("id_proyecto") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "solicitudes_finalizacion" (
    "id_solicitud" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proyecto_id" INTEGER NOT NULL,
    CONSTRAINT "solicitudes_finalizacion_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos" ("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "solicitud_finalizacion_evidencias" (
    "id_solicitud" INTEGER NOT NULL,
    "id_evidencia" INTEGER NOT NULL,

    PRIMARY KEY ("id_solicitud", "id_evidencia"),
    CONSTRAINT "solicitud_finalizacion_evidencias_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitudes_finalizacion" ("id_solicitud") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "solicitud_finalizacion_evidencias_id_evidencia_fkey" FOREIGN KEY ("id_evidencia") REFERENCES "evidencias" ("id_evidencia") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "estados_descripcion_key" ON "estados"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_descripcion_key" ON "categorias"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_participacion_descripcion_key" ON "tipos_participacion"("descripcion");
