'use client'

import { Module, KpiMetric } from '@/lib/types'
import { getAccentColor, getLightAccentColor } from '@/lib/theme'

export default function DualKpiModule({ module }: { module: Module }) {
  const { data } = module
  const kpis: KpiMetric[] = (data.kpis as KpiMetric[]) || []

  // Ensure we at least have two slots even if data is missing, for layout integrity
  const leftKpi = kpis[0]
  const rightKpi = kpis[1]

  const renderSparkline = (sparkline?: number[], childAccent?: string) => {
    if (!sparkline || sparkline.length < 2) return null
    const max = Math.max(...sparkline, 1)
    const childColor = getAccentColor(childAccent)

    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28, flexShrink: 0 }}>
        {sparkline.map((val, i) => {
          const h      = Math.max((val / max) * 100, 10)
          const isLast = i === sparkline.length - 1
          const opacity = 0.15 + (i / (sparkline.length - 1)) * 0.55
          return (
            <div key={i} style={{
              width: 5,
              height: `${h}%`,
              background: childColor,
              opacity: isLast ? 1 : opacity,
              borderRadius: '2px 2px 0 0',
              transition: 'height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }} />
          )
        })}
      </div>
    )
  }

  const renderKpi = (kpi?: KpiMetric) => {
    if (!kpi) return <div style={{ flex: 1 }} /> // empty placeholder space

    const accentCode = getAccentColor(kpi.accent || module.accent)
    const isUp   = kpi.direction === 'up'
    const isDown = kpi.direction === 'down'

    const deltaColor = isUp ? '#16A34A' : isDown ? '#DC2626' : '#9B9B97'
    const deltaBg    = isUp ? '#DCFCE7' : isDown ? '#FEE2E2' : '#F3F4F6'
    const arrow      = isUp ? '↗' : isDown ? '↘' : '→'

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6, flex: 1 }}>
        {/* ── Metric label ── */}
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: accentCode,
        }}>
          {kpi.title}
        </div>

        {/* ── Big number ── */}
        <div style={{
          fontSize: 'clamp(20px, 4cqw, 36px)',
          fontWeight: 800,
          color: 'var(--t-primary)',
          letterSpacing: '-1.5px',
          lineHeight: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}>
          {kpi.value}
        </div>

        {/* ── Bottom row ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 8,
        }}>
          {/* Delta badge */}
          {kpi.delta && (
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: deltaColor,
              background: deltaBg,
              padding: '3px 7px',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 3,
              flexShrink: 0,
            }}>
              {arrow} {kpi.delta}
            </div>
          )}

          {/* Sparkline bars */}
          {renderSparkline(kpi.sparkline, kpi.accent || module.accent)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* ── Outer Hero Label ── */}
      {data.title && (
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: getAccentColor(module.accent),
          textTransform: 'uppercase', letterSpacing: '0.15em',
          paddingBottom: 4,
          borderBottom: '1px solid var(--border)',
        }}>
          {data.title as string}
        </div>
      )}

      {/* ── Split Layout ── */}
      <div style={{ 
        display: 'flex', flexDirection: 'row', height: '100%', width: '100%', gap: 16,
      }}>
        {renderKpi(leftKpi)}
        {/* Subtle Divider */}
        <div style={{ width: 1, background: 'var(--border)', margin: '4px 0' }} />
        {renderKpi(rightKpi)}
      </div>
    </div>
  )
}
