'use client'

import { useState } from 'react'
import { Module } from '@/lib/types'

interface Competitor {
  name: string
  x: number // 0-100 scale
  y: number // 0-100 scale
  size: number // Bubble size (market share, revenue, etc.)
  color: string
  description?: string
}

export default function CompetitiveMatrixModule({ module }: { module: Module }) {
  const { data } = module
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const competitors = (data.competitors as Competitor[]) || []
  const xAxisLabel = (data.xAxisLabel as string) || 'X Axis'
  const yAxisLabel = (data.yAxisLabel as string) || 'Y Axis'
  const sizeLabel = (data.sizeLabel as string) || 'Size'

  // Calculate bubble radius based on size (normalized)
  const maxSize = Math.max(...competitors.map(c => c.size), 1)
  const minRadius = 20
  const maxRadius = 60

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

      {/* Main Content: Matrix + Legend */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 20,
        minHeight: 0,
      }}>
        {/* Left: Matrix Chart */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: 12,
          minHeight: 0,
        }}>
          {/* Y Axis Label - Rotated, Left of Matrix */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--t-secondary)',
            whiteSpace: 'nowrap',
          }}>
            {yAxisLabel}
          </div>

          {/* Chart Container */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}>
            {/* Chart Area */}
            <div style={{
              flex: 1,
              position: 'relative',
              background: '#FAFAFA',
              borderRadius: 8,
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}>
              {/* Grid Lines */}
              <svg
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                {/* Vertical grid lines */}
                {[25, 50, 75].map(x => (
                  <line
                    key={`v-${x}`}
                    x1={`${x}%`}
                    y1="0"
                    x2={`${x}%`}
                    y2="100%"
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
                {/* Horizontal grid lines */}
                {[25, 50, 75].map(y => (
                  <line
                    key={`h-${y}`}
                    x1="0"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>

              {/* Competitors as bubbles */}
              {competitors.map((comp, idx) => {
                const radius = minRadius + ((comp.size / maxSize) * (maxRadius - minRadius))
                const isHovered = hoveredIndex === idx

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${comp.x}%`,
                      bottom: `${comp.y}%`,
                      transform: 'translate(-50%, 50%)',
                      width: radius * 2,
                      height: radius * 2,
                      borderRadius: '50%',
                      background: comp.color,
                      opacity: isHovered ? 1 : 0.85,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isHovered 
                        ? `0 8px 24px ${comp.color}40` 
                        : `0 4px 12px ${comp.color}30`,
                      border: `2px solid ${isHovered ? '#FFFFFF' : 'transparent'}`,
                      zIndex: isHovered ? 10 : 1,
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Company Initial/Name */}
                    <div style={{
                      fontSize: radius > 30 ? 12 : 10,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      padding: 4,
                    }}>
                      {comp.name.substring(0, radius > 30 ? 10 : 3)}
                    </div>

                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div style={{
                        position: 'fixed',
                        transform: 'translate(-50%, -100%)',
                        marginTop: -8,
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        pointerEvents: 'none',
                      }}>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--t-primary)',
                          marginBottom: 4,
                        }}>
                          {comp.name}
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: 'var(--t-secondary)',
                          marginBottom: 2,
                        }}>
                          {xAxisLabel}: {comp.x}
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: 'var(--t-secondary)',
                          marginBottom: 2,
                        }}>
                          {yAxisLabel}: {comp.y}
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: 'var(--t-secondary)',
                        }}>
                          {sizeLabel}: {comp.size}
                        </div>
                        {comp.description && (
                          <div style={{
                            fontSize: 9,
                            color: 'var(--t-muted)',
                            marginTop: 4,
                            maxWidth: 200,
                            whiteSpace: 'normal',
                          }}>
                            {comp.description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* X Axis Label - Outside, Bottom */}
            <div style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--t-secondary)',
              marginTop: 8,
            }}>
              {xAxisLabel}
            </div>
          </div>
        </div>

        {/* Right: Legend */}
        <div style={{
          width: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--t-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Companies
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflow: 'auto',
          }}>
            {competitors.map((comp, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  background: hoveredIndex === idx ? 'var(--page-bg)' : 'transparent',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: `1px solid ${hoveredIndex === idx ? comp.color + '40' : 'transparent'}`,
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: comp.color,
                  flexShrink: 0,
                }} />
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--t-primary)',
                  flex: 1,
                }}>
                  {comp.name}
                </div>
                <div style={{
                  fontSize: 9,
                  color: 'var(--t-muted)',
                }}>
                  {comp.size}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
