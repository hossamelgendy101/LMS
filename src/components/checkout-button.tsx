"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShoppingCart } from "lucide-react";

interface CheckoutButtonProps {
  courseId: string;
  price: number;
  isEnrolled: boolean;
}

export function CheckoutButton({ courseId, price, isEnrolled }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (isEnrolled) {
      router.push("/dashboard/courses");
      return;
    }

    if (price === 0) {
      // Free course - enroll directly
      setLoading(true);
      try {
        const res = await fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Enrolled successfully!");
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
        setLoading(false);
      }
      return;
    }

    // Paid course - redirect to checkout
    router.push(`/checkout?courseId=${courseId}`);
  };

  return (
    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isEnrolled ? (
        "Continue Learning"
      ) : price === 0 ? (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Enroll for Free
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy Now
        </>
      )}
    </Button>
  );
}
