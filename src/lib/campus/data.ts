import laptop from "@/assets/laptop.jpg";
import sneakers from "@/assets/sneakers.jpg";
import photographer from "@/assets/photographer.jpg";
import headphones from "@/assets/headphones.jpg";
import books from "@/assets/books.jpg";
import jollof from "@/assets/jollof.jpg";
import design from "@/assets/design.jpg";
import hostelKettle from "@/assets/images/hostel_kettle_1794706586876.jpg";
import campusBraiding from "@/assets/images/campus_braiding_1794706586495.jpg";
import laptopRepair from "@/assets/images/laptop_repair_1794706586463.jpg";
import type {
  AudienceScope,
  ListingStatus,
  PriceType,
  VerificationStatus,
} from "@/lib/supabase/database.types";

export const BRAND = "CampusLoop";

export const universities = [
  "KNUST",
  "University of Ghana",
  "University of Cape Coast",
  "UPSA",
  "UEW",
  "UDS",
  "UMaT",
  "UENR",
  "GCTU",
  "UHAS",
  "UESD",
  "GIMPA",
  "ATU",
  "KsTU",
  "TTU",
  "Other institutions",
];

export const productCategories = [
  "Electronics",
  "Fashion",
  "Books & Academics",
  "Food & Groceries",
  "Beauty",
  "Hostel Essentials",
  "Sports",
  "Accessories",
  "Home and Living",
  "Others",
];

export const serviceCategories = [
  "Graphic Design",
  "Photography",
  "Hair & Beauty",
  "Technology & Repairs",
  "Tutoring",
  "Laundry",
  "Printing",
  "Food Services",
  "Transport",
  "Cleaning",
  "Events",
  "Others",
];

export const priceTypes: PriceType[] = [
  "Fixed",
  "Starting from",
  "Price range",
  "Negotiable",
  "Free",
];

export type Listing = {
  id: string;
  sellerId?: string | undefined;
  sellerUsername?: string | undefined;
  verificationStatus?: VerificationStatus | undefined;
  slug?: string | undefined;
  title: string;
  type: "product" | "service";
  category: string;
  categoryId?: string | undefined;
  price: number;
  priceType?: PriceType | undefined;
  currency?: string | undefined;
  image: string;
  images?: string[] | undefined;
  seller: string;
  university: string;
  audience: string[];
  audienceScope?: AudienceScope | undefined;
  description: string;
  condition?: string | undefined;
  brand?: string | undefined;
  stockStatus?: string | undefined;
  duration?: string | undefined;
  serviceArea?: string | undefined;
  deliveryMethod?: string | undefined;
  location?: string | undefined;
  time: string;
  status: "Active" | "Paused" | "Sold" | "Unavailable";
  rawStatus?: ListingStatus | undefined;
  views: number;
  likes: number;
  favoriteCount?: number | undefined;
  contactClicks?: number | undefined;
  featured?: boolean | undefined;
  ownerEmail?: string | undefined;
  contact?: string | undefined;
  contactMethod?: string | undefined;
  postedAt?: number | undefined;
};

export const sampleImages = [
  { label: "Laptop", src: laptop },
  { label: "Sneakers", src: sneakers },
  { label: "Hostel kettle", src: hostelKettle },
  { label: "Headphones", src: headphones },
  { label: "Books", src: books },
  { label: "Photography", src: photographer },
  { label: "Braiding", src: campusBraiding },
  { label: "Tech repair", src: laptopRepair },
];

