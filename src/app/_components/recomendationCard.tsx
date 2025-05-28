"use client"

import { Briefcase, GraduationCap, DollarSign, Target } from 'lucide-react';

export interface Recommendation {
  id: number;
  type: 'career' | 'job' | 'training' | 'funding' | string;
  title: string;
  company?: string; // Optional for training/funding
  provider?: string; // Optional for job/career
  location?: string;
  match: number;
  tags: string[];
  deadline?: string;
  duration?: string;
  startDate?: string;
  amount?: string;
}

export default function RecommendationCard({ item } : { item: Recommendation }) {
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'job':
      case 'career': return <Briefcase size={20} />;
      case 'training': return <GraduationCap size={20} />;
      case 'funding': return <DollarSign size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'job':
      case 'career': return 'text-blue-600 bg-blue-50';
      case 'training': return 'text-purple-600 bg-purple-50';
      case 'funding': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
          {getTypeIcon(item.type)}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Match</div>
          <div className="text-lg font-bold text-emerald-600">{item.match}%</div>
        </div>
      </div>

      <h4 className="font-bold text-base lg:text-lg mb-2 line-clamp-2">{item.title}</h4>
      <p className="text-gray-600 mb-3 text-sm lg:text-base">{item.company || item.provider}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs lg:text-sm">
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs lg:text-sm">
            +{item.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs lg:text-sm text-gray-500 truncate flex-1 mr-2">
          {item.location && <span>{item.location}</span>}
          {item.duration && <span>{item.duration}</span>}
          {item.amount && <span className="truncate">{item.amount}</span>}
        </div>
        <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm lg:text-base whitespace-nowrap">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}