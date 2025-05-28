"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useProfile } from "@/app/_hooks/useProfile"; // Adjust path as needed
import useShowcase from "@/app/_hooks/useShowcase"; // Import useShowcase hook
import EditProfileModal from "@/app/_modal/editProfile";
import AddShowcaseModal from "@/app/_modal/addShowcase";
import ManageShowcaseModal from "@/app/_modal/manageShowcase";
import { useNotification } from "@/app/_hooks/useNotification";
import Notification from "@/app/_components/notification";
import { InteractiveProjectCard } from "@/app/_components/interactiveProjectCard";
import { ProjectCardSkeletonGrid } from "@/app/_components/projectCardSkeleton";
import { ProfileSkeleton, ProfileShowcaseSkeleton } from "@/app/_components/profileSkeleton";

export default function ProfilePage() {
  const { profile, updateProfile, updating, loading: profileLoading } = useProfile();
  const { 
    loading: showcaseLoading, 
    error: showcaseError, 
    projects: showcaseProjects, 
    fetchProjects,
    deleteProject 
  } = useShowcase();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddShowcaseOpen, setIsAddShowcaseOpen] = useState(false);
  const [isManageShowcaseOpen, setIsManageShowcaseOpen] = useState(false);
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  // Fetch user's showcase projects on component mount
  useEffect(() => {
    if (profile?.id) {
      fetchProjects({
        filter: "all", // Get all projects from this user
        limit: 10, // Show more projects in profile
        sortBy: "newest",
        userId: profile.id // Filter by current user's ID
      });
    }
  }, [fetchProjects, profile?.id]);

  const [upcomingMentorships] = useState([
    {
      id: 1,
      mentorName: "Dr. Sarah Wijaya",
      topic: "Career Planning in Tech Industry",
      date: "2025-05-26",
      time: "14:00",
      status: "ACCEPTED" as const,
      mentorAvatar: null,
      expertise: "Technology Leadership",
    },
    {
      id: 2,
      mentorName: "Prof. Andi Rahman",
      topic: "Sustainable Innovation Strategy",
      date: "2025-05-28",
      time: "10:00",
      status: "REQUESTED" as const,
      mentorAvatar: null,
      expertise: "Environmental Engineering",
    },
  ]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      { field: "name", weight: 20 },
      { field: "bio", weight: 20 },
      { field: "location", weight: 15 },
      { field: "phone", weight: 15 },
      { field: "avatarUrl", weight: 20 },
      { field: "email", weight: 10 }, // Usually always present
    ];

    let totalWeight = 0;
    let completedWeight = 0;

    fields.forEach(({ field, weight }) => {
      totalWeight += weight;
      const value = profile[field as keyof typeof profile];

      if (value && typeof value === "string" && value.trim().length > 0) {
        completedWeight += weight;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  }, [profile]);

  // Get completion status for display
  const getCompletionStatus = (percentage: number) => {
    if (percentage >= 90)
      return { text: "Sangat Lengkap", color: "text-green-600" };
    if (percentage >= 70)
      return { text: "Cukup Lengkap", color: "text-blue-600" };
    if (percentage >= 50)
      return { text: "Perlu Dilengkapi", color: "text-yellow-600" };
    return { text: "Belum Lengkap", color: "text-red-600" };
  };

  // Get missing fields for user guidance
  const getMissingFields = useMemo(() => {
    if (!profile) return [];

    const fieldsToCheck = [
      { field: "name", label: "Nama" },
      { field: "bio", label: "Bio" },
      { field: "location", label: "Lokasi" },
      { field: "phone", label: "Nomor Telepon" },
      { field: "avatarUrl", label: "Foto Profil" },
    ];

    return fieldsToCheck
      .filter(({ field }) => {
        const value = profile[field as keyof typeof profile];
        return (
          !value || (typeof value === "string" && value.trim().length === 0)
        );
      })
      .map(({ label }) => label);
  }, [profile]);

  // State update handler for interactive project cards
  const handleProjectUpdate = (projectId: string, updates: Partial<{
    likes: number;
    saves: number;
    views: number;
    isLiked: boolean;
    isBookmarked: boolean;
  }>) => {
    // This would typically update the local state or trigger a refetch
    // For now, we'll handle this optimistically in the useShowcaseActions hook
    console.log('Project updated:', projectId, updates);
  };

  // Handle multiple project deletion
  const handleDeleteProjects = async (projectIds: string[]) => {
    if (!profile?.id) {
      showError("Error", "User not authenticated");
      return { success: false };
    }

    try {
      const deletePromises = projectIds.map(projectId => 
        deleteProject(projectId, profile.id)
      );
      
      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(result => !result.success);
      
      if (failedDeletes.length === 0) {
        showSuccess(
          "Berhasil menghapus proyek", 
          `${projectIds.length} proyek berhasil dihapus`
        );
        // Refresh projects list
        await fetchProjects({
          filter: "all",
          limit: 10,
          sortBy: "newest",
          userId: profile.id
        });
        return { success: true };
      } else {
        showError(
          "Gagal menghapus beberapa proyek", 
          `${failedDeletes.length} dari ${projectIds.length} proyek gagal dihapus`
        );
        return { success: false };
      }
    } catch (err) {
      console.error("Error deleting projects:", err);
      showError("Error", "Terjadi kesalahan saat menghapus proyek");
      return { success: false };
    }
  };

  const handleSaveProfile = async (formData: {
    name?: string;
    bio?: string;
    location?: string;
    phone?: string;
    avatarUrl?: string;
  }) => {
    try {
      await updateProfile({
        name: formData.name || "",
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl,
      });
      setIsEditProfileOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      showSuccess(
        "Berhasil mengupdate profil",
        "Profil Anda telah berhasil diupdate"
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      showError("Gagal mengupdate profil", "Profil Anda gagal diupdate");
    }
  };

  const handleAddShowcase = async (projectData: {
    title: string;
    description: string;
    imageUrl?: string;
    sdgTags: string[];
    techTags: string[];
    githubUrl?: string;
    demoUrl?: string;
    status?: string;
  }) => {
    try {
      // Call your showcase API to create new project
      const response = await fetch('/api/showcase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const newProject = await response.json();
        setIsAddShowcaseOpen(false);
        
        // Refresh the showcase projects
        if (profile?.id) {
          fetchProjects({
            filter: "all",
            limit: 10,
            sortBy: "newest",
            userId: profile.id
          });
        }
        
        showSuccess(
          "Proyek berhasil ditambahkan",
          "Proyek showcase Anda telah berhasil dibuat"
        );
        
        return { success: true, project: newProject };
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error("Failed to create showcase project:", error);
      showError(
        "Gagal membuat proyek",
        "Terjadi kesalahan saat membuat proyek showcase"
      );
      return { success: false };
    }
  };

  const completionStatus = getCompletionStatus(profileCompletion);

  return (
    <div className="max-w-4xl space-y-6 lg:space-y-8">
      <Notification
        show={notification.show}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        description={notification.description}
        autoClose={true}
        autoCloseDelay={notification.type === "success" ? 3000 : 5000}
      />
      
      {/* Profile Section */}
      {profileLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-6 lg:mb-8">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold mx-auto lg:mx-0">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name || "User Avatar"}
                width={96}
                height={96}
                priority
                loading="eager"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-2xl lg:text-3xl font-bold flex items-center justify-center rounded-full">
                {profile?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {profile?.name}
            </h2>
            <p className="text-gray-600 mb-2">{profile?.bio}</p>
            <div className="flex items-center gap-2 text-gray-500 justify-center lg:justify-start">
              <MapPin size={16} />
              <span>{profile?.location}</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            disabled={updating}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors w-fit mx-auto lg:mx-0 flex items-center gap-2"
          >
            {updating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              "Edit Profil"
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-4 text-black">
              Profil AI
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minat
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Teknologi", "Lingkungan", "Inovasi", "AI/ML"].map(
                    (interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keahlian
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python",
                    "Data Analysis",
                    "Sustainability",
                    "Research",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-4 text-black">
              Statistik
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Kelengkapan Profil</span>
                  <div className="text-right">
                    <span className="font-semibold text-black">{profileCompletion}%</span>
                    <div className={`text-xs ${completionStatus.color}`}>
                      {completionStatus.text}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      profileCompletion >= 90 ? 'bg-green-600' :
                      profileCompletion >= 70 ? 'bg-blue-600' :
                      profileCompletion >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                {getMissingFields.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span>Belum diisi: </span>
                    <span className="text-gray-700">
                      {getMissingFields.join(', ')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Proyek Showcase</span>
                <span className="font-semibold text-black">
                  {showcaseLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
                  ) : showcaseError ? (
                    <span className="text-red-500">Error</span>
                  ) : (
                    showcaseProjects?.length || 0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sesi Mentorship</span>
                <span className="font-semibold text-black">
                  {upcomingMentorships?.filter((s) => s.status === "ACCEPTED")
                    ?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Showcase Projects Section */}
      {profileLoading ? (
        <ProfileShowcaseSkeleton />
      ) : (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            Proyek Showcase Saya
          </h3>
          <button 
            onClick={() => setIsManageShowcaseOpen(true)}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            Kelola Proyek
          </button>
        </div>
        
        {showcaseLoading ? (
          <ProjectCardSkeletonGrid count={6} />
        ) : showcaseError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Gagal memuat proyek showcase</p>
            <button
              onClick={() => fetchProjects({
                filter: "all",
                limit: 10,
                sortBy: "newest",
                userId: profile?.id || ""
              })}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : showcaseProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
              <span className="text-gray-400 text-2xl">📂</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Belum ada proyek showcase</h4>
            <p className="text-gray-500 mb-4">Mulai berkarya dan bagikan proyekmu untuk menginspirasi yang lain</p>
            <button 
              onClick={() => setIsAddShowcaseOpen(true)}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Buat Proyek Pertama
            </button>
          </div>
        )}
      </div>
      )}

      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          profile={
            profile || {
              name: "",
              email: "",
              bio: "",
              location: "",
              phone: "",
              avatarUrl: "",
            }
          }
          onSave={handleSaveProfile}
        />
      )}

      {isAddShowcaseOpen && (
        <AddShowcaseModal
          isOpen={isAddShowcaseOpen}
          onClose={() => setIsAddShowcaseOpen(false)}
          onSubmit={handleAddShowcase}
        />
      )}

      {isManageShowcaseOpen && (
        <ManageShowcaseModal
          isOpen={isManageShowcaseOpen}
          onClose={() => setIsManageShowcaseOpen(false)}
          projects={showcaseProjects}
          onDelete={handleDeleteProjects}
          onAddNew={() => {
            setIsManageShowcaseOpen(false);
            setIsAddShowcaseOpen(true);
          }}
          loading={showcaseLoading}
        />
      )}
    </div>
  );
}
