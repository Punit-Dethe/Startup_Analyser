'use client'

import { Module } from '@/lib/types'
import { getAccentColor } from '@/lib/theme'

export default function KpiModule({ module }: { module: Module }) {
  const { data, accent } = module
  const color = getAccentColor(accent)
  const sparkline = (data.sparkline as number[]) || [30, 45, 38, 60, 75, 82, 100]
  const max       = Math.max(...sparkline, 1)

  const isUp   = data.direction === 'up'
  const isDown = data.direction === 'down'

  const deltaColor = isUp ? '#16A34A' : isDown ? '#DC2626' : '#9B9B97'
  const deltaBg    = isUp ? '#DCFCE7' : isDown ? '#FEE2E2' : '#F3F4F6'
  const arrow      = isUp ? '↗' : isDown ? '↘' : '→'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>

      {/* ── Metric label ── */}
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color,
      }}>
        {data.title as string}
      </div>

      {/* ── Big number ── */}
      <div style={{
        fontSize: 'clamp(22px, 5cqw, 40px)',
        fontWeight: 800,
        color: 'var(--t-primary)',
        letterSpacing: '-1.5px',
        lineHeight: 1,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      }}>
        {data.value as string}
      </div>

      {/* ── Bottom row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        {/* Delta badge */}
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: deltaColor,
          background: deltaBg,
          padding: '3px 7px',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 3,
          flexShrink: 0,
        }}>
          {arrow} {data.delta as string}
        </div>

        {/* Sparkline bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28, flexShrink: 0 }}>
          {sparkline.map((val, i) => {
            const h      = Math.max((val / max) * 100, 10)
            const isLast = i === sparkline.length - 1
            const opacity = 0.15 + (i / (sparkline.length - 1)) * 0.55
            return (
              <div key={i} style={{
                width: 7,
                height: `${h}%`,
                background: isLast ? color : color,
                opacity: isLast ? 1 : opacity,
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
