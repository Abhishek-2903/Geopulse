// File: lib/supabase.js
// Use the auth helpers approach to stay consistent with _app.js

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create the client using auth helpers for consistency
export const supabase = createPagesBrowserClient();

// Database helper functions remain the same
export const dbHelpers = {
  async logMapGeneration(userId, bounds, zoomLevels, tileSource, fileSize) {
    try {
      const { data, error } = await supabase.from("map_generations").insert({
        user_id: userId,
        bounds: bounds,
        min_zoom: zoomLevels.min,
        max_zoom: zoomLevels.max,
        tile_source: tileSource,
        file_size_mb: fileSize,
        generated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error logging map generation:", error);
      return null;
    }
  },

  async getUserGenerations(userId) {
    try {
      const { data, error } = await supabase
        .from("map_generations")
        .select("*")
        .eq("user_id", userId)
        .order("generated_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user generations:", error);
      return [];
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase.from("user_profiles").upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  async getUsageStats(userId) {
    try {
      const { data, error } = await supabase
        .from("map_generations")
        .select("file_size_mb, generated_at")
        .eq("user_id", userId);

      if (error) throw error;

      const totalMaps = data.length;
      const totalSize = data.reduce(
        (sum, gen) => sum + (gen.file_size_mb || 0),
        0
      );
      const thisMonth = data.filter((gen) => {
        const genDate = new Date(gen.generated_at);
        const now = new Date();
        return (
          genDate.getMonth() === now.getMonth() &&
          genDate.getFullYear() === now.getFullYear()
        );
      }).length;

      return {
        totalMaps,
        totalSize: totalSize.toFixed(2),
        thisMonth,
      };
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      return { totalMaps: 0, totalSize: 0, thisMonth: 0 };
    }
  },

  async getUserDownloadStats(userId) {
    try {
      // First check if user has active subscription
      const isSubscribed = await this.isUserSubscribed(userId);

      if (isSubscribed) {
        return {
          downloads_remaining: "unlimited",
          total_downloads: 0,
          is_first_time_user: false,
          is_subscribed: true,
        };
      }

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("downloads_remaining, total_downloads, is_first_time_user")
        .eq("user_id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      // If no profile exists, create one for first-time user
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: userId,
            downloads_remaining: 1, // First download free
            total_downloads: 0,
            is_first_time_user: true,
          })
          .select()
          .single();

        if (createError) {
          console.error("Profile creation error:", createError);
          throw createError;
        }
        return { ...newProfile, is_subscribed: false };
      }

      return { ...profile, is_subscribed: false };
    } catch (error) {
      console.error("Error fetching download stats:", error);
      return {
        downloads_remaining: 1,
        total_downloads: 0,
        is_first_time_user: true,
        is_subscribed: false,
      };
    }
  },

  async deductDownload(userId) {
    try {
      const { data, error } = await supabase.rpc("deduct_user_download", {
        user_id_param: userId,
      });

      if (error) {
        console.error("Deduct download error:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error deducting download:", error);
      return false;
    }
  },

  async addDownloads(userId, count = 100) {
    try {
      const { data, error } = await supabase.rpc("add_user_downloads", {
        user_id_param: userId,
        download_count: count,
      });

      if (error) {
        console.error("Add downloads error:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error adding downloads:", error);
      return false;
    }
  },

  async createPaymentRecord(userId, amount, currency, razorpayOrderId) {
    try {
      const { data, error } = await supabase
        .from("payments")
        .insert({
          user_id: userId,
          amount: amount,
          currency: currency,
          razorpay_order_id: razorpayOrderId,
          status: "pending",
          downloads_purchased: 100,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating payment record:", error);
      return null;
    }
  },

  async updatePaymentStatus(razorpayOrderId, status, razorpayPaymentId = null) {
    try {
      const updateData = {
        status: status,
        updated_at: new Date().toISOString(),
      };

      if (razorpayPaymentId) {
        updateData.razorpay_payment_id = razorpayPaymentId;
      }

      const { data, error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("razorpay_order_id", razorpayOrderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      return null;
    }
  },

  async createInvoiceRecord(userId, paymentId, invoiceData) {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert({
          user_id: userId,
          payment_id: paymentId,
          invoice_number: invoiceData.invoiceNumber,
          amount: invoiceData.amount,
          currency: invoiceData.currency,
          status: "generated",
          invoice_data: invoiceData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating invoice record:", error);
      return null;
    }
  },

  async getUserInvoices(userId) {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user invoices:", error);
      return [];
    }
  },

  // Subscription helper functions
  async createSubscription(userId, subscriptionData) {
    try {
      // Use service role client for subscription operations
      const { createClient } = await import("@supabase/supabase-js");
      const serviceClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { data, error } = await serviceClient
        .from("subscriptions")
        .insert({
          user_id: userId,
          razorpay_subscription_id: subscriptionData.razorpay_subscription_id,
          plan_id: subscriptionData.plan_id,
          status: subscriptionData.status,
          current_start: subscriptionData.current_start,
          current_end: subscriptionData.current_end,
          charge_at: subscriptionData.charge_at,
          subscription_data: subscriptionData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      return null;
    }
  },

  async updateSubscription(razorpaySubscriptionId, updates) {
    try {
      // Use service role client for subscription operations
      const { createClient } = await import("@supabase/supabase-js");
      const serviceClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { data, error } = await serviceClient
        .from("subscriptions")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_subscription_id", razorpaySubscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      return null;
    }
  },

  async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["active", "authenticated", "created"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      return null;
    }
  },

  async isUserSubscribed(userId) {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return false;

      // Check if subscription is in valid status
      const validStatuses = ["active", "authenticated"];
      if (!validStatuses.includes(subscription.status)) return false;

      // Check if subscription is not expired (if current_end exists)
      if (subscription.current_end) {
        const now = new Date();
        const currentEnd = new Date(subscription.current_end);
        return currentEnd > now;
      }

      // If no end date, consider it active
      return true;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  },
};
