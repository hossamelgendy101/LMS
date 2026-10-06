"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CheckCircle, BookOpen, ArrowRight, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    // Poll for enrollment status (webhook might take a moment)
    const checkEnrollment = async () => {
      try {
        const res = await fetch("/api/enrollments");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setEnrolled(true);
        }
      } catch {
        // Ignore
      } finally {
        setVerifying(false);
      }
    };

    const timer = setTimeout(checkEnrollment, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your enrollment is being processed.
                </p>
              </div>

              {verifying ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Finalizing your enrollment...</span>
                </div>
              ) : enrolled ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>You are now enrolled!</span>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-4">
                <Link href="/dashboard/courses">
                  <Button className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Go to My Courses
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" className="w-full">
                    Browse More Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
