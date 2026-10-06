"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
  } | null;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPayments(data.data);
      })
      .catch(() => toast.error("Failed to load payment history"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "REFUNDED":
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No payments yet</h3>
            <p className="text-muted-foreground mb-4">Your payment history will appear here.</p>
            <Link href="/courses">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Browse Courses
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment History</h1>
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {payment.course?.title || "Unknown Course"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: payment.currency,
                        }).format(Number(payment.amount))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(payment.status)}
                  {payment.course && payment.status === "COMPLETED" && (
                    <Link href={`/course/${payment.course.slug}`}>
                      <span className="text-sm text-primary hover:underline flex items-center">
                        View Course <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
