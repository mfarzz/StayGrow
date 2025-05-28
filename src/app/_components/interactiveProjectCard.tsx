import React, { useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  User,
  Calendar,
  Eye,
  Star,
  BookmarkPlus,
  Share2,
  ExternalLink,
  Edit,
} from "lucide-react";
import { useShowcaseActions } from "@/app/_hooks/useShowcaseActions";
import { useAuth } from "@/app/_hooks/useAuth";

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

interface ProjectCardProps {
  project: ShowcaseProject;
  onProjectUpdate?: (projectId: string, updates: Partial<ShowcaseProject>) => void;
  onEditProject?: (project: ShowcaseProject) => void;
}

export const InteractiveProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onProjectUpdate,
  onEditProject,
}) => {
  const { userId } = useAuth({ redirectOnFailure: false });
  
  // Validate project data
  useEffect(() => {
    if (!project?.id) {
      console.error('InteractiveProjectCard: Missing project ID', project);
    }
    if (!project?.title) {
      console.error('InteractiveProjectCard: Missing project title', project);
    }
  }, [project]);

  const {
    likes,
    bookmarks,
    likeCounts,
    bookmarkCounts,
    loading,
    toggleLike,
    toggleBookmark,
    shareProject,
    viewProject,
    initializeProjectState
  } = useShowcaseActions();

  // Initialize project state
  useEffect(() => {
    initializeProjectState(project.id, {
      isLiked: project.isLiked,
      isBookmarked: project.isBookmarked,
      likes: project.likes,
      bookmarks: project.saves
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, project.isLiked, project.isBookmarked, project.likes, project.saves]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentLikes = likeCounts[project.id] ?? project.likes;
    await toggleLike(project.id, currentLikes);
    
    // Update parent component if callback provided
    if (onProjectUpdate) {
      onProjectUpdate(project.id, {
        likes: likeCounts[project.id] ?? currentLikes,
        isLiked: likes[project.id]
      });
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentBookmarks = bookmarkCounts[project.id] ?? project.saves;
    await toggleBookmark(project.id, currentBookmarks);
    
    // Update parent component if callback provided
    if (onProjectUpdate) {
      onProjectUpdate(project.id, {
        saves: bookmarkCounts[project.id] ?? currentBookmarks,
        isBookmarked: bookmarks[project.id]
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareProject({
      id: project.id,
      title: project.title,
      author: project.author
    });
  };

  const handleViewDetail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handleViewDetail clicked for project:', project.id, project.title);
    
    if (!project.id) {
      console.error('Project ID is missing:', project);
      alert('Error: Project ID tidak ditemukan');
      return;
    }
    
    // Check if user is the project owner
    const isOwner = userId && userId === project.authorId;
    if (isOwner) {
      console.log('User is project owner, views will not be tracked');
    }
    
    try {
      await viewProject(project.id);
    } catch (error) {
      console.error('Error in handleViewDetail:', error);
      alert('Error: Gagal membuka detail proyek');
    }
  };

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditProject) {
      onEditProject(project);
    }
  };

  const isLiked = likes[project.id] ?? project.isLiked ?? false;
  const isBookmarked = bookmarks[project.id] ?? project.isBookmarked ?? false;
  const currentLikes = likeCounts[project.id] ?? project.likes;
  const currentBookmarks = bookmarkCounts[project.id] ?? project.saves;

  // Check if project is in draft status
  const isDraft = project.status === 'DRAFT';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <Image
          width={400}
          height={240} 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {project.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Star size={12} /> Featured
            </span>
          )}
          {project.aiMatchScore >= 85 && (
            <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {project.aiMatchScore}% Match
            </span>
          )}
        </div>
        {/* Only show bookmark and share buttons if not draft */}
        {!isDraft && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              onClick={handleBookmark}
              disabled={loading[`bookmark-${project.id}`]}
              className={`p-2 rounded-full transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
              } ${loading[`bookmark-${project.id}`] ? 'animate-pulse' : ''}`}
            >
              <BookmarkPlus size={16} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* SDG Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.sdgTags.slice(0, 3).map((tag: string) => (
            <span 
              key={tag} 
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {project.sdgTags.length > 3 && (
            <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
              +{project.sdgTags.length - 3} lainnya
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techTags.slice(0, 4).map((tag: string) => (
            <span 
              key={tag} 
              className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {project.techTags.length > 4 && (
            <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
              +{project.techTags.length - 4}
            </span>
          )}
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-7 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
              {project.avatarUrl ? (
                <Image
                  src={project.avatarUrl}
                  alt={project.author}
                  height={32}
                  width={31}
                  className="object-cover"
                />
              ) : (
                <User size={16} className="text-emerald-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{project.author}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={12} />
                {new Date(project.createdAt).toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Only show stats if not draft */}
          {!isDraft ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleLike}
                disabled={loading[`like-${project.id}`]}
                className={`flex items-center gap-1 transition-all duration-200 ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-red-500'
                } ${loading[`like-${project.id}`] ? 'animate-pulse' : ''}`}
              >
                <Heart 
                  size={16} 
                  className={isLiked ? 'fill-current' : ''}
                />
                <span className="text-sm font-medium">{currentLikes}</span>
              </button>
              <div className="flex items-center gap-1 text-gray-500">
                <Eye size={16} />
                <span className="text-sm">{project.views}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <BookmarkPlus 
                  size={16} 
                  className={isBookmarked ? 'fill-current text-emerald-600' : ''}
                />
                <span className="text-sm">{currentBookmarks}</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          
          {/* Action button */}
          {isDraft ? (
            <button 
              onClick={handleEditProject}
              className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-1"
              data-testid="edit-project-button"
              title={`Edit proyek ${project.title}`}
            >
              Edit
              <Edit size={14} />
            </button>
          ) : (
            <button 
              onClick={handleViewDetail}
              className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1"
              data-testid="lihat-detail-button"
              title={`Lihat detail proyek ${project.title}`}
            >
              Lihat Detail
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};