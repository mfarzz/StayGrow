"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Heart as HeartIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  Briefcase as BriefcaseIcon,
  ChevronRight,
  Plus,
  UserPlus,
  Star,
  ArrowRight,
} from "lucide-react";

import StatCard from "../../_components/statCard"; // Adjust path as needed
import RecommendationCard from "../../_components/recomendationCard"; // Adjust path as needed
import MentorshipCard from "../../_components/mentorShipCard"; // Adjust path as needed
import { InteractiveProjectCard } from "../../_components/interactiveProjectCard";
import { useProfile } from "../../_hooks/useProfile"; // Adjust path as needed
import useShowcase from "../../_hooks/useShowcase"; // Adjust path as needed
import { useShowcaseActions } from "../../_hooks/useShowcaseActions";
import { useAuth } from "../../_hooks/useAuth";
import { useMentorApplication } from "../../_hooks/useMentorApplication";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { role } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { application: mentorApplication, canApply } = useMentorApplication();
  const { 
    loading: showcaseLoading, 
    error: showcaseError, 
    projects: showcaseProjects, 
    fetchProjects 
  } = useShowcase();

  const { fetchUserStates } = useShowcaseActions();

  // Calculate profile completion percentage
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

  const completionStatus = getCompletionStatus(profileCompletion);

  // Navigate to profile page for editing
  const handleProfileEdit = () => {
    router.push('/home/profile');
  };

  // Initialize user states when projects are loaded
  useEffect(() => {
    if (showcaseProjects.length > 0) {
      const projectIds = showcaseProjects.map(project => project.id);
      fetchUserStates(projectIds);
    }
  }, [showcaseProjects, fetchUserStates]);

  // State update handler for interactive project cards
  const handleProjectUpdate = (projectId: string, updates: Partial<{
    likes: number;
    saves: number;
    views: number;
    isLiked: boolean;
    isBookmarked: boolean;
  }>) => {
    console.log('Project updated:', projectId, updates);
  };

  const [quickStats] = useState({
    appliedJobs: 12,
    savedOpportunities: 8,
    mentorshipHours: 24,
    profileViews: 156,
  });

  // Fetch showcase projects on component mount
  useEffect(() => {
    fetchProjects({
      filter: "featured", // Show featured projects on dashboard
      limit: 4, // Limit to 4 projects for dashboard
      sortBy: "popular"
    });
  }, [fetchProjects]);

  const [recommendations] = useState([
    {
      id: 1,
      type: "career",
      title: "Data Scientist - Sustainable Technology",
      company: "EcoTech Indonesia",
      location: "Jakarta",
      match: 92,
      tags: ["AI", "Sustainability", "Python"],
      deadline: "2025-06-15",
    },
    {
      id: 2,
      type: "training",
      title: "Bootcamp Machine Learning untuk Lingkungan",
      provider: "GreenSkill Academy",
      duration: "8 minggu",
      match: 88,
      tags: ["ML", "Environment", "Certificate"],
      startDate: "2025-06-01",
    },
    {
      id: 3,
      type: "funding",
      title: "Grant Inovasi Teknologi Hijau 2025",
      provider: "Kementerian Lingkungan Hidup",
      amount: "Rp 500 juta",
      match: 85,
      tags: ["Innovation", "Grant", "Environment"],
      deadline: "2025-07-30",
    },
  ]);

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

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Selamat datang kembali, {profile?.name}! 👋
            </h2>
            <p className="text-emerald-100 text-base lg:text-lg">
              Mari lanjutkan perjalanan kariermu menuju masa depan berkelanjutan
            </p>
          </div>
          <div className="lg:block">
            {profileLoading ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[120px]">
                <div className="text-center">
                  <div className="h-8 bg-white/20 rounded animate-pulse mb-1"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleProfileEdit}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[120px] hover:bg-white/30 transition-all duration-200 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{profileCompletion}%</div>
                  <div className="text-sm text-emerald-100 mb-2">Profil Lengkap</div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-emerald-100/80">
                    {completionStatus.text}
                  </div>
                  
                  {profileCompletion < 90 && (
                    <div className="text-xs text-emerald-100/70 mt-1">
                      Klik untuk edit
                    </div>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={BriefcaseIcon}
          label="Lamaran Terkirim"
          value={quickStats.appliedJobs}
          color="blue"
        />
        <StatCard
          icon={HeartIcon}
          label="Peluang Disimpan"
          value={quickStats.savedOpportunities}
          color="red"
        />
        <StatCard
          icon={ClockIcon}
          label="Jam Mentorship"
          value={quickStats.mentorshipHours}
          color="purple"
        />
        <StatCard
          icon={EyeIcon}
          label="Profil Dilihat"
          value={quickStats.profileViews}
          color="green"
        />
      </div>

      {/* Mentor Application CTA - Only for PEMUDA who haven't applied */}
      {role === 'PEMUDA' && canApply() && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold">Jadi Mentor StayGrow</h3>
              </div>
              <p className="text-blue-100 text-base lg:text-lg mb-2">
                Bagikan pengalaman dan keahlian Anda untuk membantu pemuda lain berkembang
              </p>
              <p className="text-blue-200 text-sm">
                ✨ Bangun jaringan profesional • 🎯 Tingkatkan leadership skills • 💡 Berkontribusi untuk masa depan
              </p>
            </div>
            <div className="lg:block">
              <button
                onClick={() => router.push('/home/mentor-application')}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 min-w-fit"
              >
                <UserPlus size={20} />
                <span>Ajukan Sekarang</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show mentor application status for PEMUDA who already applied */}
      {role === 'PEMUDA' && mentorApplication && (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <UserPlus className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Status Pengajuan Mentor</h3>
              </div>
              <p className="text-gray-600 mb-2">
                Pengajuan Anda telah diterima dan sedang dalam proses review
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mentorApplication.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  mentorApplication.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mentorApplication.status === 'PENDING' ? 'Menunggu Review' :
                   mentorApplication.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                </span>
              </div>
            </div>
            <div className="lg:block">
              <button
                onClick={() => router.push('/home/mentor-application')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center gap-3 min-w-fit"
              >
                <span>Lihat Detail</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            Rekomendasi AI Untukmu
          </h3>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 w-fit">
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {recommendations.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Upcoming Mentorships */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            Mentorship Mendatang
          </h3>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 w-fit">
            <Plus size={16} /> Jadwalkan Baru
          </button>
        </div>
        <div className="space-y-4">
          {upcomingMentorships.map((session) => (
            <MentorshipCard key={session.id} session={session} />
          ))}
        </div>
      </div>

      {/* Showcase Projects */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            Showcase Proyek Inovatif
          </h3>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 w-fit" onClick={() => router.push('/home/showcase')}>
            Jelajahi Semua <ChevronRight size={16}/>
          </button>
        </div>
        
        {showcaseLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat proyek...</p>
          </div>
        ) : showcaseError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Gagal memuat proyek showcase</p>
            <button
              onClick={() => fetchProjects({
                filter: "featured",
                limit: 4,
                sortBy: "popular"
              })}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : showcaseProjects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {showcaseProjects.map((project) => (
              <InteractiveProjectCard 
                key={project.id} 
                project={project}
                onProjectUpdate={handleProjectUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada proyek showcase tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}