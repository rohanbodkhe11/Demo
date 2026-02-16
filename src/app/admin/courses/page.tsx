"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function AdminCoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/courses');
            if (res.ok) {
                const data = await res.json();
                setCourses(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Error fetching courses", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    if (user?.role !== 'admin') return <div className="p-8">Access Denied</div>;

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
                    <p className="text-muted-foreground">View all active courses.</p>
                </div>
                <Button onClick={fetchCourses} disabled={loading} variant="outline" size="sm">
                    <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>All Courses</CardTitle>
                    <CardDescription>
                        List of all courses across all departments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Faculty</TableHead>
                                <TableHead>Classes</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading courses...</TableCell>
                                </TableRow>
                            ) : courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No courses found.</TableCell>
                                </TableRow>
                            ) : (
                                courses.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.courseCode}</TableCell>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.facultyName}</TableCell>
                                        <TableCell>{Array.isArray(c.classes) ? c.classes.join(', ') : c.classes}</TableCell>
                                        <TableCell>{c.type}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
