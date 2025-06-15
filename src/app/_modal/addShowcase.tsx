import React, { useState, useEffect } from "react";
import {
  X,
  Github,
  ExternalLink,
  Tag,
  Target,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/app/_hooks/useUpload";

interface ShowcaseProject {
  id: string;
  title: string;
  author: string;
  authorRole?: string;
  authorId: string;
  location: string;
  image: string;
  avatarUrl?: string;
  likes: number;
  views: number;
  saves: number;
  sdgTags: string[];
  techTags: string[];
  description: string;
  createdAt: string;
  featured: boolean;
  aiMatchScore: number;
  githubUrl?: string;
  demoUrl?: string;
  status: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface AddShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    projectData: ShowcaseProjectData
  ) => Promise<{ 
    success: boolean; 
    project?: ShowcaseProjectData;
    error?: string;
    message?: string;
    violations?: string[];
    severity?: string;
  }>;
  editingProject?: ShowcaseProject | null;
}

interface ShowcaseProjectData {
  title: string;
  description: string;
  imageUrl?: string;
  sdgTags: string[];
  techTags: string[];
  githubUrl?: string;
  demoUrl?: string;
  status?: string;
}

const AddShowcaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingProject,
}: AddShowcaseModalProps) => {
  const [formData, setFormData] = useState<ShowcaseProjectData>({
    title: "",
    description: "",
    imageUrl: "",
    sdgTags: [],
    techTags: [],
    githubUrl: "",
    demoUrl: "",
    status: "PUBLISHED",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentSDGInput, setCurrentSDGInput] = useState("");
  const [currentTechInput, setCurrentTechInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [contentModerationError, setContentModerationError] = useState("");
  
  // Constants for file validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Check if we're in editing mode
  const isEditMode = !!editingProject;

  // Populate form when editing
  useEffect(() => {
    if (editingProject && isOpen) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        imageUrl: editingProject.image,
        sdgTags: editingProject.sdgTags,
        techTags: editingProject.techTags,
        githubUrl: editingProject.githubUrl || "",
        demoUrl: editingProject.demoUrl || "",
        status: editingProject.status,
      });
      setImagePreview(editingProject.image);
      setImageFile(null);
      setImageError("");
      setCurrentSDGInput("");
      setCurrentTechInput("");
      setContentModerationError("");
    } else if (!editingProject && isOpen) {
      // Reset form for new project
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        sdgTags: [],
        techTags: [],
        githubUrl: "",
        demoUrl: "",
        status: "PUBLISHED",
      });
      setImagePreview("");
      setImageFile(null);
      setImageError("");
      setCurrentSDGInput("");
      setCurrentTechInput("");
      setContentModerationError("");
    }
  }, [editingProject, isOpen]);

  const sdgOptions = [
    "SDG 1 - No Poverty",
    "SDG 2 - Zero Hunger",
    "SDG 3 - Good Health and Well-being",
    "SDG 4 - Quality Education",
    "SDG 5 - Gender Equality",
    "SDG 6 - Clean Water and Sanitation",
    "SDG 7 - Affordable and Clean Energy",
    "SDG 8 - Decent Work and Economic Growth",
    "SDG 9 - Industry, Innovation and Infrastructure",
    "SDG 10 - Reduced Inequalities",
    "SDG 11 - Sustainable Cities and Communities",
    "SDG 12 - Responsible Consumption and Production",
    "SDG 13 - Climate Action",
    "SDG 14 - Life Below Water",
    "SDG 15 - Life on Land",
    "SDG 16 - Peace, Justice and Strong Institutions",
    "SDG 17 - Partnerships for the Goals",
  ];

  const popularTechTags = [
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "TypeScript",
    "JavaScript",
    "Flutter",
    "React Native",
    "Vue.js",
    "Angular",
    "Django",
    "Laravel",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "AWS",
    "Docker",
    "Machine Learning",
    "AI",
    "IoT",
    "Blockchain",
    "Mobile App",
    "Web App",
  ];

  // Reset form and errors when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setImageError("");
      setCurrentSDGInput("");
      setCurrentTechInput("");
      setContentModerationError("");
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear content moderation error when user starts typing
    if (contentModerationError && (name === 'title' || name === 'description')) {
      setContentModerationError("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous errors
    setImageError("");
    setContentModerationError("");

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setImageError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      e.target.value = ""; // Reset input
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setImageError(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      e.target.value = ""; // Reset input
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      return await uploadFile(file, { type: 'showcase' });
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageError("Gagal mengupload gambar. Coba lagi.");
      throw new Error("Gagal mengupload gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const addSDGTag = () => {
    if (currentSDGInput && !formData.sdgTags.includes(currentSDGInput)) {
      setFormData((prev) => ({
        ...prev,
        sdgTags: [...prev.sdgTags, currentSDGInput],
      }));
      setCurrentSDGInput("");
    }
  };

  const removeSDGTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      sdgTags: prev.sdgTags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addTechTag = () => {
    if (currentTechInput && !formData.techTags.includes(currentTechInput)) {
      setFormData((prev) => ({
        ...prev,
        techTags: [...prev.techTags, currentTechInput],
      }));
      setCurrentTechInput("");
    }
  };

  const removeTechTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      techTags: prev.techTags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addPopularTechTag = (tag: string) => {
    if (!formData.techTags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        techTags: [...prev.techTags, tag],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation for publishing
      if (formData.status === 'PUBLISHED') {
        const validationErrors = [];

        if (!formData.title || formData.title.trim().length < 5) {
          validationErrors.push('Judul proyek harus minimal 5 karakter');
        }

        if (!formData.description || formData.description.trim().length < 50) {
          validationErrors.push('Deskripsi proyek harus minimal 50 karakter');
        }

        if (!formData.imageUrl && !imageFile) {
          validationErrors.push('Gambar proyek wajib diisi untuk publikasi');
        }

        if (!formData.sdgTags || formData.sdgTags.length === 0) {
          validationErrors.push('Minimal satu SDG tag harus dipilih');
        }

        if (!formData.techTags || formData.techTags.length === 0) {
          validationErrors.push('Minimal satu tech tag harus dipilih');
        }

        if (validationErrors.length > 0) {
          alert(`Validasi gagal untuk publikasi:\n\n${validationErrors.join('\n')}\n\nSilakan lengkapi data yang diperlukan atau simpan sebagai draft terlebih dahulu.`);
          setIsLoading(false);
          return;
        }
      }

      let imageUrl = formData.imageUrl;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const projectData = {
        ...formData,
        imageUrl,
      };

      const result = await onSubmit(projectData);

      if (result.success) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          sdgTags: [],
          techTags: [],
          githubUrl: "",
          demoUrl: "",
          status: "PUBLISHED",
        });
        setImageFile(null);
        setImagePreview("");
        setImageError("");
        setCurrentSDGInput("");
        setCurrentTechInput("");
        setContentModerationError("");
        onClose();
      } else if (result.error === 'content_moderation') {
        // Handle content moderation errors from the new response structure
        setContentModerationError(result.message || "Konten mengandung kata-kata yang tidak pantas. Silakan periksa dan perbaiki teks Anda.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      
      // Fallback error handling for unexpected errors
      setContentModerationError("Terjadi kesalahan saat memproses proyek. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ margin: 0, padding: "1rem" }}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? `Edit Proyek: ${editingProject?.title}` : "Submit Proyek Showcase"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status - Show prominently for draft projects */}
          {isEditMode && editingProject?.status === 'DRAFT' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Status: Draft</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Proyek ini masih dalam status draft dan tidak terlihat oleh publik.
              </p>
            </div>
          )}

          {/* Content Moderation Error */}
          {contentModerationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">Konten Tidak Sesuai</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                {contentModerationError}
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Proyek *
              {formData.status === 'PUBLISHED' && (
                <span className="text-xs text-gray-500 ml-1">(minimal 5 karakter untuk publikasi)</span>
              )}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`text-black w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                formData.status === 'PUBLISHED' && formData.title.length < 5 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200'
              }`}
              placeholder="Masukkan judul proyek yang menarik..."
            />
            {formData.status === 'PUBLISHED' && formData.title.length > 0 && formData.title.length < 5 && (
              <p className="text-xs text-red-500 mt-1">Judul harus minimal 5 karakter untuk publikasi</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Proyek *
              {formData.status === 'PUBLISHED' && (
                <span className="text-xs text-gray-500 ml-1">(minimal 50 karakter untuk publikasi)</span>
              )}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className={`text-black w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none ${
                formData.status === 'PUBLISHED' && formData.description.length < 50 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200'
              }`}
              placeholder="Jelaskan proyek Anda, tujuan, dan dampak yang ingin dicapai..."
            />
            {formData.status === 'PUBLISHED' && formData.description.length > 0 && formData.description.length < 50 && (
              <p className="text-xs text-red-500 mt-1">Deskripsi harus minimal 50 karakter untuk publikasi</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{formData.description.length} karakter</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Proyek {isEditMode && "(Kosongkan jika tidak ingin mengubah)"}
              {formData.status === 'PUBLISHED' && !isEditMode && (
                <span className="text-red-500 ml-1">*</span>
              )}
              {formData.status === 'PUBLISHED' && (
                <span className="text-xs text-gray-500 ml-1">(wajib untuk publikasi)</span>
              )}
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 transition-colors ${
              formData.status === 'PUBLISHED' && !formData.imageUrl && !imageFile
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}>
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(isEditMode ? editingProject?.image || "" : "");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">
                    {isEditMode ? "Upload gambar baru" : "Upload gambar proyek"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer inline-block"
                  >
                    Pilih Gambar
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Format yang didukung: JPG, PNG, WebP. Maksimal ukuran 5MB.
            </p>
            {imageError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                {imageError}
              </p>
            )}
            {isUploading && (
              <p className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                Mengupload gambar...
              </p>
            )}
          </div>

          {/* SDG Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline mr-1" size={16} />
              SDG yang Didukung
              {formData.status === 'PUBLISHED' && (
                <span className="text-red-500 ml-1">*</span>
              )}
              {formData.status === 'PUBLISHED' && (
                <span className="text-xs text-gray-500 ml-1">(minimal 1 untuk publikasi)</span>
              )}
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={currentSDGInput}
                onChange={(e) => setCurrentSDGInput(e.target.value)}
                className="text-gray-500 flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="">Pilih SDG...</option>
                {sdgOptions.map((sdg) => (
                  <option key={sdg} value={sdg}>
                    {sdg}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSDGTag}
                disabled={!currentSDGInput}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sdgTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeSDGTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            {formData.status === 'PUBLISHED' && formData.sdgTags.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Minimal satu SDG harus dipilih untuk publikasi</p>
            )}
          </div>

          {/* Tech Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline mr-1" size={16} />
              Teknologi yang Digunakan
              {formData.status === 'PUBLISHED' && (
                <span className="text-red-500 ml-1">*</span>
              )}
              {formData.status === 'PUBLISHED' && (
                <span className="text-xs text-gray-500 ml-1">(minimal 1 untuk publikasi)</span>
              )}
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentTechInput}
                onChange={(e) => setCurrentTechInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTechTag();
                  }
                }}
                className="text-black flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Masukkan teknologi..."
              />
              <button
                type="button"
                onClick={addTechTag}
                disabled={!currentTechInput}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300"
              >
                Tambah
              </button>
            </div>

            {/* Popular Tech Tags */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">
                Atau pilih dari teknologi populer:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTechTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addPopularTechTag(tag)}
                    disabled={formData.techTags.includes(tag)}
                    className="text-gray-400 text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-emerald-50 hover:border-emerald-300 disabled:bg-gray-100 disabled:text-gray-600"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.techTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTechTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            {formData.status === 'PUBLISHED' && formData.techTags.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Minimal satu teknologi harus dipilih untuk publikasi</p>
            )}
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Github className="inline mr-1" size={16} />
                GitHub Repository
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://github.com/username/repository"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ExternalLink className="inline mr-1" size={16} />
                Demo/Live URL
              </label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://your-demo-site.com"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Publikasi
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="PUBLISHED">Publikasikan Langsung</option>
              <option value="DRAFT">Simpan sebagai Draft</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.status === 'DRAFT' 
                ? "Draft tidak akan terlihat oleh publik dan tidak akan mendapat interaksi seperti like atau bookmark." 
                : "Proyek yang dipublikasikan akan terlihat oleh semua pengguna dan dapat mendapat interaksi."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={
                isLoading || 
                isUploading || 
                !!imageError || 
                !formData.title || 
                !formData.description
              }
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  {isEditMode ? "Menyimpan perubahan..." : "Menyimpan..."}
                </>
              ) : isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Mengupload...
                </>
              ) : (
                isEditMode ? "Simpan Perubahan" : "Submit Proyek"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShowcaseModal;