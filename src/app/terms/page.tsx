import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Terms of Service",
  description: "LMS Platform Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: January 1, 2024</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using LMS Platform, you agree to be bound by these Terms of Service. 
              If you do not agree, you may not use our services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to provide accurate information and update it as necessary.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Course Content</h2>
            <p className="text-muted-foreground mb-4">
              All course content is protected by copyright. You may not reproduce, distribute, or 
              create derivative works without explicit permission.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payments and Refunds</h2>
            <p className="text-muted-foreground mb-4">
              All payments are processed securely. We offer a 30-day money-back guarantee for 
              eligible purchases. Refunds are processed within 5-10 business days.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
