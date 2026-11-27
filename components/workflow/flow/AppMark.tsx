import {
  BookUser,
  Calendar,
  ChartLine,
  ClipboardList,
  Clock,
  CreditCard,
  Database,
  FileText,
  Folder,
  Globe,
  ListChecks,
  Mail,
  Megaphone,
  MessageSquare,
  Phone,
  Star,
  Wrench,
  Send,
  Signature,
  Sparkles,
  Store,
  Table,
  Ticket,
  Users,
  Video,
  Webhook,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import type { NodeKind } from "@/content/workflows";
import { APPS, isAppSlug, type AppSlug, type FallbackGlyph, type Glyph } from "@/lib/logos";
import { showMark } from "@/lib/used-apps";

/** Neutral glyphs for apps whose mark is not shown. Never a brand drawing. */
const FALLBACK: Record<FallbackGlyph, LucideIcon> = {
  mail: Mail,
  calendar: Calendar,
  folder: Folder,
  table: Table,
  document: FileText,
  chart: ChartLine,
  message: MessageSquare,
  video: Video,
  contacts: BookUser,
  card: CreditCard,
  signature: Signature,
  database: Database,
  ticket: Ticket,
  checklist: ListChecks,
  store: Store,
  people: Users,
  sparkles: Sparkles,
  megaphone: Megaphone,
  phone: Phone,
  wrench: Wrench,
  star: Star,
};

/** House glyphs for steps that are not a branded app. */
const HOUSE: Record<Glyph, LucideIcon> = {
  code: ListChecks,
  clock: Clock,
  webhook: Webhook,
  form: ClipboardList,
  http: Globe,
};

/** When a step names no app at all, the glyph says what kind of step it is. */
const BY_KIND: Partial<Record<NodeKind, LucideIcon>> = {
  trigger: Zap,
  deterministic: ListChecks,
  output: Send,
};

/**
 * The app's mark, or a neutral glyph. The mark is drawn only when its status allows it under
 * LOGO_MODE and the artwork file exists (checked at build time). The app name is always printed
 * beside it, so the image is decorative: alt="". Marks are never recolored or given effects.
 * Never use this on the gold approval card.
 */
export function AppMark({
  app,
  kind,
  mark,
  glyph,
  eager = false,
}: {
  app?: AppSlug | Glyph;
  kind?: NodeKind;
  /** Mark size in px. */
  mark: number;
  /** Fallback glyph size in px. */
  glyph: number;
  eager?: boolean;
}) {
  if (app && isAppSlug(app) && showMark(app)) {
    // onLight is optional on the registry entry: very dark marks sit on an ivory disc.
    const light = (APPS[app] as { onLight?: boolean }).onLight === true;
    return (
      <span className="flow-mark" data-light={light ? "" : undefined} style={{ "--mark": `${mark}px` } as CSSProperties}>
        {/* Brand files are served unaltered from public/logos, never through the image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/logos/${app}.svg`}
          alt=""
          width={mark}
          height={mark}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </span>
    );
  }
  const Icon = app ? (isAppSlug(app) ? FALLBACK[APPS[app].glyph] : HOUSE[app]) : (kind && BY_KIND[kind]) || ListChecks;
  return (
    <span className="flow-mark flow-glyph">
      <Icon aria-hidden focusable="false" size={glyph} strokeWidth={1.5} />
    </span>
  );
}
