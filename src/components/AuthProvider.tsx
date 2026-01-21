'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshToken } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Intentar renovar token al cargar la aplicación
    dispatch(refreshToken());

    // Configurar renovación automática cada 50 minutos
    const interval = setInterval(() => {
      dispatch(refreshToken());
    }, 50 * 60 * 1000); // 50 minutos

    return () => clearInterval(interval);
  }, [dispatch]);

  return <>{children}</>;
}