import { NextResponse } from 'next/server';
import { getRealtimeDb } from '@/lib/firebase-server';
import { getCourses, saveCourses, getUsers } from '@/lib/data'; // Keep for types/fallback if needed

export async function GET() {
  const db = getRealtimeDb();
  if (db) {
    try {
      const snapshot = await db.ref('courses').get();
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object { "id": { ... } } to array [ { ... } ]
        const coursesArray = Object.values(data);
        return NextResponse.json(coursesArray, { status: 200 });
      } else {
        return NextResponse.json([], { status: 200 }); // Return empty array if no courses
      }
    } catch (err) {
      console.error('[API] Firebase courses fetch error:', err);
      // Fallback to local data only on error
    }
  }

  // Fallback
  console.warn('[API] using fallback local data for courses');
  const courses = getCourses();
  return NextResponse.json(courses, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, course } = body as { userId?: string; course: any };

    // Validations could go here

    // We still need to look up the faculty name. 
    // Ideally we fetch user from DB, but for speed we can try DB then local.
    let facultyName = 'Unknown Faculty';
    const db = getRealtimeDb();
    
    if (db && userId) {
        const userSnap = await db.ref(`users/${userId}`).get();
        if (userSnap.exists()) {
            facultyName = userSnap.val().name;
        }
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      facultyId: userId ?? 'unknown',
      facultyName: facultyName,
      name: course.name,
      courseCode: course.courseCode,
      classes: course.classes,
      totalLectures: course.totalLectures,
      description: course.description,
      type: course.type,
    };

    if (db) {
        try {
            await db.ref(`courses/${newCourse.id}`).set(newCourse);
            return NextResponse.json(newCourse, { status: 201 });
        } catch (err) {
            console.error('[API] Firebase course save error:', err);
             // Verify if we should fallback or fail. Usually fail is better to avoid data sync issues, 
             // but for this hybrid app we might fallback.
        }
    }

    // Fallback
    console.warn('[API] using fallback local persistence for new course');
    const courses = getCourses();
    const updated = [...courses, newCourse];
    saveCourses(updated);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
