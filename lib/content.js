// ═══════════════════════════════════════════════════════════════════
// KEENAN FARM — SITE CONTENT
// Everything a customer reads lives here. Edit this file (GitHub web UI
// is fine), commit, and Vercel redeploys in about a minute.
// ═══════════════════════════════════════════════════════════════════

export const farm = {
  name: 'Keenan Farm',
  legalName: 'Keenan Land & Cattle',
  town: 'Caledonia, New York',
  phone: '585-734-6458',
  phoneHref: 'tel:+15857346458',
  // Set to null to hide the email line until you have a keenanfarm.com address.
  email: null, // e.g. 'kevin@keenanfarm.com'
  established: 2024,
};

// $/lb hanging weight. Customer pays the butcher separately for processing.
export const shares = [
  {
    key: 'Quarter',
    label: 'Quarter',
    pricePerLb: 7.25,
    hangingLbs: 210,   // typical, used in the fine print
    featured: false,
  },
  {
    key: 'Half',
    label: 'Half',
    pricePerLb: 7.15,
    hangingLbs: 420,
    featured: true,
  },
  {
    key: 'Whole',
    label: 'Whole',
    pricePerLb: 7.0,
    hangingLbs: 840,
    featured: false,
  },
];

export const hero = {
  headline: 'Organically Raised Beef',
  // The farm's creed. Kevin's words — edit carefully.
  sub: "Organic because we believe in it. The cattle build the pasture and the pasture builds the cattle; that's how it's worked for a very long time. We didn't invent it. We just try to be good stewards of it.",
  // Practical line shown under the creed.
  sub2: 'Beef shares from a small family farm in Caledonia, New York — quarter, half, or whole.',
};

export const organic = {
  heading: "What they eat, and why we aren't certified.",
  p1: 'Our cattle come to us as calves from neighboring farms and are raised here in Caledonia on our own organic grass and hay, then finished with certified organic grain from Keystone Mills.',
  p2: "Certified organic beef has to be processed at a certified organic butcher, and there isn't one anywhere near us. Rather than truck our animals hours away, we work with a local custom butcher we trust. So the certification stops at the farm gate; the practices don't.",
};

export const steps = [
  {
    title: 'Request a share',
    body: 'Choose a quarter, half, or whole and tell us which animal you want to be on. We confirm within a day or two and send you a deposit link.',
  },
  {
    title: 'We set the date',
    body: "We'll tell you when your animal is scheduled at the butcher, usually a few weeks out.",
  },
  {
    title: 'Fill out your cut sheet',
    body: 'Steaks thick or thin, roasts or more ground, bone-in or boneless. You choose online and we pass it to the butcher.',
  },
  {
    title: 'Pick up your share',
    body: 'Paper-wrapped, labeled, and frozen by the butcher. You pay us the balance on hanging weight, pay the butcher for processing, and load up the coolers.',
  },
];

export const sharesNote =
  "Why shares? In New York, a farm can't sell you beef by the cut without a USDA-inspected plant. What we sell is a share of a live animal; the custom butcher then processes your share for you. That's why pricing is on hanging weight and processing is a separate bill from the butcher.";

// Frequently asked questions. Plain answers, only things that are true today.
export const faq = [
  {
    q: 'How much beef is a quarter, really?',
    a: 'A quarter hangs around 210 lb, and you take home roughly 60–65% of that as packaged beef — call it 125–135 lb — depending on how you have it cut. A half is about double, a whole about four times.',
  },
  {
    q: 'How much freezer space do I need?',
    a: "Rough rule: about 35–40 lb of packaged beef per cubic foot. A quarter fits in a 5 cu ft chest freezer with a little room; a half wants 8–10 cu ft; a whole needs 15 cu ft or more. A standard kitchen freezer won't hold a quarter.",
  },
  {
    q: 'What does it cost, all in?',
    a: "Two bills. You pay us per pound of hanging weight ($7.25 quarter, $7.15 half, $7.00 whole), and you pay the butcher directly for processing when you pick up. The final number depends on the animal's actual hanging weight, so we can only estimate until the animal is butchered.",
  },
  {
    q: 'Can I split a share with someone?',
    a: "Yes, and people do. Two families often go in on a half. One of you is our customer for that share and fills out the cut sheet; how you divide the boxes is up to you.",
  },
  {
    q: "I've never bought beef this way. What do I have to decide?",
    a: "Just how you'd like it cut and packaged: steaks thick or thin, roasts or more ground beef, bone-in or boneless. Our cut sheet walks you through every choice with plain explanations and sensible defaults. Most first-timers finish it in ten minutes.",
  },
  {
    q: 'When do I pay?',
    a: 'A deposit holds your share when you reserve. The balance to us is due at pickup, once we know the hanging weight. Processing is paid to the butcher at the same time.',
  },
  {
    q: "Why do you sell 'shares' instead of just beef?",
    a: "New York law. Without a USDA-inspected plant, a farm can't sell beef by the cut. What we sell is a share of a live animal; a licensed custom butcher processes your share for you. It's the standard way small farms sell direct here.",
  },
  {
    q: 'Are you certified organic?',
    a: "No, and we say so plainly. Our cattle eat our own organic grass and hay and are finished on certified organic grain from Keystone Mills. Certification would require processing at a certified organic butcher, and there isn't one anywhere near us. The practices are organic; the paperwork stops at the farm gate.",
  },
  {
    q: 'Where are you, and how do I pick up?',
    a: "We're in Caledonia, NY. You pick up your beef from the butcher, who will call you when it's ready — about two weeks after the butcher date. Bring coolers.",
  },
];

export const contact = {
  heading: 'Questions?',
};

export const fmtMoney = (n) => `$${n.toFixed(2)}`;
