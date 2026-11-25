/**
 * Client testimonials. Add only real quotes, with the client's written permission to publish
 * their name, role and company. The page shows an empty state until this list has entries.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Optional: the workflow id this client runs, linked under the quote. */
  workflowId?: string;
};

export const TESTIMONIALS: Testimonial[] = [];
