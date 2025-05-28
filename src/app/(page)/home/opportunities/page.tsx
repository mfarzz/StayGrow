"use client";

import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import RecommendationCard from "@/app/_components/recomendationCard"; // Adjust path as needed

export default function OpportunitiesPage() {
  // Initial recommendations, can be expanded or fetched
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

  // Additional opportunities specific to this page
  const [moreOpportunities] = useState([
    {
      id: 4,
      type: "job",
      title: "Frontend Developer - Climate Tech",
      company: "GreenWeb Solutions",
      location: "Remote",
      match: 78,
      tags: ["React", "TypeScript", "Climate"],
      deadline: "2025-06-20",
    },
    {
      id: 5,
      type: "training",
      title: "Workshop Energi Terbarukan",
      provider: "Renewable Academy",
      duration: "3 hari",
      match: 82,
      tags: ["Solar", "Wind", "Workshop"],
      startDate: "2025-06-10",
    },
    {
      id: 6,
      type: "funding",
      title: "Seed Funding untuk Startup Hijau",
      provider: "EcoVenture Capital",
      amount: "Rp 2 miliar",
      match: 90,
      tags: ["Startup", "Investment", "Green"],
      deadline: "2025-08-15",
    },
  ]);

  const allOpportunities = recommendations.concat(moreOpportunities);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          Peluang Karier
        </h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm lg:text-base">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm lg:text-base">
            <Plus size={16} /> Posting Peluang
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {allOpportunities.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}