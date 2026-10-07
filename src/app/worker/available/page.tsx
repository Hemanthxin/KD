import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { SearchBox } from "@/components/search-box";
import { AcceptLeadButton } from "@/components/worker/accept-lead-button";
import { Phone, Mail, MapPin, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AvailableLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where: Prisma.LeadWhereInput = { status: "NEW", assignedToId: null };
  if (q) where.businessName = { contains: q };

  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <TopHeader
        title="Available Leads"
        description="Unclaimed businesses waiting for outreach. First to accept, works it."
      />

      <div className="mb-5">
        <SearchBox placeholder="Search business name…" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leads.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-border-subtle py-16 text-center text-sm text-text-muted">
            No available leads right now — check back soon.
          </p>
        )}
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex flex-col rounded-xl border border-border-subtle bg-surface p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground">
              {lead.businessName}
            </h3>
            <div className="mt-3 space-y-1.5 text-sm text-text-muted">
              {lead.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" /> {lead.phone}
                </p>
              )}
              {lead.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> {lead.email}
                </p>
              )}
              {lead.city && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {lead.city}
                </p>
              )}
              {lead.category && (
                <p className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 shrink-0" /> {lead.category}
                </p>
              )}
            </div>
            {lead.notes && (
              <p className="mt-3 line-clamp-2 text-xs text-text-muted">
                {lead.notes}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
              <span className="text-xs text-text-muted">
                Added {formatDate(lead.createdAt)}
              </span>
              <AcceptLeadButton leadId={lead.id} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
