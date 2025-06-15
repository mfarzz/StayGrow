'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_hooks/useAuth';
import { useAppeals } from '@/app/_hooks/useAppeals';
import Image from 'next/image';
import { 
  AlertTriangle, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  User,
  Shield,
  Calendar
} from 'lucide-react';

const statusColors = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  OPEN: 'Menunggu',
  IN_PROGRESS: 'Sedang Diproses',
  RESOLVED: 'Selesai',
  CLOSED: 'Ditutup',
};

const statusIcons = {
  OPEN: Clock,
  IN_PROGRESS: MessageCircle,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
};

export default function AdminAppealsPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { appeals, loading, error } = useAppeals(selectedStatus);

  // Redirect if not admin
  useEffect(() => {
    if (role && role !== 'ADMIN') {
      router.push('/home');
    }
  }, [role, router]);

  const handleAppealClick = (appealId: string) => {
    router.push(`/admin/appeals/${appealId}`);
  };

  const getAppealStats = () => {
    const stats = {
      total: appeals.length,
      open: appeals.filter(a => a.status === 'OPEN').length,
      inProgress: appeals.filter(a => a.status === 'IN_PROGRESS').length,
      resolved: appeals.filter(a => a.status === 'RESOLVED').length,
      closed: appeals.filter(a => a.status === 'CLOSED').length,
    };
    return stats;
  };

  const stats = getAppealStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-32 border"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Kelola Banding Proyek
              </h1>
              <p className="text-gray-600">
                Kelola semua banding dari pengguna untuk proyek yang di-flag
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.open}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Diproses</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Ditutup</p>
                  <p className="text-2xl font-bold text-red-900">{stats.closed}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="OPEN">Menunggu</option>
              <option value="IN_PROGRESS">Sedang Diproses</option>
              <option value="RESOLVED">Selesai</option>
              <option value="CLOSED">Ditutup</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {appeals.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada banding
            </h3>
            <p className="text-gray-500">
              {selectedStatus 
                ? `Tidak ada banding dengan status ${statusLabels[selectedStatus as keyof typeof statusLabels] || selectedStatus}`
                : 'Belum ada banding yang masuk dari pengguna'
              }
            </p>
          </div>
        )}

        {/* Appeals List */}
        <div className="space-y-4">
          {appeals.map((appeal) => {
            const StatusIcon = statusIcons[appeal.status];
            const lastMessage = appeal.messages[appeal.messages.length - 1];
            const urgencyLevel = appeal.status === 'OPEN' ? 'high' : appeal.status === 'IN_PROGRESS' ? 'medium' : 'low';
            
            return (
              <div
                key={appeal.id}
                onClick={() => handleAppealClick(appeal.id)}
                className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-6 ${
                  urgencyLevel === 'high' ? 'border-l-4 border-l-yellow-400' :
                  urgencyLevel === 'medium' ? 'border-l-4 border-l-blue-400' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Project Image */}
                  {appeal.project.imageUrl && (
                    <Image
                      src={appeal.project.imageUrl}
                      alt={appeal.project.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {appeal.project.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{appeal.user.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {new Date(appeal.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColors[appeal.status]}`}>
                          <StatusIcon size={12} />
                          {statusLabels[appeal.status]}
                        </span>
                      </div>
                    </div>

                    {/* Reason Preview */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      <span className="font-medium">Alasan: </span>
                      {appeal.reason}
                    </p>

                    {/* Last Message */}
                    {lastMessage && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          {lastMessage.isAdminMessage ? (
                            <Shield size={12} className="text-blue-600" />
                          ) : (
                            <User size={12} className="text-gray-600" />
                          )}
                          <span className="text-xs font-medium text-gray-500">
                            {lastMessage.isAdminMessage ? 'Admin' : lastMessage.sender.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(lastMessage.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {lastMessage.message}
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{appeal.messages.length} pesan</span>
                      </div>
                      {appeal.resolvedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          <span>
                            Diselesaikan {new Date(appeal.resolvedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
