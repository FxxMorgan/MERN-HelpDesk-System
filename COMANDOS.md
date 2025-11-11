# 🛠️ Comandos Útiles - HelpDesk

##  Instalación y Configuración

```bash
# Instalar dependencias
npm install

# Generar JWT Secret seguro
node generate-secret.js

# Verificar configuración
node -e "console.log(require('dotenv').config())"
```

## 🚀 Desarrollo

```bash
# Iniciar en modo desarrollo (con nodemon)
npm run dev

# Iniciar en modo producción
npm start

# Verificar que el servidor está corriendo
curl http://localhost:5000/api/health
```

##  Testing API con cURL

### Autenticación

```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@test.com",
    "password": "123456"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }'

# Guardar el token devuelto
TOKEN="tu_token_aqui"

# Obtener perfil actual
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Tickets

```bash
# Crear ticket
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "asunto": "Problema con el sistema",
    "descripcion": "No puedo acceder a mi cuenta",
    "prioridad": "alta"
  }'

# Obtener todos los tickets
curl http://localhost:5000/api/tickets \
  -H "Authorization: Bearer $TOKEN"

# Obtener mis tickets
curl http://localhost:5000/api/tickets/mis-tickets \
  -H "Authorization: Bearer $TOKEN"

# Obtener ticket por ID
curl http://localhost:5000/api/tickets/TICKET_ID \
  -H "Authorization: Bearer $TOKEN"

# Agregar comentario
curl -X POST http://localhost:5000/api/tickets/TICKET_ID/comentarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "contenido": "Este es un comentario de prueba"
  }'

# Cambiar estado (Agente/Admin)
curl -X PUT http://localhost:5000/api/tickets/TICKET_ID/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "estado": "en_progreso"
  }'

# Asignar ticket (Agente/Admin)
curl -X PUT http://localhost:5000/api/tickets/TICKET_ID/asignar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "agenteId": "ID_DEL_AGENTE"
  }'
```

### Usuarios (Solo Admin)

```bash
# Obtener todos los usuarios
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"

# Crear usuario
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Nuevo Usuario",
    "email": "nuevo@test.com",
    "password": "123456",
    "rol": "agente"
  }'

# Actualizar usuario
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rol": "admin",
    "activo": true
  }'

# Eliminar usuario
curl -X DELETE http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"

# Obtener agentes
curl http://localhost:5000/api/users/agentes \
  -H "Authorization: Bearer $TOKEN"
```

##  MongoDB Comandos

```bash
# Conectar a MongoDB Atlas (desde mongo shell)
mongosh "mongodb+srv://cluster.mongodb.net/helpdesk" --username TU_USUARIO

# Comandos útiles en mongo shell
use helpdesk
db.users.find().pretty()
db.tickets.find().pretty()
db.users.countDocuments()
db.tickets.countDocuments()

# Crear primer admin (después de registrarte)
db.users.updateOne(
  { email: "tu@email.com" },
  { $set: { rol: "admin" } }
)

# Ver todos los usuarios con su rol
db.users.find({}, { nombre: 1, email: 1, rol: 1 })

# Ver tickets por estado
db.tickets.aggregate([
  { $group: { _id: "$estado", count: { $sum: 1 } } }
])

# Limpiar base de datos (CUIDADO!)
db.tickets.deleteMany({})
db.users.deleteMany({})
```

## 🐳 Docker (Opcional)

```bash
# Crear Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
EOF

# Construir imagen
docker build -t helpdesk .

# Ejecutar contenedor
docker run -p 5000:5000 \
  -e MONGODB_URI=tu_uri \
  -e JWT_SECRET=tu_secret \
  helpdesk
```

## 🔧 Git Comandos

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit: Sistema HelpDesk completo"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/helpdesk.git
git branch -M main
git push -u origin main

# Crear rama de desarrollo
git checkout -b develop
git push -u origin develop
```

## 📊 Monitoreo y Logs

```bash
# Ver logs en tiempo real
npm run dev | tee logs/app.log

# Buscar errores en logs
grep -i "error" logs/app.log

# Ver últimas 50 líneas de logs
tail -50 logs/app.log

# Monitorear peticiones HTTP
tail -f logs/app.log | grep "POST\|GET\|PUT\|DELETE"
```

## 🧹 Mantenimiento

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar actualizaciones de paquetes
npm outdated

# Actualizar paquetes
npm update

# Auditoría de seguridad
npm audit
npm audit fix

# Limpiar caché de npm
npm cache clean --force
```

## 🚀 Despliegue

### Render.com

```bash
# En render.com:
# Build Command:
npm install

# Start Command:
npm start

# Variables de entorno:
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
```

### Heroku

```bash
# Login a Heroku
heroku login

# Crear app
heroku create mi-helpdesk

# Configurar variables
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Abrir app
heroku open
```

### Railway

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar
railway init

# Deploy
railway up

# Ver logs
railway logs
```

## 🧪 Scripts Personalizados

```bash
# Crear script de backup de MongoDB
cat > backup.sh << EOF
#!/bin/bash
mongodump --uri="mongodb+srv://..." --out=backup/\$(date +%Y%m%d)
EOF
chmod +x backup.sh

# Crear script de limpieza
cat > cleanup.sh << EOF
#!/bin/bash
rm -rf logs/*.log
echo "Logs eliminados"
EOF
chmod +x cleanup.sh
```

## Notas

- Reemplazar `$TOKEN`, `TICKET_ID`, `USER_ID` con valores reales
- Para producción, usar HTTPS siempre
- Mantener JWT_SECRET secreto y nunca compartir
- Hacer backup regular de MongoDB
- Monitorear logs en producción
