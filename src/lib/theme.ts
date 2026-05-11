export interface Theme {
  primary: string;
  accent: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  mode: 'light' | 'dark';
  communityName: string;
  teamLine: string;
  milesCurrency: string;
  ctaVerb: string;
}

const impalaVetTheme: Theme = {
  primary: '#000000',
  accent: '#D41E28',
  surface: '#111111',
  textPrimary: '#FFFFFF',
  textSecondary: '#9A9A9A',
  mode: 'dark',
  communityName: 'Impala RFC',
  teamLine: 'The Gazelles \u00b7 Roans \u00b7 Swara',
  milesCurrency: 'AddVal Miles',
  ctaVerb: 'Back',
};

const impalaDefaultTheme: Theme = {
  primary: '#D41E28',
  accent: '#000000',
  surface: '#FFF8F8',
  textPrimary: '#0D0D0D',
  textSecondary: '#6B6B6B',
  mode: 'light',
  communityName: 'Impala RFC',
  teamLine: 'The Gazelles \u00b7 Roans \u00b7 Swara',
  milesCurrency: 'AddVal Miles',
  ctaVerb: 'Back',
};

const soulSistersTheme: Theme = {
  primary: '#6C3483',
  accent: '#B7860C',
  surface: '#FAF7FD',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  mode: 'light',
  communityName: 'Soul Sisters Nairobi',
  teamLine: 'Learn \u00b7 Laugh \u00b7 Grow',
  milesCurrency: 'AddVal Miles',
  ctaVerb: 'Support',
};

const defaultTheme: Theme = impalaDefaultTheme;

export function getTheme(): Theme {
  const slug = localStorage.getItem('community_slug') || '';
  const profileType = localStorage.getItem('profile_type') || '';

  if (slug === 'impala-rfc' && profileType === 'vet') {
    return impalaVetTheme;
  }
  if (slug === 'impala-rfc') {
    return impalaDefaultTheme;
  }
  if (slug === 'soul-sisters') {
    return soulSistersTheme;
  }
  return defaultTheme;
}

export function isImpalaTheme(theme: Theme): boolean {
  return theme.communityName === 'Impala RFC';
}
