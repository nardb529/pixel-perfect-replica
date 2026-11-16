import { compressImageFile, getSupabaseClient, requireSupabase } from "@/lib/supabase/client";
import type {
  AudienceScope,
  ListingStatus,
  ListingType,
  PriceType,
  SearchListingRow,
  UniversityRecord,
} from "@/lib/supabase/database.types";
import type { Listing } from "@/lib/campus/data";

export interface SearchListingsParams {
  universityFilter?: string | null | undefined;
  listingType?: ListingType | null | undefined;
  categoryFilter?: string | null | undefined;
  searchQuery?: string | null | undefined;
  minPrice?: number | null | undefined;
  maxPrice?: number | null | undefined;
  featuredOnly?: boolean | undefined;
  sort?: "recent" | "price_asc" | "price_desc" | "popular" | "relevant" | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface UpsertListingInput {
  listingType: ListingType;
  title: string;
  description: string;
  categoryId: string;
  price: number | null;
  priceType: PriceType;
  condition?: string | undefined;
  brand?: string | undefined;
  stockStatus?: string | undefined;
  duration?: string | undefined;
  serviceArea?: string | undefined;
  deliveryMethod?: string | undefined;
  location?: string | undefined;
  contactMethod: string;
  contactValue: string;
  status?: ListingStatus | undefined;
  audienceScope: AudienceScope;
  universityIds: string[];
  images: Array<{ imageUrl: string; storagePath?: string | null | undefined }>;
}

function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "listing"}-${suffix}`;
}

export function formatRelativeTime(isoDate?: string | null): string {
  if (!isoDate) return "Recently";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60_000));
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(isoDate).toLocaleDateString("en-GH", { month: "short", day: "numeric" });
}

export function mapSearchRowToListing(row: SearchListingRow): Listing {
  const orderedImages = (row.images || [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.image_url);

  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerUsername: row.seller_username,
    verificationStatus: row.seller_verification,
    title: row.title,
    slug: row.slug,
    type: row.listing_type,
    category: row.category_name,
    categoryId: row.category_id,
    price: Number(row.price ?? 0),
    priceType: row.price_type,
    currency: row.currency,
    image: orderedImages[0] || "",
    images: orderedImages,
    seller: row.seller_name,
    university: row.primary_university_name,
    audience:
      row.audience_scope === "all"
        ? ["All Universities"]
        : row.audience_universities?.length
          ? row.audience_universities
          : [row.primary_university_name],
    audienceScope: row.audience_scope,
    description: row.description,
    condition: row.condition ?? undefined,
    location: row.location || undefined,
    time: formatRelativeTime(row.published_at || row.created_at),
    status:
      row.status === "Active" ||
      row.status === "Paused" ||
      row.status === "Sold" ||
      row.status === "Unavailable"
        ? row.status
        : "Paused",
    rawStatus: row.status,
    views: row.view_count,
    likes: row.like_count,
    favoriteCount: row.favorite_count,
    contactClicks: row.contact_click_count,
    featured: row.is_featured,
    contact: row.contact_value,
    contactMethod: row.contact_method,
    postedAt: new Date(row.published_at || row.created_at).getTime(),
  };
}

export const listingService = {
  async searchListings(params: SearchListingsParams = {}): Promise<{
    items: Listing[];
    totalCount: number;
  }> {
    const client = getSupabaseClient();
    if (!client) return { items: [], totalCount: 0 };

    const { data, error } = await client.rpc("search_marketplace_listings", {
      p_university_filter: params.universityFilter ?? null,
      p_listing_type: params.listingType ?? null,
      p_category_filter: params.categoryFilter ?? null,
      p_search_query: params.searchQuery ?? null,
      p_min_price: params.minPrice ?? null,
      p_max_price: params.maxPrice ?? null,
      p_featured_only: Boolean(params.featuredOnly),
      p_sort: params.sort ?? "recent",
      p_limit: params.limit ?? 24,
      p_offset: params.offset ?? 0,
    });

    if (error) throw error;
    const rows = (data || []) as SearchListingRow[];
    return {
      items: rows.map(mapSearchRowToListing),
      totalCount: Number(rows[0]?.total_count ?? 0),
    };
  },

  async getSearchSuggestions(
    query: string,
    limit = 6,
  ): Promise<Array<{ id: string; title: string; type: ListingType }>> {
    const client = getSupabaseClient();
    if (!client || !query.trim()) return [];

    const { data, error } = await client
      .from("listings")
      .select("id, title, listing_type")
      .eq("status", "Active")
      .ilike("title", `%${query.trim()}%`)
      .order("view_count", { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data || []).map((row) => ({
      id: String(row["id"]),
      title: String(row["title"]),
      type: row["listing_type"] as ListingType,
    }));
  },

  async getListingById(listingId: string): Promise<Listing | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("listings")
      .select(
        `
        *,
        category:categories(id, name, slug),
        images:listing_images(id, image_url, storage_path, display_order),
        product_details(condition, brand, stock_status),
        service_details(starting_price, duration, service_area, delivery_method),
        targets:listing_universities(university_id, university:universities(short_name, university_name))
      `,
      )
      .eq("id", listingId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const sellerId = String(data["seller_id"]);
    const { data: sellerPublic } = await client
      .from("public_seller_profiles")
      .select("id, full_name, username, verification_status, primary_university_id")
      .eq("id", sellerId)
      .maybeSingle();

    let primaryUniName = "Ghana Campus";
    if (sellerPublic?.["primary_university_id"]) {
      const { data: uniRow } = await client
        .from("universities")
        .select("short_name, university_name")
        .eq("id", sellerPublic["primary_university_id"])
        .maybeSingle();
      if (uniRow) {
        primaryUniName = String(uniRow["short_name"] || uniRow["university_name"]);
      }
    }

    const rawImages = (
      (data["images"] as Array<{ id: string; image_url: string; display_order: number }> | null) ||
      []
    )
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => i.image_url);

    const targets =
      (data["targets"] as Array<{
        university_id: string;
        university?: { short_name?: string; university_name?: string } | null;
      }> | null) || [];

    const audience =
      data["audience_scope"] === "all"
        ? ["All Universities"]
        : targets
            .map((t) => t.university?.short_name || t.university?.university_name || "")
            .filter(Boolean);

    const category = data["category"] as { id?: string; name?: string } | null;
    const prodDetails = data["product_details"] as {
      condition?: string;
      brand?: string;
      stock_status?: string;
    } | null;
    const servDetails = data["service_details"] as {
      duration?: string;
      service_area?: string;
      delivery_method?: string;
    } | null;

    const rawStatus = data["status"] as ListingStatus;

    return {
      id: String(data["id"]),
      sellerId,
      sellerUsername: sellerPublic?.["username"] ? String(sellerPublic["username"]) : undefined,
      verificationStatus:
        (sellerPublic?.["verification_status"] as Listing["verificationStatus"]) || "unverified",
      title: String(data["title"]),
      slug: String(data["slug"]),
      type: data["listing_type"] as ListingType,
      category: category?.name || "Others",
      categoryId: String(data["category_id"]),
      price: Number(data["price"] ?? 0),
      priceType: data["price_type"] as PriceType,
      currency: String(data["currency"] || "GHS"),
      image: rawImages[0] || "",
      images: rawImages,
      seller: String(sellerPublic?.["full_name"] || "Campus Seller"),
      university: primaryUniName,
      audience: audience.length ? audience : [primaryUniName],
      audienceScope: data["audience_scope"] as AudienceScope,
      description: String(data["description"]),
      condition: prodDetails?.condition || (data["condition"] as string | undefined) || undefined,
      brand: prodDetails?.brand || undefined,
      stockStatus: prodDetails?.stock_status || undefined,
      duration: servDetails?.duration || undefined,
      serviceArea: servDetails?.service_area || undefined,
      deliveryMethod: servDetails?.delivery_method || undefined,
      location: (data["location"] as string | undefined) || undefined,
      time: formatRelativeTime(
        (data["published_at"] as string | null) || (data["created_at"] as string),
      ),
      status:
        rawStatus === "Active" ||
        rawStatus === "Paused" ||
        rawStatus === "Sold" ||
        rawStatus === "Unavailable"
          ? rawStatus
          : "Paused",
      rawStatus,
      views: Number(data["view_count"] || 0),
      likes: Number(data["like_count"] || 0),
      favoriteCount: Number(data["favorite_count"] || 0),
      contactClicks: Number(data["contact_click_count"] || 0),
      featured: Boolean(data["is_featured"]),
      contact: String(data["contact_value"] || ""),
      contactMethod: String(data["contact_method"] || "WhatsApp"),
      postedAt: new Date(
        (data["published_at"] as string | null) || (data["created_at"] as string),
      ).getTime(),
    };
  },

  async getListingsBySeller(sellerId: string): Promise<Listing[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
      .from("listings")
      .select(
        `
        *,
        category:categories(id, name),
        images:listing_images(image_url, display_order),
        targets:listing_universities(university:universities(short_name))
      `,
      )
      .eq("seller_id", sellerId)
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => mapSellerRowToListing(row, "Campus Seller", "Ghana Campus"));
  },

  async getMyListings(): Promise<Listing[]> {
    const supabase = requireSupabase();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) return [];

    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        category:categories(id, name),
        images:listing_images(image_url, display_order),
        product_details(condition, brand, stock_status),
        service_details(starting_price, duration, service_area, delivery_method),
        targets:listing_universities(university:universities(short_name, university_name))
      `,
      )
      .eq("seller_id", user.id)
      .neq("status", "Archived")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((row) =>
      mapSellerRowToListing(
        row,
        String(user.user_metadata?.["full_name"] || "You"),
        "My Campus",
        user.email,
      ),
    );
  },

  async createListing(input: UpsertListingInput): Promise<Listing> {
    const supabase = requireSupabase();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error("Sign in to publish listings.");

    const slug = slugifyTitle(input.title);
    const { data: created, error } = await supabase
      .from("listings")
      .insert({
        seller_id: user.id,
        listing_type: input.listingType,
        title: input.title.trim(),
        slug,
        description: input.description.trim(),
        category_id: input.categoryId,
        price: input.price,
        price_type: input.priceType,
        currency: "GHS",
        status: input.status ?? "Active",
        condition: input.listingType === "product" ? input.condition || "New" : null,
        location: input.location?.trim() || "",
        contact_method: input.contactMethod,
        contact_value: input.contactValue.trim(),
        audience_scope: input.audienceScope,
        published_at: input.status === "Draft" ? null : new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) throw error;
    const listingId = String(created["id"]);

    await syncListingChildren(supabase, listingId, input);
    const full = await this.getListingById(listingId);
    if (!full) throw new Error("Listing was saved but could not be reloaded.");
    return full;
  },

  async updateListing(listingId: string, input: UpsertListingInput): Promise<Listing> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("listings")
      .update({
        listing_type: input.listingType,
        title: input.title.trim(),
        description: input.description.trim(),
        category_id: input.categoryId,
        price: input.price,
        price_type: input.priceType,
        status: input.status ?? "Active",
        condition: input.listingType === "product" ? input.condition || "New" : null,
        location: input.location?.trim() || "",
        contact_method: input.contactMethod,
        contact_value: input.contactValue.trim(),
        audience_scope: input.audienceScope,
      })
      .eq("id", listingId);

    if (error) throw error;
    await syncListingChildren(supabase, listingId, input);
    const full = await this.getListingById(listingId);
    if (!full) throw new Error("Updated listing could not be reloaded.");
    return full;
  },

  async updateListingStatus(listingId: string, status: ListingStatus): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase.from("listings").update({ status }).eq("id", listingId);
    if (error) throw error;
  },

  async archiveListing(listingId: string): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("listings")
      .update({ status: "Archived" })
      .eq("id", listingId);
    if (error) throw error;
  },

  async uploadListingImage(file: File): Promise<{ imageUrl: string; storagePath: string }> {
    const supabase = requireSupabase();
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      throw new Error("Only JPG, PNG, WebP or AVIF images are allowed.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Images must be 5 MB or smaller.");
    }

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error("Sign in to upload images.");

    const optimized = await compressImageFile(file, 1400, 0.84);
    const ext = optimized.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("listing-images").upload(storagePath, optimized, {
      upsert: false,
      contentType: optimized.type,
    });

    if (error) throw error;
    const { data } = supabase.storage.from("listing-images").getPublicUrl(storagePath);
    return { imageUrl: data.publicUrl, storagePath };
  },

  async removeListingStorageObject(storagePath: string): Promise<void> {
    const client = getSupabaseClient();
    if (!client || !storagePath) return;
    await client.storage.from("listing-images").remove([storagePath]);
  },

  resolveUniversityIdsFromNames(
    audienceNames: string[],
    universitiesList: UniversityRecord[],
  ): { scope: AudienceScope; universityIds: string[] } {
    if (audienceNames.includes("All Universities")) {
      return { scope: "all", universityIds: [] };
    }
    const ids = audienceNames
      .map(
        (name) =>
          universitiesList.find(
            (u) =>
              u.short_name === name ||
              u.university_name === name ||
              u.slug === name ||
              u.id === name,
          )?.id,
      )
      .filter((id): id is string => Boolean(id));

    return {
      scope: ids.length > 1 ? "multiple" : "single",
      universityIds: ids,
    };
  },
};

