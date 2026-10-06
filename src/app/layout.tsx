import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LMS Platform - Online Learning",
    template: "%s | LMS Platform",
  },
  description: "The best online learning platform for developers, designers, and data scientists. Learn from industry experts with hands-on projects.",
  keywords: ["online learning", "courses", "education", "web development", "data science", "design"],
  authors: [{ name: "LMS Platform" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lms-platform.com",
    siteName: "LMS Platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
