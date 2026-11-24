export type SearchType = "Page" | "Service" | "Industry" | "Workflow" | "Insight";

export type SearchEntry = {
  url: string;
  title: string;
  type: SearchType;
  summary: string;
  keywords: string;
};

export const SEARCH_GROUPS: { type: SearchType; heading: string }[] = [
  { type: "Page", heading: "Pages" },
  { type: "Service", heading: "Services" },
  { type: "Industry", heading: "Industries" },
  { type: "Workflow", heading: "Workflows" },
  { type: "Insight", heading: "Insights" },
];

function words(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

/** Exact word beats prefix. Title beats keywords beats summary. Every term has to match somewhere. */
function fieldScore(field: string[], term: string, weight: number): number {
  if (field.includes(term)) return weight * 2;
  if (term.length > 1 && field.some((word) => word.startsWith(term))) return weight;
  return 0;
}

export function search(entries: SearchEntry[], query: string, limit = 40): SearchEntry[] {
  const terms = words(query);
  if (terms.length === 0) return [];
  return entries
    .map((entry) => {
      const title = words(entry.title);
      const keywords = words(entry.keywords);
      const summary = words(entry.summary);
      let score = 0;
      for (const term of terms) {
        const best =
          fieldScore(title, term, 10) + fieldScore(keywords, term, 4) + fieldScore(summary, term, 1);
        if (best === 0) return { entry, score: 0 };
        score += best;
      }
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

let cached: Promise<SearchEntry[]> | null = null;

/** Loads the static index once, on first use. A failed load can be retried. */
export function loadSearchIndex(): Promise<SearchEntry[]> {
  cached ??= fetch("/search-index.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Search index responded ${response.status}`);
      return response.json() as Promise<SearchEntry[]>;
    })
    .catch((error: unknown) => {
      cached = null;
      throw error;
    });
  return cached;
}
