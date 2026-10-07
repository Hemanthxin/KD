import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Tag,
  User,
  ArrowLeft,
  UserX,
  Trash2,
} from "lucide-react";
import { db } from "@/lib/db";
import { TopHeader } from "@/components/dashboard-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/utils";
import { unassignLead, deleteLead } from "@/app/admin/actions/lead-actions";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      uploadedBy: true,
      activities: {
        orderBy: { createdAt: "desc" },
        include: { actor: true },
      },
    },
  });

  if (!lead) notFound();

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <TopHeader
        title={lead.businessName}
        description={`Added ${formatDateTime(lead.createdAt)}${
          lead.uploadedBy ? ` by ${lead.uploadedBy.name}` : ""
        }`}
        action={<StatusBadge status={lead.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader title="Business details" />
            <dl className="space-y-3 p-5 text-sm">
              <DetailRow icon={Phone} label="Phone" value={lead.phone} />
              <DetailRow icon={Mail} label="Email" value={lead.email} />
              <DetailRow icon={MapPin} label="City" value={lead.city} />
              <DetailRow icon={Tag} label="Category" value={lead.category} />
              <DetailRow
                icon={User}
                label="Contact"
                value={lead.contactName}
              />
              {lead.notes && (
                <div className="border-t border-border-subtle pt-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Notes
                  </dt>
                  <dd className="mt-1 text-foreground">{lead.notes}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Assignment" />
            <div className="p-5">
              {lead.assignedTo ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {lead.assignedTo.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {lead.assignedTo.email}
                    </p>
                  </div>
                  <form
                    action={unassignLead.bind(null, lead.id)}
                    className="shrink-0"
                  >
                    <ConfirmSubmitButton
                      variant="outline"
                      size="sm"
                      confirmMessage="Release this lead back to the pool? The assigned worker will lose it."
                    >
                      <UserX className="h-4 w-4" />
                      Release
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  Not yet claimed by a worker.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <form action={deleteLead.bind(null, lead.id)}>
                <ConfirmSubmitButton
                  variant="danger"
                  size="sm"
                  className="w-full"
                  confirmMessage="Delete this lead permanently? This cannot be undone."
                >
                  <Trash2 className="h-4 w-4" />
                  Delete lead
                </ConfirmSubmitButton>
              </form>
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Activity timeline"
            description="Full history of this lead, most recent first"
          />
          <div className="divide-y divide-border-subtle">
            {lead.activities.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                No activity yet.
              </p>
            )}
            {lead.activities.map((activity) => (
              <div key={activity.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-foreground">
                    {activity.actor?.name ?? "System"}
                  </p>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDateTime(activity.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-muted">
                  {describeActivity(activity)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-text-muted" />
      <div className="min-w-0">
        <dt className="text-xs text-text-muted">{label}</dt>
        <dd className="truncate font-medium text-foreground">
          {value || "—"}
        </dd>
      </div>
    </div>
  );
}

function describeActivity(activity: {
  action: string;
  note: string | null;
  fromStatus: string | null;
  toStatus: string | null;
}) {
  switch (activity.action) {
    case "UPLOADED":
      return "Uploaded into the lead pool";
    case "ACCEPTED":
      return "Accepted this lead and started working it";
    case "STATUS_CHANGED":
      return `Changed status from ${formatStatus(
        activity.fromStatus
      )} to ${formatStatus(activity.toStatus)}${
        activity.note ? ` — ${activity.note}` : ""
      }`;
    case "NOTE_ADDED":
      return activity.note ?? "Added a note";
    case "UNASSIGNED":
      return activity.note ?? "Released back to the pool";
    default:
      return activity.note ?? activity.action;
  }
}

function formatStatus(status: string | null) {
  if (!status) return "—";
  return status.replace("_", " ").toLowerCase();
}
