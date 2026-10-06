"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Award, Star } from "lucide-react";

const stats = [
  { icon: Users, label: "Active Students", value: "12,500+" },
  { icon: BookOpen, label: "Total Courses", value: "250+" },
  { icon: Award, label: "Certificates Issued", value: "8,200+" },
  { icon: Star, label: "Average Rating", value: "4.8/5" },
];

export function Stats() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
