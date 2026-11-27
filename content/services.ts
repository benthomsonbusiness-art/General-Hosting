import type { Faq } from "./approach.ts";

export type Photo = { src: string; alt: string; position: string };

export type Service = {
  slug: string;
  name: string;
  /** The first service is the one most clients start with. */
  kind: "flagship" | "secondary";
  summary: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  cta: { label: string; href: string };
  /** What the customer gets, as short cards. */
  areas: { title: string; body: string }[];
  /** How we set it up, as a short track. */
  steps: { title: string; body: string }[];
  /** The one workflow this service runs. */
  workflowIds: string[];
  faqs: Faq[];
  keywords: string[];
};

const SETUP: Service["steps"] = [
  { title: "Look", body: "How you book today" },
  { title: "Plan", body: "Write the texts with you" },
  { title: "Test", body: "Two weeks of practice runs" },
  { title: "Go live", body: "It's yours" },
];

const CTA = { label: "Request a booking audit", href: "/contact" };

export const SERVICES: Service[] = [
  {
    slug: "missed-calls",
    name: "Missed call text-back",
    kind: "flagship",
    summary: "Every missed call gets a text back in minutes.",
    metaTitle: "Missed call text-back for service businesses",
    metaDescription:
      "When you can't pick up, the caller gets a text back in minutes with times you're free. You approve it from your phone, so you stop losing jobs to missed calls.",
    h1: "Stop losing jobs to missed calls",
    dek: "When you can't pick up, the caller gets a text back in minutes with times you're free. You approve it with one tap.",
    cta: CTA,
    areas: [
      { title: "Text back in minutes", body: "Once you approve, before they call someone else." },
      { title: "Real open times", body: "Pulled from your schedule." },
      { title: "Day and night", body: "A text is ready for you, even on a job." },
      { title: "You approve", body: "One tap from your phone." },
    ],
    steps: SETUP,
    workflowIds: ["missed-call-text-back"],
    faqs: [
      {
        q: "Does it text people without asking me?",
        a: "No. Every text comes to you first. You tap Approve or change it.",
      },
      {
        q: "Do I need a new phone number?",
        a: "Usually not. Missed calls are forwarded from the number you already have. We check this in the audit.",
      },
      {
        q: "What if I don't answer in time?",
        a: "Your on-call tech gets a heads-up to call the customer back.",
      },
    ],
    keywords: ["missed call", "text back", "phone", "after hours", "voicemail"],
  },
  {
    slug: "instant-booking",
    name: "Instant booking for web leads",
    kind: "secondary",
    summary: "Web leads get a time and a booked job, fast.",
    metaTitle: "Instant booking for web leads",
    metaDescription:
      "When someone fills out the form on your website, we check your area, pick a tech and an open time, and text them. You approve, and the job is on your schedule.",
    h1: "Book web leads while they're still looking",
    dek: "When someone fills out your website form, we find an open time and text them. You approve, and the job is booked.",
    cta: CTA,
    areas: [
      { title: "Area check", body: "Only leads you can serve." },
      { title: "Right tech", body: "Someone who does that job." },
      { title: "Open time", body: "Straight from your schedule." },
      { title: "Booked for you", body: "On your calendar, with the source." },
    ],
    steps: SETUP,
    workflowIds: ["web-lead-booking"],
    faqs: [
      {
        q: "Which software does it work with?",
        a: "ServiceTitan, Jobber, Housecall Pro or a plain Google Calendar.",
      },
      {
        q: "What about leads outside my area?",
        a: "They go to your office so you can decide.",
      },
      {
        q: "Can I still call the customer myself?",
        a: "Yes. Every booking has a Call instead button.",
      },
    ],
    keywords: ["online booking", "web leads", "website form", "speed to lead", "schedule"],
  },
  {
    slug: "reminders",
    name: "Appointment reminders",
    kind: "secondary",
    summary: "Customers confirm by text, so fewer no-shows.",
    metaTitle: "Appointment reminders for service businesses",
    metaDescription:
      "The day before each visit, customers get a reminder text and reply YES to confirm. Anyone who needs to change is flagged early, so fewer wasted trips for you.",
    h1: "Fewer no-shows, fewer wasted trips",
    dek: "The day before each visit, customers get a reminder and reply YES to confirm. Changes reach you early, not at the door.",
    cta: CTA,
    areas: [
      { title: "Day-before text", body: "Time, tech and what to expect." },
      { title: "Reply YES", body: "Confirmed visits are marked." },
      { title: "Changes flagged", body: "Before the truck leaves." },
      { title: "You approve", body: "The whole list, in one tap." },
    ],
    steps: SETUP,
    workflowIds: ["appointment-reminders"],
    faqs: [
      {
        q: "Will it move appointments on its own?",
        a: "No. It flags changes. You decide what to move.",
      },
      {
        q: "What if a customer replies with a question?",
        a: "It goes to your office. Nothing answers customers automatically.",
      },
    ],
    keywords: ["appointment reminders", "no-shows", "confirm", "text reminders", "schedule"],
  },
];

/** The "Works with the tools you already use" list on each service page. */
export const INTEGRATIONS = {
  heading: "Works with the tools you already use",
  note: "Examples only. Product names and logos belong to their owners. No partnership is implied.",
};

export function serviceHref(slug: string): string {
  return `/services/${slug}`;
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
