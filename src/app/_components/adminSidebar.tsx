'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  Users,
  FileText,
  UserCheck,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/app/_hooks/useAuth';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const menuItems = [
    {
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Statistics'
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'User Management',
      description: 'Manage all users'
    },
    {
      href: '/admin/showcase',
      icon: FileText,
      label: 'Showcase Projects',
      description: 'Moderate projects'
    },
    {
      href: '/admin/appeals',
      icon: MessageSquare,
      label: 'Project Appeals',
      description: 'Handle user appeals'
    },
    {
      href: '/admin/mentor-applications',
      icon: UserCheck,
      label: 'Mentor Applications',
      description: 'Review applications'
    },
    {
      href: '/admin/reports',
      icon: BarChart3,
      label: 'Reports',
      description: 'Analytics & Reports'
    },
    {
      href: '/admin/moderation',
      icon: Shield,
      label: 'Content Moderation',
      description: 'Review flagged content'
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'System Settings',
      description: 'Platform configuration'
    }
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
              StayGrow Admin
            </h1>
          </Link>
          <p className="text-sm text-gray-600 mt-1">Administrative Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 mr-3 ${
                    active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} 
                />
                <div className="flex-1">
                  <div className={`font-medium ${active ? 'text-emerald-900' : ''}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${
                    active ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
