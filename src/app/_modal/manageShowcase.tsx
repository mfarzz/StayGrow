import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Eye,
  Heart,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

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
}

interface ManageShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ShowcaseProject[];
  onDelete: (projectIds: string[]) => Promise<{ success: boolean; message?: string }>;
  onAddNew: () => void;
  onEditProject?: (project: ShowcaseProject) => void;
  loading: boolean;
}

const ManageShowcaseModal = ({
  isOpen,
  onClose,
  projects,
  onDelete,
  onAddNew,
  onEditProject,
  loading,
}: ManageShowcaseModalProps) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProjects([]);
      setShowDeleteConfirm(false);
      setActiveTab('all');
    }
  }, [isOpen]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Filter projects based on the active tab
  const filteredProjects = React.useMemo(() => {
    if (activeTab === 'all') {
      return projects;
    } else if (activeTab === 'published') {
      return projects.filter(project => project.status === 'PUBLISHED');
    } else {
      return projects.filter(project => project.status === 'DRAFT');
    }
  }, [projects, activeTab]);

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;

    setIsDeleting(true);
    const result = await onDelete(selectedProjects);
    
    if (result.success) {
      setSelectedProjects([]);
      setShowDeleteConfirm(false);
    }
    setIsDeleting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ margin: 0, padding: "1rem" }}>
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Proyek Showcase</h2>
            <p className="text-gray-600 mt-1">
              Kelola semua proyek showcase Anda dengan mudah
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 px-6 pt-6 bg-gray-50">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 border-t border-r border-l border-gray-200'
                : 'text-gray-500 hover:text-gray-700 bg-gray-100'
            }`}
          >
            Semua Proyek ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`py-2 px-4 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === 'published'
                ? 'bg-white text-gray-900 border-t border-r border-l border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Published ({projects.filter(p => p.status === 'PUBLISHED').length})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`py-2 px-4 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === 'draft'
                ? 'bg-white text-gray-900 border-t border-r border-l border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Draft ({projects.filter(p => p.status === 'DRAFT').length})
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onAddNew}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Proyek Baru
            </button>
            
            {filteredProjects.length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">
                  Pilih Semua ({selectedProjects.length} dari {filteredProjects.length})
                </span>
              </div>
            )}
          </div>

          {selectedProjects.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Hapus ({selectedProjects.length})
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat proyek...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📂</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Belum ada proyek showcase</h4>
              <p className="text-gray-500 mb-4">Mulai berkarya dan bagikan proyekmu untuk menginspirasi yang lain</p>
              <button 
                onClick={onAddNew}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Buat Proyek Pertama
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📂</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'published' ? 'Belum ada proyek published' : 'Belum ada proyek draft'}
              </h4>
              <p className="text-gray-500 mb-4">
                {activeTab === 'published' 
                  ? 'Anda belum mempublikasikan proyek apa pun'
                  : 'Anda tidak memiliki proyek draft'}
              </p>
              <button 
                onClick={onAddNew}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Buat Proyek Baru
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className={`border ${
                    project.status === 'DRAFT' 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200'
                  } rounded-lg p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    {/* Project Image */}
                    <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {project.image && project.image !== '/api/placeholder/300/200' && project.image !== '/api/placeholder/400/240' ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-emerald-200 to-green-200 flex items-center justify-center text-emerald-700 text-xs font-medium">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.sdgTags.slice(0, 2).map((tag) => (
                              <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {project.sdgTags.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                +{project.sdgTags.length - 2} lainnya
                              </span>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart size={12} />
                              {project.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              {project.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(project.createdAt).toLocaleDateString('id-ID')}
                            </div>
                            {project.featured && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {project.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                          </span>
                          
                          {project.status === 'DRAFT' && (
                            <button 
                              className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit draft
                                onClose();
                                // This assumes there's an onEditProject prop passed to ManageShowcaseModal
                                // We'll implement this next
                                if (typeof onEditProject === 'function') {
                                  onEditProject(project);
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Konfirmasi Hapus</h3>
                  <p className="text-gray-600 text-sm">
                    Apakah Anda yakin ingin menghapus {selectedProjects.length} proyek? 
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageShowcaseModal;
