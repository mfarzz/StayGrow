"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  Award,
} from "lucide-react";
import useShowcase from "@/app/_hooks/useShowcase";
import { useShowcaseActions } from "@/app/_hooks/useShowcaseActions";
import AddShowcaseModal from "@/app/_modal/addShowcase";
import { InteractiveProjectCard } from "@/app/_components/interactiveProjectCard";
import { ProjectCardSkeletonGrid } from "@/app/_components/projectCardSkeleton";

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

export default function ShowcasePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSDG, setSelectedSDG] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    loading,
    error,
    projects: showcaseProjects,
    pagination,
    fetchProjects,
    createProject,
  } = useShowcase();

  const { fetchUserStates } = useShowcaseActions();

  // Initialize user states when projects are loaded
  useEffect(() => {
    if (showcaseProjects.length > 0) {
      const projectIds = showcaseProjects.map(project => project.id);
      fetchUserStates(projectIds);
    }
  }, [showcaseProjects, fetchUserStates]);

  // State update handler for interactive project cards
  const handleProjectUpdate = (projectId: string, updates: Partial<ShowcaseProject>) => {
    // This would typically update the local state or trigger a refetch
    // For now, we'll handle this optimistically in the useShowcaseActions hook
    console.log('Project updated:', projectId, updates);
  };

  useEffect(() => {
    fetchProjects({
      search: searchQuery,
      filter: selectedFilter,
      sdg: selectedSDG,
      sortBy: sortBy,
    });
  }, [searchQuery, selectedFilter, selectedSDG, sortBy, fetchProjects]);

  const handleCreateProject = async (projectData: {
    title: string;
    description: string;
    imageUrl?: string;
    sdgTags: string[];
    techTags: string[];
    githubUrl?: string;
    demoUrl?: string;
    status?: string;
  }) => {
    const result = await createProject(projectData);
    if (result.success) {
      // Refresh the projects list
      await fetchProjects({
        search: searchQuery,
        filter: selectedFilter,
        sdg: selectedSDG,
        sortBy: sortBy,
      });
    }
    return result;
  };

  const filterOptions = [
    { value: "all", label: "Semua Proyek" },
    { value: "featured", label: "Proyek Unggulan" },
    { value: "recent", label: "Terbaru" },
    { value: "popular", label: "Terpopuler" },
    { value: "ai-match", label: "Cocok Untukmu" },
    { value: "liked", label: "Proyek Disukai" },
    { value: "bookmarked", label: "Proyek Tersimpan" },
  ];

  const sdgOptions = [
    { value: "all", label: "Semua SDG" },
    { value: "SDG 1", label: "SDG 1 - No Poverty" },
    { value: "SDG 2", label: "SDG 2 - Zero Hunger" },
    { value: "SDG 3", label: "SDG 3 - Good Health and Well-being" },
    { value: "SDG 4", label: "SDG 4 - Quality Education" },
    { value: "SDG 5", label: "SDG 5 - Gender Equality" },
    { value: "SDG 6", label: "SDG 6 - Clean Water and Sanitation" },
    { value: "SDG 7", label: "SDG 7 - Affordable and Clean Energy" },
    { value: "SDG 8", label: "SDG 8 - Decent Work and Economic Growth" },
    { value: "SDG 9", label: "SDG 9 - Industry, Innovation and Infrastructure" },
    { value: "SDG 10", label: "SDG 10 - Reduced Inequalities" },
    { value: "SDG 11", label: "SDG 11 - Sustainable Cities and Communities" },
    { value: "SDG 12", label: "SDG 12 - Responsible Consumption and Production" },
    { value: "SDG 13", label: "SDG 13 - Climate Action" },
    { value: "SDG 14", label: "SDG 14 - Life Below Water" },
    { value: "SDG 15", label: "SDG 15 - Life on Land" },
    { value: "SDG 16", label: "SDG 16 - Peace, Justice and Strong Institutions" },
    { value: "SDG 17", label: "SDG 17 - Partnerships for the Goals" }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Showcase Proyek Inovatif 🚀
          </h1>
          <p className="text-emerald-100 text-lg lg:text-xl mb-6">
            Temukan inspirasi dari proyek-proyek berkelanjutan yang dibuat oleh pemuda Indonesia untuk menciptakan dampak positif
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2 w-fit"
            >
              <Plus size={20} />
              Submit Proyek Kamu
            </button>
            <button 
              onClick={() => router.push('/home/showcase/guide')}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2 w-fit"
            >
              <Award size={20} />
              Panduan Showcase
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari proyek, teknologi, atau nama author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-400 focus:text-black lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Filter
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-gray-400 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white focus:text-gray-900"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSDG}
              onChange={(e) => setSelectedSDG(e.target.value)}
              className="text-gray-400 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white min-w-48 focus:text-gray-900"
            >
              {sdgOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-gray-400 focus:text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSDG}
              onChange={(e) => setSelectedSDG(e.target.value)}
              className="text-gray-400 focus:text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              {sdgOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-gray-600">
          Menampilkan <span className="font-medium text-gray-900">{showcaseProjects.length}</span> proyek
          {searchQuery && (
            <span> untuk &quot;<span className="font-medium text-gray-900">{searchQuery}</span>&quot;</span>
          )}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Urutkan:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-gray-400 focus:text-gray-900 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Terpopuler</option>
            <option value="likes">Paling Disukai</option>
            <option value="match">AI Match Score</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="space-y-6">
          <ProjectCardSkeletonGrid count={6} />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500">!</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi kesalahan</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => fetchProjects({
              search: searchQuery,
              filter: selectedFilter,
              sdg: selectedSDG,
              sortBy: sortBy,
            })}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Coba Lagi
          </button>
        </div>
      ) : showcaseProjects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseProjects.map((project) => (
            <InteractiveProjectCard 
              key={project.id} 
              project={project}
              onProjectUpdate={handleProjectUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada proyek ditemukan</h3>
          <p className="text-gray-500 mb-4">Coba ubah kata kunci pencarian atau filter yang digunakan</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
              setSelectedSDG("all");
            }}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Load More */}
      {pagination?.hasNextPage && (
        <div className="text-center">
          <button 
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            onClick={() => fetchProjects({
              search: searchQuery,
              filter: selectedFilter,
              sdg: selectedSDG,
              sortBy: sortBy,
              page: (pagination?.currentPage || 1) + 1,
            })}
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}

      {/* Add Showcase Modal */}
      <AddShowcaseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}