import { headers } from 'next/headers';
import React from 'react';

export interface SSRAuthData {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  role?: string;
}

/**
 * Get auth data from middleware headers for SSR
 * Use this in your server components or page components
 */
export async function getSSRAuthData(): Promise<SSRAuthData> {
  const headersList = await headers();
  
  const isAuthenticated = headersList.get('x-user-authenticated') === 'true';
  const userId = headersList.get('x-user-id') || undefined;
  const email = headersList.get('x-user-email') || undefined;
  const role = headersList.get('x-user-role') || undefined;

  return {
    isAuthenticated,
    userId,
    email,
    role,
  };
}

/**
 * Higher-order component untuk protected pages
 */
export function withAuth<T extends object>(Component: React.ComponentType<T & { ssrAuthData?: SSRAuthData }>) {
  return async function AuthenticatedComponent(props: T) {
    const authData = await getSSRAuthData();
    
    // Middleware sudah handle redirect, jadi di sini kita hanya pass data
    return React.createElement(Component, { ...props, ssrAuthData: authData });
  };
}