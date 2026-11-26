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
    line: "The phones ring hardest on the hottest and coldest days.",
    hours: ["Missed calls in a heat wave", "Unsold system estimates", "Tune-up season", "Service plan renewals"],
    workflowIds: ["missed-call-text-back", "estimate-follow-up", "maintenance-reminders"],
    stays: "Diagnosis, pricing on site and anything a tech has to see.",
    keywords: ["heating", "cooling", "furnace", "air conditioning", "tune-up", "comfort advisor", "membership"],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    line: "Emergencies come in at night and every one wants a time.",
    hours: ["After-hours calls", "Booking the right tech", "Drain and water heater follow-up", "No-shows"],
    workflowIds: ["web-lead-booking", "appointment-reminders", "estimate-follow-up"],
    stays: "Emergency triage on the phone and anything about safety.",
    keywords: ["plumber", "drain", "water heater", "leak", "emergency", "sewer"],
  },
  {
    slug: "electrical",
    name: "Electrical",
    line: "Small jobs arrive from many places and each needs a quote.",
    hours: ["Marketplace leads", "Panel and EV charger quotes", "Scheduling permits and visits"],
    workflowIds: ["marketplace-leads", "estimate-follow-up", "review-requests"],
    stays: "Code questions, permits and anything about safety.",
    keywords: ["electrician", "panel", "EV charger", "outlets", "wiring", "generator"],
  },
  {
    slug: "roofing",
    name: "Roofing and exteriors",
    line: "Storms bring a wave of leads and a long tail of estimates.",
    hours: ["Storm lead spikes", "Inspection booking", "Estimate follow-up", "Review requests"],
    workflowIds: ["web-lead-booking", "estimate-follow-up", "review-requests"],
    stays: "Insurance claims, inspections and final pricing.",
    keywords: ["roofer", "roof repair", "gutters", "siding", "storm damage", "inspection"],
  },
  {
    slug: "landscaping",
    name: "Lawn and landscaping",
    line: "Every spring the whole list wants to start the same week.",
    hours: ["Spring start-up booking", "Weather reschedules", "Seasonal reminders", "New estimates"],
    workflowIds: ["cancellation-waitlist", "maintenance-reminders", "marketplace-leads"],
    stays: "Design decisions and walk-throughs on site.",
    keywords: ["lawn care", "landscaping", "mowing", "irrigation", "snow removal", "seasonal"],
  },
  {
    slug: "cleaning",
    name: "Cleaning and pest control",
    line: "Recurring visits live or die on reminders and reschedules.",
    hours: ["Recurring visit reminders", "Cancellations", "Filling open slots", "Review requests"],
    workflowIds: ["appointment-reminders", "cancellation-waitlist", "maintenance-reminders"],
    stays: "Treatment choices and anything about chemicals or health.",
    keywords: ["house cleaning", "maid service", "pest control", "recurring", "carpet cleaning"],
  },
];
