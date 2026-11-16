import { getSupabaseClient } from "@/lib/supabase/client";
import type { CategoryRecord, CategoryType } from "@/lib/supabase/database.types";

export const categoryService = {
  async listActiveCategories(type?: CategoryType): Promise<CategoryRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    let query = client
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (type) {
      query = query.eq("category_type", type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as CategoryRecord[];
  },

  async listAllCategories(): Promise<CategoryRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from("categories")
      .select("*")
      .order("category_type", { ascending: true })
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data || []) as CategoryRecord[];
  },
};
