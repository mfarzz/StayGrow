"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  provider: string;
  googleId?: string;
  emailVerified: boolean;
  role: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

interface UpdateProfileData {
  name: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatarUrl?: string;
}

interface UseProfileState {
  loading: boolean;
  updating: boolean;
  profile?: UserProfile;
  error?: string;
}

interface UseProfileReturn extends UseProfileState {
  updateProfile: (data: UpdateProfileData) => Promise<UserProfile>;
  refetchProfile: () => Promise<void>;
  clearError: () => void;
}

export function useProfile(): UseProfileReturn {
  const { userId, isAuthenticated, loading: authLoading } = useAuth({ redirectOnFailure: false });
  const [state, setState] = useState<UseProfileState>({ 
    loading: true, 
    updating: false 
  });

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !userId) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: undefined }));

      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          profile: data.user,
          error: undefined 
        }));
      } else {
        const error = await res.json();
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error?.error || "Failed to fetch profile" 
        }));
      }// Handle non-200 responses                                                            
    } catch  {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Network error while fetching profile" 
      }));
    }
  }, [isAuthenticated, userId]);

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<UserProfile> => {
    if (!isAuthenticated || !userId) {
      throw new Error("User not authenticated");
    }

    setState(prev => ({ ...prev, updating: true, error: undefined }));

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        const updatedProfile = result.user;
        
        setState(prev => ({ 
          ...prev, 
          updating: false, 
          profile: updatedProfile,
          error: undefined 
        }));
        
        return updatedProfile;
      } else {
        const error = await res.json();
        const errorMessage = error?.error || "Failed to update profile";
        
        setState(prev => ({ 
          ...prev, 
          updating: false, 
          error: errorMessage 
        }));
        
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error while updating profile";
      
      setState(prev => ({ 
        ...prev, 
        updating: false, 
        error: errorMessage 
      }));
      
      throw new Error(errorMessage);
    }
  }, [isAuthenticated, userId]);

  const refetchProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !userId) {
      setState({ loading: false, updating: false });
      return;
    }

    let isMounted = true;

    const initFetch = async () => {
      if (isMounted) {
        await fetchProfile();
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuthenticated, userId, fetchProfile]);

  return {
    ...state,
    updateProfile,
    refetchProfile,
    clearError,
  };
}