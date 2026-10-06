"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code, BarChart3, Palette, Briefcase, Megaphone, ArrowRight } from "lucide-react";

const categories = [
  { icon: Code, name: "Development", slug: "development", count: 85, color: "bg-blue-500/10 text-blue-600" },
  { icon: BarChart3, name: "Data Science", slug: "data-science", count: 42, color: "bg-green-500/10 text-green-600" },
  { icon: Palette, name: "Design", slug: "design", count: 38, color: "bg-amber-500/10 text-amber-600" },
  { icon: Briefcase, name: "Business", slug: "business", count: 56, color: "bg-red-500/10 text-red-600" },
  { icon: Megaphone, name: "Marketing", slug: "marketing", count: 29, color: "bg-purple-500/10 text-purple-600" },
];

export function Categories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from a wide range of categories and start learning from the best instructors in the industry.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/courses?category=${category.slug}`}
                className="group block p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.color} mb-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.count} courses</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
