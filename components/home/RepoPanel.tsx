import { FileText, Folder, Lock } from "lucide-react";

const ROWS: { name: string; note: string; depth: number; file?: boolean }[] = [
  { name: "Missed call texts", note: "Your wording", depth: 0 },
  { name: "Booking rules", note: "Your area, your techs", depth: 0 },
  { name: "Reminder texts", note: "Your wording", depth: 0 },
  { name: "Every text sent", note: "Who approved it, and when", depth: 0 },
  { name: "How-to guide", note: "Simple steps for your team", depth: 0, file: true },
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
        <span className="repo-path">Your booking tools</span>
        <span className="repo-badge">
          <Lock aria-hidden size={12} strokeWidth={2} />
          Private · yours
        </span>
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
