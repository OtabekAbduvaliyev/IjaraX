'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAuth = true, requireNoAuth = false, requiredRole = null }) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push('/auth');
      return;
    }

    if (requireNoAuth && user) {
      router.push('/');
      return;
    }

    if (user && !userRole && !['/role-selection', '/auth'].includes(window.location.pathname)) {
      router.push('/role-selection');
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      router.push('/');
      return;
    }
  }, [user, userRole, loading, requireAuth, requireNoAuth, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
}
