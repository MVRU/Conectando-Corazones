# Modelo de Datos

```mermaid
erDiagram
  Usuario ||--|| CuentaFirebase : tiene
  Usuario ||--o{ Proyecto : publica
  Usuario ||--o{ Postulacion : realiza
  Usuario ||--o{ Validacion : posee
  Usuario }o--|| Rol : pertenece
  Usuario }o--o{ ProyectoFavorito : guarda

  Rol ||--o{ Permiso : contiene
  Proyecto ||--o{ Postulacion : recibe
  Proyecto ||--o{ Archivo : incluye
  Proyecto ||--|| EstadoProyecto : estado_actual
  Proyecto ||--o{ ProyectoTag : clasifica
  Proyecto ||--o{ HistorialEstado : cambia
  Proyecto }o--o{ ColaboradorAprobado : aprueba
  Proyecto ||--|| Institucion : pertenece

  Institucion ||--|| Localidad : ubica
  Institucion }o--|| DocumentoLegal : registra
  Proyecto }o--o{ Chat : habilita

  Chat ||--o{ Mensaje : contiene
  Postulacion ||--o{ EvaluacionColaborador : responde
  Proyecto ||--o{ EvidenciaCierre : justifica
  Archivo ||--|| TipoArchivo : clasifica
  ProyectoTag ||--|| Tag : refiere

  Validacion ||--|| TipoValidacion : usa
  Validacion ||--|| ResultadoValidacion : genera

  Usuario {
    string id PK
    string nombre
    string email UNIQUE
    string cuil_cuit UNIQUE
    string telefono
    string direccion
    date fecha_registro
    boolean activo
    boolean verificado
  }

  CuentaFirebase {
    string id PK
    string usuario_id FK
    string uid_firebase UNIQUE
    string refresh_token
  }

  Rol {
    string id PK
    string nombre
    string descripcion
  }

  Proyecto {
    string id PK
    string titulo
    text descripcion
    string tipo_ayuda
    string institucion_id FK
    date fecha_publicacion
    boolean cerrado
  }

  Postulacion {
    string id PK
    string usuario_id FK
    string proyecto_id FK
    date fecha_postulacion
    string mensaje
    string estado
  }

  Validacion {
    string id PK
    string usuario_id FK
    string tipo_validacion_id FK
    string resultado_id FK
    date fecha_validacion
  }

  Archivo {
    string id PK
    string proyecto_id FK
    string nombre_archivo
    string url
    string tipo_archivo_id FK
    date fecha_carga
  }

  Chat {
    string id PK
    string proyecto_id FK
    boolean activo
    date creado_en
  }

  Mensaje {
    string id PK
    string chat_id FK
    string remitente_id FK
    text contenido
    date fecha_envio
    boolean leido
  }

  EvidenciaCierre {
    string id PK
    string proyecto_id FK
    string url_archivo
    string descripcion
    date fecha_envio
  }

  HistorialEstado {
    string id PK
    string proyecto_id FK
    string estado_anterior
    string estado_nuevo
    date fecha_cambio
    string motivo
  }

  ProyectoFavorito {
    string usuario_id FK
    string proyecto_id FK
  }

  ProyectoTag {
    string proyecto_id FK
    string tag_id FK
  }

  ColaboradorAprobado {
    string proyecto_id FK
    string usuario_id FK
    date fecha_aprobacion
  }

  Institucion {
    string id PK
    string nombre
    string razon_social
    string cuit UNIQUE
    string email
    string telefono
    string direccion
    string localidad_id FK
    boolean activa
  }

  Localidad {
    string id PK
    string nombre
    string provincia
  }

  DocumentoLegal {
    string id PK
    string institucion_id FK
    string tipo
    string url
    date fecha_subida
  }

  Tag {
    string id PK
    string nombre
  }

  TipoArchivo {
    string id PK
    string nombre
    string descripcion
  }

  TipoValidacion {
    string id PK
    string nombre
    string descripcion
  }

  ResultadoValidacion {
    string id PK
    string descripcion
    boolean aprobado
  }

```