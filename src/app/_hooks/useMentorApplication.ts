import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';

export interface MentorApplication {
  id: string;
  userId: string;
  motivation: string;
  experience: string;
  expertise: string[];
  availableHours: number;
  linkedinUrl?: string;
  portfolioUrl?: string;
  education?: string;
  currentPosition?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    createdAt?: string;
  };
}

export interface MentorApplicationForm {
  motivation: string;
  experience: string;
  expertise: string[];
  availableHours: number;
  linkedinUrl: string;
  portfolioUrl: string;
  education: string;
  currentPosition: string;
}

export const useMentorApplication = () => {
  const [application, setApplication] = useState<MentorApplication | null>(null);
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { role, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // Fetch user's own application
  const fetchMyApplication = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await fetch('/api/mentor-application', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
      } else {
        const error = await response.json();
        console.error('Error fetching application:', error);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch all applications (admin only)
  const fetchAllApplications = useCallback(async () => {
    if (!isAuthenticated || role !== 'ADMIN') return;

    setLoading(true);
    try {
      const response = await fetch('/api/mentor-application?admin=true', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        const error = await response.json();
        console.error('Error fetching applications:', error);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  // Submit mentor application
  const submitApplication = async (formData: MentorApplicationForm) => {
    if (!isAuthenticated) {
      throw new Error('Anda harus login terlebih dahulu');
    }

    if (role !== 'PEMUDA') {
      throw new Error('Hanya pemuda yang dapat mengajukan menjadi mentor');
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/mentor-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
        return true;
      } else {
        throw new Error(data.error || 'Gagal mengirim pengajuan');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Terjadi kesalahan saat mengirim pengajuan');
    } finally {
      setSubmitting(false);
    }
  };

  // Update application status (admin only)
  const updateApplicationStatus = async (
    applicationId: string, 
    status: 'APPROVED' | 'REJECTED', 
    adminNotes?: string
  ) => {
    if (!isAuthenticated || role !== 'ADMIN') {
      showNotification('error', 'Akses Ditolak', 'Anda tidak memiliki akses untuk melakukan aksi ini');
      return false;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/mentor-application', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          applicationId,
          status,
          adminNotes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Berhasil!', data.message);
        // Refresh applications list
        await fetchAllApplications();
        return true;
      } else {
        showNotification('error', 'Gagal', data.error || 'Gagal memperbarui status');
        return false;
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      showNotification('error', 'Error', 'Terjadi kesalahan saat memperbarui status');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user can apply
  const canApply = () => {
    return role === 'PEMUDA' && !application;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Menunggu Review';
      case 'APPROVED':
        return 'Disetujui';
      case 'REJECTED':
        return 'Ditolak';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'ADMIN') {
        fetchAllApplications();
      } else if (role === 'PEMUDA') {
        fetchMyApplication();
      }
    }
  }, [isAuthenticated, role, fetchAllApplications, fetchMyApplication]);

  return {
    // Data
    application,
    applications,
    loading,
    submitting,
    
    // Functions
    fetchMyApplication,
    fetchAllApplications,
    submitApplication,
    updateApplicationStatus,
    canApply,
    
    // Helpers
    getStatusColor,
    getStatusText,
  };
};
