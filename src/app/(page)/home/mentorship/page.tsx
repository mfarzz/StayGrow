"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import MentorshipCard from "@/app/_components/mentorShipCard"; // Adjust path as needed
import MentorCard from "@/app/_components/mentorCard"; // Adjust path as needed

export default function MentorshipPage() {
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

  // Placeholder for recommended mentors, can be fetched or expanded
  const [recommendedMentors] = useState([
    {
      id: 1,
      name: "Dr. Maria Sari",
      expertise: "Sustainable Business",
      experience: "15+ tahun",
      rating: 4.9,
      sessions: 124,
      avatar: null, // Add avatar if available
    },
    {
      id: 2,
      name: "Prof. Ahmad Fauzi",
      expertise: "Green Technology",
      experience: "20+ tahun",
      rating: 4.8,
      sessions: 89,
      avatar: null, // Add avatar if available
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          Mentorship
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 w-fit">
          <Plus size={16} /> Cari Mentor
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold mb-4">Sesi Mendatang</h3>
          <div className="space-y-4">
            {upcomingMentorships.map((session) => (
              <MentorshipCard key={session.id} session={session} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold mb-4">
            Mentor Rekomendasi
          </h3>
          <div className="space-y-4">
            {recommendedMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                name={mentor.name}
                expertise={mentor.expertise}
                experience={mentor.experience}
                rating={mentor.rating}
                sessions={mentor.sessions}
                // avatar={mentor.avatar} // Pass avatar if you have it
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}