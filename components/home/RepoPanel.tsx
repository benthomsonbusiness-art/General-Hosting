import { FileText, Folder, GitBranch, Lock } from "lucide-react";

const ROWS: { name: string; note: string; depth: number; file?: boolean }[] = [
  { name: "tools/", note: "Your three tools", depth: 0 },
  { name: "missed-calls/", note: "Missed call text-back", depth: 1 },
  { name: "booking/", note: "Instant booking", depth: 1 },
  { name: "reminders/", note: "Appointment reminders", depth: 1 },
  { name: "texts/", note: "Every text, in plain words", depth: 0 },
  { name: "history/", note: "Every text you approved", depth: 0 },
  { name: "HOW-TO.md", note: "Simple instructions for your team", depth: 0, file: true },
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
        <span className="repo-branch-note">Yours to keep</span>
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
      <figcaption className="repo-foot">Runs in your accounts. Everything stays with you.</figcaption>
    </figure>
  );
}
