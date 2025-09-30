import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const UsageStats = ({ user }) => {
  const [stats, setStats] = useState({
    total_generations: 0,
    total_size_mb: 0,
    total_tiles: 0,
    this_month_count: 0,
    this_week_count: 0,
    last_generation: null
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_usage_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setStats(data || {
          total_generations: 0,
          total_size_mb: 0,
          total_tiles: 0,
          this_month_count: 0,
          this_week_count: 0,
          last_generation: null
        });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, supabase]);

  if (loading) {
    return (
      <div style={{
        padding: '15px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        textAlign: 'center',
        fontSize: '14px',
        opacity: 0.7
      }}>
        Loading usage stats...
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      marginBottom: '25px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '15px'
      }}>
        Usage Statistics
      </h3>
      <div style={{
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <div>Total Generations: {stats.total_generations}</div>
        <div>Total Tiles Generated: {stats.total_tiles.toLocaleString()}</div>
        <div>Total Size: {stats.total_size_mb.toFixed(2)} MB</div>
        <div>Generations This Month: {stats.this_month_count}</div>
        <div>Generations This Week: {stats.this_week_count}</div>
        {stats.last_generation && (
          <div>Last Generation: {new Date(stats.last_generation).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
};

export default UsageStats;