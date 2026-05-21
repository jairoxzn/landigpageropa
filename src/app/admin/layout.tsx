import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { NotificationsProvider } from "@/components/admin/notifications-context";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar user={{ name: session.name, email: session.email }} />
        <div className="pl-64">{children}</div>
      </div>
    </NotificationsProvider>
  );
}
