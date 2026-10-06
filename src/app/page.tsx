import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FeaturedCourses } from "@/components/landing/featured-courses";
import { Categories } from "@/components/landing/categories";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <TrendingUp className="h-4 w-4" />
                <span>Over 10,000+ students learning</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Master New Skills with{" "}
                <span className="text-primary">Expert-Led</span> Courses
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Learn from industry professionals. Build real-world projects. Get certified. 
                Start your journey to becoming a professional developer, designer, or data scientist today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button size="lg" className="w-full sm:w-auto">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Users className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Certified Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Expert Instructors</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Start Learning Today</p>
                  </div>
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-lg border animate-slide-in-from-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Certificate</p>
                    <p className="text-xs text-muted-foreground">Earn on completion</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border animate-slide-in-from-bottom">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">12.5K+ Students</p>
                    <p className="text-xs text-muted-foreground">Learning together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Stats />

      {/* Categories */}
      <Categories />

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <CTA />

      <Footer />
    </div>
  );
}
