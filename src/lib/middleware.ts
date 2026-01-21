import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, hasPermission } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    try {
      const token = req.cookies.get('access_token')?.value || 
                   req.headers.get('authorization')?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Token de acceso requerido' },
          { status: 401 }
        );
      }

      const payload = verifyAccessToken(token);
      if (!payload) {
        return NextResponse.json(
          { success: false, error: 'Token inválido o expirado' },
          { status: 401 }
        );
      }

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      return handler(req);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Error de autenticación' },
        { status: 500 }
      );
    }
  };
}

export function withRole(roles: string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !hasPermission(req.user.role, roles)) {
        return NextResponse.json(
          { success: false, error: 'Permisos insuficientes' },
          { status: 403 }
        );
      }
      return handler(req);
    });
  };
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}