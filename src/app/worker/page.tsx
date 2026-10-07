import Link from "next/link";
import { Inbox, Loader, CheckCircle2, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { requireWorker } from "@/lib/auth";
import { TopHeader } from "@/components/dashboard-shell";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { AcceptLeadButton } from "@/components/worker/accept-lead-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WorkerDashboardPage() {
  const session = await requireWorker();

  const [available, myLeads] = await Promise.all([
    db.lead.findMany({
      where: { status: "NEW", assignedToId: null },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    db.lead.findMany({
      where: { assignedToId: session.uid },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const activeCount = myLeads.filter((l) => l.status === "IN_PROGRESS").length;
  const completedCount = myLeads.filter((l) => l.status === "COMPLETED").length;

  return (
    <>
      <TopHeader
        title={`Welcome back, ${session.name.split(" ")[0]}`}
        description="Here's where things stand today."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Available Leads"
          value={available.length > 0 ? `${available.length}+` : 0}
          icon={Inbox}
          tone="amber"
          hint="Up for grabs"
        />
        <StatCard
          label="My Active Leads"
          value={activeCount}
          icon={Loader}
          tone="neutral"
        />
        <StatCard
          label="My Conversions"
          value={completedCount}
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="New leads to accept"
            action={
              <Link
                href="/worker/available"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-emerald-600 hover:text-brand-emerald-700"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border-subtle">
            {available.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                No unclaimed leads right now.
              </p>
            )}
            {available.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {lead.businessName}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {lead.phone ?? lead.email}
                  </p>
                </div>
                <AcceptLeadButton leadId={lead.id} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="My active leads"
            action={
              <Link
                href="/worker/my-leads"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-emerald-600 hover:text-brand-emerald-700"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border-subtle">
            {myLeads.filter((l) => l.status === "IN_PROGRESS").length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                Accept a lead to start working it.
              </p>
            )}
            {myLeads
              .filter((l) => l.status === "IN_PROGRESS")
              .slice(0, 5)
              .map((lead) => (
                <Link
                  key={lead.id}
                  href={`/worker/leads/${lead.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {lead.businessName}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      Accepted {lead.acceptedAt ? formatDate(lead.acceptedAt) : "—"}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </>
  );
}
