# HelpDesk - Sistema de Tickets de Soporte

Sistema completo de gestión de tickets (Help Desk) desarrollado con stack MERN, diseñado para proyectos de portafolio profesional.

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node](https://img.shields.io/badge/Node.js-v18+-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Roles de Usuario](#-roles-de-usuario)
- [Capturas de Pantalla](#-capturas-de-pantalla)

##  Características

### Gestión de Usuarios
- Registro e inicio de sesión con JWT
- Tres roles de usuario: **Usuario**, **Agente**, **Admin**
- Autenticación y autorización por roles
- Gestión de usuarios (solo Admin)
- Cambio de contraseña y actualización de perfil

### Gestión de Tickets
- Crear tickets con asunto, descripción y prioridad
- Estados: Abierto, En Progreso, Resuelto, Cerrado
- Prioridades: Baja, Media, Alta
- Asignación de tickets a agentes
- Sistema de comentarios en tickets
- Filtros por estado y prioridad
- Historial de cambios de estado

### Seguridad
- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Rate limiting para prevenir ataques
- Validación y sanitización de datos
- Helmet para headers HTTP seguros

### UI/UX
- Diseño responsive (móvil y escritorio)
- Interfaz moderna y limpia
- React desde CDN (sin build)
- Iconos de Font Awesome
- Notificaciones visuales

## Stack Tecnológico

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

### Frontend
- **React 18** (desde CDN)
- **Axios** - Cliente HTTP
- **Babel Standalone** - Transpilar JSX
- **Font Awesome** - Iconos

### Seguridad
- **Helmet** - Seguridad HTTP
- **express-rate-limit** - Limitar peticiones
- **express-validator** - Validación de datos
- **CORS** - Control de acceso

## Requisitos Previos

- **Node.js** v14 o superior
- **MongoDB Atlas** (cuenta gratuita)
- **npm** o **yarn**
- Navegador web moderno

##  Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/FxxMorgan/MERN-HelpDesk-System.git
cd HelpDesk
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/helpdesk?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_secret_key_super_seguro_cambiar_en_produccion
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5000
```

**IMPORTANTE:** 
- Genera un JWT_SECRET seguro con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Reemplaza `MONGODB_URI` con tu conexión de MongoDB Atlas

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## Configuración

### MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster (tier gratuito)
3. Crear un usuario de base de datos
4. Agregar tu IP a la whitelist (o usar 0.0.0.0/0 para desarrollo)
5. Copiar la cadena de conexión y agregarla al `.env`

### Generar JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Uso

### Primer Usuario Admin

Para crear el primer usuario administrador, puedes:

1. **Registrarse normalmente** y luego actualizar el rol en MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "tu@email.com" },
     { $set: { rol: "admin" } }
   )
   ```

2. **Usar MongoDB Compass** para cambiar el campo `rol` a `"admin"`

### Credenciales de Prueba

Una vez creado el primer admin, puede crear usuarios de prueba:
- **Admin**: Gestiona usuarios y tickets
- **Agente**: Gestiona tickets, asigna y cambia estados
- **Usuario**: Crea y comenta sus propios tickets

## Estructura del Proyecto

```
HelpDesk/
├── config/
│   └── database.js          # Configuración MongoDB
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── ticketController.js  # Lógica de tickets
│   └── userController.js    # Lógica de usuarios
├── middleware/
│   └── auth.js              # Middleware de autenticación
├── models/
│   ├── User.js              # Modelo de usuario
│   └── Ticket.js            # Modelo de ticket
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── ticketRoutes.js      # Rutas de tickets
│   └── userRoutes.js        # Rutas de usuarios
├── public/
│   ├── css/
│   │   └── styles.css       # Estilos CSS
│   ├── js/
│   │   ├── components/      # Componentes React
│   │   ├── utils/           # Utilidades (API, Auth)
│   │   └── App.js           # Componente principal
│   └── index.html           # HTML base
├── utils/
│   └── jwt.js               # Utilidades JWT
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── server.js                # Entrada del servidor
└── README.md
```

##  API Endpoints

### Autenticación

```
POST   /api/auth/registro        # Registrar usuario
POST   /api/auth/login           # Iniciar sesión
GET    /api/auth/me              # Obtener usuario actual
PUT    /api/auth/actualizar-perfil # Actualizar perfil
PUT    /api/auth/cambiar-password  # Cambiar contraseña
```

### Tickets

```
GET    /api/tickets              # Obtener tickets (según rol)
POST   /api/tickets              # Crear ticket
GET    /api/tickets/mis-tickets  # Mis tickets
GET    /api/tickets/:id          # Obtener ticket por ID
PUT    /api/tickets/:id/asignar  # Asignar ticket (Agente/Admin)
PUT    /api/tickets/:id/estado   # Cambiar estado (Agente/Admin)
POST   /api/tickets/:id/comentarios # Agregar comentario
DELETE /api/tickets/:id          # Eliminar ticket (Admin)
```

### Usuarios (Solo Admin)

```
GET    /api/users                # Obtener todos los usuarios
GET    /api/users/:id            # Obtener usuario por ID
POST   /api/users                # Crear usuario
PUT    /api/users/:id            # Actualizar usuario
DELETE /api/users/:id            # Eliminar usuario
GET    /api/users/agentes        # Obtener agentes (Agente/Admin)
```

## Roles de Usuario

###  Usuario (Cliente)
- Crear nuevos tickets
- Ver solo sus propios tickets
- Comentar en sus tickets
- Actualizar su perfil

###  Agente (Soporte)
- Todo lo del Usuario
- Ver todos los tickets del sistema
- Asignarse tickets
- Cambiar estado de tickets
- Comentar en cualquier ticket

###  Admin (Administrador)
- Todo lo del Agente
- Gestionar usuarios (crear, editar, eliminar)
- Cambiar roles de usuarios
- Activar/desactivar usuarios
- Eliminar tickets

## Capturas de Pantalla

### Login
![Login](docs/login.png)

### Dashboard Usuario
![Dashboard Usuario](docs/dashboard-usuario.png)

### Dashboard Agente
![Dashboard Agente](docs/dashboard-agente.png)

### Dashboard Admin
![Dashboard Admin](docs/dashboard-admin.png)

### Dashboard Admin
![Dashboard Admin](docs/dashboard-adminticket.png)

### Detalle de Ticket
![Detalle Ticket](docs/ticket-detalle.png)

## 🔧 Desarrollo

### Comandos disponibles

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

### Testing

Para probar la API, puedes usar:
- **Postman** - Importar colección
- **Thunder Client** (VS Code)
- **cURL**

Ejemplo con cURL:
```bash
# Registro
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","email":"test@test.com","password":"123456"}'
```

## 🚀 Despliegue

### Heroku

```bash
heroku create mi-helpdesk
heroku config:set MONGODB_URI=<tu_uri>
heroku config:set JWT_SECRET=<tu_secret>
git push heroku main
```

### Render / Railway

1. Conectar repositorio
2. Configurar variables de entorno
3. Desplegar

### Variables de entorno necesarias
```
MONGODB_URI
JWT_SECRET
JWT_EXPIRE
NODE_ENV=production
PORT (automático en la mayoría de plataformas)
```

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

##  Autor

**FxxMorgan**

## Contribuciones

Las contribuciones son bienvenidas :

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Soporte

Si tienes preguntas o problemas, abre un [issue](https://github.com/tu-usuario/helpdesk/issues).

## Agradecimientos

- MongoDB Atlas por la base de datos gratuita
- React por el framework frontend
- Express.js por el framework backend
- Font Awesome por los iconos

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub
