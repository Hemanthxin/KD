import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  size = 40,
  showText = true,
  dark = false,
  className,
}: {
  href?: string | null;
  size?: number;
  showText?: boolean;
  dark?: boolean;
  className?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt="Krateus Dynamic Solutions"
        width={size}
        height={size}
        priority
        className="shrink-0 rounded-md"
      />
      {showText && (
        <span className="leading-tight">
          <span
            className={cn(
              "block font-bold tracking-tight",
              dark ? "text-white" : "text-brand-teal-950"
            )}
            style={{ fontSize: size * 0.34 }}
          >
            Krateus Dynamic
          </span>
          <span
            className={cn(
              "block text-[11px] font-medium uppercase tracking-[0.18em]",
              dark ? "text-brand-emerald-400" : "text-brand-emerald-600"
            )}
          >
            Lead Workspace
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
