import Link from "next/link";
import { JsonLd } from "@/components/util/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="small flex flex-wrap items-center gap-x-2 text-muted">
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-x-2">
              {last ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="inline-flex min-h-8 items-center underline-offset-4 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
