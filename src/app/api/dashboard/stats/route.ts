import { NextResponse } from 'next/server';
import { getCourses, getStudents, getAttendanceReports, getUsers } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const userRole = url.searchParams.get('role');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    if (userRole === 'faculty') {
      // Faculty statistics
      const allCourses = getCourses();
      const facultyCourses = allCourses.filter(c => c.facultyId === userId);
      const theoryCourses = facultyCourses.filter(c => c.type === 'Theory');
      const practicalCourses = facultyCourses.filter(c => c.type === 'Practical');
      
      const facultyClasses = [...new Set(facultyCourses.flatMap(c => c.classes || []))];
      const allUsers = getUsers();
      const totalStudents = allUsers.filter(u => u.role === 'student' && facultyClasses.includes(u.class || '')).length;
      
      const attendanceReports = getAttendanceReports();
      const facultyReports = attendanceReports.filter(r => 
        facultyCourses.some(c => c.id === r.courseId)
      );

      return NextResponse.json({
        role: 'faculty',
        totalCourses: facultyCourses.length,
        theoryCourses: theoryCourses.length,
        practicalCourses: practicalCourses.length,
        totalStudents,
        totalClasses: facultyClasses.length,
        attendanceReports: facultyReports.length,
        department: allUsers.find(u => u.id === userId)?.department || 'N/A',
      });
    } else if (userRole === 'student') {
      // Student statistics
      const allUsers = getUsers();
      const student = allUsers.find(u => u.id === userId);
      
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      const allCourses = getCourses();
      const studentCourses = allCourses.filter(c => 
        Array.isArray(c.classes) && c.classes.includes(student.class || '')
      );

      const attendanceReports = getAttendanceReports();
      const studentRecords = attendanceReports.flatMap(r => 
        r.attendance
          .filter(a => a.studentId === userId)
          .map(a => ({ ...a, courseId: r.courseId, date: r.date, courseName: r.courseName }))
      );

      const presentCount = studentRecords.filter(r => r.isPresent).length;
      const totalRecords = studentRecords.length;
      const overallAttendance = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      // Course-wise attendance
      const courseWiseAttendance = studentCourses.map(course => {
        const courseRecords = studentRecords.filter(r => r.courseId === course.id);
        const coursePresentCount = courseRecords.filter(r => r.isPresent).length;
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
      const absentRecords = studentRecords.filter(r => !r.isPresent);
      absentRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('[API] Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
