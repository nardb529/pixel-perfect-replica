import { getSessionUser, getSupabaseClient, requireSupabase } from "@/lib/supabase/client";
import type { NotificationPreferences, NotificationRecord } from "@/lib/supabase/database.types";

const NOTIFICATION_COLUMNS =
  "id, user_id, title, message, notification_type, is_read, metadata, created_at";

export const notificationService = {
  async listNotifications(limit = 25): Promise<NotificationRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    const user = await getSessionUser(client);
    if (!user) return [];

    const { data, error } = await client
      .from("notifications")
      .select(NOTIFICATION_COLUMNS)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as NotificationRecord[];
  },

  async markAsRead(notificationId: string): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    if (error) throw error;
  },

  async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    const supabase = requireSupabase();
    const user = await getSessionUser(supabase);
    if (!user) throw new Error("Authentication required");
    const { error } = await supabase
      .from("profiles")
      .update({ notification_preferences: preferences })
      .eq("id", user.id);
    if (error) throw error;
  },
};
