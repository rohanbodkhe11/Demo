import { NextResponse } from 'next/server';
import { saveAttendanceReport, getAttendanceReportById, saveNotifications, getAttendanceReports } from '@/lib/data';
import { getRealtimeDb } from '@/lib/firebase-server';
import type { AttendanceReport } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { report, notifications } = body;

    if (!report || !report.id) {
      return NextResponse.json({ error: 'Invalid report data' }, { status: 400 });
    }

    const db = getRealtimeDb();
    if (db) {
      try {
        // 1. Save the main report
        await db.ref(`attendance-reports/${report.id}`).set(report);

        // 2. Save individual records for easier querying later (optional but good for filtering)
        // Flatten the records
        const newAttendanceRecords = report.attendance.map((att: any) => ({
          id: `att-${report.id}-${att.studentId}`,
          courseId: report.courseId,
          studentId: att.studentId,
          date: report.date,
          isPresent: att.isPresent,
          class: report.class,
          reportId: report.id
        }));

        // Use multi-path update for atomicity
        const updates: any = {};
        newAttendanceRecords.forEach((rec: any) => {
          updates[`attendance-records/${rec.id}`] = rec;
        });
        await db.ref().update(updates);

        // 3. Save notifications if provided
        if (notifications && Array.isArray(notifications)) {
          const notifUpdates: any = {};
          notifications.forEach((n: any) => {
            // assuming notification has an id, if not generate one
            const nid = n.id || `notif-${Date.now()}-${Math.random()}`;
            notifUpdates[`notifications/${nid}`] = { ...n, id: nid };
          });
          await db.ref().update(notifUpdates);
        }

        return NextResponse.json(report, { status: 201 });

      } catch (error) {
        console.error('[API] Firebase attendance save error:', error);
      }
    }

    // Fallback logic
    console.warn('[API] Using local fallback for attendance');
    saveAttendanceReport(report as AttendanceReport);
    if (notifications && Array.isArray(notifications)) {
      saveNotifications(notifications);
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('[API] Error saving attendance report:', error);
    return NextResponse.json({ error: 'Failed to save attendance report' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const reportId = url.searchParams.get('id');

    const db = getRealtimeDb();
    if (db) {
      try {
        if (!reportId) {
          // Return all reports
          const snapshot = await db.ref('attendance-reports').get();
          if (snapshot.exists()) {
            return NextResponse.json(Object.values(snapshot.val()));
          }
          return NextResponse.json([]);
        } else {
          // Return specific report
          const snapshot = await db.ref(`attendance-reports/${reportId}`).get();
          if (snapshot.exists()) {
            return NextResponse.json(snapshot.val());
          }
          return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }
      } catch (error) {
        console.error('[API] Firebase attendance fetch error:', error);
      }
    }

    // Fallback
    console.warn('[API] Using local fallback for attendance fetch');
    if (!reportId) {
      const allReports = getAttendanceReports();
      return NextResponse.json(allReports);
    }

    const report = getAttendanceReportById(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('[API] Error fetching attendance report:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance report' }, { status: 500 });
  }
}
