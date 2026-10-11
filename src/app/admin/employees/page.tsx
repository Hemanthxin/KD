import Link from "next/link";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { CreateEmployeeForm } from "@/components/admin/create-employee-form";
import { Button } from "@/components/ui/button";
import { toggleEmployeeActive } from "@/app/admin/actions/employee-actions";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await db.user.findMany({
    where: { role: "EMPLOYEE" },
    orderBy: { createdAt: "desc" },
    include: {
      leadsAssigned: { select: { status: true } },
    },
  });

  return (
    <>
      <TopHeader
        title="Employees"
        description={`${employees.length} employee${employees.length === 1 ? "" : "s"} with access to the lead pool`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader
            title="Add an employee"
            description="They'll sign in from the Employee Login page"
          />
          <div className="p-5">
            <CreateEmployeeForm />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="All employees" />
          <div className="divide-y divide-border-subtle">
            {employees.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-text-muted">
                No employees yet. Add your first one on the left.
              </p>
            )}
            {employees.map((employee) => {
              const active = employee.leadsAssigned.filter(
                (l) => l.status === "IN_PROGRESS"
              ).length;
              const completed = employee.leadsAssigned.filter(
                (l) => l.status === "COMPLETED"
              ).length;

              return (
                <div
                  key={employee.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    href={`/admin/employees/${employee.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-900 text-xs font-bold text-white">
                      {initials(employee.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {employee.name}
                        {!employee.active && (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                            Disabled
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {employee.email}
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
                    <form action={toggleEmployeeActive.bind(null, employee.id)}>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                      >
                        {employee.active ? "Disable" : "Enable"}
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
