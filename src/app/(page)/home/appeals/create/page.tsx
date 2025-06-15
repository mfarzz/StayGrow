'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/_hooks/useAuth';
import { AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';

export default function CreateAppealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [projectId] = useState(searchParams.get('projectId') || '');
  const [project, setProject] = useState<{
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    status: string;
  } | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        const response = await fetch(`/api/showcase/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    };

    fetchProject();
  }, [projectId]);

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
      return newAppeal;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Alasan banding harus diisi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createAppeal(projectId, reason);
      router.push('/home/appeals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat banding');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, useAuth hook will handle redirect
  if (!isAuthenticated) {
    return null;
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Project ID tidak ditemukan
          </h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ajukan Banding Proyek
          </h1>
          <p className="text-gray-600">
            Sampaikan alasan mengapa proyek Anda seharusnya tidak di-flag
          </p>
        </div>

        {/* Project Info */}
        {project && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-start gap-4">
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    <AlertTriangle size={12} />
                    Proyek Di-flag
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appeal Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Banding *
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan mengapa proyek Anda seharusnya tidak di-flag. Berikan penjelasan yang detail dan objektif..."
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={8}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimal 50 karakter. Jelaskan dengan detail dan sopan.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Informasi Penting:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Banding akan ditinjau oleh tim admin dalam 1-3 hari kerja</li>
                <li>• Anda dapat berkomunikasi dengan admin melalui sistem chat</li>
                <li>• Berikan penjelasan yang jujur dan objektif</li>
                <li>• Keputusan admin bersifat final</li>
              </ul>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || reason.trim().length < 50}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={16} />
                )}
                {loading ? 'Mengirim...' : 'Kirim Banding'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
