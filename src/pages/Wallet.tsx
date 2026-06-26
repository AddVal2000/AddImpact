import { getTheme } from '../lib/theme';
import BottomNav from '../components/BottomNav';

export default function Wallet() {
  const theme = getTheme();
  const isDark = theme.mode === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? '#0A0A0A' : '#F7F7F7',
        color: theme.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 72,
      }}
    >
      <p style={{ fontSize: 18, color: theme.textSecondary }}>Coming soon</p>
      <BottomNav theme={theme} />
    </div>
  );
}
