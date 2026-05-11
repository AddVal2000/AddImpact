import { useNavigate } from 'react-router-dom';
import { type Theme, isImpalaTheme } from '../lib/theme';
import { calculateMiles } from '../lib/miles';

interface HeroCardProps {
  theme: Theme;
}

export default function HeroCard({ theme }: HeroCardProps) {
  const navigate = useNavigate();
  const price = 50;
  const miles = calculateMiles(price);

  const impala = isImpalaTheme(theme);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {impala && (
        <div
          style={{
            height: 3,
            width: '100%',
            background:
              'repeating-linear-gradient(90deg, #D41E28 0px, #D41E28 4px, #fff 4px, #fff 12px)',
          }}
        />
      )}
      <div
        style={{
          background: theme.primary,
          padding: 20,
        }}
      >
        <div
          style={{
            fontSize: 10,
            opacity: 0.75,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: '#FFFFFF',
          }}
        >
          TODAY'S TOP-UP
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1,
            marginTop: 8,
          }}
        >
          KES {price}
        </div>
        <div
          style={{
            fontSize: 13,
            color: '#FFFFFF',
            opacity: 0.85,
            marginTop: 4,
          }}
        >
          50MB Daily Bundle &middot; 24hrs
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.25)',
            marginTop: 12,
            paddingTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: '#FFFFFF',
              opacity: 0.9,
            }}
          >
            KES 2.50 goes to {theme.communityName} with every purchase
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#FFFFFF',
              opacity: 0.9,
              marginTop: 4,
            }}
          >
            +{miles} AddVal Mile{miles !== 1 ? 's' : ''} with this purchase
          </div>
        </div>
        <button
          onClick={() => navigate('/purchase/SKU-D050')}
          style={{
            width: '100%',
            marginTop: 16,
            background: '#FFFFFF',
            color: theme.primary,
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            borderRadius: 8,
            padding: 13,
            cursor: 'pointer',
          }}
        >
          {theme.ctaVerb} the {theme.communityName} — Buy Now
        </button>
      </div>
    </div>
  );
}
