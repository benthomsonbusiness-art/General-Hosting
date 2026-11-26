import { Bot, ClipboardList, Database, Megaphone, Send, UserCheck } from "lucide-react";

/** Workflow automation: a short chain of steps ending at the person who approves. */
function FlowArt() {
  const steps = [
    { icon: ClipboardList, label: "Form" },
    { icon: Bot, label: "AI drafts" },
    { icon: Database, label: "CRM" },
    { icon: UserCheck, label: "You approve", gold: true },
    { icon: Send, label: "Sent" },
  ];
  return (
    <span className="art-flow">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <span key={step.label} className="art-flow-step">
            <span className="art-node" data-gold={step.gold ? "" : undefined}>
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="art-caption">{step.label}</span>
            {i < steps.length - 1 ? <span className="art-link" /> : null}
          </span>
        );
      })}
    </span>
  );
}

/** Meta ads: weekly results climbing, with the latest week highlighted. */
function AdsArt() {
  const bars = [32, 40, 36, 52, 58, 66, 84];
  return (
    <span className="art-ads">
      <span className="art-ads-head">
        <Megaphone size={16} strokeWidth={1.75} />
        Booked from ads, by week
      </span>
      <span className="art-bars">
        {bars.map((h, i) => (
          <span
            key={i}
            className="art-bar"
            data-gold={i === bars.length - 1 ? "" : undefined}
            style={{ height: `${h}%` }}
          />
        ))}
      </span>
    </span>
  );
}

/** Strategy: effort against impact, with one item marked to fix first. */
function StrategyArt() {
  const dots = [
    { x: 22, y: 70 },
    { x: 40, y: 30 },
    { x: 64, y: 62 },
    { x: 78, y: 82 },
    { x: 30, y: 48 },
  ];
  return (
    <span className="art-strategy">
      <span className="art-axis-y">Impact</span>
      <span className="art-axis-x">Effort</span>
      <span className="art-grid">
        <span className="art-quad" data-gold="" />
        <span className="art-quad" />
        <span className="art-quad" />
        <span className="art-quad" />
        {dots.map((d, i) => (
          <span key={i} className="art-dot" style={{ left: `${d.x}%`, top: `${d.y}%` }} />
        ))}
        <span className="art-pick" style={{ left: "24%", top: "22%" }}>
          Fix first
        </span>
      </span>
    </span>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  "ai-workflow-automation": FlowArt,
  "meta-ads-consulting": AdsArt,
  strategy: StrategyArt,
};

/** A drawn picture of what each service does, in place of a photograph. Decorative. */
export function ServiceArt({ slug, className = "" }: { slug: string; className?: string }) {
  const Art = ART[slug] ?? FlowArt;
  return (
    <span className={`art ${className}`} aria-hidden>
      <Art />
    </span>
  );
}
