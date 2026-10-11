import { LayoutDashboard, Inbox, ListChecks } from "lucide-react";
import { requireEmployee } from "@/lib/auth";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { href: "/employee", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/available", label: "Available Leads", icon: Inbox },
  { href: "/employee/my-leads", label: "My Leads", icon: ListChecks },
];

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireEmployee();

  return (
    <DashboardShell
      navItems={navItems}
      roleLabel="Employee"
      userName={session.name}
      userEmail={session.email}
    >
      {children}
    </DashboardShell>
  );
}
