import Link from "next/link";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { CreateWorkerForm } from "@/components/admin/create-worker-form";
import { Button } from "@/components/ui/button";
import { toggleWorkerActive } from "@/app/admin/actions/worker-actions";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WorkersPage() {
  const workers = await db.user.findMany({
    where: { role: "WORKER" },
    orderBy: { createdAt: "desc" },
    include: {
      leadsAssigned: { select: { status: true } },
    },
  });

  return (
    <>
      <TopHeader
        title="Workers"
        description={`${workers.length} worker${workers.length === 1 ? "" : "s"} with access to the lead pool`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader
            title="Add a worker"
            description="They'll sign in from the Worker Login page"
          />
          <div className="p-5">
            <CreateWorkerForm />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="All workers" />
          <div className="divide-y divide-border-subtle">
            {workers.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-text-muted">
                No workers yet. Add your first one on the left.
              </p>
            )}
            {workers.map((worker) => {
              const active = worker.leadsAssigned.filter(
                (l) => l.status === "IN_PROGRESS"
              ).length;
              const completed = worker.leadsAssigned.filter(
                (l) => l.status === "COMPLETED"
              ).length;

              return (
                <div
                  key={worker.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    href={`/admin/workers/${worker.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-900 text-xs font-bold text-white">
                      {initials(worker.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {worker.name}
                        {!worker.active && (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                            Disabled
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {worker.email}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between gap-5 pl-12 sm:justify-end sm:pl-0">
                    <div className="text-right text-xs text-text-muted">
                      <p>
                        <span className="font-semibold text-foreground">
                          {active}
                        </span>{" "}
                        active
                      </p>
                      <p>
                        <span className="font-semibold text-brand-emerald-600">
                          {completed}
                        </span>{" "}
                        won
                      </p>
                    </div>
                    <form action={toggleWorkerActive.bind(null, worker.id)}>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                      >
                        {worker.active ? "Disable" : "Enable"}
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
