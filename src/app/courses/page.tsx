"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { toast } from "sonner";
import { Search, Star, Clock, Users, SlidersHorizontal, X } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  level: string;
  price: number;
  comparePrice: number | null;
  currency: string;
  duration: number | null;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  instructor: {
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: { tag: { name: string; slug: string } }[];
}

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
        setTotalPages(data.meta.totalPages);
      }
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.map((c: { name: string; slug: string }) => ({ name: c.name, slug: c.slug })));
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Courses</h1>
            <p className="text-muted-foreground">Explore our collection of expert-led courses</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={category === "" ? "default" : "outline"}
                size="sm"
                onClick={() => { setCategory(""); setPage(1); }}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.slug}
                  variant={category === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setCategory(cat.slug); setPage(1); }}
                >
                  {cat.name}
                </Button>
              ))}
              {(search || category) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <Link key={course.id} href={`/course/${course.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/20">{course.category.name[0]}</span>
                        </div>
                        <Badge className="absolute top-3 left-3">{course.level}</Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {course.instructor.displayName || `${course.instructor.firstName} ${course.instructor.lastName}`}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {course.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.enrollmentCount.toLocaleString()}
                          </span>
                          {course.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {Math.floor(course.duration / 60)}h
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">${course.price}</span>
                          {course.comparePrice && (
                            <span className="text-sm text-muted-foreground line-through">${course.comparePrice}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
