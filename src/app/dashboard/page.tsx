
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { Course, User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, User as UserIcon, Users, PlusCircle, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
        {user.role === 'faculty' ? <FacultyDashboard user={user} /> : <StudentDashboard user={user} />}
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64" />
            </div>
        </div>
    );
}

function FacultyDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch dashboard statistics
        const statsRes = await fetch(`/api/dashboard/stats?userId=${user.id}&role=faculty`);
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }

        // Fetch courses
        const coursesRes = await fetch('/api/courses');
        if (coursesRes.ok) {
          const allCourses = await coursesRes.json();
          const facultyCourses = allCourses.filter((c: Course) => c.facultyId === user.id);
          setCourses(facultyCourses);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const theoryCourses = courses.filter(c => c.type === 'Theory');
  const practicalCourses = courses.filter(c => c.type === 'Practical');

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.theoryCourses || 0} Theory • {stats?.practicalCourses || 0} Practical
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats?.totalClasses || 0} classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Reports</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendanceReports || 0}</div>
            <p className="text-xs text-muted-foreground">Total attendance records</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>An overview of the courses you are teaching.</CardDescription>
            </div>
                <Button asChild>
                <Link href="/courses/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Course
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="theory">
                <TabsList className="mb-4">
                    <TabsTrigger value="theory">Theory</TabsTrigger>
                    <TabsTrigger value="practical">Practical</TabsTrigger>
                </TabsList>
                <TabsContent value="theory">
                    <CourseGrid courses={theoryCourses} />
                </TabsContent>
                <TabsContent value="practical">
                    <CourseGrid courses={practicalCourses} />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>
    </>
  );
}

function CourseGrid({ courses }: { courses: Course[] }) {
    if (courses.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No courses found.</div>
    }
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
             <Image
                src={`https://placehold.co/600x400.png`}
                alt={course.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint="education textbook"
              />
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.courseCode}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="flex flex-wrap gap-1 mb-2">
                  {course.classes && course.classes.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {course.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
}

function StudentDashboard({ user }: { user: User }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/dashboard/stats?userId=${user.id}&role=student`);
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Progress value={stats?.overallAttendance || 0} className="h-2 w-20" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overallAttendance || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.presentCount || 0} of {stats?.totalAttendanceRecords || 0} sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.coursesEnrolled || 0}</div>
            <p className="text-xs text-muted-foreground">Courses this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Absent</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats?.lastAbsent ? (
                <>
                    <div className="text-2xl font-bold">{stats.lastAbsent.courseName}</div>
                    <p className="text-xs text-muted-foreground">
                      on {new Date(stats.lastAbsent.date).toLocaleDateString()}
                    </p>
                </>
            ) : (
                <>
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">No absences recorded yet!</p>
                </>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Your attendance status in each course.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.courseWiseAttendance && stats.courseWiseAttendance.length > 0 ? (
              <div className="space-y-6">
                {stats.courseWiseAttendance.map((course: any) => (
                  <div key={course.courseId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{course.courseName}</span>
                      <span className="text-sm text-muted-foreground">
                        {course.attendance.toFixed(1)}% ({course.presentCount}/{course.totalCount})
                      </span>
                    </div>
                    <Progress value={course.attendance} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No attendance records yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
