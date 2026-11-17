import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";
import {
  buildPhoneHref,
  buildWhatsAppUrl,
  formatListingPrice,
  normalizeGhanaPhoneDigits,
  ownsListing,
  validateListing,
} from "@/lib/campus/data";
import {
  getSupabaseClient,
  getVisitorSessionId,
  isSchemaMissingError,
  isSupabaseConfigured,
  requireSupabase,
} from "@/lib/supabase/client";
import {
  adminService,
  authenticationService,
  favoriteService,
  listingService,
  profileService,
} from "@/services";
import type { UniversityRecord } from "@/lib/supabase/database.types";

describe("Supabase client & credential safety", () => {
  it("reports unconfigured gracefully when env vars are missing", () => {
    expect(isSupabaseConfigured).toBe(false);
    expect(getSupabaseClient()).toBeNull();
    expect(() => requireSupabase()).toThrow(/Supabase is not configured/i);
  });

  it("identifies PostgREST PGRST202/PGRST205 and Postgres missing schema errors accurately", () => {
    expect(isSchemaMissingError({ code: "PGRST202", message: "Could not find the function" })).toBe(
      true,
    );
    expect(isSchemaMissingError({ code: "PGRST205", message: "Could not find the table" })).toBe(
      true,
    );
    expect(
      isSchemaMissingError({
        message: "Could not find the table 'public.universities' in the schema cache",
      }),
    ).toBe(true);
    expect(isSchemaMissingError({ code: "23505", message: "duplicate key value" })).toBe(false);
    expect(isSchemaMissingError(null)).toBe(false);
  });

  it("generates and persists a stable visitor session ID", () => {
    localStorage.clear();
    const first = getVisitorSessionId();
    const second = getVisitorSessionId();
    expect(first.length).toBeGreaterThan(8);
    expect(second).toBe(first);
  });

  it("never embeds SUPABASE_SERVICE_ROLE_KEY inside src/", () => {
    const srcRoot = join(process.cwd(), "src");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name !== "test") {
          walk(join(dir, entry.name));
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          files.push(join(dir, entry.name));
        }
      }
    };
    walk(srcRoot);
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    }
  });
});

describe("Ghana contact builders & listing price formatting", () => {
  it("normalizes Ghana phone numbers and builds WhatsApp / tel links", () => {
    expect(normalizeGhanaPhoneDigits("024 123 4567")).toBe("233241234567");
    expect(normalizeGhanaPhoneDigits("+233 55 987 6543")).toBe("233559876543");
    expect(buildWhatsAppUrl("024 123 4567", "Hi there")).toBe(
      "https://wa.me/233241234567?text=Hi%20there",
    );
    expect(buildPhoneHref("024 123 4567")).toBe("tel:+233241234567");
    expect(buildWhatsAppUrl("abc")).toBeNull();
  });

  it("formats Free, Negotiable, Starting from, and zero-price services accurately", () => {
    expect(formatListingPrice({ type: "product", price: 0, priceType: "Free" })).toBe("Free");
    expect(formatListingPrice({ type: "product", price: 220, priceType: "Negotiable" })).toBe(
      "GH₵ 220 (Neg.)",
    );
    expect(formatListingPrice({ type: "service", price: 0 })).toBe("Contact for pricing");
    expect(
      validateListing({
        type: "product",
        title: "Old Study Lamp",
        description: "Free pickup at Unity Hall",
        price: "",
        priceType: "Free",
        images: ["img"],
        audience: ["KNUST"],
        contact: "0240000000",
      }),
    ).toBe("");
  });

  it("checks ownership across ownerEmail and sellerId", () => {
    expect(
      ownsListing(
        {
          id: "1",
          sellerId: "uuid-seller",
          title: "Item",
          type: "product",
          category: "Electronics",
          price: 100,
          image: "",
          seller: "Ama",
          university: "KNUST",
          audience: ["KNUST"],
          description: "Desc",
          time: "Now",
          status: "Active",
          views: 0,
          likes: 0,
        },
        "uuid-seller",
      ),
    ).toBe(true);
  });
});

describe("Listing university audience resolution & anonymous favorites", () => {
  const sampleUnis: UniversityRecord[] = [
    {
      id: "u1",
      university_name: "Kwame Nkrumah University of Science and Technology",
      short_name: "KNUST",
      slug: "knust",
      logo_url: null,
      location: "Kumasi",
      region: "Ashanti",
      description: "",
      display_order: 1,
      is_active: true,
      created_at: "",
    },
    {
      id: "u2",
      university_name: "University of Ghana",
      short_name: "University of Ghana",
      slug: "ug",
      logo_url: null,
      location: "Legon, Accra",
      region: "Greater Accra",
      description: "",
      display_order: 2,
      is_active: true,
      created_at: "",
    },
  ];

  it("maps All Universities, single campus, and multi-campus targets correctly", () => {
    expect(listingService.resolveUniversityIdsFromNames(["All Universities"], sampleUnis)).toEqual({
      scope: "all",
      universityIds: [],
    });
    expect(listingService.resolveUniversityIdsFromNames(["KNUST"], sampleUnis)).toEqual({
      scope: "single",
      universityIds: ["u1"],
    });
    expect(
      listingService.resolveUniversityIdsFromNames(["KNUST", "University of Ghana"], sampleUnis),
    ).toEqual({
      scope: "multiple",
      universityIds: ["u1", "u2"],
    });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and toggles buyer favorites locally without registration", async () => {
    expect(await favoriteService.listFavorites()).toEqual([]);
    await favoriteService.saveFavorite("hp-laptop");
    expect(favoriteService.getAnonymousFavorites()).toEqual(["hp-laptop"]);
    await favoriteService.removeFavorite("hp-laptop");
    expect(favoriteService.getAnonymousFavorites()).toEqual([]);
  });

  it("handles service calls safely when Supabase credentials are absent", async () => {
    expect(await authenticationService.getSession()).toBeNull();
    expect(await profileService.getPublicSellerProfile("non-existent")).toBeNull();
    await expect(adminService.getSummary()).rejects.toThrow(/Supabase is not configured/i);
  });
});

