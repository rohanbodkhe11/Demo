
import type { User, Course, Student, AttendanceRecord, AttendanceReport, Notification } from './types';
import { getSupabase } from './supabase-server';

// This will now act as our in-memory "database"
let users: User[] = [];
let courses: Course[] = [];
let attendance: AttendanceRecord[] = [];
let courseStudents: Record<string, Student[]> = {};
let attendanceReports: AttendanceReport[] = [];
let notifications: Notification[] = [];

// Flag to ensure initialization only runs once
let isInitialized = false;

// --- Data Persistence Simulation ---
function saveDataToSession() {
  // Persist data to disk when running on the server so state survives restarts.
  // Avoid importing 'fs' at module top-level so this file can still be imported by client code.
  if (typeof window !== 'undefined') {
    // running in the browser — nothing to do
    return;
  }

    try {
      // Use eval('require') to avoid static analysis by webpack/next which
      // otherwise tries to bundle node builtins like 'fs' into client code.
      // This keeps the module importable from client components while
      // allowing server-side persistence when running in Node.
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fs = (eval("require"))('fs');
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const path = (eval("require"))('path');

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'db.json');
    const db = {
      users,
      courses,
      attendance,
      courseStudents,
      attendanceReports,
      notifications,
    };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    // If persistence fails, keep running with in-memory data.
    // We intentionally don't throw here because client imports may still work.
    // console.warn('Failed to persist data to disk:', err);
  }
}

