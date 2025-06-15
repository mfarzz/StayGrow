"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/_hooks/useAuth";
import { useAppeals } from "@/app/_hooks/useAppeals";
import { MessageCircle, X, FileText, Plus } from "lucide-react";

export default function FloatingAppealButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuth();
  const { appeals } = useAppeals();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Only show for regular users, not admins, and not on admin or appeal pages
  if (
    role === "ADMIN" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/home/appeals")
  ) {
    return null;
  }

  // Count appeals that need attention (open or in progress)
  const activeAppealsCount =
    appeals?.filter(
      (appeal) => appeal.status === "OPEN" || appeal.status === "IN_PROGRESS"
    ).length || 0;

  const handleCreateAppeal = () => {
    router.push("/home/appeals/create");
    setIsOpen(false);
  };

  const handleViewAppeals = () => {
    router.push("/home/appeals");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Options */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          {/* View Appeals */}
          <div className="flex items-center justify-end">
            <div className="hidden sm:block bg-gray-900 text-white text-sm px-3 py-2 rounded-lg mr-3 opacity-90 shadow-lg max-w-48">
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span>Lihat Banding Saya</span>
                {activeAppealsCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {activeAppealsCount}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleViewAppeals}
              className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              title="Lihat Banding Saya"
            >
              <FileText size={20} />
            </button>
          </div>

          {/* Create Appeal */}
          <div className="flex items-center justify-end">
            <div className="hidden sm:block bg-gray-900 text-white text-sm px-3 py-2 rounded-lg mr-3 opacity-90 shadow-lg max-w-48">
              <div className="flex items-center gap-2">
                <Plus size={14} />
                <span>Buat Banding Baru</span>
              </div>
            </div>
            <button
              onClick={handleCreateAppeal}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Buat Banding Baru"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isOpen
              ? "bg-red-600 hover:bg-red-700 rotate-180 focus:ring-red-500"
              : "bg-orange-600 hover:bg-orange-700 hover:scale-105 focus:ring-orange-500"
          } text-white`}
          title={isOpen ? "Tutup Menu" : "Banding Proyek"}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>

        {/* Notification Badge */}
        {!isOpen && activeAppealsCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
            {activeAppealsCount > 9 ? "9+" : activeAppealsCount}
          </div>
        )}
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
