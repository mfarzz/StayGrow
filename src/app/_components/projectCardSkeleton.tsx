import React from "react";

interface ProjectCardSkeletonProps {
  count?: number;
}

const ProjectCardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="relative overflow-hidden h-48">
        <div className="w-full h-full bg-gray-200"></div>
        {/* Featured/Match Badge Skeleton */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
        </div>
        {/* Action Buttons Skeleton */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
          <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* SDG Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
          <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
          <div className="bg-gray-200 h-6 w-12 rounded-full"></div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="bg-gray-200 h-6 w-4/5 rounded"></div>
          <div className="bg-gray-200 h-6 w-3/5 rounded"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
        </div>

        {/* Tech Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-gray-200 h-5 w-14 rounded-full"></div>
          <div className="bg-gray-200 h-5 w-18 rounded-full"></div>
          <div className="bg-gray-200 h-5 w-16 rounded-full"></div>
          <div className="bg-gray-200 h-5 w-12 rounded-full"></div>
        </div>

        {/* Author Info Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="space-y-1">
              <div className="bg-gray-200 h-4 w-24 rounded"></div>
              <div className="bg-gray-200 h-3 w-32 rounded"></div>
            </div>
          </div>
        </div>

        {/* External Links Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
          <div className="bg-gray-200 h-6 w-12 rounded-full"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="bg-gray-200 h-4 w-4 rounded"></div>
              <div className="bg-gray-200 h-4 w-6 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-gray-200 h-4 w-4 rounded"></div>
              <div className="bg-gray-200 h-4 w-6 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-gray-200 h-4 w-4 rounded"></div>
              <div className="bg-gray-200 h-4 w-6 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-200 h-8 w-24 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const ProjectCardSkeletonGrid: React.FC<ProjectCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
};

export { ProjectCardSkeleton, ProjectCardSkeletonGrid };
