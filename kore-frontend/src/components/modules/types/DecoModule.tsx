'use client'

import { Module } from '@/lib/types'
import { getAccentColor, getLightAccentColor, getChartPalette } from '@/lib/theme'

interface DecoMetric {
  label: string
  value: string
  delta?: string
  sub?: string
}

interface TimelinePoint {
  year: string
  event: string
}

export default function DecoModule({ module, variant }: { module: Module; variant: string }) {
  switch (variant) {
    case 'timeline': return <TimelineVariant module={module} />
    case 'gradient': return <GradientVariant module={module} />
    case 'pulse': return <PulseVariant module={module} />
    default: return <StatsVariant module={module} />   // 'stats'
  }
}

function StatsVariant({ module }: { module: Module }) {
  const { data } = module
  const metrics = (data.metrics as DecoMetric[]) || []

  const primary    = getAccentColor('primary')
  const secondary  = getAccentColor('secondary')
  const tertiary   = getAccentColor('tertiary')
  const quaternary = getAccentColor('quaternary')

  // Metric values cycle: secondary → tertiary → quaternary → primary → secondary → ...
  const cycle = [secondary, tertiary, quaternary, primary]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
      {data.title && (
        <div style={{
          fontSize: 9, fontWeight: 700, color: primary,
          textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0,
        }}>
          {data.title as string}
        </div>
      )}
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 0 }}>
        {metrics.map((m, i) => {
          const metricColor = cycle[i % cycle.length]
          return (
            <div key={i} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', gap: 3,
              padding: '0 10px',
              borderRight: i < metrics.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: 'clamp(14px, 2.5cqw, 22px)',
                fontWeight: 800, color: metricColor,
                letterSpacing: '-0.8px', lineHeight: 1,
              }}>
                {m.value}
              </div>
              <div style={{ fontSize: 9, color: 'var(--t-muted)', letterSpacing: '0.02em', lineHeight: 1.3 }}>
                {m.label}
              </div>
              {m.delta && (
                <div style={{
                  fontSize: 9, fontWeight: 600,
                  color: m.delta.startsWith('+') ? '#16A34A' : m.delta.startsWith('-') ? '#DC2626' : 'var(--t-muted)',
                  background: m.delta.startsWith('+') ? '#DCFCE7' : m.delta.startsWith('-') ? '#FEE2E2' : '#F3F4F6',
                  padding: '1px 5px', borderRadius: 3,
                }}>
                  {m.delta}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineVariant({ module }: { module: Module }) {
  const { data } = module
  const points = (data.points as TimelinePoint[]) || []

  const primary    = getAccentColor('primary')
  const secondary  = getAccentColor('secondary')
  const tertiary   = getAccentColor('tertiary')
  const quaternary = getAccentColor('quaternary')

  const pool = [secondary, tertiary, quaternary]

  function nodeColor(i: number, isLast: boolean): string {
    if (isLast) return primary
    return pool[i % pool.length]
  }

  // Compute a solid, fully-opaque light tint by blending the color 85% toward white
  function lightenHex(hex: string, amount = 0.85): string {
    const h = hex.replace('#', '')
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    const lr = Math.round(r + (255 - r) * amount)
    const lg = Math.round(g + (255 - g) * amount)
    const lb = Math.round(b + (255 - b) * amount)
    return `rgb(${lr}, ${lg}, ${lb})`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      {data.title && (
        <div style={{
          fontSize: 9, fontWeight: 700, color: primary,
          textTransform: 'uppercase', letterSpacing: '0.10em', flexShrink: 0,
        }}>
          {data.title as string}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Connector line */}
        <div style={{
          position: 'absolute', left: '1%', right: '1%', top: '50%',
          height: 2.5, transform: 'translateY(-50%)',
          background: `linear-gradient(90deg, ${secondary}60 0%, ${tertiary}60 33%, ${quaternary}60 66%, ${primary}80 100%)`,
          borderRadius: 2,
        }} />

        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
          {points.map((p, i) => {
            const isAbove = i % 2 === 0
            const isLast  = i === points.length - 1
            const c       = nodeColor(i, isLast)
            const lightBg = lightenHex(c, 0.82) // solid pale tint, no transparency

            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                position: 'relative', zIndex: 1, gap: 0,
              }}>
                {/* Top label */}
                <div style={{
                  visibility: isAbove ? 'visible' : 'hidden',
                  textAlign: 'center', maxWidth: 100, marginBottom: 8,
                }}>
                  <div style={{
                    fontSize: 11, lineHeight: 1.3, color: 'var(--t-secondary)',
                    fontWeight: isLast ? 700 : 500,
                  }}>
                    {p.event}
                  </div>
                </div>

                {/* Year pill badge — solid tinted background, no transparency */}
                <div style={{
                  background: isLast ? c : lightBg,
                  color: isLast ? '#fff' : c,
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '5px 12px',
                  borderRadius: 20,
                  letterSpacing: '0.04em',
                  border: `1.5px solid ${c}`,
                  boxShadow: isLast ? `0 2px 12px ${c}55` : `0 1px 6px ${c}33`,
                  whiteSpace: 'nowrap' as const,
                  transition: 'all 0.2s ease',
                }}>
                  {p.year}
                </div>

                {/* Bottom label (odd index) */}
                <div style={{
                  visibility: !isAbove ? 'visible' : 'hidden',
                  textAlign: 'center', maxWidth: 90, marginTop: 6,
                }}>
                  <div style={{
                    fontSize: 10, lineHeight: 1.3, color: 'var(--t-secondary)',
                    fontWeight: isLast ? 700 : 500,
                  }}>
                    {p.event}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function GradientVariant({ module }: { module: Module }) {
  const { data, accent } = module
  const color = getAccentColor(accent)
  const lightBg = getLightAccentColor(accent)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', gap: 4,
      background: `linear-gradient(135deg, ${lightBg} 0%, #FFFFFF 60%)`,
      margin: '-11px -13px', padding: '11px 13px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          boxShadow: `0 0 0 3px ${color}22`,
        }} />
        <div style={{
          fontSize: 9, fontWeight: 700, color,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {data.title as string}
        </div>
      </div>
      <div style={{
        fontSize: 'clamp(16px, 3.5cqw, 28px)',
        fontWeight: 800, color: 'var(--t-primary)',
        letterSpacing: '-0.8px', lineHeight: 1.05,
        flex: 1, display: 'flex', alignItems: 'center',
      }}>
        {data.value as string}
      </div>
      <div className="footer-stats" style={{ fontSize: 10, color: 'var(--t-muted)', lineHeight: 1.4 }}>
        {data.subtitle as string}
      </div>
    </div>
  )
}

function PulseVariant({ module }: { module: Module }) {
  const { data, accent } = module
  const color = getAccentColor(accent)
  const lightBg = getLightAccentColor(accent)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', gap: 8,
      alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(circle at 50% 40%, ${lightBg} 0%, #FFFFFF 70%)`,
      margin: '-11px -13px', padding: '11px 13px',
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `${color}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t-primary)', letterSpacing: '-0.8px', lineHeight: 1 }}>
          {data.value as string}
        </div>
        <div style={{ fontSize: 10, color: 'var(--t-muted)', marginTop: 4 }}>
          {data.title as string}
        </div>
      </div>
      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.8; }
          50%  { transform: scale(1.15); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
