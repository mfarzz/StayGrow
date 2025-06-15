'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppeals } from '@/app/_hooks/useAppeals';
import { AlertTriangle, MessageCircle, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import Image from 'next/image';

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

export default function AppealsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { appeals, loading, error } = useAppeals(selectedStatus);

  const handleAppealClick = (appealId: string) => {
    router.push(`/home/appeals/${appealId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Banding Proyek
              </h1>
              <p className="text-gray-600">
                Kelola banding untuk proyek yang di-flag
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
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
            <p className="text-gray-500 mb-6">
              Anda belum memiliki banding untuk proyek yang di-flag
            </p>
          </div>
        )}

        {/* Appeals List */}
        <div className="space-y-4">
          {appeals.map((appeal) => {
            const StatusIcon = statusIcons[appeal.status];
            const lastMessage = appeal.messages[appeal.messages.length - 1];
            
            return (
              <div
                key={appeal.id}
                onClick={() => handleAppealClick(appeal.id)}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-6"
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
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {appeal.project.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Dibuat {new Date(appeal.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColors[appeal.status]}`}>
                          <StatusIcon size={12} />
                          {statusLabels[appeal.status]}
                        </span>
                      </div>
                    </div>

                    {/* Reason Preview */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {appeal.reason}
                    </p>

                    {/* Last Message */}
                    {lastMessage && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            {lastMessage.isAdminMessage ? 'Admin' : 'Anda'}
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
