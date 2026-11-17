import { requireSupabase } from "@/lib/supabase/client";
import type { ReportReason } from "@/lib/supabase/database.types";

export const reportService = {
  async submitReport(input: {
    listingId: string;
    reportedUserId?: string | null | undefined;
    reason: ReportReason;
    description?: string | undefined;
  }): Promise<void> {
    const supabase = requireSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("reports").insert({
      reporter_id: user?.id ?? null,
      listing_id: input.listingId,
      reported_user_id: input.reportedUserId ?? null,
      reason: input.reason,
      description: (input.description || "").trim().slice(0, 1500),
      status: "open",
    });

    if (error) throw error;
  },
};
