import Link from "next/link";
import type { LeadStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireWorker } from "@/lib/auth";
import { TopHeader } from "@/components/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { StatusFilterTabs } from "@/components/worker/status-filter-tabs";

export const dynamic = "force-dynamic";

export default async function MyLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireWorker();
  const { status } = await searchParams;

  const leads = await db.lead.findMany({
    where: {
      assignedToId: session.uid,
      ...(status ? { status: status as LeadStatus } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <TopHeader
        title="My Leads"
        description="Everything you've accepted, with its current progress."
      />

      <StatusFilterTabs />

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-5 py-3">Business</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-text-muted"
                >
                  No leads here yet.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-surface-muted">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/worker/leads/${lead.id}`}
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
                  {formatDate(lead.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