export const initialListings: Listing[] = [
  {
    id: "hp-laptop",
    title: "HP EliteBook 840 G5",
    type: "product",
    category: "Electronics",
    price: 2450,
    priceType: "Fixed",
    currency: "GHS",
    image: laptop,
    seller: "Kwame Asante",
    university: "KNUST",
    audience: ["KNUST"],
    description:
      "A reliable companion for lectures, projects and everything in between. Intel Core i5, 8GB RAM and a 256GB SSD. Battery lasts around 4 hours. Charger included. You’re welcome to inspect it on campus before deciding.",
    condition: "Used",
    time: "2 hours ago",
    status: "Active",
    views: 128,
    likes: 12,
    featured: true,
    postedAt: 11,
  },
  {
    id: "green-sneakers",
    title: "Green & white everyday sneakers",
    type: "product",
    category: "Fashion",
    price: 180,
    priceType: "Fixed",
    currency: "GHS",
    image: sneakers,
    seller: "Ama Mensah",
    university: "University of Ghana",
    audience: ["All Universities"],
    description:
      "Fresh green and white low-tops, perfect for your everyday campus rotation. Available in sizes 38–44. Meet up on campus to try your pair.",
    condition: "New",
    time: "3 hours ago",
    status: "Active",
    views: 94,
    likes: 18,
    featured: true,
    postedAt: 10,
  },
  {
    id: "portrait-session",
    title: "Your next favourite portrait",
    type: "service",
    category: "Photography",
    price: 150,
    priceType: "Starting from",
    currency: "GHS",
    image: photographer,
    seller: "Kofi Owusu",
    university: "KNUST",
    audience: ["KNUST", "University of Ghana"],
    description:
      "Natural, personality-filled portraits for birthdays, graduation and just because. Includes a 45-minute session and 8 edited images. Let’s find your good light around campus.",
    time: "4 hours ago",
    status: "Active",
    views: 152,
    likes: 21,
    featured: true,
    postedAt: 9,
  },
  {
    id: "hostel-kettle",
    title: "Electric kettle & study lamp set",
    type: "product",
    category: "Hostel Essentials",
    price: 140,
    priceType: "Fixed",
    currency: "GHS",
    image: hostelKettle,
    seller: "Yaw Darko",
    university: "KNUST",
    audience: ["KNUST", "University of Cape Coast"],
    description:
      "Clean 1.7L stainless-steel kettle paired with a warm LED study desk lamp. Ideal for late-night revision and quick hostel tea.",
    condition: "Like New",
    time: "45 mins ago",
    status: "Active",
    views: 88,
    likes: 15,
    postedAt: 12,
  },
  {
    id: "campus-braids",
    title: "Neat knotless braids & styling",
    type: "service",
    category: "Hair & Beauty",
    price: 90,
    priceType: "Starting from",
    currency: "GHS",
    image: campusBraiding,
    seller: "Esi Tetteh",
    university: "University of Ghana",
    audience: ["All Universities"],
    description:
      "Neat, lightweight knotless braids, cornrows and quick campus touch-ups right from Pent & Evandy hostels. Book a slot that fits your lecture timetable.",
    time: "2 hours ago",
    status: "Active",
    views: 136,
    likes: 27,
    featured: true,
    postedAt: 11,
  },
  {
    id: "laptop-repair",
    title: "Same-day laptop diagnostics & repair",
    type: "service",
    category: "Technology & Repairs",
    price: 70,
    priceType: "Starting from",
    currency: "GHS",
    image: laptopRepair,
    seller: "Daniel Appiah",
    university: "University of Ghana",
    audience: ["All Universities"],
    description:
      "SSD upgrades, screen replacements, keyboard fixes and Windows/Mac tune-ups for students. Free quick check-up before any repair.",
    time: "3 hours ago",
    status: "Active",
    views: 119,
    likes: 16,
    postedAt: 9,
  },
  {
    id: "headphones",
    title: "Wireless noise-cancelling headphones",
    type: "product",
    category: "Electronics",
    price: 220,
    priceType: "Negotiable",
    currency: "GHS",
    image: headphones,
    seller: "Nana Boateng",
    university: "KNUST",
    audience: ["KNUST"],
    description:
      "Block out the hostel noise and get into your zone. Comfortable wireless headphones with a long-lasting battery, carry pouch and charging cable.",
    condition: "Like New",
    time: "5 hours ago",
    status: "Active",
    views: 81,
    likes: 9,
    postedAt: 7,
  },
  {
    id: "academic-bundle",
    title: "Textbooks + scientific calculator",
    type: "product",
    category: "Books & Academics",
    price: 95,
    priceType: "Fixed",
    currency: "GHS",
    image: books,
    seller: "Abena Osei",
    university: "University of Cape Coast",
    audience: ["All Universities"],
    description:
      "Get ready for the semester with three introductory university textbooks and a working scientific calculator. All in good condition with a few helpful notes.",
    condition: "Used",
    time: "6 hours ago",
    status: "Active",
    views: 72,
    likes: 11,
    postedAt: 6,
  },
  {
    id: "jollof",
    title: "Jollof that tastes like home",
    type: "product",
    category: "Food & Groceries",
    price: 45,
    priceType: "Fixed",
    currency: "GHS",
    image: jollof,
    seller: "Akua’s Kitchen",
    university: "KNUST",
    audience: ["KNUST"],
    description:
      "Freshly prepared Ghanaian jollof, grilled chicken and sweet fried plantain. Contact Akua to ask about today’s menu and campus collection.",
    condition: "New",
    time: "1 hour ago",
    status: "Active",
    views: 114,
    likes: 23,
    postedAt: 11,
  },
  {
    id: "graphic-design",
    title: "Good ideas. Great design.",
    type: "service",
    category: "Graphic Design",
    price: 80,
    priceType: "Starting from",
    currency: "GHS",
    image: design,
    seller: "Elorm Creative",
    university: "UPSA",
    audience: ["All Universities"],
    description:
      "Thoughtful flyers, brand identities and social media graphics that make your ideas stand out. Starting price covers one social post with two revisions. Tell me what you’re creating.",
    time: "7 hours ago",
    status: "Active",
    views: 106,
    likes: 14,
    postedAt: 5,
  },
  {
    id: "math-tutor",
    title: "Make maths make sense",
    type: "service",
    category: "Tutoring",
    price: 50,
    priceType: "Starting from",
    currency: "GHS",
    image: books,
    seller: "Abena Osei",
    university: "University of Cape Coast",
    audience: ["All Universities"],
    description:
      "Patient, one-on-one support in calculus and introductory statistics. In-person at UCC or online at any university. Starting price is per hour.",
    time: "8 hours ago",
    status: "Active",
    views: 64,
    likes: 8,
    postedAt: 4,
  },
];

