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
    slug: "gyms",
    name: "Gyms and fitness studios",
    line: "Calls come in while coaches are on the floor, and trial leads go cold if they wait until tomorrow.",
    hours: [
      "Missed calls during busy classes",
      "Trial and intro forms after hours",
      "Recurring class and session reminders",
    ],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Coaching, programming and membership sales.",
    keywords: ["gym", "fitness studio", "pilates", "yoga", "crossfit", "martial arts", "personal training", "classes"],
  },
  {
    slug: "recruiting",
    name: "Recruiting and staffing",
    line: "Strong candidates talk to whoever texts back first and books the screen.",
    hours: [
      "Missed candidate calls between screens",
      "Fast booking from job and intake forms",
      "Interview reminders so people show up",
    ],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Evaluating candidates, client calls and offers.",
    keywords: ["recruiting", "staffing", "hiring", "candidates", "interviews", "placement"],
  },
  {
    slug: "events",
    name: "Events and entertainment",
    line: "Weekend inquiries ask if their date is open while you're setting up a show.",
    hours: [
      "Calls missed during Friday and Saturday events",
      "Date checks and consult calls from your site",
      "Walk-through and planning reminders",
    ],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Music, production, custom quotes and event planning.",
    keywords: ["dj", "entertainment", "events", "weddings", "sound", "lighting", "venue"],
  },
  {
    slug: "landscaping",
    name: "Lawn and landscaping",
    line: "Every spring, everyone wants a walk-through and a crew on the schedule the same week.",
    hours: [
      "Calls while crews are out on properties",
      "Walk-through requests from your website",
      "Recurring visit and weather reminders",
    ],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Property walk-throughs, design and crew work.",
    keywords: ["lawn care", "landscaping", "mowing", "irrigation", "recurring crew"],
  },
  {
    slug: "plumbing",
    name: "Plumbing and home services",
    line: "Calls come in while you're on a job, and callers dial the next number if nobody answers.",
    hours: [
      "Missed calls during active jobs",
      "Website quote and booking forms",
      "Day-before visit confirmations",
    ],
    workflowIds: ["missed-call-text-back", "web-lead-booking", "appointment-reminders"],
    stays: "Diagnosing the issue, safety and pricing.",
    keywords: ["plumbing", "home services", "hvac", "electrical", "repairs", "estimates"],
  },
  {
    slug: "appointments",
    name: "Studios and local services",
    line: "Repeat bookings and classes stay full when clients get a fast reply and a simple reminder.",
    hours: [
      "New client inquiries after hours",
      "Recurring session and class reminders",
      "Catching reschedules early enough to fill the spot",
    ],
    workflowIds: ["appointment-reminders", "web-lead-booking", "missed-call-text-back"],
    stays: "Client care and in-person work.",
    keywords: ["wellness", "salon", "clinic", "cleaning", "recurring appointments", "studio"],
  },
];
