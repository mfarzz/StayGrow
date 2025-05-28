// components/ProjectCard.jsx
"use client"

import { 
  Heart, 
  Eye, 
  BookmarkPlus, 
  Share2, 
  Star, 
  User, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  author: string;
  authorRole?: string;
  authorId: string;
  location?: string;
  image: string;
  avatarUrl?: string;
  likes: number;
  views: number;
  saves?: number;
  sdgTags: string[];
  techTags?: string[];
  description: string;
  createdAt: string;
  featured?: boolean;
  aiMatchScore?: number;
  githubUrl?: string;
  demoUrl?: string;
  status?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <Image
          width={400}
          height={240} 
          src={project.image && project.image !== '/api/placeholder/300/200' && project.image !== '/api/placeholder/400/240' ? project.image : ''} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!project.image || project.image === '/api/placeholder/300/200' || project.image === '/api/placeholder/400/240' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-green-200 flex items-center justify-center text-emerald-700 font-semibold text-sm">
            Project Image Placeholder
          </div>
        ) : null}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Star size={12} /> Featured
            </span>
          )}
          {project.aiMatchScore && project.aiMatchScore >= 85 && (
            <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {project.aiMatchScore}% Match
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <BookmarkPlus size={16} className="text-gray-600" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* SDG Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.sdgTags?.slice(0, 3).map((tag: string) => (
            <span 
              key={tag} 
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {project.sdgTags?.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
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
        {project.techTags && project.techTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techTags.slice(0, 3).map((tag: string) => (
              <span 
                key={tag} 
                className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.techTags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{project.techTags.length - 3} lainnya
              </span>
            )}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{project.author}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {project.location && (
                  <>
                    <MapPin size={12} />
                    {project.location}
                    <span>•</span>
                  </>
                )}
                <Calendar size={12} />
                {new Date(project.createdAt).toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
              <Heart size={16} />
              <span className="text-sm">{project.likes || 0}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-500">
              <Eye size={16} />
              <span className="text-sm">{project.views || 0}</span>
            </div>
            {project.saves !== undefined && (
              <div className="flex items-center gap-1 text-gray-500">
                <BookmarkPlus size={16} />
                <span className="text-sm">{project.saves}</span>
              </div>
            )}
          </div>
          <button className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}