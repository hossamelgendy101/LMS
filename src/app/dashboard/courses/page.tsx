"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BookOpen, Clock, Play, Award } from "lucide-react";

interface Enrollment {
  id: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: string;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    instructor: {
      firstName: string;
      lastName: string;
      displayName: string | null;
    };
  };
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEnrollments(data.data);
      })
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course.</p>
            <Link href="/courses">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Browse Courses
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => (
          <Link key={enrollment.id} href={`/course/${enrollment.course.slug}`}>
            <Card className="hover:shadow-lg transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-primary/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{enrollment.course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {enrollment.course.instructor.displayName || `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{enrollment.progress}% complete</span>
                        <span className="text-muted-foreground">{enrollment.completedLessons}/{enrollment.totalLessons} lessons</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Badge variant={enrollment.status === "ACTIVE" ? "default" : "secondary"}>
                        {enrollment.status === "ACTIVE" ? "In Progress" : enrollment.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
