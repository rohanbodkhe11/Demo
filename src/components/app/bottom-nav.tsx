"use client";

import Link from 'next/link';
import { LayoutDashboard, BookCheck, FileText, BookUser } from 'lucide-react';

export default function BottomNav({ className }: { className?: string }) {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 border-t backdrop-blur-sm ${className || ''}`} aria-label="mobile navigation">
      <ul className="flex justify-around items-center py-2">
        <li>
          <Link href="/dashboard" className="flex flex-col items-center text-xs text-muted-foreground">
            <LayoutDashboard className="h-5 w-5" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/attendance" className="flex flex-col items-center text-xs text-muted-foreground">
            <BookCheck className="h-5 w-5" />
            <span>Mark</span>
          </Link>
        </li>
        <li>
          <Link href="/reports" className="flex flex-col items-center text-xs text-muted-foreground">
            <FileText className="h-5 w-5" />
            <span>Reports</span>
          </Link>
        </li>
        <li>
          <Link href="/courses" className="flex flex-col items-center text-xs text-muted-foreground">
            <BookUser className="h-5 w-5" />
            <span>Courses</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
