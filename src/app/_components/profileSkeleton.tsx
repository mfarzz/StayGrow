import React from "react";

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Avatar Skeleton */}
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full animate-pulse mx-auto lg:mx-0"></div>
        
        {/* Profile Info Skeleton */}
        <div className="flex-1 text-center lg:text-left">
          <div className="h-8 lg:h-10 bg-gray-200 rounded-lg animate-pulse mb-2 w-48 mx-auto lg:mx-0"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-64 mx-auto lg:mx-0"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto lg:mx-0"></div>
        </div>
        
        {/* Edit Button Skeleton */}
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse mx-auto lg:mx-0"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Profile AI */}
        <div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-24"></div>
          <div className="space-y-4">
            {/* Interests */}
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-7 w-20 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Skills */}
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-7 w-24 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            
            {/* AI Match Score */}
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-32"></div>
              <div className="h-2 bg-gray-200 rounded-full animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mt-1 w-16"></div>
            </div>
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-20"></div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
            </div>
            
            {/* Stats Items */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileShowcaseSkeleton() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
      
      {/* Project Cards Skeleton Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-gray-50 rounded-lg p-4 space-y-3">
            {/* Image */}
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            
            {/* Content */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
            
            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-between pt-2">
              <div className="flex gap-4">
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
