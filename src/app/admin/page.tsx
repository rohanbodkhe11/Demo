"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Recreate StatsCard if not exported (it wasn't exported in original file view)
function AdminStatsCard({ title, value, icon: Icon, description, trend }: any) {
    return (
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const { user, isLoading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        // In a real app, we'd have a dedicated /api/admin/stats endpoint
        // For now, we'll fetch all users and courses directly to compute client-side
        // or use existing endpoints if possible.

        // Let's quickly create a fetcher
        async function fetchStats() {
            try {
                const [usersRes, coursesRes] = await Promise.all([
                    fetch('/api/users').then(r => r.json()),
                    fetch('/api/courses').then(r => r.json())
                ]);

                const totalUsers = Array.isArray(usersRes) ? usersRes.length : 0;
                const students = Array.isArray(usersRes) ? usersRes.filter((u: any) => u.role === 'student').length : 0;
                const faculty = Array.isArray(usersRes) ? usersRes.filter((u: any) => u.role === 'faculty').length : 0;
                const totalCourses = Array.isArray(coursesRes) ? coursesRes.length : 0;

                setStats({
                    totalUsers,
                    students,
                    faculty,
                    totalCourses
                });
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoadingStats(false);
            }
        }

        fetchStats();
    }, []);

    if (isLoading || loadingStats) {
        return <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
        </div>
    }

    if (user?.role !== 'admin') {
        return <div className="p-8">Access Denied. Admins only.</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Admin Overview
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AdminStatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    description="Registered active users"
                />
                <AdminStatsCard
                    title="Students"
                    value={stats?.students || 0}
                    icon={Users}
                    description="Enrolled students"
                />
                <AdminStatsCard
                    title="Faculty"
                    value={stats?.faculty || 0}
                    icon={CheckCircle}
                    description="Active faculty members"
                />
                <AdminStatsCard
                    title="Total Courses"
                    value={stats?.totalCourses || 0}
                    icon={BookOpen}
                    description="Active courses"
                />
            </div>

            {/* Placeholder for more detailed sections */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                            System functioning normally
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                            No recent alerts
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
