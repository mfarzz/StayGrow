'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  User
} from 'lucide-react';
import Image from 'next/image';

interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  techTags: string[];
  sdgTags: string[];
  status: string;
  userId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  _count: {
    likes: number;
    views: number;
    savedItems: number;
  };
}

const AdminShowcasePage: React.FC = () => {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'flag' | 'archive' | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false); // ✅ Tambah loading state

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const requestOptions: RequestInit = token 
        ? { headers: { 'Authorization': `Bearer ${token}` } }
        : {};
      
      const response = await fetch('/api/admin/showcase', requestOptions);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAction = async (projectId: string, action: 'approve' | 'flag' | 'archive' | 'delete', reason?: string) => {
    try {
      setActionLoading(true); // ✅ Set loading true saat mulai action
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/showcase/${projectId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action, reason }),
      });

      if (response.ok) {
        await fetchProjects();
        setModerationAction(null);
        setModerationReason('');
        setShowProjectModal(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} project:`, error);
    } finally {
      setActionLoading(false); // ✅ Set loading false setelah selesai
    }
  };  const filteredProjects = projects.filter(project => {
    // Don't show draft projects in admin panel
    if (project.status === 'DRAFT') {
      return false;
    }
    
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'FLAGGED': return 'bg-red-100 text-red-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Showcase Projects</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-xl"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Showcase Projects</h1>
          <p className="text-gray-600 mt-1">Moderate and manage showcase projects</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-600">Total Projects: </span>
            <span className="text-sm font-bold text-gray-900">{projects.length}</span>
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
              placeholder="Search projects by title, description, or author..."
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
            <option value="PUBLISHED">Published</option>
            <option value="FLAGGED">Flagged</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Project Image */}
            <div className="relative h-48 bg-gray-100">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Flags Indicator */}
              {project.status === 'FLAGGED' && (
                <div className="absolute top-3 right-3">
                  <div className="bg-red-500 text-white p-1 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setShowProjectModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

              {/* Author */}
              <div className="flex items-center space-x-2 mb-4">
                {project.user.avatarUrl ? (
                  <Image
                    src={project.user.avatarUrl}
                    alt={project.user.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
                <span className="text-sm text-gray-600">{project.user.name}</span>
              </div>

              {/* Technologies */}
              {project.techTags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.techTags.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techTags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{project.techTags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{project._count?.views || 0} views</span>
                <span>{project._count?.likes || 0} likes</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {project.status === 'FLAGGED' && (
                  <>
                    <button
                      onClick={() => handleProjectAction(project.id, 'approve')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleProjectAction(project.id, 'archive')}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Archive
                    </button>
                  </>
                )}
                
                {project.status === 'PUBLISHED' && (
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setModerationAction('flag');
                    }}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Flag
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No projects found matching your criteria</p>
        </div>
      )}

      {/* Project Detail Modal */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h4>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created {new Date(selectedProject.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Image */}
                {selectedProject.imageUrl && (
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>

                {/* SDG Tags */}
                {selectedProject.sdgTags.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">SDG Goals</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.sdgTags.map((sdg, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full border border-emerald-200"
                        >
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}


                {/* Technologies */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Technologies</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techTags.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                
                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">View on GitHub</span>
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">Live Demo</span>
                    </a>
                  )}
                </div>

                {/* Moderation Flags - Remove since not in schema */}
                {selectedProject.status === 'FLAGGED' && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Project Status</h5>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">This project has been flagged for review</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  {selectedProject.status === 'FLAGGED' && (
                    <>
                      <button
                        onClick={() => handleProjectAction(selectedProject.id, 'approve')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Project
                      </button>
                      <button
                        onClick={() => handleProjectAction(selectedProject.id, 'archive')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Archive Project
                      </button>
                    </>
                  )}
                  
                  {selectedProject.status === 'PUBLISHED' && (
                    <button
                      onClick={() => setModerationAction('flag')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Flag Project
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleProjectAction(selectedProject.id, 'delete')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Action Modal */}
      {moderationAction && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ margin: 0, padding: "1rem" }}>
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {moderationAction === 'flag' ? 'Flag Project' : 'Archive Project'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  placeholder="Please provide a reason for this action..."
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                  disabled={actionLoading} // ✅ Disable textarea saat loading
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleProjectAction(selectedProject.id, moderationAction, moderationReason)}
                  disabled={actionLoading || !moderationReason.trim()} // ✅ Disable saat loading atau reason kosong
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                    actionLoading || !moderationReason.trim()
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {actionLoading ? (
                    <>
                      {/* ✅ Spinner loading icon */}
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
                <button
                  onClick={() => {
                    setModerationAction(null);
                    setModerationReason('');
                  }}
                  disabled={actionLoading} // ✅ Disable cancel button saat loading
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    actionLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
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

export default AdminShowcasePage;
