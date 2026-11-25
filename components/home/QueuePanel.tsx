import { BarChart3, Check, Mail, Receipt, UserCheck } from "lucide-react";

type Row = {
  icon: typeof Mail;
  title: string;
  detail: string;
  status: "approve" | "done";
  statusLabel: string;
};

const ROWS: Row[] = [
  {
    icon: Mail,
    title: "New lead from your website",
    detail: "Company looked up, scored as a good fit, first reply drafted",
    status: "approve",
    statusLabel: "Waiting for you",
  },
  {
    icon: Receipt,
    title: "Supplier invoice",
    detail: "Every line matched to the purchase order, totals agree",
    status: "done",
    statusLabel: "Ready to post",
  },
  {
    icon: BarChart3,
    title: "Monday numbers",
    detail: "Pulled from three tools into one brief, each figure sourced",
    status: "done",
    statusLabel: "Posted 6:30 a.m.",
  },
];

/** "Where it helps first", drawn as the queue a client sees once the work runs itself. */
export function QueuePanel() {
  return (
    <figure className="repo-panel" aria-label="Example of the work queue after automation, with sample data">
      <div className="repo-bar">
        <span className="repo-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="repo-path">Today&apos;s queue</span>
        <span className="repo-badge">
          <UserCheck aria-hidden size={12} strokeWidth={2} />1 needs approval
        </span>
      </div>
      <ul className="queue-rows">
        {ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <li key={row.title} className="queue-row" data-status={row.status}>
              <span className="queue-icon" aria-hidden>
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <span className="queue-text">
                <span className="queue-title">{row.title}</span>
                <span className="queue-detail">{row.detail}</span>
              </span>
              {row.status === "approve" ? (
                <span className="queue-actions">
                  <span className="queue-approve">Approve</span>
                  <span className="queue-status">{row.statusLabel}</span>
                </span>
              ) : (
                <span className="queue-actions">
                  <span className="queue-done">
                    <Check aria-hidden size={14} strokeWidth={2.25} />
                    {row.statusLabel}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <figcaption className="repo-foot">
        Sample data. Routine items finish on their own; anything going out waits for you.
      </figcaption>
    </figure>
  );
}
