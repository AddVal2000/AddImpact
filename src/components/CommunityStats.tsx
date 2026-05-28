import { useState, useEffect } from 'react';
import { type Theme } from '../lib/theme';
import { supabase } from '../lib/supabase';

interface CommunityStatsProps {
  theme: Theme;
}

interface Community {
  miles_balance: number;
  raised_kes: number;
  goal_kes: number;
  goal_label: string;
}

export default function CommunityStats({ theme }: CommunityStatsProps) {
  const slug = localStorage.getItem('community_slug') || '';
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    async function fetchCommunity() {
      const { data } = await supabase
        .from('communities')
        .select('miles_balance, raised_kes, goal_kes, goal_label')
        .eq('slug', slug)
        .maybeSingle();
      if (data) setCommunity(data as Community);
    }
    fetchCommunity();
  }, [slug]);

  if (!community) return null;

  const progress = Math.min((Number(community.raised_kes) / Number(community.goal_kes)) * 100, 100);

  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, color: theme.textPrimary }}>Your Miles</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>
          {community.miles_balance} {theme.milesCurrency}
        </span>
      </div>
      <div
        style={{
          borderTop: '1px solid #E5E5E5',
          margin: '10px 0',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, color: theme.textPrimary }}>
          {theme.communityName} raised
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.primary }}>
          KES {Number(community.raised_kes).toLocaleString()}
        </span>
      </div>
      <div
        style={{
          marginTop: 10,
          height: 4,
          borderRadius: 2,
          background: '#F3F3F3',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 2,
            background: theme.primary,
            width: `${progress}%`,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
      <div
        style={{
          textAlign: 'right',
          fontSize: 9,
          color: theme.textSecondary,
          marginTop: 6,
        }}
      >
        Goal: KES {Number(community.goal_kes).toLocaleString()} &middot; {community.goal_label}
      </div>
    </div>
  );
}
