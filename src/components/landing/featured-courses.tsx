"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const featuredCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    instructor: "John Smith",
    thumbnail: "/api/placeholder/400/225",
    rating: 4.7,
    reviewCount: 320,
    students: 1250,
    duration: "48h",
    level: "Beginner",
    price: 89.99,
    comparePrice: 199.99,
    category: "Development",
  },
  {
    id: "2",
    title: "Advanced React Patterns & Performance",
    slug: "advanced-react-patterns-performance",
    instructor: "John Smith",
    thumbnail: "/api/placeholder/400/225",
    rating: 4.9,
    reviewCount: 215,
    students: 890,
    duration: "24h",
    level: "Advanced",
    price: 129.99,
    comparePrice: 249.99,
    category: "Development",
  },
  {
    id: "3",
    title: "Machine Learning Fundamentals",
    slug: "machine-learning-fundamentals",
    instructor: "Sarah Johnson",
    thumbnail: "/api/placeholder/400/225",
    rating: 4.8,
    reviewCount: 450,
    students: 2100,
    duration: "36h",
    level: "Intermediate",
    price: 99.99,
    comparePrice: 179.99,
    category: "Data Science",
  },
  {
    id: "4",
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design-masterclass",
    instructor: "Sarah Johnson",
    thumbnail: "/api/placeholder/400/225",
    rating: 4.6,
    reviewCount: 180,
    students: 750,
    duration: "28h",
    level: "Beginner",
    price: 79.99,
    comparePrice: 149.99,
    category: "Design",
  },
];

export function FeaturedCourses() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-muted-foreground max-w-2xl">
              Hand-picked courses from our top instructors to help you start your learning journey.
            </p>
          </div>
          <Link href="/courses" className="hidden md:block">
            <Button variant="outline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/course/${course.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">{course.category[0]}</span>
                    </div>
                    <Badge className="absolute top-3 left-3">{course.level}</Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">${course.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${course.comparePrice}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {Math.round(((course.comparePrice - course.price) / course.comparePrice) * 100)}% OFF
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/courses">
            <Button variant="outline">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
