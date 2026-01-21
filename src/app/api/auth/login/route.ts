import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { executeQuerySingle } from '@/lib/db';
import { comparePassword, generateTokens } from '@/lib/auth';
import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Buscar usuario por email
    const user = await executeQuerySingle<User>(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [email]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Guardar refresh token en la base de datos
    await executeQuerySingle(
      'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [uuidv4(), user.id, refreshToken]
    );

    // Actualizar último acceso
    await executeQuerySingle(
      'UPDATE users SET last_access = NOW() WHERE id = ?',
      [user.id]
    );

    // Registrar en audit log
    await executeQuerySingle(
      'INSERT INTO audit_log (id, user_id, action_type, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), user.id, 'LOGIN', 'USER', user.id, request.ip || 'unknown']
    );

    // Crear respuesta con cookies
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          branchId: user.branch_id,
        },
        accessToken,
      },
      message: 'Inicio de sesión exitoso',
    });

    // Configurar cookies seguras
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hora
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}