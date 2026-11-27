import type { Faq } from "./approach.ts";

export type Photo = { src: string; alt: string; position: string };

export type Service = {
  slug: string;
  name: string;
  kind: "flagship" | "secondary";
  summary: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  cta: { label: string; href: string };
  areas: { title: string; body: string }[];
  steps: { title: string; body: string }[];
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
    metaTitle: "Missed call text-back for gyms and service businesses",
    metaDescription:
      "When you miss a call during a class or appointment, the caller gets a text back in minutes with open times. You approve every text from your phone.",
    h1: "Stop losing bookings to missed calls",
    dek: "When you're coaching a class, on a call or out on a site, callers get a text back in minutes with real open times. You approve with one tap.",
    cta: CTA,
    areas: [
      { title: "Text back in minutes", body: "Before they book somewhere else." },
      { title: "Real open times", body: "Pulled straight from your calendar." },
      { title: "During classes or after hours", body: "A reply is ready whenever the phone rings." },
      { title: "You approve", body: "One tap from your phone." },
    ],
    steps: SETUP,
    workflowIds: ["missed-call-text-back"],
    faqs: [
      {
        q: "Does it text people without asking me?",
        a: "No. Every text comes to your phone first so you can approve or edit it.",
      },
      {
        q: "Do I need a new phone number?",
        a: "Usually not. Missed calls forward from the number you already use.",
      },
      {
        q: "What if nobody approves in time?",
        a: "Your team gets a heads-up to call back directly, and nothing goes out on its own.",
      },
    ],
    keywords: ["missed call", "text back", "gym", "studio", "after hours", "voicemail"],
  },
  {
    slug: "instant-booking",
    name: "Instant booking for web leads",
    kind: "secondary",
    summary: "Website inquiries get an open time and a booked spot fast.",
    metaTitle: "Instant booking for web leads",
    metaDescription:
      "When someone fills out the form on your website, we check fit, find an open class or slot on your calendar and draft the text for you to approve.",
    h1: "Book web leads while they're still interested",
    dek: "When someone fills out your trial, consult or quote form, we match an open time on your calendar and draft the text. You approve, and they're booked.",
    cta: CTA,
    areas: [
      { title: "Fit check", body: "Matches your classes, area or roles." },
      { title: "Right calendar", body: "Picks the right coach or team member." },
      { title: "Open time", body: "Pulled live from your schedule." },
      { title: "Booked for you", body: "Added to your calendar with the source." },
    ],
    steps: SETUP,
    workflowIds: ["web-lead-booking"],
    faqs: [
      {
        q: "Which calendars and tools does it work with?",
        a: "Google Calendar, Calendly, HubSpot, Greenhouse, Jobber and most studio or booking calendars.",
      },
      {
        q: "What if an inquiry isn't a clear fit?",
        a: "It goes straight to your inbox so you can reply personally.",
      },
      {
        q: "Can I call them instead of texting?",
        a: "Yes. Every approval message lets you skip the text and call directly.",
      },
    ],
    keywords: ["online booking", "web leads", "trial class", "intro session", "schedule"],
  },
  {
    slug: "reminders",
    name: "Appointment reminders",
    kind: "secondary",
    summary: "Members and clients confirm by text, keeping classes and calendars full.",
    metaTitle: "Class and appointment reminders",
    metaDescription:
      "Before each class, call or visit, clients get a reminder text and reply YES to confirm. Recurring sessions stay full and changes show up early.",
    h1: "Keep classes and calendars full",
    dek: "Set up recurring class and appointment reminders so members reply YES to confirm, and last-minute changes open up spots early.",
    cta: CTA,
    areas: [
      { title: "Recurring classes", body: "Works for daily classes and 1-on-1 slots." },
      { title: "Reply YES", body: "Confirmed spots mark themselves." },
      { title: "Changes caught early", body: "Open spots go back to your waitlist." },
      { title: "You approve", body: "Review tomorrow's batch in one tap." },
    ],
    steps: SETUP,
    workflowIds: ["appointment-reminders"],
    faqs: [
      {
        q: "Can it handle recurring weekly classes?",
        a: "Yes. It reads tomorrow's class roster or appointment list every afternoon and prepares reminders for everyone booked.",
      },
      {
        q: "Will it reschedule someone on its own?",
        a: "No. Anyone asking to move is flagged for your front desk so you stay in control.",
      },
    ],
    keywords: ["appointment reminders", "class reminders", "recurring classes", "no-shows", "gym"],
  },
];

export const INTEGRATIONS = {
  heading: "Works with the tools you already use",
  note: "",
};

export function serviceHref(slug: string): string {
  return `/services/${slug}`;
}

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
