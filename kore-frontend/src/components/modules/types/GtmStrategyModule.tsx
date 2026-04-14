'use client'

import { Module } from '@/lib/types'

interface GtmStep {
  title: string
  description: string
  icon: string
  color: string
  points: string[]
}

export default function GtmStrategyModule({ module }: { module: Module }) {
  const { data } = module
  const steps = (data.steps as GtmStep[]) || []

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 16,
    }}>
      {/* Title - No subtitle */}
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

      {/* Steps Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        minHeight: 0,
        overflow: 'auto',
      }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              background: '#F5F5F5',
              borderRadius: 12,
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #999999',
            }}
          >
            {/* Step Number - Bottom Right */}
            <div style={{
              position: 'absolute',
              bottom: 8,
              right: 12,
              fontSize: 56,
              fontWeight: 900,
              color: 'rgba(0,0,0,0.05)',
              lineHeight: 1,
              pointerEvents: 'none',
            }}>
              {idx + 1}
            </div>

            {/* Icon - Image from CDN */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 8,
            }}>
              <img 
                src={step.icon.replace('color=white', `color=${encodeURIComponent(step.color)}`)} 
                alt={step.title}
                style={{
                  width: 36,
                  height: 36,
                }}
              />
            </div>

            {/* Title */}
            <div style={{
              fontSize: 12,
              fontWeight: 800,
              color: step.color,
              textAlign: 'center',
              lineHeight: 1.3,
              letterSpacing: '0.02em',
              minHeight: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {step.title}
            </div>

            {/* Points */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              flex: 1,
            }}>
              {step.points.map((point, pidx) => (
                <div
                  key={pidx}
                  style={{
                    fontSize: 11,
                    color: 'var(--t-primary)',
                    lineHeight: 1.5,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    fontWeight: 500,
                  }}
                >
                  <div style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: step.color,
                    flexShrink: 0,
                    marginTop: 6,
                  }} />
                  <span style={{ flex: 1 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
