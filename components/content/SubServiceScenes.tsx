import type { SubService } from "@/content/services";

/** The build types as a readable sequence, without photographs. */
export function SubServiceScenes({ items }: { items: SubService[] }) {
  return (
    <ol className="mt-10 divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.slug} id={item.slug} tabIndex={-1} className="scroll-mt-28 py-8 outline-none">
          <h3 className="h3">{item.name}</h3>
          <p className="row-title mt-4 max-w-[40rem]">{item.question}</p>
          <p className="measure mt-3 text-muted">{item.answer}</p>
          <ul aria-label={`What you get from ${item.name}`} className="mt-5 grid gap-2 sm:grid-cols-2">
            {item.get.map((line) => (
              <li key={line} className="text-[15px]">
                {line}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
