// components/StatCard.jsx
"use client"

interface StatCardProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string | number;
    color: 'blue' | 'red' | 'purple' | 'green';
}

export default function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
      <div className={`inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white mb-3 lg:mb-4`}>
        <Icon size={20} className="lg:w-6 lg:h-6" />
      </div>
      <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-xs lg:text-sm">{label}</div>
    </div>
  );
}