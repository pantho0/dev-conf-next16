
export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "JSConf Asia 2025",
    slug: "jsconf-asia-2025",
    location: "Singapore, SG",
    date: "December 12–14, 2025",
    time: "09:30 AM – 6:00 PM SGT",
  },
  {
    image: "/images/event2.png",
    title: "Hack the Winter 2026",
    slug: "hack-the-winter-2026",
    location: "Berlin, Germany (Hybrid)",
    date: "January 23–25, 2026",
    time: "Fri 6:00 PM – Sun 3:00 PM CET",
  },
  {
    image: "/images/event3.png",
    title: "Next.js Global Summit",
    slug: "nextjs-global-summit-2026",
    location: "San Francisco, CA, USA",
    date: "February 19–20, 2026",
    time: "09:00 AM – 5:30 PM PST",
  },
  {
    image: "/images/event4.png",
    title: "PyCon Europe 2026",
    slug: "pycon-europe-2026",
    location: "Prague, Czech Republic",
    date: "March 16–20, 2026",
    time: "09:00 AM – 6:00 PM CET",
  },
  {
    image: "/images/event5.png",
    title: "KubeCon + CloudNativeCon APAC",
    slug: "kubecon-cloudnativecon-apac-2026",
    location: "Tokyo, Japan",
    date: "April 8–10, 2026",
    time: "09:00 AM – 5:00 PM JST",
  },
  {
    image: "/images/event6.png",
    title: "Open Source Maintainers Meetup",
    slug: "oss-maintainers-meetup-nyc-2026",
    location: "New York, NY, USA",
    date: "May 2, 2026",
    time: "10:00 AM – 4:00 PM EDT",
  },
];
