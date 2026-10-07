import { acceptLead } from "@/app/worker/actions/worker-lead-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ComponentProps } from "react";

export function AcceptLeadButton({
  leadId,
  ...props
}: { leadId: string } & Omit<ComponentProps<typeof SubmitButton>, "children" | "pendingText">) {
  return (
    <form action={acceptLead.bind(null, leadId)}>
      <SubmitButton pendingText="Accepting…" {...props}>
        Accept
      </SubmitButton>
    </form>
  );
}
