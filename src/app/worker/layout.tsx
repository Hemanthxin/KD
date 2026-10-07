import { LayoutDashboard, Inbox, ListChecks } from "lucide-react";
import { requireWorker } from "@/lib/auth";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { href: "/worker", label: "Dashboard", icon: LayoutDashboard },
  { href: "/worker/available", label: "Available Leads", icon: Inbox },
  { href: "/worker/my-leads", label: "My Leads", icon: ListChecks },
];

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireWorker();

  return (
    <DashboardShell
      navItems={navItems}
      roleLabel="Worker"
      userName={session.name}
      userEmail={session.email}
    >
      {children}
    </DashboardShell>
  );
}
