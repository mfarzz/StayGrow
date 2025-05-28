// File: app/(page)/home/layout.tsx
"use client";

import { useState, ReactNode } from "react";
import Navbar from "../../../app/_components/navbar";
import Sidebar from "../../../app/_components/sidebar"; // Ensure this path is correct
import { useProfile } from "../../../app/_hooks/useProfile";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={profile?.name || null}
        avatarUrl={profile?.avatarUrl || null}
        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar // activeTab and setActiveTab are removed
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
          <main className="flex-1 lg:ml-0 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}