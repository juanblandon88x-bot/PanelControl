import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export async function getConnection() {
  if (!connection) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      // Usar DATABASE_URL si está disponible
      connection = await mysql.createConnection(databaseUrl);
    } else {
      // Fallback a variables individuales
      const config: mysql.ConnectionOptions = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ticket_management',
      };

      if (process.env.NODE_ENV === 'production') {
        config.ssl = { rejectUnauthorized: false };
      }

      connection = await mysql.createConnection(config);
    }
  }
  return connection;
}

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function executeQuerySingle<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  const results = await executeQuery<T>(query, params);
  return results.length > 0 ? results[0] : null;
}