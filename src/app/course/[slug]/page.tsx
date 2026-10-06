"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { toast } from "sonner";
import {
  Star, Clock, Users, BookOpen, PlayCircle, FileText, CheckCircle,
  Award, ChevronDown, ChevronUp, ShoppingCart, Heart, Share2
} from "lucide-react";

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  previewVideo: string | null;
  level: string;
  language: string;
  price: number;
  comparePrice: number | null;
  currency: string;
  duration: number | null;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  isCertificateEnabled: boolean;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
    bio: string | null;
    instructorProfile: {
      totalStudents: number;
      totalCourses: number;
      rating: number;
    } | null;
  };
  category: { name: string; slug: string };
  sections: {
    id: string;
    title: string;
    description: string | null;
    lessons: {
      id: string;
      title: string;
      type: string;
      videoDuration: number | null;
      isPreview: boolean;
      isDownloadable: boolean;
    }[];
  }[];
  tags: { tag: { name: string; slug: string } }[];
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    content: string;
    helpfulCount: number;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      displayName: string | null;
      avatar: string | null;
    };
  }[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourse(data.data);
          if (data.data.sections.length > 0) {
            setExpandedSections(new Set([data.data.sections[0].id]));
          }
        }
      })
      .catch(() => toast.error("Failed to load course"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course?.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Successfully enrolled!");
        setIsEnrolled(true);
        router.push("/dashboard/courses");
      } else if (res.status === 401) {
        toast.error("Please sign in to enroll");
        router.push("/login");
      } else {
        toast.error(data.error || "Enrollment failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/3 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="aspect-video" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">The course you are looking for does not exist.</p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = course.comparePrice
    ? Math.round(((course.comparePrice - course.price) / course.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-foreground">Courses</Link>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Badge className="mb-3">{course.level}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{course.shortDescription}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <strong>{course.rating}</strong> ({course.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.enrollmentCount.toLocaleString()} students
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m` : "Self-paced"}
                  </span>
                  <span>Language: {course.language.toUpperCase()}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" /> Preview Course
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="curriculum">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({course.reviewCount})</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground">
                      {course.totalLessons} lessons · {course.totalQuizzes} quizzes · {course.totalAssignments} assignments
                    </p>
                  </div>
                  {course.sections.map((section) => (
                    <Card key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold">{section.title}</h3>
                          <p className="text-sm text-muted-foreground">{section.lessons.length} lessons</p>
                        </div>
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      {expandedSections.has(section.id) && (
                        <div className="border-t">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                            >
                              {lesson.type === "VIDEO" ? (
                                <PlayCircle className="h-5 w-5 text-muted-foreground" />
                              ) : lesson.type === "PDF" ? (
                                <FileText className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{lesson.title}</p>
                                {lesson.isPreview && (
                                  <Badge variant="secondary" className="text-xs mt-1">Preview</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{formatDuration(lesson.videoDuration)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">About This Course</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {course.description || "No description available."}
                      </p>
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">What You Will Learn</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {["Master core concepts", "Build real-world projects", "Earn a certificate", "Lifetime access"].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {course.reviews.length === 0 ? (
                    <Card><CardContent className="p-6 text-center text-muted-foreground">No reviews yet</CardContent></Card>
                  ) : (
                    course.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {(review.user.displayName || `${review.user.firstName} ${review.user.lastName}`).charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {review.user.displayName || `${review.user.firstName} ${review.user.lastName}`}
                                </span>
                                <div className="flex">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              {review.title && <p className="font-medium mb-1">{review.title}</p>}
                              <p className="text-sm text-muted-foreground">{review.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="instructor" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                          {(course.instructor.displayName || `${course.instructor.firstName} ${course.instructor.lastName}`).charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {course.instructor.displayName || `${course.instructor.firstName} ${course.instructor.lastName}`}
                          </h3>
                          {course.instructor.instructorProfile && (
                            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                              <span>{course.instructor.instructorProfile.totalStudents.toLocaleString()} students</span>
                              <span>{course.instructor.instructorProfile.totalCourses} courses</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {course.instructor.instructorProfile.rating}
                              </span>
                            </div>
                          )}
                          <p className="text-muted-foreground mt-3">{course.instructor.bio || "No bio available."}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-primary/40" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl font-bold">${course.price}</span>
                      {course.comparePrice && (
                        <span className="text-lg text-muted-foreground line-through">${course.comparePrice}</span>
                      )}
                    </div>
                    {discount > 0 && (
                      <Badge variant="secondary" className="mb-4">{discount}% OFF</Badge>
                    )}
                  </div>
                  <Button className="w-full" size="lg" onClick={handleEnroll} disabled={enrolling || isEnrolled}>
                    {enrolling ? "Enrolling..." : isEnrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration ? `${Math.floor(course.duration / 60)}h total` : "Self-paced"}</span>
                    </div>
                    {course.isCertificateEnabled && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.enrollmentCount.toLocaleString()} students enrolled</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Heart className="h-4 w-4 mr-1" /> Wishlist
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      <Share2 className="h-4 w-4 mr-1" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