describe("SQL migrations, RLS, and business-rule integrity", () => {
  const schemaSql = readFileSync(
    join(process.cwd(), "supabase/migrations/202611160001_initial_schema.sql"),
    "utf8",
  );
  const rlsSql = readFileSync(
    join(process.cwd(), "supabase/migrations/202611160002_rls_and_storage.sql"),
    "utf8",
  );
  const seedSql = readFileSync(
    join(process.cwd(), "supabase/migrations/202611160003_seed_universities_categories.sql"),
    "utf8",
  );

  it("enables RLS on every core CampusLoop table and avoids any payment tables", () => {
    const requiredTables = [
      "universities",
      "profiles",
      "user_universities",
      "categories",
      "listings",
      "listing_images",
      "product_details",
      "service_details",
      "listing_universities",
      "favorites",
      "listing_likes",
      "listing_views",
      "contact_clicks",
      "reports",
      "moderation_logs",
      "notifications",
      "promotion_configs",
    ];
    for (const tbl of requiredTables) {
      expect(schemaSql).toContain(`create table if not exists public.${tbl}`);
      expect(rlsSql).toContain(`alter table public.${tbl} enable row level security`);
    }
    expect(schemaSql.toLowerCase()).not.toContain("create table if not exists public.orders");
    expect(schemaSql.toLowerCase()).not.toContain("create table if not exists public.payments");
    expect(schemaSql.toLowerCase()).not.toContain("create table if not exists public.cart");
  });

  it("seeds all 16 Ghanaian universities and core product/service categories", () => {
    for (const uni of [
      "KNUST",
      "University of Ghana",
      "University of Cape Coast",
      "UPSA",
      "UEW",
      "UDS",
      "GIMPA",
      "ATU",
    ]) {
      expect(seedSql).toContain(uni);
    }
    for (const cat of [
      "Electronics",
      "Books & Academics",
      "Graphic Design",
      "Hair & Beauty",
      "Tutoring",
    ]) {
      expect(seedSql).toContain(cat);
    }
  });
});

describe("Security hardening, strict per-user isolation & free-tier SQL optimizations", () => {
  const setupSql = readFileSync(join(process.cwd(), "supabase/setup_all.sql"), "utf8");
  const stylesCss = readFileSync(join(process.cwd(), "src/styles.css"), "utf8");

  it("isolates private user_universities reads to owners and admins only", () => {
    expect(setupSql).toContain(
      'create policy "Owners and admins view user university affiliations"',
    );
    expect(setupSql).toContain("using (auth.uid() = user_id or public.is_admin())");
    expect(setupSql).not.toContain('create policy "Public read seller university affiliations"');
  });

  it("uses security_barrier view and expiry filters on public listing child tables", () => {
    expect(setupSql).toContain("with (security_barrier = true) as");
    const expiryMatches = setupSql.match(/\(l\.expires_at is null or l\.expires_at > now\(\)\)/g);
    expect(expiryMatches?.length ?? 0).toBeGreaterThanOrEqual(4);
  });

  it("includes partial/composite indexes and CTE aggregation in get_seller_analytics", () => {
    expect(setupSql).toContain("idx_listings_active_featured_pub");
    expect(setupSql).toContain("idx_favorites_listing_created");
    expect(setupSql).toContain("with seller_listings as (");
  });

  it("sanitizes Edge Function 500 errors and sets no-store caching headers", () => {
    for (const fn of ["admin-moderate", "contact-track", "upload-sign"]) {
      const code = readFileSync(join(process.cwd(), `supabase/functions/${fn}/index.ts`), "utf8");
      expect(code).toContain('"Cache-Control": "no-store"');
      expect(code).toContain("Invalid JSON request body");
      expect(code).not.toContain("err instanceof Error ? err.message");
    }
  });

  it("adapts viewport safe areas and elevates floating navbar above the very bottom", () => {
    expect(stylesCss).toContain("bottom: max(26px, calc(env(safe-area-inset-bottom) + 18px));");
    expect(stylesCss).toContain(
      "padding: 10px max(12px, env(safe-area-inset-right)) calc(126px + env(safe-area-inset-bottom))",
    );
    expect(stylesCss).toContain("@media (max-height: 540px) and (max-width: 960px)");
  });
});
