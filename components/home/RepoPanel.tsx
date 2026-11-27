import { FileText, Folder } from "lucide-react";

const ITEMS: { name: string; file?: boolean }[] = [
  { name: "Missed-call reply wording" },
  { name: "Class and calendar booking rules" },
  { name: "Recurring reminder schedule" },
  { name: "Log of every approved text" },
  { name: "Step-by-step guide for your team", file: true },
];

/** Clean list of what lives inside the client's own accounts — zero subtext repetition. */
export function RepoPanel() {
  return (
    <div className="repo-panel" role="region" aria-label="What stays in your accounts">
      <div className="repo-bar">
        <span className="repo-path font-semibold">Inside your accounts</span>
      </div>
      <ul className="divide-y divide-line">
        {ITEMS.map((item) => (
          <li key={item.name} className="flex items-center gap-3 px-5 py-3.5 text-[15px] text-ivory">
            {item.file ? (
              <FileText aria-hidden size={16} strokeWidth={1.5} className="shrink-0 text-muted" />
            ) : (
              <Folder aria-hidden size={16} strokeWidth={1.5} className="shrink-0 text-gold" />
            )}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
