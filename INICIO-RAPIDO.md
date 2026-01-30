#  Guía de Inicio Rápido - HelpDesk

##  En 5 minutos tendrás el sistema funcionando

###  Pre-requisitos
- Node.js instalado (v14+)
- Navegador web moderno
- Cuenta en MongoDB Atlas (gratis)

---

##  Paso a Paso

### 1. Instalar Dependencias (1 min)

```bash
npm install
```

**Espera a que se instalen todas las dependencias...**

---

### 2. Configurar MongoDB Atlas (2 min)

#### A. Crear cuenta y cluster
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster (tier gratuito M0)

#### B. Configurar acceso
1. **Database Access**: Crea un usuario
   - Username: `helpdesk`
   - Password: `helpdesk123` (o la que prefieras)
   - Rol: `Atlas admin`

2. **Network Access**: Agrega IP
   - Clic en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirma

#### C. Obtener URI de conexión
1. Clic en "Connect" en tu cluster
2. Selecciona "Connect your application"
3. Copia la URI (similar a):
   ```
   mongodb+srv://helpdesk:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
4. Reemplaza `<password>` con tu contraseña
5. Agrega `/helpdesk` después de `.net/`:
   ```
   mongodb+srv://helpdesk:helpdesk123@cluster.mongodb.net/helpdesk?retryWrites=true&w=majority
   ```

---

### 3. Generar JWT Secret (30 seg)

```bash
node generate-secret.js
```

**Copia el secret generado**

---

### 4. Configurar .env (30 seg)

Abre el archivo `.env` y actualiza:

```env
PORT=5000
NODE_ENV=development

# PEGA AQUÍ tu URI de MongoDB Atlas
MONGODB_URI=mongodb+srv://helpdesk:helpdesk123@cluster.mongodb.net/helpdesk?retryWrites=true&w=majority

# PEGA AQUÍ el secret generado
JWT_SECRET=tu_secret_super_largo_generado_anteriormente

JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5000
```

**Guarda el archivo**

---

### 5. Iniciar Servidor (10 seg)

```bash
npm run dev
```

Deberías ver:
```
Conectado a MongoDB Atlas
Servidor corriendo en puerto 5000
API disponible en: http://localhost:5000/api
Frontend en: http://localhost:5000
```

---

### 6. Acceder al Sistema (10 seg)

1. Abre tu navegador
2. Ve a: http://localhost:5000
3. Verás la pantalla de login

---

### 7. Crear Primera Cuenta (1 min)

1. Clic en "Regístrate aquí"
2. Completa el formulario:
   - Nombre: `Admin User`
   - Email: `admin@test.com`
   - Password: `123456`
   - Confirmar Password: `123456`
3. Clic en "Crear Cuenta"

**¡Ya estás dentro! Pero eres un usuario normal...**

---

### 8. Convertir en Admin (1 min)

Para tener acceso completo, necesitas convertirte en admin.

#### Opción A: MongoDB Compass (Recomendado)
1. Descarga MongoDB Compass: https://www.mongodb.com/products/compass
2. Conecta con tu URI de MongoDB
3. Ve a base de datos `helpdesk` → colección `users`
4. Encuentra tu usuario (admin@test.com)
5. Edita el campo `rol` y cámbialo a `"admin"`
6. Guarda

#### Opción B: MongoDB Atlas Web
1. Ve a tu cluster en MongoDB Atlas
2. Clic en "Browse Collections"
3. Selecciona base de datos `helpdesk` → colección `users`
4. Encuentra tu usuario
5. Clic en "Edit Document"
6. Cambia `"rol": "usuario"` por `"rol": "admin"`
7. Clic en "Update"

#### Opción C: Mongo Shell (Avanzado)
```bash
mongosh "tu_uri_de_mongodb"
use helpdesk
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { rol: "admin" } }
)
```

---

### 9. Recargar Aplicación

1. Cierra sesión en el navegador (botón "Cerrar Sesión")
2. Vuelve a iniciar sesión con `admin@test.com`
3. **¡Ahora eres Admin!** Verás el panel completo con:
   - Gestión de Tickets
   - Gestión de Usuarios

---

##  ¡Listo! Ahora puedes:

### Como Admin puedes:
-  Ver todos los tickets
-  Crear nuevos usuarios (Agentes, Usuarios)
-  Cambiar roles de usuarios
-  Asignar tickets
-  Cambiar estados
-  Eliminar tickets

### Crear usuarios de prueba:
1. Ve a "Usuarios" en el sidebar
2. Clic en "Nuevo Usuario"
3. Crea:
   - **Agente**: para probar asignación de tickets
   - **Usuario**: para probar creación de tickets

---

##  Verificación Rápida

### Probar la API directamente:

```bash
# Health check
curl http://localhost:5000/api/health

# Debería responder:
# {"status":"ok","message":"HelpDesk API funcionando correctamente","timestamp":"..."}
```

---

## Problemas Comunes

### Error: "Error al conectar a MongoDB"
**Solución:**
- Verifica que tu URI en .env sea correcta
- Verifica que la contraseña no tenga caracteres especiales (o escápalos)
- Verifica que tu IP esté en whitelist (0.0.0.0/0)

### Error: "Token no válido"
**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- Limpia localStorage del navegador (F12 → Application → Clear Storage)

### Error: "Cannot find module"
**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### El servidor no inicia
**Solución:**
- Verifica que el puerto 5000 no esté ocupado
- Cambia el puerto en .env si es necesario
- Reinicia el terminal

---

##  Próximos Pasos

1. **Lee el README.md** - Documentación completa
2. **Revisa RESUMEN.md** - Características del proyecto
3. **Consulta COMANDOS.md** - Comandos útiles y API testing
4. **Explora el código** - Aprende cómo funciona

---

##  Necesitas Ayuda?

### Recursos:
- **README.md** - Documentación detallada
- **COMANDOS.md** - Testing con cURL
- **RESUMEN.md** - Resumen ejecutivo

### Contacto:
- Abre un issue en GitHub
- Revisa los logs del servidor (aparecen en la terminal)

---

##  Tips

### Para Desarrollo:
- Usa `npm run dev` (con nodemon para auto-reload)
- Abre DevTools (F12) para ver errores del frontend
- Revisa la terminal para errores del backend

### Para Producción:
- Cambia `NODE_ENV` a `production` en .env
- Usa un JWT_SECRET más seguro
- Configura CORS correctamente
- Despliega en Render, Railway o Heroku

---

##  Estructura de Prueba Sugerida

### 1. Como Admin:
- [ ] Crear 2 usuarios agentes
- [ ] Crear 3 usuarios normales
- [ ] Ver lista de usuarios

### 2. Como Usuario (cierra sesión y entra con un usuario nuevo):
- [ ] Crear 3 tickets con diferentes prioridades
- [ ] Agregar comentarios a tus tickets
- [ ] Ver solo tus tickets

### 3. Como Agente:
- [ ] Ver todos los tickets
- [ ] Asignarte un ticket
- [ ] Cambiar estado de ticket
- [ ] Agregar comentarios

### 4. Como Admin nuevamente:
- [ ] Ver estadísticas
- [ ] Cambiar rol de un usuario
- [ ] Eliminar un ticket

---

## ⚡
```bash
# Instalar
npm install

# Desarrollo
npm run dev

# Producción
npm start

# Generar secret
node generate-secret.js

# Ver health
curl http://localhost:5000/api/health
```

---

**¡Disfruta construyendo con HelpDesk! 🎉**
