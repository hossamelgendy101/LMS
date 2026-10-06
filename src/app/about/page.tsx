import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Globe, Target, Heart } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about LMS Platform and our mission to democratize education",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">About LMS Platform</h1>
            <p className="text-lg text-muted-foreground">
              We are on a mission to democratize education by providing world-class learning 
              experiences accessible to everyone, everywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Target, title: "Our Mission", text: "To empower millions of learners worldwide with accessible, high-quality education that transforms careers and lives." },
              { icon: Globe, title: "Our Vision", text: "A world where anyone, anywhere can learn anything they need to achieve their goals and dreams." },
              { icon: Heart, title: "Our Values", text: "Excellence, accessibility, innovation, and community drive everything we do at LMS Platform." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center mb-16">
            {[
              { icon: Users, value: "50,000+", label: "Students" },
              { icon: BookOpen, value: "250+", label: "Courses" },
              { icon: Award, value: "100+", label: "Instructors" },
              { icon: Globe, value: "120+", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
