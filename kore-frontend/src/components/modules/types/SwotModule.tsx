import { Module } from '@/lib/types'

export default function SwotModule({ module }: { module: Module }) {
  const { data } = module
  const strengths = (data.strengths as string[]) || []
  const weaknesses = (data.weaknesses as string[]) || []
  const opportunities = (data.opportunities as string[]) || []
  const threats = (data.threats as string[]) || []

  const Section = ({ 
    title, 
    items, 
    iconColor,
    iconPath,
    bgColor
  }: { 
    title: string
    items: string[]
    iconColor: string
    iconPath: string
    bgColor: string
  }) => (
    <div style={{
      background: bgColor,
      borderRadius: 12,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 0,
    }}>
      {/* Icon and Title - Stacked, Left Aligned */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        {/* Icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
        
        {/* Title */}
        <div style={{
          fontSize: 16,
          fontWeight: 800,
          color: iconColor,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {title}
        </div>
      </div>

      {/* Items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflow: 'auto',
        flex: 1,
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 13,
              color: 'var(--t-primary)',
              lineHeight: 1.6,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: iconColor,
              flexShrink: 0,
              marginTop: 7,
            }} />
            <span style={{ flex: 1 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 16,
    }}>
      {/* Title */}
      {data.title && (
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--t-primary)',
          letterSpacing: '-0.3px',
          textAlign: 'center',
        }}>
          {data.title as string}
        </div>
      )}

      {/* 2x2 Grid */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 12,
      }}>
        {/* Top Left - Strengths */}
        <Section
          title="Strengths"
          items={strengths}
          iconColor="#22C55E"
          iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          bgColor="#F5F5F5"
        />

        {/* Top Right - Weaknesses */}
        <Section
          title="Weaknesses"
          items={weaknesses}
          iconColor="#F59E0B"
          iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          bgColor="#F5F5F5"
        />

        {/* Bottom Left - Opportunities */}
        <Section
          title="Opportunities"
          items={opportunities}
          iconColor="#3B82F6"
          iconPath="M13 10V3L4 14h7v7l9-11h-7z"
          bgColor="#F5F5F5"
        />

        {/* Bottom Right - Threats */}
        <Section
          title="Threats"
          items={threats}
          iconColor="#EF4444"
          iconPath="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
          bgColor="#F5F5F5"
        />
      </div>
    </div>
  )
}