export function filterListings(
  listings: Listing[],
  university: string,
  query = "",
  type?: string,
  category = "All",
  maxPrice = Infinity,
) {
  return listings.filter(
    (l) =>
      l.status === "Active" &&
      (university === "All Universities" ||
        l.audience.includes("All Universities") ||
        l.audience.includes(university)) &&
      (!type || l.type === type) &&
      (category === "All" || l.category === category) &&
      l.price <= maxPrice &&
      `${l.title} ${l.seller} ${l.category} ${l.description} ${l.university} ${l.audience.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}

export function canManage(user: unknown) {
  return Boolean(user);
}

export function ownsListing(listing: Listing, identifier?: string) {
  if (!identifier) return false;
  return Boolean(
    (listing.ownerEmail && listing.ownerEmail === identifier) ||
    (listing.sellerId && listing.sellerId === identifier),
  );
}

export function validatePassword(password: string, confirm?: string) {
  if (password.length < 8) return "Use a password with at least 8 characters.";
  if (confirm !== undefined && password !== confirm)
    return "Your passwords don’t match. Please try again.";
  return "";
}

export function validateListing(values: {
  type: "product" | "service";
  title: string;
  description: string;
  price: string;
  priceType?: PriceType | undefined;
  images: string[];
  audience: string[];
  contact: string;
}) {
  if (!values.images.length) return "Add at least one image.";
  if (!values.title.trim() || !values.description.trim()) return "Add a name and description.";
  const isFree = values.priceType === "Free";
  if (
    (!isFree && values.type === "product" && !values.price.trim()) ||
    (values.price.trim() && (!Number.isFinite(Number(values.price)) || Number(values.price) < 0))
  )
    return "Enter a valid price in GH₵.";
  if (!values.audience.length) return "Choose at least one university.";
  if (!values.contact.trim()) return "Add your contact details.";
  return "";
}

export const money = (amount: number) => `GH₵ ${amount.toLocaleString("en-GH")}`;

export function formatListingPrice(
  listing: Pick<Listing, "type" | "price"> & { priceType?: PriceType | undefined },
) {
  if (listing.priceType === "Free") {
    return "Free";
  }
  if (listing.type === "service" && (!listing.price || listing.price <= 0)) {
    return "Contact for pricing";
  }
  if (listing.priceType === "Negotiable") {
    return listing.price > 0 ? `${money(listing.price)} (Neg.)` : "Negotiable";
  }
  return money(listing.price);
}

export function normalizeGhanaPhoneDigits(raw?: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsAppUrl(contact?: string, message?: string): string | null {
  const digits = normalizeGhanaPhoneDigits(contact);
  if (digits.length < 9) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function buildPhoneHref(contact?: string): string | null {
  const digits = normalizeGhanaPhoneDigits(contact);
  if (digits.length < 9) return null;
  return `tel:+${digits}`;
}
