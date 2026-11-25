import { FileText, Folder, GitBranch, Lock } from "lucide-react";

const ROWS: { name: string; note: string; depth: number; file?: boolean }[] = [
  { name: "workflows/", note: "One folder per workflow", depth: 0 },
  { name: "lead-triage/", note: "New lead follow-up", depth: 1 },
  { name: "ap-intake/", note: "Supplier invoice processing", depth: 1 },
  { name: "prompts/", note: "AI instructions, in plain text", depth: 0 },
  { name: "tests/", note: "Saved cases from the side-by-side run", depth: 0 },
  { name: "monitoring/", note: "Alerts when anything fails", depth: 0 },
  { name: "audit-log/", note: "Every approval and every send", depth: 0 },
  { name: "RUNBOOK.md", note: "Your team's manual", depth: 0, file: true },
];

/** The handover, drawn as the repository a client receives: what each part is, in plain words. */
export function RepoPanel() {
  return (
    <figure className="repo-panel" aria-label="Example of the repository you receive">
      <div className="repo-bar">
        <span className="repo-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="repo-path">your-company/automations</span>
        <span className="repo-badge">
          <Lock aria-hidden size={12} strokeWidth={2} />
          Private · yours
        </span>
      </div>
      <div className="repo-branch">
        <GitBranch aria-hidden size={14} strokeWidth={1.75} />
        main
        <span className="repo-branch-note">Updated after every tested change</span>
      </div>
      <ul className="repo-rows">
        {ROWS.map((row) => (
          <li key={row.name + row.depth} className="repo-row" style={{ paddingLeft: `${16 + row.depth * 22}px` }}>
            <span className="repo-name">
              {row.file ? (
                <FileText aria-hidden size={16} strokeWidth={1.5} />
              ) : (
                <Folder aria-hidden size={16} strokeWidth={1.5} className="text-gold" />
              )}
              {row.name}
            </span>
            <span className="repo-note">{row.note}</span>
          </li>
        ))}
      </ul>
      <figcaption className="repo-foot">Runs in your accounts. Logins, logs and code stay with you.</figcaption>
    </figure>
  );
}
