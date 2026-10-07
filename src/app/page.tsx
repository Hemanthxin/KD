import Link from "next/link";
import {
  ShieldCheck,
  Users,
  UploadCloud,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/logo";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-brand-gradient">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <Logo href="/" dark size={38} />
          <nav className="flex items-center gap-2 text-sm sm:gap-3">
            <Link
              href="/login/worker"
              className="rounded-lg px-3 py-2 font-medium text-white/80 hover:text-white sm:px-4"
            >
              Worker Login
            </Link>
            <Link
              href="/login/admin"
              className="rounded-lg bg-brand-emerald-500 px-3 py-2 font-medium text-white hover:bg-brand-emerald-600 sm:px-4"
            >
              Admin Login
            </Link>
          </nav>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-emerald-300 ring-1 ring-inset ring-white/10">
              Internal Workspace
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Turn local businesses without a website into{" "}
              <span className="text-gradient-emerald">paying clients.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
              Krateus Dynamic Solutions&apos; lead workspace: admins upload
              business leads, workers claim and contact them, and every
              conversion from first call to completed website is tracked in
              one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login/admin"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:bg-brand-emerald-600"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Login
              </Link>
              <Link
                href="/login/worker"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Users className="h-4 w-4" />
                Worker Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              How the workspace works
            </h2>
            <p className="mt-3 text-text-muted">
              A simple pipeline from a raw business lead to a signed website
              client.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Step
              icon={UploadCloud}
              step="01"
              title="Admin uploads leads"
              description="Business names and numbers go in via CSV or Excel — any format. They land in the shared pool instantly."
            />
            <Step
              icon={PhoneCall}
              step="02"
              title="Workers accept & contact"
              description="Workers browse available leads, accept the ones they'll work, and reach out to pitch a website."
            />
            <Step
              icon={CheckCircle2}
              step="03"
              title="Track to conversion"
              description="Progress updates roll up to the admin dashboard in real time — who's working what, and what's completed."
            />
          </div>
        </section>

        <section className="border-t border-border-subtle bg-surface-muted">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6">
            <PortalCard
              icon={ShieldCheck}
              title="Admin Portal"
              description="Upload leads in bulk, manage workers, and see exactly which worker is working which lead and how far along it is."
              href="/login/admin"
              cta="Go to Admin Login"
            />
            <PortalCard
              icon={Users}
              title="Worker Portal"
              description="See available leads, accept the ones you'll pursue, and update status as you move a business toward becoming a client."
              href="/login/worker"
              cta="Go to Worker Login"
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-text-muted sm:flex-row sm:px-6">
          <Logo href={null} showText size={28} />
          <p>
            © {new Date().getFullYear()} Krateus Dynamic Solutions. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Step({
  icon: Icon,
  step,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal-900 text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-bold text-text-muted">{step}</span>
      </div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {description}
      </p>
    </div>
  );
}

function PortalCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-8 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-emerald-100 text-brand-emerald-600">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {description}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-emerald-600 hover:text-brand-emerald-700"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
