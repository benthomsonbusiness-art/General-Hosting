import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { WORKFLOWS } from "../content/workflows.ts";
import { APP_SLUGS, APPS, GLYPHS, LOGO_MODE, isAppSlug, isGlyph } from "../lib/logos.ts";

const LOGOS = join(process.cwd(), "public", "logos");
const today = new Date().toISOString().slice(0, 10);

function logoFile(slug: string): string {
  return join(LOGOS, `${slug}.svg`);
}

test("LOGO_MODE is one of the two switches", () => {
  assert.ok(LOGO_MODE === "cleared-only" || LOGO_MODE === "all");
});

test("the registry has one entry per slug", () => {
  assert.deepEqual(Object.keys(APPS).sort(), [...APP_SLUGS].sort());
  for (const glyph of GLYPHS) assert.ok(!isAppSlug(glyph), `${glyph} is both a glyph and a slug`);
});

test("every app entry names its owner, guidelines and check date", () => {
  for (const [slug, entry] of Object.entries(APPS)) {
    assert.ok(entry.name.trim(), `${slug}: name`);
    assert.ok(entry.owner.trim(), `${slug}: owner`);
    assert.ok(entry.note.trim(), `${slug}: note`);
    assert.match(entry.guidelines, /^https:\/\/\S+$/, `${slug}: guidelines must be an https URL`);
    assert.match(entry.checkedOn, /^\d{4}-\d{2}-\d{2}$/, `${slug}: checkedOn must be an ISO date`);
    assert.ok(!Number.isNaN(Date.parse(entry.checkedOn)), `${slug}: checkedOn is not a real date`);
    assert.ok(entry.checkedOn <= today, `${slug}: checkedOn ${entry.checkedOn} is later than ${today}`);
  }
});

test("a cleared app has its official artwork file", () => {
  for (const [slug, entry] of Object.entries(APPS)) {
    if (entry.status === "cleared") assert.ok(existsSync(logoFile(slug)), `${slug}: cleared without ${slug}.svg`);
  }
});

test("every logo file belongs to a registry entry and is safe to inline", () => {
  const files = existsSync(LOGOS) ? readdirSync(LOGOS).filter((name) => name.endsWith(".svg")) : [];
  for (const name of files) {
    const slug = name.replace(/\.svg$/, "");
    assert.ok(isAppSlug(slug), `${name}: no registry entry`);
    const path = join(LOGOS, name);
    const svg = readFileSync(path, "utf8");
    assert.ok(statSync(path).size <= 6 * 1024, `${name}: larger than 6 KB`);
    assert.match(svg, /viewBox=/, `${name}: needs a viewBox`);
    assert.doesNotMatch(svg, /<script/i, `${name}: script`);
    assert.doesNotMatch(svg, /\son\w+\s*=/i, `${name}: event attribute`);
    assert.doesNotMatch(svg, /<image/i, `${name}: embedded image`);
    assert.doesNotMatch(svg, /<foreignObject/i, `${name}: foreignObject`);
    assert.doesNotMatch(svg, /href\s*=\s*["']\s*https?:/i, `${name}: external link`);
  }
});

test("every app a workflow names is in the registry", () => {
  for (const workflow of WORKFLOWS) {
    for (const node of workflow.nodes) {
      const where = `${workflow.id}/${node.id}`;
      if (node.app) assert.ok(isAppSlug(node.app.app) || isGlyph(node.app.app), `${where}: ${node.app.app}`);
      if (node.gate) assert.ok(isAppSlug(node.gate.channelApp), `${where}: ${node.gate.channelApp}`);
      for (const item of node.attached ?? []) {
        assert.ok(isAppSlug(item.app) || isGlyph(item.app), `${where}/${item.id}: ${item.app}`);
      }
    }
  }
});
