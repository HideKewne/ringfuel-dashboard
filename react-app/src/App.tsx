import { useState } from 'react';
import DashboardV1 from './DashboardV1.tsx';
import DashboardV2 from './DashboardV2.tsx';

function App() {
  const [variant, setVariant] = useState<'v1' | 'v2'>('v1');

  return (
    <>
      {/* Variant Switcher */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        display: 'flex',
        gap: '4px',
        padding: '4px',
        background: 'rgba(15, 19, 32, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid rgba(41, 182, 168, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <button
          onClick={() => setVariant('v1')}
          style={{
            padding: '8px 20px',
            border: 'none',
            borderRadius: '8px',
            background: variant === 'v1' ? '#29B6A8' : 'transparent',
            color: variant === 'v1' ? 'white' : 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
          }}
        >
          V1 Center
        </button>
        <button
          onClick={() => setVariant('v2')}
          style={{
            padding: '8px 20px',
            border: 'none',
            borderRadius: '8px',
            background: variant === 'v2' ? '#29B6A8' : 'transparent',
            color: variant === 'v2' ? 'white' : 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
          }}
        >
          V2 Asymmetric
        </button>
      </div>

      {/* Render active variant */}
      {variant === 'v1' ? <DashboardV1 /> : <DashboardV2 />}
    </>
  );
}

export default App;
