import { useNavigate, useLocation } from 'react-router-dom';
import { Hop as Home, Award, User } from 'lucide-react';
import { Rugby } from './Rugby';
import { type Theme } from '../lib/theme';

interface BottomNavProps {
  theme: Theme;
}

const tabs = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Award, label: 'My Miles', path: '/wallet' },
  { icon: Rugby, label: 'Community', path: '/community' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function BottomNav({ theme }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: theme.mode === 'dark' ? '#111111' : '#FFFFFF',
        borderTop: '1px solid #E5E5E5',
        zIndex: 1000,
      }}
    >
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        const Icon = tab.icon;
        const isRugby = tab.label === 'Community';
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: active ? theme.primary : theme.textSecondary,
              fontSize: 10,
              gap: 2,
            }}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.2 : 1.5}
              style={isRugby ? { transform: 'rotate(45deg)' } : undefined}
            />
            <span style={{ fontWeight: active ? 600 : 400 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
