import { NextResponse } from 'next/server';
import { getCourses, saveCourses, getUsers } from '@/lib/data';

export async function GET() {
  try {
    const courses = getCourses();
    return NextResponse.json(courses, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, course } = body as { userId?: string; course: any };

    const users = getUsers();
    const facultyUser = users.find(u => u.id === userId);

    const newCourse = {
      id: `course-${Date.now()}`,
      facultyId: facultyUser?.id ?? userId ?? 'unknown',
      facultyName: facultyUser?.name ?? 'Unknown Faculty',
      name: course.name,
      courseCode: course.courseCode,
      classes: course.classes,
      totalLectures: course.totalLectures,
      description: course.description,
      type: course.type,
    };

    const courses = getCourses();
    const updated = [...courses, newCourse];
    saveCourses(updated);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
