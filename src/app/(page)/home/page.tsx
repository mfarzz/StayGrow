"use client";

import { useState, useEffect } from "react";
import {
  Heart as HeartIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  Briefcase as BriefcaseIcon,
  ChevronRight,
  Plus,
} from "lucide-react";

import StatCard from "../../_components/statCard"; // Adjust path as needed
import RecommendationCard from "../../_components/recomendationCard"; // Adjust path as needed
import MentorshipCard from "../../_components/mentorShipCard"; // Adjust path as needed
import ProjectCard from "../../_components/projectCard"; // Adjust path as needed
import { useProfile } from "../../_hooks/useProfile"; // Adjust path as needed
import useShowcase from "../../_hooks/useShowcase"; // Adjust path as needed

export default function DashboardPage() {
  const { profile } = useProfile();
  const { 
    loading: showcaseLoading, 
    error: showcaseError, 
    projects: showcaseProjects, 
    fetchProjects 
  } = useShowcase();

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
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-fit">
              <div className="text-center">
                <div className="text-2xl font-bold">75</div>
                <div className="text-sm text-emerald-100">Profil Lengkap</div>
              </div>
            </div>
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
          <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 w-fit">
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
              <ProjectCard key={project.id} project={project} />
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