// --- Notification Management ---
export const getNotificationsForStudent = (studentId: string): Notification[] => {
    return notifications.filter(n => n.studentId === studentId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const saveNotifications = (newNotifications: Notification[]) => {
    notifications.push(...newNotifications);
    saveDataToSession();
    console.log("Saved notifications:", newNotifications); // For debugging
}

// --- Student Management for Courses ---
export const getStudentsForCourse = (courseId: string): Student[] => {
    return courseStudents[courseId] || [];
}

export const saveStudentsForCourse = (courseId: string, students: Student[]) => {
    courseStudents[courseId] = students;
    saveDataToSession();
}

export const addStudentsToClass = (className: string, newStudents: { name: string, rollNumber: string }[]): { added: number, skipped: number } => {
    const allUsers = getUsers(); // Get current users
    const existingStudentsInClass = allUsers.filter(u => u.role === 'student' && u.class === className);
    const newUsers: User[] = [];
    let addedCount = 0;
    let skippedCount = 0;

    newStudents.forEach(student => {
        const studentExists = existingStudentsInClass.some(u => u.rollNumber === student.rollNumber);
        if (!studentExists) {
              const newUser: User = {
                id: `user-${Date.now()}-${student.rollNumber}`,
                name: student.name,
                rollNumber: student.rollNumber,
                email: `${student.name.toLowerCase().replace(/\s/g,'.')}.${student.rollNumber}@example.com`,
                role: 'student',
                class: className,
                department: 'Imported',
                avatarUrl: 'https://placehold.co/100x100.png',
              };
            newUsers.push(newUser);
            addedCount++;
        } else {
            skippedCount++;
        }
    });

    if (newUsers.length > 0) {
        users = [...users, ...newUsers];
        saveDataToSession();
    }

    return { added: addedCount, skipped: skippedCount };
}


export const getStudentsByClass = (className: string): Student[] => {
  return users.filter(u => u.role === 'student' && u.class === className).map(u => ({
    id: u.id,
    name: u.name,
    rollNumber: u.rollNumber || `S${u.id.replace('student', '')}`, // Generate a sample roll number
    class: u.class || 'N/A'
  }));
}

export const getStudents = (): Student[] => {
  return users.filter(u => u.role === 'student').map(u => ({
    id: u.id,
    name: u.name,
    rollNumber: u.rollNumber || `S${u.id.replace('student', '')}`, // Generate a sample roll number
    class: u.class || 'N/A'
  }));
}

// --- User Management ---
export const getUsers = (): User[] => {
  // If Supabase is configured, fetch synchronously is not possible here —
  // keep returning in-memory users for code paths that import this module on the server.
  // The API routes will use Supabase directly when configured.
  return users;
};

export const saveUsers = (newUsers: User[]) => {
  users = newUsers;
  // If Supabase is available, upsert users server-side via service key.
  if (typeof window === 'undefined') {
    const supabase = getSupabase();
    if (supabase) {
      try {
        // We will attempt to upsert all users into a 'users' table.
        // This is a best-effort sync: do not block execution if it fails.
        void (async () => {
          await supabase.from('users').upsert(newUsers, { onConflict: 'id' });
        })();
        return;
      } catch (err) {
        // continue to file persistence if Supabase fails
      }
    }
  }

  saveDataToSession();
};


// --- Course Management ---
export const getCourses = (): Course[] => {
    return courses;
};

export const saveCourses = (newCourses: Course[]) => {
  courses = newCourses;
  saveDataToSession();
};


// --- Attendance Management ---
export const getAttendance = (): AttendanceRecord[] => {
    return attendance;
}

export const saveAttendance = (newAttendance: AttendanceRecord[]) => {
    attendance = newAttendance;
    saveDataToSession();
}


// --- Attendance Report Management ---
export const getAttendanceReports = (): AttendanceReport[] => {
    return attendanceReports;
}

export const getAttendanceReportById = (reportId: string): AttendanceReport | undefined => {
    return attendanceReports.find(r => r.id === reportId);
}

export const saveAttendanceReport = (report: AttendanceReport) => {
    attendanceReports.push(report);
    // Also save the individual records for historical data
    const newAttendanceRecords = report.attendance.map(att => ({
        id: `att-${report.id}-${att.studentId}`,
        courseId: report.courseId,
        studentId: att.studentId,
        date: report.date,
        isPresent: att.isPresent,
        class: report.class,
    }));
    attendance.push(...newAttendanceRecords);
    saveDataToSession();
}


// --- Helper Functions for Data Querying ---
export const getStudentAttendance = (studentId: string): { course: Course; records: AttendanceRecord[] }[] => {
  const student = users.find(u => u.id === studentId);
  if (!student) return [];
  
  return courses
    .filter(course => Array.isArray(course.classes) && course.classes.includes(student.class || ''))
    .map(course => ({
        course,
        records: attendance.filter(att => att.studentId === studentId && att.courseId === course.id),
    }));
};

export const getCourseAttendance = (courseId: string): AttendanceRecord[] => {
  return attendance.filter(att => att.courseId === courseId);
};

function initializeData() {
  if (isInitialized) {
    return;
  }
  // If we're running on the server and a persisted DB exists, load it.
  if (typeof window === 'undefined') {
    try {
      // Use eval('require') for the same reason as above to avoid bundling
      // server-only Node modules into the client bundle.
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fs = (eval("require"))('fs');
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const path = (eval("require"))('path');
      const dbPath = path.join(process.cwd(), 'data', 'db.json');
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const parsed = JSON.parse(raw || '{}');
        users = parsed.users || [];
        courses = parsed.courses || [];
        attendance = parsed.attendance || [];
        courseStudents = parsed.courseStudents || {};
        attendanceReports = parsed.attendanceReports || [];
        notifications = parsed.notifications || [];
        isInitialized = true;
        return;
      }
    } catch (err) {
      // ignore and fall back to default sample data
    }
  }

  users = [
    {
      id: 'student1',
      rollNumber: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'student',
      department: 'Computer Science',
      class: 'SE CSE A',
      avatarUrl: 'https://placehold.co/100x100.png',
      mobileNumber: '9876543210'
    },
    {
      id: 'student2',
      rollNumber: '2',
      name: 'Bob Williams',
      email: 'bob@example.com',
      role: 'student',
      department: 'Computer Science',
      class: 'SE CSE A',
      avatarUrl: 'https://placehold.co/100x100.png',
      mobileNumber: '9876543211'
    },
     {
      id: 'student3',
      rollNumber: '3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'student',
      department: 'Computer Science',
      class: 'SE CSE B',
      avatarUrl: 'https://placehold.co/100x100.png',
      mobileNumber: '9876543212'
    },
    {
      id: 'faculty1',
      name: 'Dr. Evelyn Reed',
      email: 'evelyn@example.com',
      role: 'faculty',
      department: 'Computer Science',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  ];

  const defaultCourse: Course = {
    id: 'course-1',
    name: 'Data Structures',
    courseCode: 'CS301',
    facultyId: 'faculty1',
    facultyName: 'Dr. Evelyn Reed',
    classes: ['SE CSE A', 'SE CSE B'],
    totalLectures: 40,
    description: 'An introductory course on fundamental data structures.',
    type: 'Theory',
  };
  courses = [defaultCourse];

  // Correctly get students for the default course
  const allStudents = getUsers().filter(u => u.role === 'student');
  courseStudents[defaultCourse.id] = allStudents
    .filter(s => defaultCourse.classes.includes(s.class || ''))
    .map(u => ({
        id: u.id,
        rollNumber: u.rollNumber || `S${u.id.replace('student','')}`,
        name: u.name,
        class: u.class || 'N/A'
    }));

  saveDataToSession();
  isInitialized = true;
}

// Initialize data only on the server/runtime (not in client bundles).
if (typeof window === 'undefined') {
  // guard in case this file is imported from client code; initialization
  // (and the eval-requires above) will only run on the server.
  initializeData();
}
