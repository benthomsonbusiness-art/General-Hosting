export type Industry = {
  slug: string;
  name: string;
  line: string;
  hours: string[];
  workflowIds: string[];
  stays: string;
  keywords: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "hvac",
    name: "HVAC",
    line: "The phone rings most on the hottest and coldest days, when you're busiest.",
    hours: ["Missed calls in a heat wave", "Leads that wait too long", "No-shows on tune-ups"],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Diagnosing problems and pricing the job.",
    keywords: ["heating", "cooling", "furnace", "air conditioning", "AC", "tune-up"],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    line: "Leaks don't wait for business hours, and neither do your customers.",
    hours: ["Calls after hours", "Booking the right plumber", "Customers not home"],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Emergency advice and anything about safety.",
    keywords: ["plumber", "drain", "water heater", "leak", "sewer"],
  },
  {
    slug: "electrical",
    name: "Electrical",
    line: "Lots of small jobs, each one wanting a quick answer.",
    hours: ["Missed calls on the job", "Web leads", "Rescheduled visits"],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Safety questions and permits.",
    keywords: ["electrician", "panel", "EV charger", "outlets", "wiring"],
  },
  {
    slug: "roofing",
    name: "Roofing",
    line: "After a storm, everyone calls at once.",
    hours: ["Storm call spikes", "Booking inspections", "Customers not home"],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Inspections, insurance and final prices.",
    keywords: ["roofer", "roof repair", "gutters", "siding", "storm"],
  },
  {
    slug: "landscaping",
    name: "Lawn and landscaping",
    line: "Every spring, the whole list wants to start the same week.",
    hours: ["Spring rush calls", "Web quote requests", "Weather changes"],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Design ideas and walk-throughs.",
    keywords: ["lawn care", "landscaping", "mowing", "irrigation", "snow removal"],
  },
  {
    slug: "cleaning",
    name: "Cleaning and pest control",
    line: "Repeat visits only work if customers remember them.",
    hours: ["Repeat visit reminders", "Last-minute cancels", "New web leads"],
    workflowIds: ["appointment-reminders", "web-lead-booking", "missed-call-text-back"],
    stays: "Which products to use, and anything about health.",
    keywords: ["house cleaning", "maid service", "pest control", "recurring"],
  },
];
