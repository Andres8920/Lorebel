# 🛒 Sistema de Gestión de Productos Lorebel

Sistema CRUD completo para gestión de productos y categorías con autenticación JWT.

**Stack:** React + Node.js + MongoDB Local

![Logo Lorebel](frontend/src/assets/logo.jpg)

---

## � Contenido

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación Rápida](#-instalación-rápida)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Tecnologías](#-tecnologías)
- [Solución de Problemas](#-solución-de-problemas)

---

## ✨ Características

**Productos:**
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Búsqueda en tiempo real con filtros
- Paginación (10 productos por página)
- Vista detallada en modal

**Categorías:**
- CRUD de categorías con iconos emoji
- Paginación (12 por página)
- Validación de nombres únicos

**Autenticación:**
- Login y registro de usuarios
- JWT con expiración de 30 días
- Contraseñas encriptadas
- Rutas protegidas

**Diseño:**
- Interfaz responsive
- Paleta de colores dorados (#C4975A)
- Animaciones suaves

---

## 📋 Requisitos

- **Node.js** v18+ → [Descargar](https://nodejs.org/)
- **MongoDB** instalado y corriendo → [Descargar](https://www.mongodb.com/try/download/community)

---

## 🚀 Instalación Rápida

### 1. Instalar MongoDB Local (Windows)

```bash
# Descargar e instalar MongoDB Community Server
# https://www.mongodb.com/try/download/community
# Se inicia automáticamente como servicio de Windows

# Verificar instalación:
mongosh --eval "db.version()"
```

### 2. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 3. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/productosDB
JWT_SECRET=lorebel_secret_key_2025
NODE_ENV=production
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Iniciar servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Listo!** Abre http://localhost:3000

---

## 💻 Uso

### Primera vez

1. Abre http://localhost:3000
2. Haz clic en "Registrarse"
3. Crea una cuenta
4. Automáticamente irás a la página de productos
5. Crea tus categorías desde la sección "Categorías"
6. Luego podrás crear productos asignándolos a esas categorías

### Operaciones disponibles

- **Crear producto:** Botón "➕ Nuevo Producto"
- **Ver detalle:** Click en nombre del producto
- **Editar:** Botón "✏️ Editar"
- **Eliminar:** Botón "🗑️ Eliminar" (con confirmación)
- **Buscar:** Campo de búsqueda (espera 500ms automáticamente)
- **Filtrar:** Selector de categoría
- **Paginar:** Controles en la parte inferior

---

## 📡 API Endpoints

**Base URL:** `http://localhost:3001/api`

### Autenticación

```
POST   /auth/register    # Registrar usuario
POST   /auth/login       # Iniciar sesión
GET    /auth/profile     # Obtener perfil (requiere token)
```

### Productos (requieren autenticación)

```
GET    /productos              # Listar productos (con paginación y filtros)
GET    /productos/:id          # Obtener producto por ID
POST   /productos              # Crear producto
PUT    /productos/:id          # Actualizar producto
DELETE /productos/:id          # Eliminar producto
```

### Categorías (requieren autenticación)

```
GET    /categorias             # Listar categorías
GET    /categorias/:id         # Obtener categoría por ID
POST   /categorias             # Crear categoría
PUT    /categorias/:id         # Actualizar categoría
DELETE /categorias/:id         # Eliminar categoría
```

**Ejemplo de uso:**

```javascript
// Listar productos con filtros
GET /productos?page=1&limit=10&categoria=Electrónica&search=laptop

// Crear producto
POST /productos
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "nombre": "Laptop Gaming",
  "descripcion": "Laptop de alta gama",
  "precio": 1500,
  "stock": 10,
  "categoria": "Electrónica"
}
```

---

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Bcryptjs para encriptar contraseñas

### Frontend
- React 18 + Vite
- React Router v6
- Axios
- CSS3

---

## 🐛 Solución de Problemas

### ❌ "Cannot connect to MongoDB"

**Solución:**
```bash
# Windows: Verificar servicio
services.msc  # Buscar "MongoDB Server" y hacer Start

# Verificar URI en backend/.env
MONGODB_URI=mongodb://127.0.0.1:27017/productosDB
```

### ❌ "Network Error" en Frontend

**Solución:**
```bash
# 1. Verificar que backend esté corriendo
cd backend
npm run dev

# 2. Verificar frontend/.env
VITE_API_URL=http://localhost:3001/api
```

### ❌ Token inválido / No puedo acceder

**Solución:**
```javascript
// En consola del navegador:
localStorage.clear()
// Luego hacer login nuevamente
```

### ❌ Imágenes rotas en productos

**Solución:**
```bash
cd backend
node scripts/removeImages.js
```

### ❌ No se puede eliminar categoría

**Solución:**
- Primero elimina todos los productos de esa categoría
- Luego podrás eliminar la categoría

---

## 📂 Estructura del Proyecto

```
TrabajoFinal/
├── backend/
│   ├── config/          # Configuración MongoDB
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Esquemas de BD
│   ├── routes/          # Rutas de API
│   ├── middleware/      # Autenticación JWT
│   ├── scripts/         # Seed data, utilidades
│   └── server.js        # Entrada principal
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas principales
│   │   ├── services/    # Llamadas API
│   │   ├── context/     # Context API (Auth)
│   │   └── styles/      # CSS
│   └── index.html
└── README.md
```

---

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ JWT con expiración automática
- ✅ Validación de datos en backend y frontend
- ✅ Rutas protegidas con middleware
- ✅ Variables sensibles en .env

---

## 📝 Comandos Útiles

```bash
# Backend
npm run dev        # Iniciar con nodemon (recarga automática)
npm start          # Iniciar en producción

# Frontend
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Vista previa del build

# Base de datos
node scripts/seedData.js      # Poblar con 30 productos + 15 categorías
node scripts/removeImages.js  # Limpiar imágenes
mongosh                       # Abrir shell de MongoDB
```

---

Iniciar el Proyecto

Primero iniciar el backend:
cd backend; npm run dev 

Despúes iniciar el frontend:
cd frontend; npm run dev 
