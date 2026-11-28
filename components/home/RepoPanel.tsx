import { Calendar, FileText, GitBranch, KeyRound, MessageSquare, ShieldCheck } from "lucide-react";

const MODULES = [
  { icon: MessageSquare, name: "Missed-call reply wording", tag: "Editable" },
  { icon: GitBranch, name: "Class and calendar booking rules", tag: "Live rules" },
  { icon: Calendar, name: "Recurring reminder schedule", tag: "Daily 4 p.m." },
  { icon: ShieldCheck, name: "Log of every approved text", tag: "Audit log" },
  { icon: FileText, name: "Step-by-step guide for your team", tag: "Handover doc" },
];

const ACCOUNTS = [
  { label: "Your phone number", detail: "Twilio / OpenPhone" },
  { label: "Your workflow", detail: "Runs in your login" },
  { label: "Your calendar", detail: "Google / Studio app" },
];

/** Architectural schematic showing what lives inside the client's own accounts. */
export function RepoPanel() {
  return (
    <div className="repo-panel" role="region" aria-label="What stays in your accounts">
      <div className="repo-bar justify-between">
        <span className="inline-flex items-center gap-2">
          <KeyRound aria-hidden size={15} strokeWidth={2} className="text-gold" />
          <span className="repo-path font-semibold">Inside your accounts</span>
        </span>
        <span className="rounded-full border border-[rgb(253_224_71_/_0.35)] bg-[rgb(253_224_71_/_0.08)] px-2.5 py-0.5 font-mono text-[11.5px] text-cyan">
          Admin access: Yours
        </span>
      </div>

      <div className="relative grid gap-2.5 border-b border-line bg-[#0b0604] p-4 sm:grid-cols-3">
        {ACCOUNTS.map((acct, idx) => (
          <div
            key={acct.label}
            className="relative rounded-[8px] border border-[rgb(251_246_241_/_0.12)] bg-[linear-gradient(180deg,#1f140e,#120a07)] px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-gold">0{idx + 1}</span>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cyan" />
            </div>
            <p className="mt-1 text-[13px] font-semibold text-ivory">{acct.label}</p>
            <p className="font-mono text-[11px] text-muted">{acct.detail}</p>
          </div>
        ))}
      </div>

      <ul className="divide-y divide-line">
        {MODULES.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.name}
              className="flex items-center justify-between gap-3 px-5 py-3 text-[14.5px] text-ivory transition-colors hover:bg-[rgb(251_246_241_/_0.03)]"
            >
              <span className="inline-flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-[rgb(251_246_241_/_0.12)] bg-[#1c120d] text-gold"
                >
                  <Icon size={14} strokeWidth={1.75} />
                </span>
                <span className="truncate">{item.name}</span>
              </span>
              <span className="shrink-0 rounded-[5px] border border-[rgb(251_246_241_/_0.12)] bg-[rgb(251_246_241_/_0.03)] px-2 py-0.5 font-mono text-[11.5px] text-muted">
                {item.tag}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
