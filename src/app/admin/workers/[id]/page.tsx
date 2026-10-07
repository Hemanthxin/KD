import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, initials } from "@/lib/utils";
import { Loader, CheckCircle2, XCircle, ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const worker = await db.user.findUnique({
    where: { id },
    include: {
      leadsAssigned: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!worker || worker.role !== "WORKER") notFound();

  const inProgress = worker.leadsAssigned.filter(
    (l) => l.status === "IN_PROGRESS"
  ).length;
  const completed = worker.leadsAssigned.filter(
    (l) => l.status === "COMPLETED"
  ).length;
  const notInterested = worker.leadsAssigned.filter(
    (l) => l.status === "NOT_INTERESTED"
  ).length;

  return (
    <>
      <Link
        href="/admin/workers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workers
      </Link>

      <TopHeader
        title={worker.name}
        description={worker.email}
        action={
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal-900 text-sm font-bold text-white">
            {initials(worker.name)}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Assigned"
          value={worker.leadsAssigned.length}
          icon={ListChecks}
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          icon={Loader}
          tone="amber"
        />
        <StatCard
          label="Converted"
          value={completed}
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Assigned leads"
          description={`${notInterested} marked not interested`}
        />
        <div className="divide-y divide-border-subtle">
          {worker.leadsAssigned.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-text-muted">
              Hasn&apos;t accepted any leads yet.
            </p>
          )}
          {worker.leadsAssigned.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-surface-muted"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {lead.businessName}
                </p>
                <p className="truncate text-xs text-text-muted">
                  Updated {formatDate(lead.updatedAt)}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </Link>
          ))}
        </div>
      </Card>

      {notInterested > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
          <XCircle className="h-3.5 w-3.5" />
          Leads marked not interested still count toward this worker&apos;s
          history above.
        </p>
      )}
    </>
  );
}
