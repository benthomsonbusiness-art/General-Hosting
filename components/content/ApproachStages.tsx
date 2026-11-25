import { METHOD } from "@/content/approach";

/** The four method stages as numbered rows: title, what happens, then what you see and approve. */
export function ApproachStages() {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {METHOD.map((step, index) => (
        <li key={step.title} className="grid gap-x-8 gap-y-4 py-8 lg:grid-cols-12 lg:py-10">
          <div className="lg:col-span-3">
            <p className="text-[15px] text-muted">{index + 1}</p>
            <h2 className="h3 mt-1">{step.title}</h2>
            <p className="mt-2 text-muted">{step.line}</p>
          </div>
          <p className="lg:col-span-5">{step.happens}</p>
          <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <div>
              <dt className="text-[15px] text-muted">You see</dt>
              <dd className="mt-1">{step.see}</dd>
            </div>
            <div>
              <dt className="text-[15px] text-muted">You approve</dt>
              <dd className="mt-1">{step.approve}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
