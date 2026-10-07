import Link from "next/link";
import type { Prisma, LeadStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { LinkButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { LeadsFilterBar } from "@/components/admin/leads-filter-bar";
import { formatDate } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    worker?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.LeadWhereInput = {};
  if (params.status) where.status = params.status as LeadStatus;
  if (params.worker === "unassigned") where.assignedToId = null;
  else if (params.worker) where.assignedToId = params.worker;
  if (params.q) where.businessName = { contains: params.q };

  const [leads, total, workers] = await Promise.all([
    db.lead.findMany({
      where,
      include: { assignedTo: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.lead.count({ where }),
    db.user.findMany({
      where: { role: "WORKER" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <TopHeader
        title="Leads"
        description={`${total} lead${total === 1 ? "" : "s"} in the workspace`}
        action={
          <LinkButton href="/admin/leads/upload" size="sm">
            <UploadCloud className="h-4 w-4" />
            Upload Leads
          </LinkButton>
        }
      />

      <LeadsFilterBar workers={workers} />

      <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-5 py-3">Business</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Assigned To</th>
              <th className="px-5 py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-text-muted"
                >
                  No leads match these filters.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-surface-muted">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-foreground hover:text-brand-emerald-600"
                  >
                    {lead.businessName}
                  </Link>
                  {lead.city && (
                    <p className="text-xs text-text-muted">{lead.city}</p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-text-muted">
                  {lead.phone ?? lead.email ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-3.5 text-text-muted">
                  {lead.assignedTo?.name ?? (
                    <span className="italic text-text-muted/70">
                      Unclaimed
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-text-muted">
                  {formatDate(lead.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <PageLink
              page={page - 1}
              disabled={page <= 1}
              searchParams={params}
            >
              Previous
            </PageLink>
            <PageLink
              page={page + 1}
              disabled={page >= totalPages}
              searchParams={params}
            >
              Next
            </PageLink>
          </div>
        </div>
      )}
    </>
  );
}

function PageLink({
  page,
  disabled,
  searchParams,
  children,
}: {
  page: number;
  disabled: boolean;
  searchParams: Record<string, string | undefined>;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-muted/50">
        {children}
      </span>
    );
  }

  const next = new URLSearchParams(
    Object.entries(searchParams).filter(([, v]) => v) as [string, string][]
  );
  next.set("page", String(page));

  return (
    <Link
      href={`/admin/leads?${next.toString()}`}
      className="rounded-lg border border-border-subtle px-3 py-1.5 hover:bg-surface-muted"
    >
      {children}
    </Link>
  );
}
