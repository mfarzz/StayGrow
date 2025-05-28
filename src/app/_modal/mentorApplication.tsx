import React, { useState } from "react";
import { MentorApplicationForm } from "@/app/_hooks/useMentorApplication";
import {
  X,
  Plus,
  Trash2,
  User,
  Briefcase,
  Clock,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

interface MentorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: MentorApplicationForm) => Promise<void>;
}

const EXPERTISE_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "UI/UX Design",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cybersecurity",
  "Product Management",
  "Digital Marketing",
  "Business Development",
  "Entrepreneurship",
  "Career Guidance",
  "Soft Skills",
];

export const MentorApplicationModal: React.FC<MentorApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<MentorApplicationForm>({
    motivation: "",
    experience: "",
    expertise: [],
    availableHours: 0,
    linkedinUrl: "",
    portfolioUrl: "",
    education: "",
    currentPosition: "",
  });

  const [customExpertise, setCustomExpertise] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.motivation.trim() ||
      !formData.experience.trim() ||
      formData.expertise.length === 0
    ) {
      throw new Error("Mohon lengkapi semua field yang wajib diisi");
    }

    if (formData.availableHours < 1 || formData.availableHours > 40) {
      throw new Error("Jam ketersediaan harus antara 1-40 jam per minggu");
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        motivation: "",
        experience: "",
        expertise: [],
        availableHours: 0,
        linkedinUrl: "",
        portfolioUrl: "",
        education: "",
        currentPosition: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addExpertise = (expertise: string) => {
    if (expertise && !formData.expertise.includes(expertise)) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, expertise],
      }));
    }
  };

  const removeExpertise = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((e) => e !== expertise),
    }));
  };

  const addCustomExpertise = () => {
    if (customExpertise.trim()) {
      addExpertise(customExpertise.trim());
      setCustomExpertise("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Pengajuan Menjadi Mentor
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Motivation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Motivasi Menjadi Mentor *
            </label>
            <textarea
              value={formData.motivation}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, motivation: e.target.value }))
              }
              placeholder="Ceritakan motivasi Anda untuk menjadi mentor dan bagaimana Anda ingin membantu pemuda lain..."
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="inline w-4 h-4 mr-1" />
              Pengalaman Relevan *
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, experience: e.target.value }))
              }
              placeholder="Deskripsikan pengalaman kerja, proyek, atau pencapaian yang relevan untuk menjadi mentor..."
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
              required
            />
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Keahlian *
            </label>

            {/* Selected expertise */}
            {formData.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.expertise.map((expertise) => (
                  <span
                    key={expertise}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
                  >
                    {expertise}
                    <button
                      type="button"
                      onClick={() => removeExpertise(expertise)}
                      className="ml-2 hover:text-emerald-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Expertise options */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {EXPERTISE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addExpertise(option)}
                  disabled={formData.expertise.includes(option)}
                  className={`text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
                    formData.expertise.includes(option)
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  <Plus className="inline w-3 h-3 mr-1" />
                  {option}
                </button>
              ))}
            </div>

            {/* Custom expertise */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customExpertise}
                onChange={(e) => setCustomExpertise(e.target.value)}
                placeholder="Tambah keahlian lain..."
                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addCustomExpertise())
                }
              />
              <button
                type="button"
                onClick={addCustomExpertise}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Available Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Ketersediaan Waktu (jam per minggu) *
            </label>
            <input
              type="number"
              value={formData.availableHours}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availableHours: parseInt(e.target.value) || 0,
                }))
              }
              min="1"
              max="40"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Berapa jam per minggu Anda bisa luangkan untuk mentoring?
            </p>
          </div>

          {/* Current Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="inline w-4 h-4 mr-1" />
              Posisi/Pekerjaan Saat Ini
            </label>
            <input
              type="text"
              value={formData.currentPosition}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  currentPosition: e.target.value,
                }))
              }
              placeholder="Misal: Software Engineer di TechCorp"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="inline w-4 h-4 mr-1" />
              Latar Belakang Pendidikan
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, education: e.target.value }))
              }
              placeholder="Misal: S1 Teknik Informatika - Universitas Indonesia"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ExternalLink className="inline w-4 h-4 mr-1" />
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  linkedinUrl: e.target.value,
                }))
              }
              placeholder="https://linkedin.com/in/yourprofile"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ExternalLink className="inline w-4 h-4 mr-1" />
              Portfolio/Website
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  portfolioUrl: e.target.value,
                }))
              }
              placeholder="https://yourportfolio.com"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
            >
              {submitting ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
