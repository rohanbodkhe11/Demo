import { NextResponse } from 'next/server';
import { saveAttendanceReport, getAttendanceReportById, saveNotifications, getAttendanceReports } from '@/lib/data';
import type { AttendanceReport } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { report, notifications } = body;

    if (!report || !report.id) {
      return NextResponse.json({ error: 'Invalid report data' }, { status: 400 });
    }

    // Save the attendance report
    saveAttendanceReport(report as AttendanceReport);

    // Save notifications if provided
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

    // If no ID provided, return all reports
    if (!reportId) {
      const allReports = getAttendanceReports();
      return NextResponse.json(allReports);
    }

    // If ID provided, return specific report
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
