import { NextRequest, NextResponse } from 'next/server';
import { executeQuerySingle } from '@/lib/db';
import { verifyRefreshToken, generateTokens } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token requerido' },
        { status: 401 }
      );
    }

    // Verificar refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Refresh token inválido' },
        { status: 401 }
      );
    }

    // Verificar que el token existe en la base de datos
    const tokenRecord = await executeQuerySingle(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()',
      [refreshToken]
    );

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, error: 'Refresh token expirado o inválido' },
        { status: 401 }
      );
    }

    // Obtener usuario actualizado
    const user = await executeQuerySingle<User>(
      'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
      [payload.userId]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Actualizar refresh token en la base de datos
    await executeQuerySingle(
      'UPDATE refresh_tokens SET token_hash = ?, expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE token_hash = ?',
      [newRefreshToken, refreshToken]
    );

    // Crear respuesta
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
      message: 'Token renovado exitosamente',
    });

    // Actualizar cookies
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hora
    });

    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}