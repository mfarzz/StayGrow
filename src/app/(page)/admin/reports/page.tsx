'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Download,
  Filter,
  Eye,
  Activity,
  Target,
  Award,
} from 'lucide-react';

interface ReportMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// interface ChartData {
//   period: string;
//   users: number;
//   projects: number;
//   mentorships: number;
// }

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const metrics: ReportMetric[] = [
    {
      label: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      label: 'Active Projects',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'bg-emerald-500'
    },
    {
      label: 'Mentor Sessions',
      value: '456',
      change: '+15.7%',
      trend: 'up',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      label: 'Daily Active Users',
      value: '892',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

//   const chartData: ChartData[] = [
//     { period: 'Jan', users: 1200, projects: 800, mentorships: 300 },
//     { period: 'Feb', users: 1350, projects: 920, mentorships: 350 },
//     { period: 'Mar', users: 1580, projects: 1100, mentorships: 420 },
//     { period: 'Apr', users: 1820, projects: 1250, mentorships: 480 },
//     { period: 'May', users: 2100, projects: 1400, mentorships: 520 },
//     { period: 'Jun', users: 2450, projects: 1580, mentorships: 580 },
//     { period: 'Jul', users: 2847, projects: 1234, mentorships: 456 }
//   ];

  const topProjects = [
    { name: 'E-commerce Platform', views: 1250, likes: 89, author: 'John Doe' },
    { name: 'Task Management App', views: 1100, likes: 76, author: 'Jane Smith' },
    { name: 'Weather Dashboard', views: 950, likes: 65, author: 'Mike Johnson' },
    { name: 'Portfolio Website', views: 820, likes: 54, author: 'Sarah Wilson' },
    { name: 'Chat Application', views: 780, likes: 49, author: 'David Brown' }
  ];

  const recentActivity = [
    { action: 'New user registration', user: 'Alice Cooper', time: '2 minutes ago' },
    { action: 'Project published', user: 'Bob Wilson', time: '15 minutes ago' },
    { action: 'Mentor session completed', user: 'Carol Davis', time: '1 hour ago' },
    { action: 'User profile updated', user: 'David Miller', time: '2 hours ago' },
    { action: 'New project created', user: 'Eva Martinez', time: '3 hours ago' }
  ];

  const handleExportReport = () => {
    // Implementation for exporting reports
    console.log('Exporting report...');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Monitor platform performance and user engagement</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="overview">Overview</option>
                <option value="users">Users</option>
                <option value="projects">Projects</option>
                <option value="mentorships">Mentorships</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    metric.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Growth Trends</h2>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization will be implemented here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Top Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Projects</h2>
            <Target className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {topProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">by {project.author}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span>{project.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-emerald-200 bg-emerald-50 rounded-r-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
