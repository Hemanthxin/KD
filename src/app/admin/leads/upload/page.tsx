import { TopHeader } from "@/components/dashboard-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { UploadLeadsForm } from "@/components/admin/upload-leads-form";

export default function UploadLeadsPage() {
  return (
    <>
      <TopHeader
        title="Upload Leads"
        description="Add a batch of business leads from a spreadsheet. They'll appear immediately in every worker's available leads."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Upload file" />
          <div className="p-5">
            <UploadLeadsForm />
          </div>
        </Card>

        <Card>
          <CardHeader title="Accepted columns" />
          <div className="space-y-3 p-5 text-sm text-text-muted">
            <p>
              Upload a <strong className="text-foreground">.csv</strong>,{" "}
              <strong className="text-foreground">.xlsx</strong>, or{" "}
              <strong className="text-foreground">.xls</strong> file. Column
              order doesn&apos;t matter — we match headers automatically.
            </p>
            <ul className="space-y-1.5">
              <ColumnHint label="Business Name" required />
              <ColumnHint label="Phone" note="or Email required" />
              <ColumnHint label="Email" note="or Phone required" />
              <ColumnHint label="Contact Name" optional />
              <ColumnHint label="Category" optional />
              <ColumnHint label="City" optional />
              <ColumnHint label="Notes" optional />
            </ul>
            <p className="pt-1 text-xs">
              Rows missing a business name, or missing both phone and email,
              are skipped automatically.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

function ColumnHint({
  label,
  required,
  optional,
  note,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  note?: string;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-xs">
        {required && (
          <span className="font-semibold text-brand-emerald-600">
            required
          </span>
        )}
        {optional && <span>optional</span>}
        {note && <span>{note}</span>}
      </span>
    </li>
  );
}
