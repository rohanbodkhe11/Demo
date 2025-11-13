import { NextResponse } from 'next/server';
import { getCourses, saveCourses } from '@/lib/data';

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const courses = getCourses();
    const courseIndex = courses.findIndex((c: any) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Remove the course from the array
    const updatedCourses = courses.filter((c: any) => c.id !== courseId);
    saveCourses(updatedCourses);

    return NextResponse.json({ success: true, message: 'Course deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error deleting course:', err);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const courses = getCourses();
    const course = courses.find((c: any) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    console.error('Error fetching course:', err);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
