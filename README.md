# Aplicación de Gestión de Identidades Digitales

Este proyecto proporciona una base para gestionar identidades digitales (sock puppets), facilitando el trabajo de analistas e investigadores.  
El código es completamente **open source**, para que pueda ser adaptado y extendido según tus necesidades.

---

## Instalación y Configuración

### **Requisitos previos**

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### **1. Clonar el repositorio**

```bash
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

---

### **2. Crear archivos `.env`**

#### En la raíz del proyecto:

Crea un archivo `.env` con las siguientes variables:

```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DATABASE_URL=postgresql://usuario_definido:contraseña@db:5432/nombre_base_datos
CORS_ORIGIN=*
```

#### En la carpeta `backend/`:

Crea otro archivo `.env` con los siguientes valores:

```env
SECRET_KEY=clave_segura
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
CORS_ORIGIN=http://localhost:3000
```

> Si cambias el puerto del frontend en el `docker-compose.yml`, recuerda actualizar `CORS_ORIGIN` con la nueva URL.

---

### **3. Construir y ejecutar los contenedores**

```bash
docker compose up --build
```

Esto levantará **3 contenedores**:

- `frontend`
- `api`
- `db`

---

### **4. Verificar la base de datos**

Para comprobar que la base de datos se ha creado correctamente:

```bash
psql -h localhost -p 5433 -U usuario
```

> Usa el usuario y contraseña definidos en el `.env` de la raíz del proyecto.

---

### **5. Acceder a la aplicación**

Abre tu navegador en:

```
http://localhost:3000
```

La primera vez, se te pedirá **crear un usuario**.  
Ese será el usuario principal con el que accederás a la aplicación.

> Si deseas cambiar el puerto, puedes hacerlo en el archivo `docker-compose.yml`.

---

## API — Rutas principales

Una vez en ejecución, puedes acceder a la documentación interactiva de la API en:

```
http://localhost:8000/docs#/
```

Haz clic en **Authorize** e introduce tus credenciales para autenticarte.  
A partir de ahí podrás usar los distintos endpoints para crear, listar, actualizar o eliminar entidades.

---

### **Entidades principales**

#### Géneros

| Método | Ruta                    | Descripción  |
| ------ | ----------------------- | ------------ |
| `POST` | `/api/v1/generos/crear` | Crear género |

#### Aficiones

| Método | Ruta                      | Descripción   |
| ------ | ------------------------- | ------------- |
| `POST` | `/api/v1/aficiones/crear` | Crear afición |

#### Redes Sociales

| Método   | Ruta                                     | Descripción           |
| -------- | ---------------------------------------- | --------------------- |
| `POST`   | `/api/v1/redes-sociales/crear`           | Crear red social      |
| `PUT`    | `/api/v1/redes-sociales/actualizar/{id}` | Actualizar red social |
| `DELETE` | `/api/v1/redes-sociales/eliminar/{id}`   | Eliminar red social   |

#### Estados

| Método   | Ruta                              | Descripción       |
| -------- | --------------------------------- | ----------------- |
| `POST`   | `/api/v1/estados/crear`           | Crear estado      |
| `GET`    | `/api/v1/estados/list`            | Listar estados    |
| `PUT`    | `/api/v1/estados/actualizar/{id}` | Actualizar estado |
| `DELETE` | `/api/v1/estados/eliminar/{id}`   | Eliminar estado   |

#### Orientaciones Sexuales

| Método | Ruta                               | Descripción                   |
| ------ | ---------------------------------- | ----------------------------- |
| `POST` | `/api/v1/orientacion_sexual/crear` | Crear orientación sexual      |
| `GET`  | `/api/v1/orientacion_sexual/list`  | Listar orientaciones sexuales |

#### Situaciones Sentimentales

| Método | Ruta                                      | Descripción                      |
| ------ | ----------------------------------------- | -------------------------------- |
| `POST` | `/api/v1/situaciones_sentimentales/crear` | Crear situación sentimental      |
| `GET`  | `/api/v1/situaciones_sentimentales/list`  | Listar situaciones sentimentales |

#### Orientaciones Políticas

| Método | Ruta                                 | Descripción                    |
| ------ | ------------------------------------ | ------------------------------ |
| `POST` | `/api/v1/orientacion_politica/crear` | Crear orientación política     |
| `GET`  | `/api/v1/orientacion_politica/list`  | Listar orientaciones políticas |

#### Países

| Método | Ruta                 | Descripción   |
| ------ | -------------------- | ------------- |
| `POST` | `/api/v1/pais/crear` | Crear país    |
| `GET`  | `/api/v1/pais/list`  | Listar países |

#### Nacionalidades

| Método | Ruta                         | Descripción           |
| ------ | ---------------------------- | --------------------- |
| `POST` | `/api/v1/nacionalidad/crear` | Crear nacionalidad    |
| `GET`  | `/api/v1/nacionalidad/list`  | Listar nacionalidades |

#### Identidad y Aficiones

| Método   | Ruta                                                               | Descripción                    |
| -------- | ------------------------------------------------------------------ | ------------------------------ |
| `POST`   | `/api/v1/identidad_aficiones/crear`                                | Añadir afición                 |
| `GET`    | `/api/v1/identidad_aficiones/listar/{id_identidad}`                | Listar aficiones por identidad |
| `DELETE` | `/api/v1/identidad_aficiones/eliminar/{id_identidad}/{id_aficion}` | Eliminar afición               |

---

## Estructura del Proyecto

### **Backend**

Desarrollado con **FastAPI**, sigue la siguiente estructura:

```
backend/
├── api/v1/               # Rutas y controladores
├── db/
│   ├── models/           # Modelos y relaciones de base de datos
├── schemas/              # Schemas de Pydantic (validación y serialización)
└── main.py               # Punto de entrada de la aplicación
```

### Estructura general

- **`api/v1/`**  
  Contiene las rutas principales del proyecto, organizadas por entidad.  
  Cada archivo define los endpoints y cómo interactúan con los modelos y la base de datos.

- **`db/models/`**  
  Aquí se definen las tablas de la base de datos y sus relaciones mediante **SQLAlchemy**.  
  Si deseas agregar un nuevo campo o tabla, deberás modificar los modelos aquí.

- **`schemas/`**  
  Contiene los **schemas de Pydantic**, que validan los datos de entrada y salida.  
  Actúan como un contrato entre el cliente y la API, asegurando que las peticiones tengan el formato correcto.

- **`main.py`**  
  Es el punto de entrada del backend.  
  Inicializa FastAPI, las rutas, la base de datos y la configuración CORS.

---

### **Frontend**

Dentro de la carpeta `frontend/src/` encontrarás:

```
src/
├── api/          # Interfaces y operaciones con la API
├── context/      # Contextos globales de React
├── layout/       # Componentes de layout
└── pages/        # Páginas de la aplicación
```

---

## Objetivo del Proyecto

El objetivo principal es ofrecer una base sólida para la **gestión de identidades digitales** y facilitar su personalización según cada entorno.  
Puedes extender las funcionalidades, modificar los modelos, o integrar nuevos servicios fácilmente.
