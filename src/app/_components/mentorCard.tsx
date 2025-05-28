// components/MentorCard.jsx
"use client"

import { Star } from 'lucide-react';

interface MentorCardProps {
  name: string;
  expertise: string;
  experience: string;
  rating: number;
  sessions: number;
}

export default function MentorCard({ name, expertise, experience, rating, sessions } : MentorCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold truncate">{name}</h5>
          <p className="text-sm text-gray-600 truncate">{expertise}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>{experience}</span>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-current" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{sessions} sesi</span>
        <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors">
          Hubungi
        </button>
      </div>
    </div>
  );
}