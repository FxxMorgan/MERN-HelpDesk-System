# Proyecto: Sistema de Tickets (Help Desk)

Este documento define los requisitos y el stack tecnológico para un sistema interno de soporte (Help Desk), desarrollado como proyecto de portafolio.

## 1. Stack Tecnológico (MERN)

* **Frontend:** React
    * *Librerías clave:* `axios` (para peticiones API), `react-router-dom` (para navegación).
* **Backend:** Node.js
* **Framework Backend:** Express.js
* **Base de Datos:** MongoDB Atlas (NoSQL)
    * *ODM (Object Data Modeling):* Mongoose (para definir esquemas y facilitar la interacción con la BD).
* **Autenticación:** JSON Web Tokens (JWT)

---

## 2. Requisitos Funcionales (RF)

Los requisitos funcionales describen **qué debe hacer** el sistema.

### RF-G: Gestión de Usuarios y Autenticación
* **RF-001:** El sistema debe permitir a un usuario registrarse (Nombre, Email, Contraseña).
* **RF-002:** El sistema debe permitir a un usuario iniciar sesión (Login).
* **RF-003:** El sistema debe manejar tres roles de usuario:
    * **Usuario (Cliente):** Solo puede crear tickets y ver/comentar sus propios tickets.
    * **Agente (Soporte):** Puede ver todos los tickets, asignárselos y cambiar su estado.
    * **Admin:** Puede gestionar usuarios (crear, editar roles, eliminar) y tiene los mismos permisos que un Agente.
* **RF-004:** El sistema debe permitir al usuario cerrar sesión (Logout).
* **RF-005:** El sistema debe proteger las rutas según el rol del usuario (ej. un "Usuario" no puede acceder al dashboard de "Agente").

### RF-T: Gestión de Tickets
* **RF-006:** Un "Usuario" autenticado debe poder crear un nuevo ticket (Asunto, Descripción, Prioridad [Baja, Media, Alta]).
* **RF-007:** Un "Usuario" debe poder ver una lista de todos los tickets que ha creado.
* **RF-008:** Un "Agente" o "Admin" debe poder ver un dashboard con todos los tickets del sistema.
* **RF-009:** Un "Agente" debe poder asignarse un ticket a sí mismo.
* **RF-010:** El sistema debe permitir al "Agente" cambiar el estado de un ticket (Abierto -> En Progreso -> Resuelto -> Cerrado).
* **RF-011:** El sistema debe permitir filtrar los tickets (por estado, por prioridad).

### RF-C: Comunicación (Comentarios)
* **RF-012:** El "Usuario" (dueño del ticket) y el "Agente" (asignado) deben poder añadir comentarios a un ticket.
* **RF-013:** Todos los comentarios deben mostrar el autor y la fecha.
* **RF-014:** (Opcional) El sistema debe enviar una notificación (email o en-app) al usuario cuando su ticket reciba un comentario o cambie de estado.

---

## 3. Requisitos No Funcionales (RNF)

Los requisitos no funcionales describen **cómo debe ser** el sistema (calidad, rendimiento, seguridad).

### RNF-S: Seguridad
* **RNF-001:** Todas las contraseñas de usuario deben almacenarse hasheadas en la base de datos (ej. usando `bcrypt`).
* **RNF-002:** La comunicación entre el frontend y el backend debe usar el token JWT para autorizar las peticiones (enviado en los *headers*).
* **RNF-003:** El sistema debe validar y sanitizar toda la información proveniente del cliente para prevenir ataques (ej. XSS, Inyección NoSQL).

### RNF-U: Usabilidad
* **RNF-004:** La interfaz debe ser clara, intuitiva y fácil de usar.
* **RNF-005:** El diseño debe ser *responsive*, adaptándose correctamente a pantallas de escritorio y dispositivos móviles.

### RNF-P: Rendimiento
* **RNF-006:** Las consultas a la API deben responder en un tiempo razonable (ej. < 500ms bajo condiciones normales).
* **RNF-007:** La aplicación React debe cargar rápidamente.

### RNF-M: Mantenibilidad
* **RNF-008:** El código debe estar bien estructurado y documentado (comentarios).
* **RNF-009:** El backend (API) debe seguir una arquitectura clara (ej. Modelo-Vista-Controlador o similar), separando la lógica de negocio, los controladores y los modelos.
* **RNF-010:** El frontend (React) debe estar organizado por componentes reutilizables.