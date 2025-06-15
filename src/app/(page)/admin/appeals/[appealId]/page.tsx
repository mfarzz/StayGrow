'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_hooks/useAuth';
import { useAppeal } from '@/app/_hooks/useAppeals';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Send, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  User,
  Shield,
  Calendar,
  Mail,
  ExternalLink
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

interface Props {
  params: { appealId: string };
}

export default function AdminAppealDetailPage({ params }: Props) {
  const router = useRouter();
  const { role } = useAuth();
  const { appeal, loading, error, sendMessage, updateStatus } = useAppeal(params.appealId);
  
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [resolution, setResolution] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not admin
  useEffect(() => {
    if (role && role !== 'ADMIN') {
      router.push('/home');
    }
  }, [role, router]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [appeal?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      await updateStatus(status, status === 'RESOLVED' ? resolution : undefined);
      if (status === 'RESOLVED' || status === 'CLOSED') {
        setResolution('');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !appeal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Banding tidak ditemukan'}
          </h1>
          <button
            onClick={() => router.push('/admin/appeals')}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Kembali ke Daftar Banding
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[appeal.status];
  const canSendMessage = appeal.status !== 'CLOSED' && appeal.status !== 'RESOLVED';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          
          {/* Appeal Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-start gap-6">
              {appeal.project.imageUrl && (
                <Image
                  src={appeal.project.imageUrl}
                  alt={appeal.project.title}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {appeal.project.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{appeal.user.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{appeal.user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(appeal.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${statusColors[appeal.status]}`}>
                      <StatusIcon size={14} />
                      {statusLabels[appeal.status]}
                    </span>
                    <button
                      onClick={() => window.open(`/home/showcase/${appeal.project.id}`, '_blank')}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <ExternalLink size={14} />
                      Lihat Proyek
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Alasan Banding:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {appeal.reason}
                  </p>
                </div>

                {appeal.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Keputusan Admin:</h4>
                    <p className="text-green-700 text-sm leading-relaxed">
                      {appeal.resolution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-1">
          {/* Chat Messages */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">Percakapan dengan Pengguna</h3>
              <p className="text-sm text-gray-600">
                {appeal.messages.length} pesan
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 500px)' }}>
              {appeal.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAdminMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isAdminMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.isAdminMessage ? (
                        <Shield size={12} className="text-blue-200" />
                      ) : (
                        <User size={12} className="text-gray-600" />
                      )}
                      <span className={`text-xs font-medium ${
                        message.isAdminMessage ? 'text-blue-200' : 'text-gray-600'
                      }`}>
                        {message.isAdminMessage ? 'Admin' : message.sender.name}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.isAdminMessage ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {canSendMessage && (
              <div className="p-4 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan untuk pengguna..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Admin Actions Panel */}
          <div className="w-80">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <h4 className="font-semibold text-gray-900 mb-4">Aksi Admin</h4>
              
              {appeal.status !== 'CLOSED' && appeal.status !== 'RESOLVED' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                      Keputusan (untuk status Selesai)
                    </label>
                    <textarea
                      id="resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Jelaskan keputusan Anda terhadap banding ini..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleUpdateStatus('RESOLVED')}
                      disabled={updatingStatus || !resolution.trim()}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {updatingStatus ? 'Memproses...' : 'Terima Banding'}
                    </button>
                    
                    <button
                      onClick={() => handleUpdateStatus('CLOSED')}
                      disabled={updatingStatus}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {updatingStatus ? 'Memproses...' : 'Tolak Banding'}
                    </button>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="font-medium text-blue-900 text-sm mb-2">Informasi:</h5>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• <strong>Terima:</strong> Proyek akan dipublikasikan kembali</li>
                        <li>• <strong>Tolak:</strong> Proyek tetap dalam status flagged</li>
                        <li>• Keputusan bersifat final</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    appeal.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <StatusIcon size={16} />
                    <span className="font-medium">
                      {appeal.status === 'RESOLVED' ? 'Banding Diterima' : 'Banding Ditolak'}
                    </span>
                  </div>
                  {appeal.resolvedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(appeal.resolvedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
