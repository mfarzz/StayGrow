// components/MentorshipCard.jsx
"use client"

import { Calendar, Clock } from 'lucide-react';

interface Session {
  mentorName: string;
  expertise: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'DONE';
  topic: string;
  date: string;
  time: string;
}

export default function MentorshipCard({ session }: { session: Session }) {
  const statusColors = {
    REQUESTED: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    DONE: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {session.mentorName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-semibold truncate">{session.mentorName}</h5>
            <p className="text-sm text-gray-600 truncate">{session.expertise}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[session.status] || 'bg-gray-100 text-gray-800'}`}>
          {session.status}
        </span>
      </div>

      <p className="text-gray-700 mb-2 text-sm lg:text-base line-clamp-2">{session.topic}</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {session.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {session.time}
        </span>
      </div>
    </div>
  );
}