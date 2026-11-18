import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, requireSupabase } from "@/lib/supabase/client";
import type { AccountType } from "@/lib/supabase/database.types";

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  username: string;
  accountType: AccountType;
  primaryUniversityId?: string | null | undefined;
  universityName?: string | undefined;
  phoneNumber?: string | undefined;
  whatsappNumber?: string | undefined;
  isStudent?: boolean | undefined;
}

export const authenticationService = {
  async getSession(): Promise<Session | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client.auth.getUser();
    if (error) return null;
    return data.user;
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const client = getSupabaseClient();
    if (!client) {
      return { unsubscribe: () => undefined };
    }
    const { data } = client.auth.onAuthStateChange(callback);
    return data.subscription;
  },

  async signUp(payload: SignUpPayload) {
    const supabase = requireSupabase();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        data: {
          full_name: payload.fullName.trim(),
          username: payload.username.trim().toLowerCase(),
          account_type: payload.accountType,
          primary_university_id: payload.primaryUniversityId ?? null,
          university_name: payload.universityName ?? null,
          phone_number: payload.phoneNumber?.trim() || null,
          whatsapp_number: payload.whatsappNumber?.trim() || null,
          is_student: payload.isStudent ?? true,
        },
      },
    });
    if (error) throw error;
    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: Boolean(data.user && !data.session),
    };
  },

  async signIn(email: string, password: string) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async resendVerificationEmail(email: string) {
    const supabase = requireSupabase();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
    });
    if (error) throw error;
  },

  async sendPasswordResetEmail(email: string) {
    const supabase = requireSupabase();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      redirectTo ? { redirectTo } : undefined,
    );
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data.user;
  },
};
