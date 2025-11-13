import { NextResponse } from 'next/server';
import { addStudentsToClass, getStudentsByClass } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const className = url.searchParams.get('class');

    if (!className) {
      return NextResponse.json({ error: 'Missing class parameter' }, { status: 400 });
    }

    const students = getStudentsByClass(className);
    return NextResponse.json(students);
  } catch (error) {
    console.error('[API] Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { className, students } = await request.json();

    if (!className || !students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: 'Missing or invalid className or students' },
        { status: 400 }
      );
    }

    const result = addStudentsToClass(className, students);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[API] Error adding students:', error);
    return NextResponse.json({ error: 'Failed to add students' }, { status: 500 });
  }
}
