"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MapPin,
  User,
  Calendar,
  Eye,
  Star,
  BookmarkPlus,
  Share2,
  ExternalLink,
  Github,
  ArrowLeft,
} from "lucide-react";
import { useShowcaseActions } from "@/app/_hooks/useShowcaseActions";

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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<ShowcaseProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    likes,
    bookmarks,
    likeCounts,
    bookmarkCounts,
    loading: actionLoading,
    toggleLike,
    toggleBookmark,
    shareProject,
    initializeProjectState
  } = useShowcaseActions();

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/showcase/${projectId}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);
        
        // Initialize showcase actions state
        initializeProjectState(projectId, {
          isLiked: data.isLiked,
          isBookmarked: data.isBookmarked,
          likes: data.likes,
          bookmarks: data.saves
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, initializeProjectState]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || "Project not found"}
          </h3>
          <p className="text-gray-500 mb-4">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/home/showcase")}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Showcase
          </button>
        </div>
      </div>
    );
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentLikes = likeCounts[project.id] ?? project.likes;
    await toggleLike(project.id, currentLikes);
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentBookmarks = bookmarkCounts[project.id] ?? project.saves;
    await toggleBookmark(project.id, currentBookmarks);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareProject({
      id: project.id,
      title: project.title,
      author: project.author
    });
  };

  const isLiked = likes[project.id] ?? project.isLiked ?? false;
  const isBookmarked = bookmarks[project.id] ?? project.isBookmarked ?? false;
  const currentLikes = likeCounts[project.id] ?? project.likes;
  const currentBookmarks = bookmarkCounts[project.id] ?? project.saves;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Navigation */}
      <button
        onClick={() => router.push("/home/showcase")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Kembali ke Showcase
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Project Image */}
        <div className="relative h-80 lg:h-96">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {project.featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Star size={14} /> Featured
              </span>
            )}
            {project.aiMatchScore >= 85 && (
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                {project.aiMatchScore}% Match
              </span>
            )}
            <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
              {project.status}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleBookmark}
              disabled={actionLoading[`bookmark-${project.id}`]}
              className={`p-3 rounded-full transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
              } ${actionLoading[`bookmark-${project.id}`] ? 'animate-pulse' : ''}`}
            >
              <BookmarkPlus size={20} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
            >
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* SDG Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.sdgTags.map((tag: string) => (
              <span 
                key={tag} 
                className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              {project.avatarUrl ? (
                <Image
                  src={project.avatarUrl}
                  alt={project.author}
                  width={48}
                  height={48}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-emerald-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{project.author}</p>
              {project.authorRole && (
                <p className="text-sm text-gray-600">{project.authorRole}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {project.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Tags */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Teknologi yang Digunakan
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techTags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project Links */}
          {(project.githubUrl || project.demoUrl) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Link Proyek
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Github size={16} />
                    Source Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                disabled={actionLoading[`like-${project.id}`]}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-red-500'
                } ${actionLoading[`like-${project.id}`] ? 'animate-pulse' : ''}`}
              >
                <Heart 
                  size={20} 
                  className={isLiked ? 'fill-current' : ''}
                />
                <span className="font-medium">{currentLikes}</span>
              </button>
              
              <div className="flex items-center gap-2 text-gray-500">
                <Eye size={20} />
                <span className="font-medium">{project.views}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500">
                <BookmarkPlus 
                  size={20} 
                  className={isBookmarked ? 'fill-current text-emerald-600' : ''}
                />
                <span className="font-medium">{currentBookmarks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
