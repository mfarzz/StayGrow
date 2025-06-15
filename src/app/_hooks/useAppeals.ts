import { useState, useEffect, useCallback } from 'react';

export interface AppealMessage {
  id: string;
  appealId: string;
  senderId: string;
  message: string;
  isAdminMessage: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string;
  };
}

export interface ProjectAppeal {
  id: string;
  userId: string;
  projectId: string;
  reason: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  project: {
    id: string;
    title: string;
    imageUrl: string | null;
    description?: string;
  };
  messages: AppealMessage[];
}

export function useAppeals(status?: string) {
  const [appeals, setAppeals] = useState<ProjectAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await fetch(`/api/appeals?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appeals');
      }
      
      const data = await response.json();
      setAppeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  const createAppeal = async (projectId: string, reason: string) => {
    try {
      const response = await fetch('/api/appeals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appeal');
      }

      const newAppeal = await response.json();
      setAppeals(prev => [newAppeal, ...prev]);
      return newAppeal;
    } catch (err) {
      throw err;
    }
  };

  const updateAppealStatus = async (appealId: string, status: string, resolution?: string) => {
    try {
      const response = await fetch(`/api/appeals/${appealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, resolution }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appeal');
      }

      const updatedAppeal = await response.json();
      setAppeals(prev =>
        prev.map(appeal =>
          appeal.id === appealId ? updatedAppeal : appeal
        )
      );
      return updatedAppeal;
    } catch (err) {
      throw err;
    }
  };

  return {
    appeals,
    loading,
    error,
    refetch: fetchAppeals,
    createAppeal,
    updateAppealStatus
  };
}

export function useAppeal(appealId: string) {
  const [appeal, setAppeal] = useState<ProjectAppeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/appeals/${appealId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appeal');
      }
      
      const data = await response.json();
      setAppeal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [appealId]);

  useEffect(() => {
    if (appealId) {
      fetchAppeal();
    }
  }, [fetchAppeal, appealId]);

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch(`/api/appeals/${appealId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const newMessage = await response.json();
      setAppeal(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage]
        };
      });
      return newMessage;
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (status: string, resolution?: string) => {
    try {
      const response = await fetch(`/api/appeals/${appealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, resolution }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appeal');
      }

      const updatedAppeal = await response.json();
      setAppeal(updatedAppeal);
      return updatedAppeal;
    } catch (err) {
      throw err;
    }
  };

  return {
    appeal,
    loading,
    error,
    refetch: fetchAppeal,
    sendMessage,
    updateStatus
  };
}
