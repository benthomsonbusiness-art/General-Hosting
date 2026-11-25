/**
 * Apps that the example workflows actually draw. The flagship "Built inside the tools you already
 * use" section and the /terms trademark list read from here, so neither names a tool that no
 * workflow uses.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Workflow } from "../content/workflows.ts";
import { APPS, isAppSlug, markAllowed, type AppCategory, type AppSlug } from "./logos.ts";

/** Every registry app a workflow node, approval channel or attachment names, in registry order. */
export function usedAppSlugs(workflows: Workflow[]): AppSlug[] {
  const found = new Set<string>();
  for (const workflow of workflows) {
    for (const node of workflow.nodes) {
      if (node.app?.app) found.add(node.app.app);
      if (node.gate?.channelApp) found.add(node.gate.channelApp);
      for (const attachment of node.attached ?? []) found.add(attachment.app);
    }
  }
  return (Object.keys(APPS) as AppSlug[]).filter((slug) => found.has(slug) && isAppSlug(slug));
}

const CATEGORY_LABELS: Record<AppCategory, string> = {
  email: "Email and calendar",
  chat: "Chat and meetings",
  crm: "Sales and CRM",
  docs: "Documents and e-signature",
  accounting: "Accounting and payments",
  support: "Customer support",
  projects: "Projects",
  forms: "Forms and scheduling",
  ads: "Ads and analytics",
  commerce: "Online store",
  hr: "Hiring and HR",
  ai: "AI",
  storage: "File storage",
};

export type AppGroup = { category: AppCategory; label: string; apps: { slug: AppSlug; name: string }[] };

/** Used apps grouped by registry category, in the order categories first appear in the registry. */
export function appsByCategory(slugs: AppSlug[]): AppGroup[] {
  const groups = new Map<AppCategory, AppGroup>();
  for (const slug of slugs) {
    const entry = APPS[slug];
    const group = groups.get(entry.category) ?? { category: entry.category, label: CATEGORY_LABELS[entry.category], apps: [] };
    group.apps.push({ slug, name: entry.name });
    groups.set(entry.category, group);
  }
  return [...groups.values()];
}

/** One sentence per owner: "Gmail and Google Calendar are trademarks of Google." */
export function trademarkLines(slugs: AppSlug[]): string[] {
  const owners = new Map<string, string[]>();
  for (const slug of slugs) {
    const { owner, name } = APPS[slug];
    owners.set(owner, [...(owners.get(owner) ?? []), name]);
  }
  return [...owners.entries()].map(([owner, names]) => {
    const list =
      names.length === 1
        ? names[0]
        : `${names.slice(0, -1).join(", ")}${names.length > 2 ? "," : ""} and ${names[names.length - 1]}`;
    return `${list} ${names.length === 1 ? "is a trademark" : "are trademarks"} of ${owner}.`;
  });
}

/**
 * Whether the official mark may be drawn: its status allows it under LOGO_MODE and the artwork
 * file is in public/logos/. Pages that call this are built statically, so the check runs at build.
 */
export function showMark(slug: AppSlug): boolean {
  if (!markAllowed(slug)) return false;
  try {
    return existsSync(join(process.cwd(), "public", "logos", `${slug}.svg`));
  } catch {
    return false;
  }
}
