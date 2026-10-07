import Link from "next/link";
import {
  Inbox,
  Loader,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [statusCounts, workerCount, recentActivity, topWorkers] =
    await Promise.all([
      db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
      db.user.count({ where: { role: "WORKER" } }),
      db.leadActivity.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { lead: true, actor: true },
      }),
      db.user.findMany({
        where: { role: "WORKER" },
        include: {
          _count: {
            select: {
              leadsAssigned: { where: { status: "COMPLETED" } },
            },
          },
          leadsAssigned: { select: { status: true } },
        },
      }),
    ]);

  const counts = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count._all])
  ) as Record<string, number>;

  const total =
    (counts.NEW ?? 0) +
    (counts.IN_PROGRESS ?? 0) +
    (counts.COMPLETED ?? 0) +
    (counts.NOT_INTERESTED ?? 0);

  const rankedWorkers = topWorkers
    .map((w) => ({
      id: w.id,
      name: w.name,
      completed: w.leadsAssigned.filter((l) => l.status === "COMPLETED")
        .length,
      active: w.leadsAssigned.filter((l) => l.status === "IN_PROGRESS")
        .length,
    }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5);

  return (
    <>
      <TopHeader
        title="Dashboard"
        description="Live overview of leads, workers, and conversions."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={total}
          icon={Inbox}
          tone="neutral"
        />
        <StatCard
          label="Unclaimed"
          value={counts.NEW ?? 0}
          icon={Inbox}
          tone="amber"
          hint="Waiting for a worker"
        />
        <StatCard
          label="In Progress"
          value={counts.IN_PROGRESS ?? 0}
          icon={Loader}
          tone="neutral"
          hint="Being worked right now"
        />
        <StatCard
          label="Converted"
          value={counts.COMPLETED ?? 0}
          icon={CheckCircle2}
          tone="emerald"
          hint="Became paying clients"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Recent activity"
            description="Latest updates across all leads"
            action={
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-emerald-600 hover:text-brand-emerald-700"
              >
                View all leads <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border-subtle">
            {recentActivity.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                No activity yet. Upload leads to get started.
              </p>
            )}
            {recentActivity.map((activity) => (
              <Link
                key={activity.id}
                href={`/admin/leads/${activity.leadId}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-surface-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {activity.lead.businessName}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {activity.actor?.name ?? "System"} ·{" "}
                    {activityLabel(activity.action)}
                    {activity.note ? ` — ${activity.note}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={activity.lead.status} />
                  <span className="text-xs text-text-muted">
                    {formatDateTime(activity.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Worker leaderboard"
            description={`${workerCount} worker${workerCount === 1 ? "" : "s"} total`}
            action={
              <Link
                href="/admin/workers"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-emerald-600 hover:text-brand-emerald-700"
              >
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border-subtle">
            {rankedWorkers.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                No workers yet.
              </p>
            )}
            {rankedWorkers.map((worker, i) => (
              <div
                key={worker.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-teal-900 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {worker.name}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Loader className="h-3.5 w-3.5" />
                    {worker.active} active
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {worker.completed} won
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {workerCount === 0 && (
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 px-5 py-4">
            <Users className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              You haven&apos;t added any workers yet.{" "}
              <Link href="/admin/workers" className="font-semibold underline">
                Add your first worker
              </Link>{" "}
              so they can start accepting leads.
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

function activityLabel(action: string) {
  switch (action) {
    case "UPLOADED":
      return "lead uploaded";
    case "ACCEPTED":
      return "accepted the lead";
    case "STATUS_CHANGED":
      return "updated status";
    case "NOTE_ADDED":
      return "added a note";
    case "UNASSIGNED":
      return "released the lead";
    default:
      return action;
  }
}
