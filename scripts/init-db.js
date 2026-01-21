#!/usr/bin/env node

/**
 * Script de inicialización de base de datos
 * Ejecuta el schema SQL y verifica la conexión
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  console.log('🚀 Iniciando configuración de base de datos...');

  try {
    // Leer variables de entorno
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ticket_management',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

    console.log('📡 Conectando a la base de datos...');
    const connection = await mysql.createConnection(dbConfig);

    // Leer schema SQL
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Dividir el schema en statements individuales
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📋 Ejecutando ${statements.length} statements SQL...`);

    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} ejecutado`);
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} ya existe (ignorado)`);
          } else {
            console.error(`❌ Error en statement ${i + 1}:`, error.message);
          }
        }
      }
    }

    // Verificar que las tablas se crearon
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Tablas creadas: ${tables.length}`);
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Verificar usuarios de prueba
    const [users] = await connection.execute('SELECT email, role FROM users');
    console.log(`👥 Usuarios de prueba: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    await connection.end();
    console.log('✅ Base de datos configurada exitosamente!');

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };