import { NextRequest, NextResponse } from 'next/server';
import { executeQuerySingle } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserDB } from '@/types';

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    if (!request.user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Obtener información completa del usuario
    const user = await executeQuerySingle<UserDB & { branch_name?: string }>(
      `SELECT u.*, b.name as branch_name 
       FROM users u 
       LEFT JOIN branches b ON u.branch_id = b.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [request.user.userId]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        branchId: user.branch_id,
        branchName: user.branch_name,
        isActive: user.is_active,
        lastAccess: user.last_access,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});