async function syncListingChildren(
  supabase: ReturnType<typeof requireSupabase>,
  listingId: string,
  input: UpsertListingInput,
) {
  await supabase.from("listing_images").delete().eq("listing_id", listingId);
  if (input.images.length > 0) {
    const { error: imgErr } = await supabase.from("listing_images").insert(
      input.images.map((img, index) => ({
        listing_id: listingId,
        image_url: img.imageUrl,
        storage_path: img.storagePath ?? null,
        display_order: index,
      })),
    );
    if (imgErr) throw imgErr;
  }

  if (input.listingType === "product") {
    const { error: pdErr } = await supabase.from("product_details").upsert({
      listing_id: listingId,
      condition: input.condition || "New",
      brand: input.brand?.trim() || null,
      stock_status: input.stockStatus || "In stock",
    });
    if (pdErr) throw pdErr;
  } else {
    const { error: sdErr } = await supabase.from("service_details").upsert({
      listing_id: listingId,
      starting_price: input.price,
      duration: input.duration?.trim() || null,
      service_area: input.serviceArea?.trim() || null,
      delivery_method: input.deliveryMethod?.trim() || null,
    });
    if (sdErr) throw sdErr;
  }

  await supabase.from("listing_universities").delete().eq("listing_id", listingId);
  if (input.audienceScope !== "all" && input.universityIds.length > 0) {
    const { error: uniErr } = await supabase.from("listing_universities").insert(
      input.universityIds.map((universityId) => ({
        listing_id: listingId,
        university_id: universityId,
      })),
    );
    if (uniErr) throw uniErr;
  }
}

