"use client";

import { Search, Bell, Menu } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  userName: string | null;
  avatarUrl?: string | null;
  onMobileMenuOpen: () => void;
}

export default function Navbar({
  userName,
  avatarUrl,
  onMobileMenuOpen,
}: NavbarProps) {
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              StayGrow.id
            </h1>

            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari peluang, mentor, atau proyek..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              className="relative p-2 text-gray-600 hover:text-gray-900"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full">
                <span className="sr-only">Unread notifications</span>
              </span>
            </button>

            {/* Avatar */}
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
          </div>
        </div>
      </div>
    </header>
  );
}
