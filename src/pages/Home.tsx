import { useState, useEffect } from 'react';
import { getTheme, type Theme } from '../lib/theme';
import { supabase } from '../lib/supabase';
import HeroCard from '../components/HeroCard';
import SkuList from '../components/SkuList';
import CommunityStats from '../components/CommunityStats';
import BottomNav from '../components/BottomNav';

interface Sku {
  sku_code: string;
  type: string;
  label: string;
  price_kes: number;
  value: number;
  value_unit: string;
  ttl_hours: number;
}

export default function Home() {
  const theme: Theme = getTheme();
  const [skus, setSkus] = useState<Sku[]>([]);

  useEffect(() => {
    async function fetchSkus() {
      const { data } = await supabase
        .from('skus')
        .select('*')
        .eq('active', true)
        .eq('is_hero', false)
        .order('price_kes', { ascending: true });
      if (data) setSkus(data as Sku[]);
    }
    fetchSkus();
  }, []);

  const isDark = theme.mode === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#0A0A0A' : '#F7F7F7',
        color: theme.textPrimary,
        paddingBottom: 72,
      }}
    >
      <div style={{ padding: '16px 16px 0' }}>
        <HeroCard theme={theme} />
        <div style={{ marginTop: 20 }}>
          <SkuList theme={theme} skus={skus} />
        </div>
        <div style={{ marginTop: 20 }}>
          <CommunityStats theme={theme} />
        </div>
      </div>
      <BottomNav theme={theme} />
    </div>
  );
}
