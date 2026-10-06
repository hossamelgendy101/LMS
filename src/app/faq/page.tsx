import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about LMS Platform",
};

const faqs = [
  {
    question: "How do I get started with LMS Platform?",
    answer: "Simply create a free account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately!",
  },
  {
    question: "Are the certificates recognized?",
    answer: "Yes, all certificates issued by LMS Platform include a unique verification ID and QR code that employers can use to verify your credentials.",
  },
  {
    question: "Can I download course materials?",
    answer: "Pro and Enterprise plan users can download course materials including videos, PDFs, and code resources for offline learning.",
  },
  {
    question: "What is the refund policy?",
    answer: "We offer a 30-day money-back guarantee for all paid courses. If you are not satisfied, contact our support team for a full refund.",
  },
  {
    question: "How do I become an instructor?",
    answer: "Apply through our instructor portal. Our team will review your application and expertise. Once approved, you can start creating and publishing courses.",
  },
  {
    question: "Is there a mobile app?",
    answer: "Yes, LMS Platform is fully responsive and works great on mobile devices. We also have dedicated iOS and Android apps for offline learning.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about LMS Platform
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
