"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  role?: string;
}

interface UseAuthOptions {
  redirectOnFailure?: boolean;
  initialAuthState?: Partial<AuthState>;
}

export function useAuth(options?: UseAuthOptions) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    isAuthenticated: true, // diasumsikan true dulu untuk menghindari flash redirect
    ...options?.initialAuthState,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          setAuthState({
            loading: false,
            isAuthenticated: true,
            userId: data.userId,
            email: data.email,
            role: data.role,
          });
        } else {
          setAuthState({ loading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) {
          setAuthState({ loading: false, isAuthenticated: false });
        }
      }
    }

    if (options?.initialAuthState?.loading === false) {
      return;
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [options?.initialAuthState]);

  useEffect(() => {
    // Redirect only after loading done and unauthenticated
    if (!authState.loading && !authState.isAuthenticated && options?.redirectOnFailure !== false) {
      const currentPath = window.location.pathname;
      const publicPaths = ["/login", "/register", "/reset-password", "/forgot-password"];

      if (!publicPaths.includes(currentPath)) {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [authState.loading, authState.isAuthenticated, router, options?.redirectOnFailure]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setAuthState({ loading: false, isAuthenticated: false });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshAuth = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAuthState({
          loading: false,
          isAuthenticated: true,
          userId: data.userId,
          email: data.email,
          role: data.role,
        });
        return true;
      } else {
        setAuthState({ loading: false, isAuthenticated: false });
        return false;
      }
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setAuthState({ loading: false, isAuthenticated: false });
      return false;
    }
  };

  return {
    ...authState,
    logout,
    refreshAuth,
  };
}
