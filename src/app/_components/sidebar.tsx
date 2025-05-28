"use client";

import {
  TrendingUp,
  Briefcase,
  Users,
  Award,
  User,
  LogOut,
  X,
  UserPlus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link"; // Import Link
import { usePathname, useRouter } from "next/navigation"; // Import usePathname

import { useNotification } from "../_hooks/useNotification"; // Assuming path is correct
import { useAuth } from "../_hooks/useAuth";
import Notification from "./notification"; // Assuming path is correct, or adjust

// Interface for SidebarProps - activeTab and setActiveTab are removed
interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

// Interface for NavItemProps - href is added, onClick is for Link/closing menu
interface NavItemProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  href: string; // Added href for navigation
  active: boolean;
  onClick: () => void; // For closing mobile menu
}

// NavItem Component
function NavItem({ icon: Icon, label, href, active, onClick }: NavItemProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a
        onClick={onClick} // This will primarily be for closing the mobile menu
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
          active
            ? "bg-emerald-50 text-emerald-600 font-medium"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </a>
    </Link>
  );
}

// Sidebar Component
export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname(); // Get current path
  const router = useRouter();
  const { role } = useAuth();
  const { notification, showError, showSuccess, hideNotification } = useNotification();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Base sidebar items
  const baseSidebarItems = [
    // Adjusted to use href based on your app/(page)/home/* structure
    { id: "dashboard", href: "/home", icon: TrendingUp, label: "Dashboard" },
    { id: "opportunities", href: "/home/opportunities", icon: Briefcase, label: "Peluang" },
    { id: "mentorship", href: "/home/mentorship", icon: Users, label: "Mentorship" },
    { id: "showcase", href: "/home/showcase", icon: Award, label: "Showcase" },
    { id: "profile", href: "/home/profile", icon: User, label: "Profil" },
  ];

  // Add role-specific items
  const sidebarItems = [...baseSidebarItems];
  
  // Add mentor application for PEMUDA users (hide for MENTOR users)
  if (role === 'PEMUDA') {
    sidebarItems.splice(-1, 0, {
      id: "mentor-application",
      href: "/home/mentor-application",
      icon: UserPlus,
      label: "Jadi Mentor"
    });
  }

  // Add admin items for ADMIN users
  if (role === 'ADMIN') {
    sidebarItems.splice(-1, 0, { 
      id: "admin-mentor-applications", 
      href: "/home/admin/mentor-applications", 
      icon: Settings, 
      label: "Kelola Mentor" 
    });
  }

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        showSuccess("Berhasil keluar", "Anda akan diarahkan ke halaman login....");
        setTimeout(() => {
          router.push('/login'); // Or your actual login page route e.g. /login
          router.refresh(); // Optional: to ensure fresh state from server
        }, 300); // Short delay for user to see message
      } else {
        const errorData = await response.json();
        showError("Gagal keluar", errorData.message || "Terjadi kesalahan saat keluar.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showError("Gagal keluar", "Terjadi kesalahan jaringan saat mencoba keluar.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Simplified click handler, mainly for closing mobile menu
  const handleNavItemClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      <Notification
        show={notification.show}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        description={notification.description}
        autoClose={true}
        autoCloseDelay={notification.type === "success" ? 3000 : 5000}
      />
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg lg:shadow-none lg:rounded-2xl
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileOpen ? "translate-x-0 z-50" : "-translate-x-full lg:translate-x-0 lg:z-auto"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 lg:p-6"> {/* Adjusted padding for consistency */}
          <nav className="space-y-1 lg:space-y-2"> {/* Adjusted spacing */}
            {sidebarItems.map(({ id, href, icon: Icon, label }) => (
              <NavItem
                key={id}
                icon={Icon}
                label={label}
                href={href}
                // Determine active state:
                // For exact match (e.g., /home for dashboard)
                // Or for prefix match for nested routes (e.g., /home/profile/* still highlights Profile)
                active={pathname === href || (href !== "/home" && pathname.startsWith(href))}
                onClick={handleNavItemClick} // Closes mobile menu on item click
              />
            ))}
          </nav>
          <div className="mt-8 pt-6 lg:pt-8 border-t border-gray-200"> {/* Adjusted padding */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors w-full px-3 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50" // Matched NavItem styling
            >
              <LogOut size={20} />
              <span>{isLoggingOut ? "Mengeluarkan..." : "Keluar"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}