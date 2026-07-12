"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuthStore } from "@/stores/auth-store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Auto-login with mock data for demo
    if (!isAuthenticated && !isLoading) {
      useAuthStore.getState().login("ahmed@example.com", "password").then(() => {
        // Login successful
      });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex gap-6 py-4">
          <Sidebar />
          <main className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
            {children}
          </main>
          <RightSidebar />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
