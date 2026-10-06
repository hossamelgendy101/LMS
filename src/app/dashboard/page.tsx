"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award, Clock, TrendingUp, Users, Star } from "lucide-react";

interface DashboardStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  totalCertificates: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
    { title: "Enrolled Courses", value: stats?.totalEnrollments ?? 0, icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
    { title: "Completed", value: stats?.completedCourses ?? 0, icon: Award, color: "bg-green-500/10 text-green-600" },
    { title: "In Progress", value: stats?.inProgressCourses ?? 0, icon: Clock, color: "bg-amber-500/10 text-amber-600" },
    { title: "Certificates", value: stats?.totalCertificates ?? 0, icon: Star, color: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here is your learning overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                  )}
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Completed Lesson {i}</p>
                    <p className="text-sm text-muted-foreground">Web Development Bootcamp</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Your active course progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: "Web Development Bootcamp", progress: 35 },
              { name: "Advanced React Patterns", progress: 10 },
              { name: "Machine Learning Fundamentals", progress: 50 },
            ].map((course) => (
              <div key={course.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{course.name}</span>
                  <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
