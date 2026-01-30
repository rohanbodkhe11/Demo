import { NextResponse } from 'next/server';
import { getCourses, getUsers, getAttendanceReports } from '@/lib/data'; // Fallback
import { getRealtimeDb } from '@/lib/firebase-server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const userRole = url.searchParams.get('role');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const db = getRealtimeDb();
    if (db) {
      try {
        // Fetch key data we need for stats
        const [coursesSnap, usersSnap, reportsSnap] = await Promise.all([
          db.ref('courses').get(),
          db.ref('users').get(),
          db.ref('attendance-reports').get()
        ]);

        const courses = coursesSnap.exists() ? Object.values(coursesSnap.val()) : [];
        const users = usersSnap.exists() ? Object.values(usersSnap.val()) : [];
        const reports = reportsSnap.exists() ? Object.values(reportsSnap.val()) : [];

        if (userRole === 'faculty') {
          return calculateFacultyStats(userId, courses, users, reports);
        } else if (userRole === 'student') {
          return calculateStudentStats(userId, courses, users, reports);
        }
      } catch (err) {
        console.error('[API] Firebase dashboard fetch error:', err);
        // fallback...
      }
    }

    // --- Fallback to local data ---
    console.warn('[API] Using local fallback for dashboard stats');
    if (userRole === 'faculty') {
      const c = getCourses();
      const u = getUsers();
      const r = getAttendanceReports();
      return calculateFacultyStats(userId, c, u, r);
    } else if (userRole === 'student') {
      const c = getCourses();
      const u = getUsers();
      const r = getAttendanceReports();
      return calculateStudentStats(userId, c, u, r);
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

  } catch (error) {
    console.error('[API] Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}


function calculateFacultyStats(userId: string, allCourses: any[], allUsers: any[], allReports: any[]) {
  const facultyCourses = allCourses.filter(c => c.facultyId === userId);
  const theoryCourses = facultyCourses.filter(c => c.type === 'Theory');
  const practicalCourses = facultyCourses.filter(c => c.type === 'Practical');

  // Calculate total students across these courses
  // Get all unique classes from faculty courses
  const facultyClasses = [...new Set(facultyCourses.flatMap(c => c.classes || []))];
  // Count students in those classes
  const totalStudents = allUsers.filter(u => u.role === 'student' && facultyClasses.includes(u.class || '')).length;

  const facultyReports = allReports.filter((r: any) =>
    facultyCourses.some(c => c.id === r.courseId)
  );

  // Find faculty department
  const faculty = allUsers.find(u => u.id === userId);

  return NextResponse.json({
    role: 'faculty',
    totalCourses: facultyCourses.length,
    theoryCourses: theoryCourses.length,
    practicalCourses: practicalCourses.length,
    totalStudents,
    totalClasses: facultyClasses.length,
    attendanceReports: facultyReports.length,
    department: faculty?.department || 'N/A',
  });
}

function calculateStudentStats(userId: string, allCourses: any[], allUsers: any[], allReports: any[]) {
  const student = allUsers.find(u => u.id === userId);

  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  const studentCourses = allCourses.filter(c =>
    Array.isArray(c.classes) && c.classes.includes(student.class || '')
  );

  // Flatten reports to record level
  const studentRecords = allReports.flatMap((r: any) =>
    (r.attendance || [])
      .filter((a: any) => a.studentId === userId)
      .map((a: any) => ({ ...a, courseId: r.courseId, date: r.date, courseName: r.courseName }))
  );

  const presentCount = studentRecords.filter((r: any) => r.isPresent).length;
  const totalRecords = studentRecords.length;
  const overallAttendance = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

  // Course-wise attendance
  const courseWiseAttendance = studentCourses.map(course => {
    const courseRecords = studentRecords.filter((r: any) => r.courseId === course.id);
    const coursePresentCount = courseRecords.filter((r: any) => r.isPresent).length;
    const courseTotal = courseRecords.length;
    const percentage = courseTotal > 0 ? (coursePresentCount / courseTotal) * 100 : 0;

    return {
      courseId: course.id,
      courseName: course.name,
      courseCode: course.courseCode,
      attendance: percentage,
      presentCount: coursePresentCount,
      totalCount: courseTotal,
    };
  });

  // Last absent record
  const absentRecords = studentRecords.filter((r: any) => !r.isPresent);
  // Sort desc by date
  absentRecords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const lastAbsent = absentRecords.length > 0 ? {
    courseName: absentRecords[0].courseName,
    date: absentRecords[0].date,
  } : null;

  return NextResponse.json({
    role: 'student',
    overallAttendance: parseFloat(overallAttendance.toFixed(1)),
    coursesEnrolled: studentCourses.length,
    totalAttendanceRecords: totalRecords,
    presentCount,
    courseWiseAttendance,
    lastAbsent,
  });
}
