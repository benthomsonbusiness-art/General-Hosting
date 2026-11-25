import Link from "next/link";

/**
 * A list row that is a link: title, then an optional muted line. Hover and keyboard focus
 * underline the title (.card-title inside .group), so every row reads as clickable.
 */
export function RowLink({
  href,
  title,
  line,
  titleId,
  className = "",
}: {
  href: string;
  title: string;
  line?: string;
  /** Lets a figure or region name itself after this row's title. */
  titleId?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group block py-5 ${className}`}>
      <span id={titleId} className="card-title row-title block">
        {title}
      </span>
      {line ? <span className="mt-1 block text-muted">{line}</span> : null}
    </Link>
  );
}
