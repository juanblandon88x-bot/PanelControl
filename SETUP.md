# 🛠️ Configuración Local

## 🚀 Inicio Rápido

### 1. **Clonar e Instalar**
```bash
git clone https://github.com/juanblandon88x-bot/PanelControl.git
cd PanelControl
npm install
```

### 2. **Generar Claves de Seguridad**
```bash
npm run generate-keys
```
Copia las claves generadas a tu archivo `.env.local`

### 3. **Configurar Variables de Entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Database (MySQL local o PlanetScale)
DATABASE_URL="mysql://user:password@localhost:3306/ticket_management"

# JWT (usar las claves generadas)
JWT_SECRET="tu-clave-generada"
JWT_REFRESH_SECRET="tu-clave-refresh-generada"

# Cloudinary (opcional para desarrollo)
CLOUDINARY_CLOUD_NAME="demo"
CLOUDINARY_API_KEY="demo"
CLOUDINARY_API_SECRET="demo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-nextauth-secret-generado"

# App
NEXT_PUBLIC_APP_NAME="Sistema de Gestión Técnica"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. **Configurar Base de Datos**

#### Opción A: MySQL Local
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE ticket_management;"

# Ejecutar schema
npm run init-db
```

#### Opción B: PlanetScale (Recomendado)
```bash
# Instalar PlanetScale CLI
npm install -g @planetscale/cli

# Login y crear base de datos
pscale auth login
pscale database create ticket_management

# Conectar y ejecutar schema
pscale connect ticket_management main --port 3309
# En otra terminal:
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
```

### 5. **Ejecutar en Desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Owner** | owner@sistema.com | admin123 | Acceso total |
| **Admin** | admin@sistema.com | admin123 | Gestión tickets/inventario |
| **Employee** | tecnico@sistema.com | admin123 | Panel móvil |

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build para producción
npm run start           # Servidor de producción
npm run lint            # Linter

# Configuración
npm run generate-keys   # Generar claves JWT
npm run init-db        # Inicializar base de datos
npm run setup          # Configuración completa

# Verificación
npm run type-check     # Verificar TypeScript
```

## 📱 Probar PWA

1. Abrir en Chrome/Edge
2. Ir a DevTools → Application → Service Workers
3. Verificar que el SW se registre
4. Probar instalación (ícono + en la barra de direcciones)

## 🐛 Troubleshooting

### **Error de Base de Datos**
```bash
# Verificar conexión MySQL
mysql -u root -p -e "SELECT 1"

# Verificar tablas
mysql -u root -p ticket_management -e "SHOW TABLES"
```

### **Error de Variables de Entorno**
- Verificar que `.env.local` existe
- Verificar que todas las variables están configuradas
- Reiniciar el servidor de desarrollo

### **Error de Dependencias**
```bash
# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install
```

### **Error de TypeScript**
```bash
# Verificar tipos
npm run type-check

# Regenerar tipos de Next.js
rm -rf .next
npm run dev
```

## 🔄 Desarrollo

### **Estructura del Proyecto**
```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── login/          # Páginas
│   │   └── globals.css     # Estilos globales
│   ├── components/         # Componentes React
│   ├── lib/               # Utilidades
│   ├── store/             # Redux Store
│   └── types/             # Tipos TypeScript
├── database/              # Schema SQL
├── public/               # Archivos estáticos
└── scripts/              # Scripts de utilidad
```

### **Agregar Nueva Funcionalidad**
1. Crear tipos en `src/types/`
2. Crear API route en `src/app/api/`
3. Crear slice de Redux en `src/store/slices/`
4. Crear componentes en `src/components/`
5. Agregar página en `src/app/`

### **Base de Datos**
- Schema: `database/schema.sql`
- Conexión: `src/lib/db.ts`
- Migraciones: Modificar schema y ejecutar `npm run init-db`

### **Autenticación**
- JWT: `src/lib/auth.ts`
- Middleware: `src/lib/middleware.ts`
- Store: `src/store/slices/authSlice.ts`

## 📊 Monitoreo Local

### **Logs**
- Console del navegador para frontend
- Terminal para backend/API
- Network tab para requests

### **Base de Datos**
```bash
# Ver logs de queries (MySQL)
mysql -u root -p -e "SET GLOBAL general_log = 'ON';"

# Ver usuarios activos
mysql -u root -p ticket_management -e "SELECT email, role, last_access FROM users;"
```

### **Performance**
- Lighthouse en DevTools
- Next.js Bundle Analyzer
- React DevTools Profiler

## 🚀 Preparar para Producción

1. **Build local**
   ```bash
   npm run build
   npm run start
   ```

2. **Verificar variables de entorno**
   - Todas las claves deben ser diferentes a desarrollo
   - URLs deben apuntar a producción

3. **Probar funcionalidades críticas**
   - Login/logout
   - Creación de tickets
   - GPS (si tienes HTTPS)
   - PWA installation

4. **Deploy a Vercel**
   - Seguir `DEPLOYMENT.md`

¡Listo para desarrollar! 🎉