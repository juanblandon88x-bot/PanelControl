# Sistema de Gestión Técnica

Sistema completo de gestión de servicios técnicos para empresas ISP/telecomunicaciones con seguimiento GPS en tiempo real, gestión de inventario, tickets y roles de usuario.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación y Roles
- **JWT** con tokens de acceso (1h) y refresh (7d)
- **3 Roles**: Owner, Administrator, Employee
- **Renovación automática** de tokens
- **Seguridad**: bcrypt, cookies HttpOnly, CORS

### 📊 Dashboard en Tiempo Real
- Métricas actualizadas cada 30 segundos
- Gráficos de tendencias y rendimiento
- Alertas recientes clasificadas por severidad
- Estadísticas de tickets y técnicos

### 🎫 Gestión Completa de Tickets
- **8 tipos de problemas** predefinidos
- **Estados**: Pendiente → Asignado → En Progreso → Resuelto
- **Filtros avanzados** por estado, prioridad, fechas
- **Fotos de resolución** (hasta 5 por ticket)
- **Notificaciones** en tiempo real

### 📦 Inventario Inteligente
- **9 tipos de equipos** (Router, Modem, Cable, etc.)
- **Alertas automáticas** de stock bajo
- **Estados visuales**: 🟢 Disponible, 🟡 Stock Bajo, 🔴 Agotado
- **Ajustes rápidos** con botones +/-

### 📍 GPS en Tiempo Real
- **Ubicación cada 3 segundos**
- **Estados**: 🟢 En Línea, 🔴 Fuera de Línea
- **Integración Google Maps**
- **Alertas** por GPS desactivado
- **Panel móvil** optimizado para técnicos

### 🚨 Sistema de Alertas
- **6 tipos**: GPS_DISABLED, LOW_STOCK, URGENT_TICKET, etc.
- **4 severidades**: CRITICAL, HIGH, MEDIUM, LOW
- **Estados**: PENDING → REVIEWED → RESOLVED
- **Notificaciones push**

### 📈 Reportes y Análisis
- **Estadísticas de tickets** completas
- **Rendimiento de técnicos** con rankings
- **Auditoría completa** del sistema
- **Gráficos interactivos** con Recharts

### 📱 PWA (Progressive Web App)
- **Instalable** en móvil y desktop
- **Offline** funcionalidad limitada
- **Service Worker** para caché
- **Push notifications**

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **React 18** + TypeScript
- **Redux Toolkit** para estado global
- **Tailwind CSS** con tema claro/oscuro
- **Recharts** para gráficos
- **React Icons** para iconografía

### Backend
- **Node.js** con Vercel Serverless Functions
- **MySQL** (compatible con PlanetScale)
- **JWT** para autenticación
- **Zod** para validación
- **Cloudinary** para imágenes

### Deployment
- **Vercel** para frontend y API
- **PlanetScale** para base de datos
- **Cloudinary** para almacenamiento de archivos

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd technical-service-management
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Copia `.env.example` a `.env.local` y configura:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# App Configuration
NEXT_PUBLIC_APP_NAME="Sistema de Gestión Técnica"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configurar Base de Datos

#### Opción A: PlanetScale (Recomendado)
1. Crear cuenta en [PlanetScale](https://planetscale.com)
2. Crear nueva base de datos
3. Obtener connection string
4. Ejecutar el schema:

```bash
# Conectar a PlanetScale CLI
pscale connect <database-name> <branch-name> --port 3309

# En otra terminal, ejecutar schema
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
```

#### Opción B: MySQL Local
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE ticket_management;"

# Ejecutar schema
mysql -u root -p ticket_management < database/schema.sql
```

### 5. Configurar Cloudinary
1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Obtener credenciales del dashboard
3. Configurar en `.env.local`

### 6. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👥 Usuarios de Prueba

El sistema incluye usuarios predeterminados:

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Owner** | owner@sistema.com | admin123 | Acceso total |
| **Administrator** | admin@sistema.com | admin123 | Gestión de tickets e inventario |
| **Employee** | tecnico@sistema.com | admin123 | Panel móvil y tickets asignados |

## 🚀 Deployment en Vercel

### 1. Preparar para Producción
```bash
npm run build
```

### 2. Deploy a Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Configurar Variables de Entorno
En el dashboard de Vercel, agregar todas las variables del `.env.local`

### 4. Configurar Dominio Personalizado
En Vercel dashboard → Settings → Domains

## 📱 Funcionalidades por Rol

### 👑 OWNER (Propietario)
- ✅ Acceso total al sistema
- ✅ Gestión completa de usuarios
- ✅ Configuración del sistema
- ✅ Reportes y auditoría completa
- ✅ Gestión de sucursales

### 👨‍💼 ADMINISTRATOR (Administrador)
- ✅ Gestión de tickets
- ✅ Gestión de inventario
- ✅ Ver reportes y estadísticas
- ✅ Gestión de empleados
- ✅ Monitoreo GPS

### 👤 EMPLOYEE (Empleado)
- ✅ Panel móvil optimizado
- ✅ Ver tickets asignados
- ✅ Tomar tickets pendientes
- ✅ Finalizar tickets con fotos
- ✅ Compartir ubicación GPS
- ✅ Recibir notificaciones

## 🔧 Configuración Avanzada

### Cron Jobs (Alertas Automáticas)
Vercel soporta cron jobs para alertas automáticas:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue-tickets",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/check-inactive-technicians",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

### Push Notifications
Para habilitar notificaciones push:

1. Generar VAPID keys
2. Configurar service worker
3. Solicitar permisos al usuario
4. Enviar notificaciones desde el backend

### Personalización de Temas
El sistema soporta temas claro/oscuro automáticos. Para personalizar:

```css
/* globals.css */
:root {
  --primary: tu-color-primario;
  --secondary: tu-color-secundario;
}
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Unit tests
npm run test

# Property-based tests
npm run test:properties

# Integration tests
npm run test:integration
```

### Property-Based Testing
El sistema incluye 20 propiedades de correctness que validan:
- Flujos de autenticación
- Gestión de tickets
- Cálculos de inventario
- Seguimiento GPS
- Sistema de alertas

## 📊 Monitoreo y Logs

### Logs de Auditoría
Todas las acciones se registran en `audit_log`:
- Usuario que realizó la acción
- Tipo de acción (CREATE, UPDATE, DELETE, etc.)
- Entidad afectada
- Detalles adicionales
- IP address y timestamp

### Métricas del Sistema
- Tickets por estado
- Rendimiento de técnicos
- Alertas por severidad
- Uso de inventario

## 🔒 Seguridad

### Medidas Implementadas
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración automática
- ✅ Cookies HttpOnly
- ✅ Validación de entrada con Zod
- ✅ Protección SQL injection
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Auditoría completa

### Recomendaciones Adicionales
- Usar HTTPS en producción
- Configurar CSP headers
- Implementar 2FA para owners
- Backup regular de base de datos
- Monitoreo de logs de seguridad

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: soporte@sistema.com
- 📱 WhatsApp: +1234567890
- 🌐 Web: https://sistema.com

---

**¡Gracias por usar el Sistema de Gestión Técnica!** 🚀