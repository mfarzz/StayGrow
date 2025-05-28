"use client";

import React, { useState } from "react";
import {
  useMentorApplication,
  MentorApplicationForm,
} from "@/app/_hooks/useMentorApplication";
import { useAuth } from "@/app/_hooks/useAuth";
import { useNotification } from "@/app/_hooks/useNotification";
import { MentorApplicationModal } from "@/app/_modal/mentorApplication";
import Notification from "@/app/_components/notification";
import {
  Clock,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock3,
  UserPlus,
  Briefcase,
  GraduationCap,
  Star,
} from "lucide-react";

const MentorApplicationPage: React.FC = () => {
  const { role } = useAuth();
  const {
    application,
    loading,
    getStatusColor,
    getStatusText,
    submitApplication,
  } = useMentorApplication();
  const { showSuccess, showError, notification, hideNotification } =
    useNotification();
  const [showModal, setShowModal] = useState(false);

  const handleSubmitApplication = async (formData: MentorApplicationForm) => {
    try {
      const success = await submitApplication(formData);
      if (success) {
        showSuccess("Berhasil!", "Pengajuan mentor berhasil dikirim!");
      }
    } catch (error) {
      if (error instanceof Error) {
        showError("Validasi Gagal", error.message);
      } else {
        showError("Error", "Terjadi kesalahan saat mengirim pengajuan");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pengajuan Mentor
        </h1>
        <p className="text-gray-600">
          Bergabunglah sebagai mentor dan bantu pemuda lain mencapai potensi
          terbaik mereka
        </p>
      </div>

      {/* For MENTOR users - show already mentor message */}
      {role === "MENTOR" && (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Anda Sudah Mentor
          </h3>
          <p className="text-gray-600">
            Anda sudah terdaftar sebagai mentor. Terima kasih atas kontribusi
            Anda!
          </p>
        </div>
      )}

      {/* For ADMIN users - show admin message */}
      {role === "ADMIN" && (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Panel Admin
          </h3>
          <p className="text-gray-600">
            Sebagai admin, Anda dapat mengelola pengajuan mentor melalui menu
            &quot;Kelola Mentor&quot; di sidebar.
          </p>
        </div>
      )}

      {/* For PEMUDA users */}
      {role === "PEMUDA" && (
        <>
          <Notification
            show={notification.show}
            onClose={hideNotification}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            description={notification.description}
            autoClose={true}
            autoCloseDelay={notification.type === "success" ? 3000 : 5000}
          />
          {/* Call to Action - Show for PEMUDA who haven't applied yet */}
          {!application && (
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Siap Menjadi Mentor?
                  </h2>
                  <p className="text-emerald-100">
                    Bagikan pengalaman dan keahlian Anda untuk membantu generasi
                    muda berkembang
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Ajukan Sekarang
                </button>
              </div>
            </div>
          )}

          {/* Show application status if exists */}
          {application ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Status Pengajuan Anda
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status === "PENDING" && (
                      <Clock3 className="inline w-4 h-4 mr-1" />
                    )}
                    {application.status === "APPROVED" && (
                      <CheckCircle className="inline w-4 h-4 mr-1" />
                    )}
                    {application.status === "REJECTED" && (
                      <XCircle className="inline w-4 h-4 mr-1" />
                    )}
                    {getStatusText(application.status)}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Application Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        Tanggal Pengajuan
                      </h3>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(application.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        Ketersediaan
                      </h3>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Clock size={16} />
                        {application.availableHours} jam per minggu
                      </p>
                    </div>

                    {application.currentPosition && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                          Posisi Saat Ini
                        </h3>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Briefcase size={16} />
                          {application.currentPosition}
                        </p>
                      </div>
                    )}

                    {application.education && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                          Pendidikan
                        </h3>
                        <p className="text-gray-900 flex items-center gap-2">
                          <GraduationCap size={16} />
                          {application.education}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Area Keahlian
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {application.expertise.map((expertise) => (
                          <span
                            key={expertise}
                            className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                          >
                            {expertise}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* External Links */}
                    <div className="space-y-2">
                      {application.linkedinUrl && (
                        <a
                          href={application.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink size={16} />
                          LinkedIn Profile
                        </a>
                      )}
                      {application.portfolioUrl && (
                        <a
                          href={application.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink size={16} />
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Motivasi
                  </h3>
                  <p className="text-gray-900 leading-relaxed">
                    {application.motivation}
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Pengalaman
                  </h3>
                  <p className="text-gray-900 leading-relaxed">
                    {application.experience}
                  </p>
                </div>

                {/* Admin Notes */}
                {application.adminNotes && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Catatan Admin
                    </h3>
                    <p className="text-gray-900 leading-relaxed">
                      {application.adminNotes}
                    </p>
                    {application.reviewedAt && (
                      <p className="text-sm text-gray-500 mt-2">
                        Direview pada:{" "}
                        {new Date(application.reviewedAt).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Application Modal */}
      <MentorApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitApplication}
      />
    </div>
  );
};

export default MentorApplicationPage;
