import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { logout } from "@/app/actions/auth-actions";
import { initials } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "@/components/nav-link";
import { MobileSidebar } from "@/components/mobile-sidebar";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function DashboardShell({
  navItems,
  roleLabel,
  userName,
  userEmail,
  children,
}: {
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      <MobileSidebar>
        <div className="px-5 py-6">
          <Logo href={null} dark size={36} />
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<item.icon className="h-4 w-4" />}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-2.5 rounded-lg bg-white/5 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-emerald-500 text-xs font-bold text-white">
              {initials(userName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {userName}
              </p>
              <p className="truncate text-xs text-white/50">{userEmail}</p>
            </div>
          </div>
          <p className="mt-3 px-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
            {roleLabel}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </MobileSidebar>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export function TopHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export { Link };
