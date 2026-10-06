"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CreditCard, Tag, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface CheckoutData {
  clientSecret: string;
  paymentId: string;
  amount: number;
  currency: string;
  courseName: string;
}

function CheckoutForm({
  clientSecret,
  courseName,
  amount,
  currency,
  courseId,
}: {
  clientSecret: string;
  courseName: string;
  amount: number;
  currency: string;
  courseId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful! Enrolling you now...");
      // The webhook will handle enrollment, but let's also do it client-side as backup
      try {
        await fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
      } catch {
        // Webhook will handle it
      }
      router.push("/dashboard/courses");
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Course</span>
          <span className="font-medium">{courseName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Amount</span>
          <span className="text-xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency,
            }).format(amount)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Card Details</Label>
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: "",
              },
            },
          }}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={!stripe || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured by Stripe. We do not store your card details.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    if (!courseId) {
      router.push("/courses");
      return;
    }

    fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCheckoutData(data.data);
        } else {
          toast.error(data.error || "Failed to initialize payment");
          router.push(`/course/${courseId}`);
        }
      })
      .catch(() => {
        toast.error("Failed to initialize payment");
        router.push(`/course/${courseId}`);
      })
      .finally(() => setLoading(false));
  }, [courseId, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !courseId) return;
    setValidatingCoupon(true);
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponCode}&courseId=${courseId}`);
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data);
        toast.success(`Coupon applied: ${data.data.discountValue}${data.data.discountType === "percentage" ? "%" : "$"} off`);
        // Recreate payment intent with coupon
        const intentRes = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, couponCode }),
        });
        const intentData = await intentRes.json();
        if (intentData.success) {
          setCheckoutData(intentData.data);
        }
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-lg">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <Skeleton className="h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-lg text-center py-20">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
            <p className="text-muted-foreground mb-6">Unable to initialize payment. Please try again.</p>
            <Link href={`/course/${courseId}`}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-lg">
          <Link href={`/course/${courseId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Course
          </Link>

          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          {/* Coupon Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter coupon code"
                    className="pl-10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                </div>
                {appliedCoupon ? (
                  <Button variant="outline" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                    Remove
                  </Button>
                ) : (
                  <Button onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode.trim()}>
                    {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Coupon applied: {appliedCoupon.discountValue}{appliedCoupon.discountType === "percentage" ? "%" : "$"} off
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Complete your purchase securely</CardDescription>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: checkoutData.clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#0f172a",
                    },
                  },
                }}
              >
                <CheckoutForm
                  clientSecret={checkoutData.clientSecret}
                  courseName={checkoutData.courseName}
                  amount={checkoutData.amount}
                  currency={checkoutData.currency}
                  courseId={courseId!}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
