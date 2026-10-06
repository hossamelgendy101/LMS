"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Activity } from "lucide-react";

interface AdminStats {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalRevenue: number;
  activeEnrollments: number;
  newEnrollmentsThisMonth: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: "Total Courses", value: stats?.totalCourses ?? 0, icon: BookOpen, color: "bg-blue-500/10 text-blue-600", change: "+12%" },
    { title: "Total Students", value: stats?.totalStudents ?? 0, icon: Users, color: "bg-green-500/10 text-green-600", change: "+8%" },
    { title: "Total Instructors", value: stats?.totalInstructors ?? 0, icon: GraduationCap, color: "bg-purple-500/10 text-purple-600", change: "+5%" },
    { title: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "bg-amber-500/10 text-amber-600", change: "+15%" },
    { title: "Active Enrollments", value: stats?.activeEnrollments ?? 0, icon: Activity, color: "bg-red-500/10 text-red-600", change: "+10%" },
    { title: "New This Month", value: stats?.newEnrollmentsThisMonth ?? 0, icon: TrendingUp, color: "bg-teal-500/10 text-teal-600", change: "+20%" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                  )}
                  <p className="text-xs text-green-600 mt-1">{card.change} from last month</p>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest student enrollments across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    U{i}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">User {i}</p>
                    <p className="text-sm text-muted-foreground">Enrolled in Web Development Bootcamp</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{i}h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Courses</CardTitle>
            <CardDescription>Courses with highest enrollment this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Web Development Bootcamp", students: 1250, revenue: "$112,487" },
                { name: "Machine Learning Fundamentals", students: 890, revenue: "$88,991" },
                { name: "Advanced React Patterns", students: 620, revenue: "$80,593" },
                { name: "UI/UX Design Masterclass", students: 450, revenue: "$35,995" },
              ].map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.students.toLocaleString()} students</p>
                  </div>
                  <span className="font-medium">{course.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
