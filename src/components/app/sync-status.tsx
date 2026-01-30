"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { enqueuePending, processAllQueues } from "@/lib/offline-queue";

export default function SyncStatus() {
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const readCounts = () => {
      try {
        if (typeof window === 'undefined') return;
        const u = JSON.parse(localStorage.getItem('pendingUsers') || '[]').length || 0;
        const a = JSON.parse(localStorage.getItem('pendingAttendance') || '[]').length || 0;
        const s = JSON.parse(localStorage.getItem('pendingStudents') || '[]').length || 0;
        setPendingCount(u + a + s);
      } catch (err) {
        setPendingCount(0);
      }
    };
    readCounts();
    const onChange = () => {
      setOnline(navigator.onLine);
      readCounts();
    };
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);
    window.addEventListener('storage', readCounts);
    const interval = setInterval(readCounts, 5000);
    return () => {
      window.removeEventListener('online', onChange);
      window.removeEventListener('offline', onChange);
      window.removeEventListener('storage', readCounts);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    await processAllQueues();
    try { setPendingCount(JSON.parse(localStorage.getItem('pendingUsers') || '[]').length + JSON.parse(localStorage.getItem('pendingAttendance') || '[]').length + JSON.parse(localStorage.getItem('pendingStudents') || '[]').length); } catch (err) { setPendingCount(0); }
  };

  return (
    <div className="flex items-center gap-2">
      {online ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-500" />}
      <span className="text-sm text-muted-foreground">{online ? 'Online' : 'Offline'}</span>
      {pendingCount > 0 && (
        <button onClick={handleManualSync} className="ml-2 inline-flex items-center gap-2 rounded-md bg-secondary px-2 py-1 text-xs">
          <RefreshCw className="h-4 w-4" />
          <span>{pendingCount} pending</span>
        </button>
      )}
    </div>
  );
}
