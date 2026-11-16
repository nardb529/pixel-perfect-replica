import { getSupabaseClient } from "@/lib/supabase/client";

const ANON_FAVORITES_KEY = "cl_anon_saved_v1";

export const favoriteService = {
  getAnonymousFavorites(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(ANON_FAVORITES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
    } catch {
      return [];
    }
  },

  setAnonymousFavorites(ids: string[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ANON_FAVORITES_KEY, JSON.stringify(Array.from(new Set(ids))));
    } catch {
      // Ignore storage quota errors
    }
  },

  async listFavorites(): Promise<string[]> {
    const client = getSupabaseClient();
    if (!client) return this.getAnonymousFavorites();

    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return this.getAnonymousFavorites();

    const { data, error } = await client
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => String(row["listing_id"]));
  },

  async saveFavorite(listingId: string): Promise<void> {
    const client = getSupabaseClient();
    const user = client ? (await client.auth.getUser()).data.user : null;
    if (!client || !user) {
      const current = this.getAnonymousFavorites();
      if (!current.includes(listingId)) {
        this.setAnonymousFavorites([...current, listingId]);
      }
      return;
    }

    const { error } = await client
      .from("favorites")
      .upsert({ user_id: user.id, listing_id: listingId }, { onConflict: "user_id,listing_id" });
    if (error) throw error;
  },

  async removeFavorite(listingId: string): Promise<void> {
    const client = getSupabaseClient();
    const user = client ? (await client.auth.getUser()).data.user : null;
    if (!client || !user) {
      this.setAnonymousFavorites(this.getAnonymousFavorites().filter((id) => id !== listingId));
      return;
    }

    const { error } = await client
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);
    if (error) throw error;
  },
};
