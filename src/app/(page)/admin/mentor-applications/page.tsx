'use client';

import React, { useState } from 'react';
import { useMentorApplication, MentorApplication } from '@/app/_hooks/useMentorApplication';
import { useAuth } from '@/app/_hooks/useAuth';
import Image from 'next/image';
import { 
  Users, 
  Clock, 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock3,
  Briefcase,
  GraduationCap,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const AdminMentorApplicationsPage: React.FC = () => {
  const { role } = useAuth();
  const { applications, loading, updateApplicationStatus, getStatusColor, getStatusText } = useMentorApplication();
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  // Filter applications
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const filteredApplications = applications.filter(app => 
    filter === 'ALL' || app.status === filter
  );

  const handleReview = async () => {
    if (!selectedApplication) return;

    const success = await updateApplicationStatus(
      selectedApplication.id,
      selectedStatus,
      adminNotes
    );

    if (success) {
      setReviewModal(false);
      setSelectedApplication(null);
      setAdminNotes('');
    }
  };

  const openReviewModal = (application: MentorApplication, status: 'APPROVED' | 'REJECTED') => {
    setSelectedApplication(application);
    setSelectedStatus(status);
    setAdminNotes('');
    setReviewModal(true);
  };

  if (role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
        <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Pengajuan Mentor</h1>
        <p className="text-gray-600">
          Review dan kelola pengajuan mentor dari pengguna
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Pengajuan</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Clock3 className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Menunggu Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Disetujui</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? 'Semua' : getStatusText(status)}
              {status !== 'ALL' && (
                <span className="ml-2 bg-white px-2 py-1 rounded text-xs">
                  {applications.filter(app => app.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Pengajuan</h3>
            <p className="text-gray-600">
              {filter === 'ALL' 
                ? 'Belum ada pengajuan mentor yang masuk.'
                : `Tidak ada pengajuan dengan status ${getStatusText(filter)}.`
              }
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {application.user.avatarUrl ? (
                        <Image
                          src={application.user.avatarUrl}
                          alt={application.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                          {application.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.user.name}</h3>
                      <p className="text-gray-600">{application.user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(application.createdAt).toLocaleDateString('id-ID')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {application.availableHours} jam/minggu
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                    {application.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openReviewModal(application, 'APPROVED')}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                        >
                          <ThumbsUp size={14} />
                          Setujui
                        </button>
                        <button
                          onClick={() => openReviewModal(application, 'REJECTED')}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <ThumbsDown size={14} />
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {application.currentPosition && (
                      <div className="flex items-center gap-2 text-sm text-black">
                        <Briefcase size={16} className="text-gray-400" />
                        <span>{application.currentPosition}</span>
                      </div>
                    )}
                    
                    {application.education && (
                      <div className="flex items-center gap-2 text-sm text-black">
                        <GraduationCap size={16} className="text-gray-400" />
                        <span>{application.education}</span>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Area Keahlian</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.expertise.slice(0, 3).map((expertise) => (
                          <span
                            key={expertise}
                            className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs"
                          >
                            {expertise}
                          </span>
                        ))}
                        {application.expertise.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{application.expertise.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Motivasi</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{application.motivation}</p>
                    </div>

                    {(application.linkedinUrl || application.portfolioUrl) && (
                      <div className="flex gap-3">
                        {application.linkedinUrl && (
                          <a
                            href={application.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            LinkedIn
                          </a>
                        )}
                        {application.portfolioUrl && (
                          <a
                            href={application.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Portfolio
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {application.adminNotes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Catatan Admin</h4>
                    <p className="text-sm text-gray-600">{application.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStatus === 'APPROVED' ? 'Setujui' : 'Tolak'} Pengajuan
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Anda akan {selectedStatus === 'APPROVED' ? 'menyetujui' : 'menolak'} pengajuan dari:
                </p>
                <p className="font-medium text-black">{selectedApplication.user.name}</p>
                <p className="text-sm text-black">{selectedApplication.user.email}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (opsional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={`Berikan catatan untuk ${selectedStatus === 'APPROVED' ? 'persetujuan' : 'penolakan'} ini...`}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setReviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleReview}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    selectedStatus === 'APPROVED'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {selectedStatus === 'APPROVED' ? 'Setujui' : 'Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentorApplicationsPage;
