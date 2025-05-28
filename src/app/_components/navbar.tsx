"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavbarProps {
  userName: string | null;
  avatarUrl?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  onMobileMenuOpen: () => void;
  onLogout?: () => void;
}

export default function Navbar({
  userName,
  avatarUrl,
  userEmail,
  userRole,
  onMobileMenuOpen,
  onLogout,
}: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push("/home/profile");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-400"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              StayGrow.id
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">

            <button
              className="relative p-2 text-gray-600 hover:text-gray-900"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full">
                <span className="sr-only">Unread notifications</span>
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="User menu"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={userName ? `${userName}'s avatar` : "User avatar"}
                      width={40}
                      height={40}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                  {(!avatarUrl || avatarUrl === "") && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {userInitials}
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={userName ? `${userName}'s avatar` : "User avatar"}
                            width={48}
                            height={48}
                            className="w-full h-auto object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {userInitials}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {userName || "User"}
                        </p>
                        {userEmail && (
                          <p className="text-sm text-gray-500 truncate">
                            {userEmail}
                          </p>
                        )}
                        {userRole && (
                          <p className="text-xs text-emerald-600 font-medium">
                            {userRole}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Saya
                    </button>
                  
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
