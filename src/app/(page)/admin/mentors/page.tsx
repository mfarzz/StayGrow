'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Briefcase,
  Calendar,
  Mail
} from 'lucide-react';
import Image from 'next/image';

interface MentorApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  expertise: string;
  experience: string;
  motivation: string;
  availability: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  education: string;
  achievements?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

const AdminMentorApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/mentor-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = async (applicationId: string, status: 'APPROVED' | 'REJECTED', notes: string) => {
    try {
      const response = await fetch(`/api/admin/mentor-applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          adminNotes: notes,
          reviewedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        await fetchApplications();
        setReviewModal(false);
        setSelectedApplication(null);
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Failed to review application:', error);
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const openReviewModal = (application: MentorApplication, status: 'APPROVED' | 'REJECTED') => {
    setSelectedApplication(application);
    setSelectedStatus(status);
    setAdminNotes(application.adminNotes || '');
    setReviewModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Applications</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage mentor applications</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-600">Total Applications: </span>
            <span className="text-sm font-bold text-gray-900">{applications.length}</span>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <span className="text-sm font-medium text-yellow-700">Pending: </span>
            <span className="text-sm font-bold text-yellow-800">
              {applications.filter(app => app.status === 'PENDING').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="space-y-0">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {application.userAvatar ? (
                      <Image
                        src={application.userAvatar}
                        alt={application.userName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Application Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{application.userName}</h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {application.userEmail}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {application.expertise}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied {new Date(application.submittedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {application.motivation}
                    </p>

                    {/* Links */}
                    <div className="flex items-center space-x-4">
                      {application.linkedinUrl && (
                        <a
                          href={application.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          LinkedIn
                        </a>
                      )}
                      {application.portfolioUrl && (
                        <a
                          href={application.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Portfolio
                        </a>
                      )}
                    </div>

                    {/* Admin Notes */}
                    {application.adminNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Admin Notes</h4>
                        <p className="text-sm text-gray-600">{application.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowApplicationModal(true);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {application.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => openReviewModal(application, 'APPROVED')}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => openReviewModal(application, 'REJECTED')}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors duration-200 flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No applications found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="flex items-start space-x-4">
                  {selectedApplication.userAvatar ? (
                    <Image
                      src={selectedApplication.userAvatar}
                      alt={selectedApplication.userName}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                      <UserCheck className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">{selectedApplication.userName}</h4>
                    <p className="text-gray-600">{selectedApplication.userEmail}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        <span className="ml-1">{selectedApplication.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Expertise</h5>
                    <p className="text-gray-600">{selectedApplication.expertise}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Experience</h5>
                    <p className="text-gray-600">{selectedApplication.experience}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                    <p className="text-gray-600">{selectedApplication.education}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Availability</h5>
                    <p className="text-gray-600">{selectedApplication.availability}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Motivation</h5>
                  <p className="text-gray-600">{selectedApplication.motivation}</p>
                </div>

                {selectedApplication.achievements && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Achievements</h5>
                    <p className="text-gray-600">{selectedApplication.achievements}</p>
                  </div>
                )}

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplication.linkedinUrl && (
                    <a
                      href={selectedApplication.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">LinkedIn Profile</span>
                    </a>
                  )}
                  {selectedApplication.portfolioUrl && (
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Portfolio</span>
                    </a>
                  )}
                </div>

                {/* Admin Notes */}
                {selectedApplication.adminNotes && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Admin Notes</h5>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">{selectedApplication.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(selectedApplication.submittedAt).toLocaleString()}
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div>
                        <span className="font-medium">Reviewed:</span> {new Date(selectedApplication.reviewedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedApplication.status === 'PENDING' && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openReviewModal(selectedApplication, 'APPROVED')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => openReviewModal(selectedApplication, 'REJECTED')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStatus === 'APPROVED' ? 'Approve' : 'Reject'} Application
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this decision..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleReviewApplication(selectedApplication.id, selectedStatus, adminNotes)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedStatus === 'APPROVED'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {selectedStatus === 'APPROVED' ? 'Approve' : 'Reject'}
                </button>
                <button
                  onClick={() => {
                    setReviewModal(false);
                    setAdminNotes('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
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
