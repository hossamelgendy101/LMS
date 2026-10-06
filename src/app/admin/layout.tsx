import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      redirect("/dashboard");
    }
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
