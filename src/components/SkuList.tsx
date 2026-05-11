import { useNavigate } from 'react-router-dom';
import { type Theme } from '../lib/theme';

interface Sku {
  sku_code: string;
  type: string;
  label: string;
  price_kes: number;
  value: number;
  value_unit: string;
  ttl_hours: number;
}

interface SkuListProps {
  theme: Theme;
  skus: Sku[];
}

function typeIcon(type: string): string {
  switch (type) {
    case 'data':
      return '\uD83D\uDCF6';
    case 'airtime':
      return '\uD83D\uDCDE';
    case 'sms':
      return '\uD83D\uDCAC';
    default:
      return '\uD83D\uDCE6';
  }
}

function formatTTL(hours: number): string {
  if (hours < 24) return `${hours}hrs`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function SkuList({ theme, skus }: SkuListProps) {
  const navigate = useNavigate();

  if (skus.length === 0) return null;

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          color: theme.textSecondary,
          marginBottom: 8,
        }}
      >
        More top-ups
      </div>
      {skus.map((sku) => (
        <div
          key={sku.sku_code}
          onClick={() => navigate(`/purchase/${sku.sku_code}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            border: '1px solid #E5E5E5',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 8,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{typeIcon(sku.type)}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary }}>
                {sku.label}
              </div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>
                {sku.value} {sku.value_unit} &middot; {formatTTL(sku.ttl_hours)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>
              KES {sku.price_kes}
            </span>
            <span style={{ color: theme.textSecondary, fontSize: 16 }}>&rsaquo;</span>
          </div>
        </div>
      ))}
    </div>
  );
}
