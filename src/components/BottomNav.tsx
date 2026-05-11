import { useNavigate, useLocation } from 'react-router-dom';
import { type Theme } from '../lib/theme';

interface BottomNavProps {
  theme: Theme;
}

const tabs = [
  { icon: '\uD83C\uDFE0', label: 'Home', path: '/home' },
  { icon: '\uD83D\uDC2C', label: 'Wallet', path: '/wallet' },
  { icon: '\uD83C\uDFC9', label: 'Community', path: '/community' },
  { icon: '\uD83D\uDC64', label: 'Profile', path: '/profile' },
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
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontWeight: active ? 600 : 400 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
