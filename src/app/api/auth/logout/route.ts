import { NextRequest, NextResponse } from 'next/server';
import { executeQuerySingle } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    // Eliminar refresh token de la base de datos
    if (refreshToken) {
      await executeQuerySingle(
        'DELETE FROM refresh_tokens WHERE token_hash = ?',
        [refreshToken]
      );
    }

    // Registrar logout en audit log
    if (request.user) {
      await executeQuerySingle(
        'INSERT INTO audit_log (id, user_id, action_type, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), request.user.userId, 'LOGOUT', 'USER', request.user.userId, request.ip || 'unknown']
      );
    }

    // Crear respuesta y limpiar cookies
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});