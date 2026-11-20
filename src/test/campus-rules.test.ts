import { describe, expect, it } from "vitest";
import {
  filterListings,
  canManage,
  ownsListing,
  validatePassword,
  validateListing,
  formatListingPrice,
  isSafeMediaUrl,
  universities,
  type Listing,
} from "@/lib/campus/data";
import { getCanonicalSiteUrl, pageHead } from "@/lib/campus/meta";

const fixtureListings: Listing[] = [
  {
    id: "item-laptop",
    title: "HP EliteBook 840 G6",
    type: "product",
    category: "Electronics",
    price: 3400,
    image: "https://cdn.example.com/laptop.jpg",
    seller: "Ama Boateng",
    university: "KNUST",
    audience: ["KNUST"],
    description: "Clean Core i5 laptop with charger included.",
    time: "2h ago",
    status: "Active",
    views: 12,
    likes: 3,
    contact: "0241112233",
    contactMethod: "WhatsApp",
  },
  {
    id: "item-jollof",
    title: "Homemade Jollof Bowl",
    type: "product",
    category: "Food & Groceries",
    price: 35,
    image: "https://cdn.example.com/jollof.jpg",
    seller: "Kwaku Mensah",
    university: "University of Ghana",
    audience: ["All Universities"],
    description: "Freshly cooked lunch box available near Pent.",
    time: "1h ago",
    status: "Active",
    views: 8,
    likes: 2,
    contact: "0552223344",
    contactMethod: "WhatsApp",
  },
  {
    id: "item-tutor",
    title: "Calculus & Linear Algebra Tutoring",
    type: "service",
    category: "Tutoring",
    price: 0,
    image: "https://cdn.example.com/tutor.jpg",
    seller: "Kofi Owusu",
    university: "UPSA",
    audience: ["UPSA"],
    description: "Weekly past-question prep sessions on campus.",
    time: "4h ago",
    status: "Active",
    views: 5,
    likes: 1,
    contact: "0203334455",
    contactMethod: "Phone call",
  },
];

describe("Campus marketplace rules", () => {
  const sample = fixtureListings[0]!;

  it("includes KNUST and all-university audiences at KNUST, but excludes other-only audiences", () => {
    const ids = filterListings(fixtureListings, "KNUST").map((l) => l.id);
    expect(ids).toContain("item-laptop");
    expect(ids).toContain("item-jollof");
    expect(ids).not.toContain("item-tutor");
  });

  it("shows all active university audiences when All Universities is selected", () => {
    expect(filterListings(fixtureListings, "All Universities")).toHaveLength(
      fixtureListings.length,
    );
  });

  it("excludes paused, sold and unavailable listings from browsing", () => {
    const hidden = (["Paused", "Sold", "Unavailable"] as const).map((status) => ({
      ...sample,
      status,
    }));
    expect(filterListings(hidden, "All Universities")).toHaveLength(0);
  });

  it("requires an authenticated user session for management", () => {
    expect(canManage(null)).toBe(false);
    expect(canManage({ email: "seller@example.com" })).toBe(true);
  });

  it("only lets a seller own their own listings", () => {
    const l = { ...sample, ownerEmail: "ama@example.com" };
    expect(ownsListing(l, "ama@example.com")).toBe(true);
    expect(ownsListing(l, "kofi@example.com")).toBe(false);
    expect(ownsListing(l)).toBe(false);
  });

  it("requires an eight-character password", () => {
    expect(validatePassword("1234567")).not.toBe("");
    expect(validatePassword("12345678")).toBe("");
  });

  it("requires matching registration passwords", () => {
    expect(validatePassword("12345678", "12345679")).not.toBe("");
    expect(validatePassword("12345678", "12345678")).toBe("");
  });

  const valid = {
    type: "product" as const,
    title: "Scientific Calculator",
    description: "Working Casio fx-991ES Plus calculator.",
    price: "95",
    images: ["https://cdn.example.com/calc.jpg"],
    audience: ["KNUST"],
    contact: "0240000000",
  };

  it("requires product images and caps gallery at 8", () => {
    expect(validateListing({ ...valid, images: [] })).not.toBe("");
    expect(validateListing({ ...valid, images: new Array(9).fill("img") })).not.toBe("");
    expect(validateListing(valid)).toBe("");
  });

  it("enforces title, description, price, and contact validation bounds", () => {
    expect(validateListing({ ...valid, title: "A" })).not.toBe("");
    expect(validateListing({ ...valid, description: "Too short" })).not.toBe("");
    expect(validateListing({ ...valid, price: "99999999" })).not.toBe("");
    expect(validateListing({ ...valid, contact: "123" })).not.toBe("");
    expect(validateListing(valid)).toBe("");
  });

  it("requires a product price but allows an optional service price", () => {
    expect(validateListing({ ...valid, price: "" })).not.toBe("");
    expect(validateListing({ ...valid, type: "service", price: "" })).toBe("");
    expect(formatListingPrice({ type: "service", price: 0 })).toBe("Contact for pricing");
  });

  it("allows multiple universities and all universities but requires an audience", () => {
    expect(validateListing({ ...valid, audience: [] })).not.toBe("");
    expect(validateListing({ ...valid, audience: ["KNUST", "UPSA"] })).toBe("");
    expect(validateListing({ ...valid, audience: ["All Universities"] })).toBe("");
  });

  it("filters affordable finds to the selected price ceiling", () => {
    expect(
      filterListings(fixtureListings, "All Universities", "", "product", "All", 50).map(
        (l) => l.id,
      ),
    ).toEqual(["item-jollof"]);
  });

  it("allows only safe media URLs and rejects javascript/data/protocol-relative schemes", () => {
    expect(isSafeMediaUrl("https://cdn.example.com/photo.jpg")).toBe(true);
    expect(isSafeMediaUrl("http://localhost:3000/photo.png")).toBe(true);
    expect(isSafeMediaUrl("/assets/photo.png")).toBe(true);
    expect(isSafeMediaUrl("blob:https://campusloop.app/abc")).toBe(true);
    expect(isSafeMediaUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeMediaUrl("data:image/svg+xml,<svg/>")).toBe(false);
    expect(isSafeMediaUrl("//evil.example.com/x.png")).toBe(false);
    expect(isSafeMediaUrl("")).toBe(false);
  });

  it("includes Other institutions among supported Ghanaian universities", () => {
    expect(universities).toContain("Other institutions");
    expect(universities).toContain("KNUST");
    expect(universities).toContain("University of Ghana");
  });

  it("generates complete marketplace OpenGraph, Twitter, and canonical metadata", () => {
    const baseUrl = getCanonicalSiteUrl();
    const publicHead = pageHead("Discover Campus Marketplace", "Shop student items across Ghana.", {
      path: "/discover",
    });
    expect(publicHead.meta).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Discover Campus Marketplace · CampusLoop Campus Marketplace",
        }),
        expect.objectContaining({ property: "og:url", content: `${baseUrl}/discover` }),
        expect.objectContaining({
          property: "og:image",
          content: `${baseUrl}/og-marketplace.jpg`,
        }),
        expect.objectContaining({ name: "twitter:card", content: "summary_large_image" }),
      ]),
    );
    expect(publicHead.links).toEqual([{ rel: "canonical", href: `${baseUrl}/discover` }]);

    const privateHead = pageHead("Seller dashboard", "Manage listings.", {
      path: "/dashboard",
      noIndex: true,
    });
    expect(privateHead.meta).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "robots", content: "noindex, nofollow" }),
      ]),
    );
    expect(privateHead.links).toEqual([]);
  });
});
