import { getSupabaseClient } from "@/lib/supabase/client";
import type { UniversityRecord } from "@/lib/supabase/database.types";

export const universityService = {
  async listActiveUniversities(): Promise<UniversityRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from("universities")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("university_name", { ascending: true });
    if (error) throw error;
    return (data || []) as UniversityRecord[];
  },

  async listAllUniversities(): Promise<UniversityRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from("universities")
      .select("*")
      .order("display_order", { ascending: true })
      .order("university_name", { ascending: true });
    if (error) throw error;
    return (data || []) as UniversityRecord[];
  },
};
