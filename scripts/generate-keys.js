#!/usr/bin/env node

/**
 * Script para generar claves seguras para JWT y NextAuth
 */

const crypto = require('crypto');

function generateKeys() {
  console.log('🔐 Generando claves seguras...\n');

  // Generar JWT secrets
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
  const nextAuthSecret = crypto.randomBytes(32).toString('base64');

  console.log('📋 Variables de entorno para .env.local:\n');
  console.log('# JWT Secrets');
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
  console.log('');
  console.log('# NextAuth Secret');
  console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
  console.log('');

  console.log('📋 Para Vercel Environment Variables:\n');
  console.log('JWT_SECRET');
  console.log(jwtSecret);
  console.log('');
  console.log('JWT_REFRESH_SECRET');
  console.log(jwtRefreshSecret);
  console.log('');
  console.log('NEXTAUTH_SECRET');
  console.log(nextAuthSecret);
  console.log('');

  console.log('⚠️  IMPORTANTE: Guarda estas claves de forma segura y no las compartas.');
  console.log('💡 Usa diferentes claves para desarrollo y producción.');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateKeys();
}

module.exports = { generateKeys };