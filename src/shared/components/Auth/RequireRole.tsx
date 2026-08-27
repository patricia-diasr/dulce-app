import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getRole, getToken, type UserRole } from '@/shared/utils/tokenStorage';

interface RequireRoleProps {
  role: UserRole;
  children: ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const location = useLocation();
  const token = getToken();
  const currentRole = getRole();

  if (!token || !currentRole) {
    const loginPath = role === 'ADMIN' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (currentRole !== role) {
    return <Navigate to={currentRole === 'ADMIN' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}
