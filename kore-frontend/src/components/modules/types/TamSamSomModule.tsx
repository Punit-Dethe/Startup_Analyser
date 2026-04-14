'use client'

import { useState } from 'react'
import { Module } from '@/lib/types'
import { getAccentColor } from '@/lib/theme'

interface MarketSegment {
  label: string
  value: number
  percentage: number
  description: string
  color: string
}

export default function TamSamSomModule({ module }: { module: Module }) {
  const { data } = module
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const segments = (data.segments as MarketSegment[]) || []
  const unit = (data.unit as string) || ''

  // Get theme colors
  const primaryColor = getAccentColor('primary')
  const secondaryColor = getAccentColor('secondary')
  const tertiaryColor = getAccentColor('tertiary')

  // Assign theme colors to circles (TAM=primary, SAM=secondary, SOM=tertiary)
  const circleColors = [primaryColor, secondaryColor, tertiaryColor]

  // Calculate percentages relative to TAM and apply smart minimum for visual representation
  const tam = segments[0]?.value || 1
  const segmentsWithPercentage = segments.map((seg, idx) => {
    const actualPercentage = idx === 0 ? 100 : Math.round((seg.value / tam) * 100 * 10) / 10 // One decimal place
    
    // Smart minimum sizing based on actual percentage
    // CRITICAL: Maintain visual hierarchy - TAM > SAM > SOM
    let visualPercentage: number
    if (idx === 0) {
      visualPercentage = 100 // TAM is always 100%
    } else if (idx === 1) {
      // SAM (middle circle) - minimum 20% for visibility
      visualPercentage = actualPercentage < 20 ? 20 : actualPercentage
    } else {
      // SOM (inner circle) - minimum 10% for visibility
      visualPercentage = actualPercentage < 10 ? 10 : actualPercentage
    }
    
    const isScaledUp = idx > 0 && visualPercentage > actualPercentage // Flag if we scaled it up
    
    return {
      ...seg,
      percentage: actualPercentage,
      visualPercentage: visualPercentage,
      isScaledUp: isScaledUp,
      themeColor: circleColors[idx] || seg.color
    }
  })

  // Calculate dynamic radii based on percentages (with minimum)
  const baseRadius = 90
  const radii = segmentsWithPercentage.map(seg => 
    (baseRadius * seg.visualPercentage) / 100
  )

  // Position circles at bottom, touching the circumference of outer circles
  const svgCenter = 100
  const tamCenter = { x: svgCenter, y: svgCenter }
  
  // SAM: Position so its bottom touches TAM's bottom
  // SAM's center Y = TAM's bottom - SAM's radius
  const samCenter = {
    x: svgCenter,
    y: tamCenter.y + radii[0] - radii[1]
  }
  
  // SOM: Position so its bottom touches SAM's bottom
  // SOM's center Y = SAM's bottom - SOM's radius
  const somCenter = {
    x: svgCenter,
    y: samCenter.y + radii[1] - radii[2]
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 12,
    }}>
      {/* Title */}
      {data.title && (
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--t-primary)',
            letterSpacing: '-0.2px',
          }}>
            {data.title as string}
          </div>
          {data.subtitle && (
            <div style={{
              fontSize: 11,
              color: 'var(--t-muted)',
              marginTop: 3,
            }}>
              {data.subtitle as string}
            </div>
          )}
        </div>
      )}

      {/* Main Content: Circles + Legend */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        minHeight: 0,
      }}>
        {/* Left: Concentric Circles - Larger */}
        <div style={{
          flex: '0 0 55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          aspectRatio: '1',
          maxHeight: '100%',
        }}>
          <svg
            viewBox="0 0 200 200"
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
            }}
          >
            {/* Define glow filters for each circle */}
            <defs>
              <filter id="glow-tam" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-sam" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-som" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* TAM - Outer Circle - Uses Primary Color */}
            <circle
              cx={tamCenter.x}
              cy={tamCenter.y}
              r={radii[0]}
              fill={segmentsWithPercentage[0]?.themeColor}
              opacity={hoveredIndex === 0 ? 1 : 0.95}
              stroke="#000000"
              strokeWidth="0.5"
              filter="url(#glow-tam)"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredIndex === 0 ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: `${tamCenter.x}px ${tamCenter.y}px`,
              }}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
            />

            {/* SAM - Middle Circle - Uses Secondary Color */}
            {segmentsWithPercentage[1] && (
              <circle
                cx={samCenter.x}
                cy={samCenter.y}
                r={radii[1]}
                fill={segmentsWithPercentage[1].themeColor}
                opacity={hoveredIndex === 1 ? 1 : 0.95}
                stroke="#000000"
                strokeWidth="0.5"
                filter="url(#glow-sam)"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredIndex === 1 ? 'scale(1.03)' : 'scale(1)',
                  transformOrigin: `${samCenter.x}px ${samCenter.y}px`,
                }}
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )}

            {/* SOM - Inner Circle - Uses Tertiary Color */}
            {segmentsWithPercentage[2] && (
              <circle
                cx={somCenter.x}
                cy={somCenter.y}
                r={radii[2]}
                fill={segmentsWithPercentage[2].themeColor}
                opacity={hoveredIndex === 2 ? 1 : 0.95}
                stroke="#000000"
                strokeWidth="0.5"
                filter="url(#glow-som)"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredIndex === 2 ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: `${somCenter.x}px ${somCenter.y}px`,
                }}
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )}
          </svg>
        </div>

        {/* Right: Legend with Details - Compact */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minHeight: 0,
          overflow: 'auto',
        }}>
          {segmentsWithPercentage.map((seg, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                background: hoveredIndex === idx ? 'var(--page-bg)' : 'transparent',
                borderRadius: 8,
                border: `1px solid ${hoveredIndex === idx ? seg.color + '40' : 'var(--border)'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Header: Label + Percentage */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: seg.themeColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {seg.label}
                </div>
                <div style={{
                  color: seg.themeColor,
                  fontSize: 14,
                  fontWeight: 800,
                }}>
                  {seg.percentage < 1 ? seg.percentage.toFixed(1) : Math.round(seg.percentage)}%
                </div>
              </div>

              {/* Value */}
              <div style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--t-primary)',
                letterSpacing: '-0.5px',
                marginBottom: 5,
              }}>
                {seg.value.toLocaleString()}{unit}
              </div>

              {/* Description */}
              <div style={{
                fontSize: 10,
                color: 'var(--t-secondary)',
                lineHeight: 1.4,
              }}>
                {seg.description}
                {seg.isScaledUp && (
                  <span style={{ 
                    display: 'block', 
                    marginTop: 4, 
                    fontSize: 9, 
                    fontStyle: 'italic',
                    color: 'var(--t-hint)' 
                  }}>
                    * Visual size scaled up for visibility
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
