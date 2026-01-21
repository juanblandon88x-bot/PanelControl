# 🚀 Guía de Deployment para Vercel

## 📋 Pasos para Deploy

### 1. **Preparar el Repositorio**
```bash
# El código ya está listo en GitHub
git clone https://github.com/juanblandon88x-bot/PanelControl.git
cd PanelControl
```

### 2. **Configurar Base de Datos (PlanetScale)**

#### Crear cuenta y base de datos:
1. Ve a [PlanetScale](https://planetscale.com)
2. Crea una cuenta gratuita
3. Crea una nueva base de datos llamada `ticket_management`
4. Crea una branch `main`

#### Ejecutar el schema:
```bash
# Instalar PlanetScale CLI
npm install -g @planetscale/cli

# Conectar a la base de datos
pscale connect ticket_management main --port 3309

# En otra terminal, ejecutar el schema
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
```

#### Obtener connection string:
```bash
pscale password create ticket_management main password-name
```

### 3. **Configurar Cloudinary**

1. Ve a [Cloudinary](https://cloudinary.com)
2. Crea una cuenta gratuita
3. Obtén las credenciales del dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 4. **Deploy a Vercel**

#### Opción A: Desde GitHub (Recomendado)
1. Ve a [Vercel](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `PanelControl`
4. Configura las variables de entorno (ver abajo)
5. Deploy automático

#### Opción B: Desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy
vercel --prod
```

### 5. **Variables de Entorno en Vercel**

En el dashboard de Vercel → Settings → Environment Variables:

```env
# Database
DATABASE_URL=mysql://username:password@host/database?ssl={"rejectUnauthorized":true}

# JWT Secrets (generar claves seguras)
JWT_SECRET=tu-clave-jwt-super-secreta-aqui
JWT_REFRESH_SECRET=tu-clave-refresh-super-secreta-aqui

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Next Auth
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-nextauth-secret

# App Config
NEXT_PUBLIC_APP_NAME=Sistema de Gestión Técnica
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 6. **Generar Claves Seguras**

```bash
# Para JWT_SECRET y JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Para NEXTAUTH_SECRET
openssl rand -base64 32
```

### 7. **Verificar Deployment**

1. **Acceder a la aplicación**: `https://tu-dominio.vercel.app`
2. **Probar login** con usuarios de prueba:
   - Owner: `owner@sistema.com` / `admin123`
   - Admin: `admin@sistema.com` / `admin123`
   - Employee: `tecnico@sistema.com` / `admin123`

### 8. **Configurar Dominio Personalizado (Opcional)**

En Vercel Dashboard → Settings → Domains:
1. Agregar tu dominio personalizado
2. Configurar DNS según las instrucciones
3. Actualizar `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL`

## 🔧 Configuraciones Adicionales

### **Cron Jobs (Ya configurados)**
Los cron jobs están configurados en `vercel.json`:
- Tickets vencidos: cada 15 minutos
- Técnicos inactivos: cada 30 minutos
- Stock bajo: cada 6 horas

### **PWA (Ya configurado)**
- Manifest: `/public/manifest.json`
- Service Worker: `/public/sw.js`
- Iconos: Agregar iconos reales en `/public/`

### **Notificaciones Push**
Para habilitar notificaciones push:
1. Generar VAPID keys
2. Configurar en el service worker
3. Implementar en el backend

## 🐛 Troubleshooting

### **Error de Base de Datos**
```bash
# Verificar conexión
pscale shell ticket_management main
```

### **Error de Variables de Entorno**
- Verificar que todas las variables estén configuradas
- Redeploy después de cambiar variables

### **Error de Build**
```bash
# Probar build local
npm run build
```

### **Error de Permisos**
- Verificar que los usuarios de prueba existan en la BD
- Verificar que las tablas se crearon correctamente

## 📊 Monitoreo Post-Deploy

### **Logs de Vercel**
```bash
vercel logs tu-dominio.vercel.app
```

### **Métricas**
- Dashboard de Vercel para analytics
- Logs de errores en Functions
- Performance metrics

### **Base de Datos**
- Monitoreo en PlanetScale dashboard
- Query insights y performance

## 🔄 Updates y Mantenimiento

### **Deploy Automático**
- Push a `main` branch → Deploy automático
- Pull requests → Preview deployments

### **Rollback**
```bash
vercel rollback tu-dominio.vercel.app
```

### **Backup de BD**
```bash
# Backup con PlanetScale
pscale backup create ticket_management main
```

## ✅ Checklist Final

- [ ] Base de datos creada y schema ejecutado
- [ ] Variables de entorno configuradas
- [ ] Cloudinary configurado
- [ ] Deploy exitoso en Vercel
- [ ] Login funcionando con usuarios de prueba
- [ ] PWA instalable
- [ ] Cron jobs activos
- [ ] Dominio personalizado (opcional)

¡Tu sistema está listo para producción! 🎉