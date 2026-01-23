
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider, Sidebar, SidebarInset, SidebarToggle } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Skeleton } from '../ui/skeleton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen">
        <Skeleton className="hidden md:block w-64 h-full" />
        <div className="flex-1 p-8">
            <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="flex flex-col">
          <SidebarNav user={user} />
        </Sidebar>

        <SidebarInset className="bg-gray-50 dark:bg-gray-900/50 flex flex-col w-full">
          {/* Top bar for mobile: toggle + title */}
          <header className="flex items-center justify-between px-4 py-2 border-b lg:hidden">
            <div className="flex items-center gap-3">
              {/* Sidebar toggle shown on small screens */}
              {/* Import dynamically to avoid unused import warnings */}
              <div className="-ml-2">
                {/* SidebarToggle component (lazy) */}
                {/* Reuse Button from ui/button by rendering a small toggle here */}
                {/* Keep markup minimal; actual toggle button lives in SidebarToggle export */}
                <nav aria-label="mobile">
                  <SidebarToggle />
                </nav>
              </div>
              <div className="text-lg font-semibold">AttenEase</div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>

          <footer className="p-4 text-center text-sm text-muted-foreground">
            © 2025 AttenEase Attendance. All rights reserved.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
