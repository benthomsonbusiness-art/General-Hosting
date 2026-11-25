/**
 * Client testimonials. Add only real quotes, with the client's written permission to publish
 * their name, role and company. The page shows an empty state until this list has entries.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Where the client is based. */
  location?: string;
  /** What we built for them, one line. */
  project?: string;
  /** Optional: the workflow id this client runs, linked under the quote. */
  workflowId?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I'm very satisfied with the work. Booking and the calendar now run on their own, and it saves me hours every week that I used to spend going back and forth with clients.",
    name: "Owner",
    role: "Owner",
    company: "Blessinger Entertainment",
    location: "Bloomington, Indiana",
    project: "Automated booking and calendar scheduling",
  },
];
