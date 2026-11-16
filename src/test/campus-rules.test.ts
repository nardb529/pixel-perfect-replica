import { describe, expect, it } from "vitest";
import {
  filterListings,
  initialListings,
  canManage,
  ownsListing,
  validatePassword,
  validateListing,
  formatListingPrice,
} from "@/lib/campus/data";

describe("Campus marketplace rules", () => {
  const sample = initialListings[0]!;

  it("includes KNUST and all-university audiences at KNUST, but excludes other-only audiences", () => {
    const other = { ...sample, id: "other-only", audience: ["UPSA"] };
    const ids = filterListings([...initialListings, other], "KNUST").map((l) => l.id);
    expect(ids).toContain("hp-laptop");
    expect(ids).toContain("green-sneakers");
    expect(ids).not.toContain("other-only");
  });

  it("shows all active university audiences when All Universities is selected", () => {
    expect(filterListings(initialListings, "All Universities")).toHaveLength(
      initialListings.length,
    );
  });

  it("excludes paused, sold and unavailable listings from browsing", () => {
    const hidden = (["Paused", "Sold", "Unavailable"] as const).map((status) => ({
      ...sample,
      status,
    }));
    expect(filterListings(hidden, "All Universities")).toHaveLength(0);
  });

  it("requires a simulated session for management", () => {
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
    title: "Calculator",
    description: "Working calculator",
    price: "95",
    images: ["photo"],
    audience: ["KNUST"],
    contact: "demo contact",
  };

  it("requires product images", () => {
    expect(validateListing({ ...valid, images: [] })).not.toBe("");
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

  it("requires contact details", () => {
    expect(validateListing({ ...valid, contact: "" })).not.toBe("");
    expect(validateListing(valid)).toBe("");
  });

  it("filters affordable finds to the selected price ceiling", () => {
    expect(
      filterListings(initialListings, "All Universities", "", "product", "All", 50).map(
        (l) => l.id,
      ),
    ).toEqual(["jollof"]);
  });
});
