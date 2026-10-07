import { LayoutDashboard, ListChecks, UploadCloud, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: ListChecks },
  { href: "/admin/leads/upload", label: "Upload Leads", icon: UploadCloud },
  { href: "/admin/workers", label: "Workers", icon: Users },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <DashboardShell
      navItems={navItems}
      roleLabel="Administrator"
      userName={session.name}
      userEmail={session.email}
    >
      {children}
    </DashboardShell>
  );
}