function mapSellerRowToListing(
  row: Record<string, unknown>,
  sellerName: string,
  fallbackUni: string,
  ownerEmail?: string,
): Listing {
  const images = (
    (row["images"] as Array<{ image_url: string; display_order: number }> | null) || []
  )
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => i.image_url);
  const targets =
    (row["targets"] as Array<{
      university?: { short_name?: string; university_name?: string } | null;
    }> | null) || [];
  const category = row["category"] as { id?: string; name?: string } | null;
  const prod = row["product_details"] as {
    condition?: string;
    brand?: string;
    stock_status?: string;
  } | null;
  const serv = row["service_details"] as {
    duration?: string;
    service_area?: string;
    delivery_method?: string;
  } | null;
  const audienceScope = row["audience_scope"] as AudienceScope;
  const audience =
    audienceScope === "all"
      ? ["All Universities"]
      : targets
          .map((t) => t.university?.short_name || t.university?.university_name || "")
          .filter(Boolean);
  const rawStatus = row["status"] as ListingStatus;

  return {
    id: String(row["id"]),
    sellerId: String(row["seller_id"]),
    title: String(row["title"]),
    slug: String(row["slug"]),
    type: row["listing_type"] as ListingType,
    category: category?.name || "Others",
    categoryId: String(row["category_id"]),
    price: Number(row["price"] ?? 0),
    priceType: row["price_type"] as PriceType,
    currency: String(row["currency"] || "GHS"),
    image: images[0] || "",
    images,
    seller: sellerName,
    university: audience[0] && audience[0] !== "All Universities" ? audience[0] : fallbackUni,
    audience: audience.length ? audience : [fallbackUni],
    audienceScope,
    description: String(row["description"]),
    condition: prod?.condition || (row["condition"] as string | undefined) || undefined,
    brand: prod?.brand || undefined,
    stockStatus: prod?.stock_status || undefined,
    duration: serv?.duration || undefined,
    serviceArea: serv?.service_area || undefined,
    deliveryMethod: serv?.delivery_method || undefined,
    location: (row["location"] as string | undefined) || undefined,
    time: formatRelativeTime(
      (row["published_at"] as string | null) || (row["created_at"] as string),
    ),
    status:
      rawStatus === "Active" ||
      rawStatus === "Paused" ||
      rawStatus === "Sold" ||
      rawStatus === "Unavailable"
        ? rawStatus
        : "Paused",
    rawStatus,
    views: Number(row["view_count"] || 0),
    likes: Number(row["like_count"] || 0),
    favoriteCount: Number(row["favorite_count"] || 0),
    contactClicks: Number(row["contact_click_count"] || 0),
    featured: Boolean(row["is_featured"]),
    ownerEmail,
    contact: String(row["contact_value"] || ""),
    contactMethod: String(row["contact_method"] || "WhatsApp"),
    postedAt: new Date(
      (row["published_at"] as string | null) || (row["created_at"] as string),
    ).getTime(),
  };
}
