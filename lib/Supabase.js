// File: lib/supabase.js
// Use the auth helpers approach to stay consistent with _app.js

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the client using auth helpers for consistency
export const supabase = createPagesBrowserClient();

// Database helper functions remain the same
export const dbHelpers = {
  async logMapGeneration(userId, bounds, zoomLevels, tileSource, fileSize) {
    try {
      const { data, error } = await supabase
        .from('map_generations')
        .insert({
          user_id: userId,
          bounds: bounds,
          min_zoom: zoomLevels.min,
          max_zoom: zoomLevels.max,
          tile_source: tileSource,
          file_size_mb: fileSize,
          generated_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging map generation:', error);
      return null;
    }
  },

  async getUserGenerations(userId) {
    try {
      const { data, error } = await supabase
        .from('map_generations')
        .select('*')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user generations:', error);
      return [];
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  async getUsageStats(userId) {
    try {
      const { data, error } = await supabase
        .from('map_generations')
        .select('file_size_mb, generated_at')
        .eq('user_id', userId);

      if (error) throw error;

      const totalMaps = data.length;
      const totalSize = data.reduce((sum, gen) => sum + (gen.file_size_mb || 0), 0);
      const thisMonth = data.filter(gen => {
        const genDate = new Date(gen.generated_at);
        const now = new Date();
        return genDate.getMonth() === now.getMonth() && genDate.getFullYear() === now.getFullYear();
      }).length;

      return {
        totalMaps,
        totalSize: totalSize.toFixed(2),
        thisMonth
      };
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return { totalMaps: 0, totalSize: 0, thisMonth: 0 };
    }
  }
};