import { CalendarCheck, Check, Globe, PhoneMissed, UserCheck } from "lucide-react";

type Row = {
  icon: typeof PhoneMissed;
  title: string;
  detail: string;
  status: "approve" | "done";
  statusLabel: string;
};

const ROWS: Row[] = [
  {
    icon: PhoneMissed,
    title: "Missed call, 6:12 p.m.",
    detail: "Voicemail says AC not cooling. Text written with two open times",
    status: "approve",
    statusLabel: "Waiting for you",
  },
  {
    icon: Globe,
    title: "Website form, water heater",
    detail: "In your area. Booked Tuesday 10 to 12 with Marco",
    status: "done",
    statusLabel: "Booked",
  },
  {
    icon: CalendarCheck,
    title: "Tomorrow's 14 visits",
    detail: "Reminders sent. 12 confirmed, 1 wants to change",
    status: "done",
    statusLabel: "Confirmed",
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
      <figcaption className="repo-foot">Sample data. Nothing goes to a customer until you approve it.</figcaption>
    </figure>
  );
}
