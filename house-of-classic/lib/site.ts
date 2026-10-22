// Single source of truth for business details. Edit here, not in the pages.
export const site = {
  name: "House of Classic",
  url: "https://houseofclassic.in",
  tagline: "Your new party house, equipped with the best resources",
  description:
    "House of Classic is a luxury party villa in Jaipur for bachelor's parties, birthdays, pool parties, family get-togethers and corporate events. Pool, dance floor, garden, cinema, gym and game zone.",
  address: {
    street: "C-9, Pratap Marg, Behind Science Park, Subhash Nagar",
    locality: "Jaipur",
    region: "Rajasthan",
    postalCode: "302016",
    country: "IN",
  },
  phone: "+91 9829132322",
  whatsapp: "919829132322", // digits only, international format, for wa.me links
  email: "houseofclassic9@gmail.com",
  geo: { latitude: 26.9124, longitude: 75.7873 }, // approximate, verify on Google Maps
  social: {
    facebook: "", // paste your page URL
    instagram: "", // paste your profile URL
    youtube: "", // paste your channel URL
  },
  checkIn: "2:00 PM",
  checkOut: "11:00 AM",
  nightlyRate: "", // leave empty to show "Ask for price"
  heroImage: "ANK01934_1", // pool under the glass roof, used on the home page and social previews
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/amenities", label: "Amenities" },
  { href: "/splash-relax", label: "Splash & Relax" },
  { href: "/our-tie-ups", label: "Our Tie-ups" },
  { href: "/contact", label: "Contact" },
];

export const amenities = [
  { title: "Swimming Pool", text: "Spill, splash, dance and swim in our deep swimming pool, under a glass roof and a rainbow of light.", image: "ANK01934_1", tag: "Pool" },
  { title: "Party Garden", text: "Spend your days and nights talking, walking or partying in this beautiful garden, which holds up to 70 people.", image: "IMG_5709-1", tag: "Outdoors" },
  { title: "Dance Floor", text: "Dance your worries away on a floor built for the purpose, with a built-in sound and lighting system.", image: "IMG_5707", tag: "Music" },
  { title: "Indoor Bar Area", text: "Store, mix and pour all your drinks with ease, and make more memories at the bar.", image: "", tag: "Drinks" },
  { title: "Cinema Hall", text: "A 17-seat cinema hall with comfortable recliners for the binge watchers in your group.", image: "IMG_5619", tag: "Screen" },
  { title: "Game Zone", text: "Table tennis, pool, carrom and chess for all the excitement, thrill and energy you want.", image: "IMG_5601", tag: "Play" },
  { title: "Terrace Gym", text: "A refreshing terrace gym with a treadmill, cross trainer, multi-gym and cycle.", image: "gym", tag: "Fitness" },
  { title: "Luxurious Bedrooms", text: "Three garden-facing bedrooms with fresh bedding, linens and toiletries.", image: "ANK01958", tag: "Stay" },
];

export const eventTypes = [
  "Bachelor's Party",
  "Birthday Party",
  "Pool Party",
  "Dance Party",
  "Ladies' Night Out",
  "Product Shoot",
  "Kitty Party",
  "Family Night Out",
  "Get-together",
  "Reunion Party",
  "Corporate Parties & Events",
];

export const splashInclusions = [
  "Pool area", "Living area", "Bar area", "Dining hall",
  "Indoor kitchen (self-use)", "Ground-floor rooms", "Whole ground-floor area",
  "Console & game area", "Cinema hall", "Entire house / villa",
];

export const splashSecurityDeposit = 10000;

// Transcribed from the supplied Aqua Party rate chart.
export const splashPackages = [
  { id: "splash-relax", name: "Splash & Relax", price: 15000, timing: "4 PM – 8 PM", hours: 4, maxGuests: 10, inclusions: splashInclusions.slice(0, 4), recommended: false },
  { id: "luxury-leisure", name: "Luxury Leisure", price: 18000, timing: "4 PM – 8 PM", hours: 4, maxGuests: 10, inclusions: splashInclusions.slice(0, 5), recommended: false },
  { id: "premium-evening", name: "Premium Indulgence", price: 25000, timing: "4 PM – 9 PM", hours: 5, maxGuests: 10, inclusions: splashInclusions.slice(0, 7), recommended: false },
  { id: "premium-midnight", name: "Premium Indulgence", price: 30000, timing: "2 PM – 12 AM (midnight)", hours: 10, maxGuests: 10, inclusions: splashInclusions.slice(), recommended: true },
];

export const tieUps = {
  events: {
    name: "SATKAAR Events",
    text: "Professional event management for corporate and non-corporate events, weddings, birthday parties, catering, pre-wedding shoots and more. Equipped with in-house design, production and technical units.",
    contacts: [
      "Phone: 0141-2282229",
      "Rahul Jajoo: 9828112085",
      "Deepak Bhandari: 9460951091, 9829051091",
      "Email: rahul@satkaarevents.com",
    ],
    website: "https://www.satkaarevents.com",
    image: "satkar",
  },
  food: {
    name: "Chowka Menu",
    text: "Food partner for events at House of Classic. Browse the full menu to plan your order.",
    contacts: [
      "Phone: 9829037972 / 9928900033 / 9799991428",
      "Email: sangeeta.m1964@gmail.com",
    ],
    menuImage: "Menu-chowka_Updated-1-1",
  },
};
