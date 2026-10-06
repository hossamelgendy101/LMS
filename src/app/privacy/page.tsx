import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Privacy Policy",
  description: "LMS Platform Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: January 1, 2024</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, including your name, email address, 
              password, and profile information. We also collect data about your learning progress, 
              course enrollments, and interactions with our platform.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use your information to provide and improve our services, personalize your learning 
              experience, process payments, send notifications, and comply with legal obligations.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures including encryption, secure servers, 
              and regular security audits to protect your personal information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to access, correct, or delete your personal information. Contact us 
              at privacy@lms.com to exercise these rights.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
