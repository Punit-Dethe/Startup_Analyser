'use client'

import { useEffect, useRef } from 'react'
import { Module } from '@/lib/types'
import * as echarts from 'echarts'
import { getAccentColor } from '@/lib/theme'

export default function GaugeModule({ module }: { module: Module }) {
  const ref  = useRef<HTMLDivElement>(null)
  const inst = useRef<echarts.ECharts | null>(null)
  
  const { data, accent, size } = module
  const color  = getAccentColor(accent)
  const value  = (data.value as number) || 0
  const maxVal = (data.max   as number) || 100
  const unit   = (data.unit  as string) || ''

  const isOneByOne = size === '1x1'
  const isHorizontal = size === '2x1' || size === '3x1' || size === '4x1'

  useEffect(() => {
    if (!ref.current) return

    inst.current = echarts.init(ref.current, null, { renderer: 'canvas' })
    
    const centerOffset = isOneByOne ? ['50%', '65%'] : isHorizontal ? ['50%', '55%'] : ['50%', '55%']
    const axisWidth = isOneByOne ? 8 : 14
    const fontSize = isOneByOne ? 20 : 24

    const option: echarts.EChartsOption = {
      animation: true,
      animationDuration: 800,
      animationEasing: 'cubicOut',
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: maxVal,
          radius: '90%',
          center: centerOffset,
          pointer: { show: false }, // No needle, just a progress arc
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: color,
            }
          },
          axisLine: {
            lineStyle: {
              width: axisWidth,
              color: [[1, '#EBEBEA']], // light grey background track
            }
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          detail: {
            show: true,
            valueAnimation: true,
            formatter: `{value}${unit}`,
            fontSize: fontSize, // Scaled for density
            fontWeight: 800,
            color: '#111110', // ECharts canvas needs explicit hex, not CSS var
            offsetCenter: [0, 0], // Perfectly centered inside the gauge
            fontFamily: 'Inter, system-ui',
          },
          data: [{ value }]
        }
      ]
    }

    inst.current.setOption(option)

    const obs = new ResizeObserver(() => inst.current?.resize())
    obs.observe(ref.current)

    return () => {
      obs.disconnect()
      inst.current?.dispose()
    }
  }, [data, color, maxVal, unit, value, isHorizontal, isOneByOne])

  if (isOneByOne) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
        <div className="mod-title" style={{ 
          fontSize: 11, fontWeight: 700, color: 'var(--t-primary)', 
          textAlign: 'center', letterSpacing: '-0.2px', marginBottom: 2,
          textTransform: 'uppercase'
        }}>
          {data.title as string}
        </div>
        
        <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0 }}>
          <div ref={ref} className="visual-area" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    )
  }

  if (isHorizontal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', gap: 16 }}>
        {/* ── Left Column (Data) ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          <div>
            <div className="mod-title" style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)', letterSpacing: '-0.2px' }}>
              {data.title as string}
            </div>
            <div className="mod-subtitle" style={{ fontSize: 11, color: 'var(--t-muted)', marginTop: 3 }}>
              {data.subtitle as string}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 8 }} /> {/* spacer */}

          {data.description && (
            <div style={{
              fontSize: 10.5, lineHeight: 1.4, color: 'var(--t-muted)',
              fontStyle: 'italic', opacity: 0.75,
              paddingLeft: 10, borderLeft: `2.5px solid ${color}80`,
              marginBottom: 12
            }}>
              {data.description as string}
            </div>
          )}

          {data.footer_stats && (
            <div className="footer-stats" style={{ 
              fontSize: 11, color: 'var(--t-muted)', textAlign: 'center', 
              borderTop: '1px solid #F4F4F2', paddingTop: 8, marginTop: 'auto'
            }}>
              {((data.footer_stats as string[]) || []).join(' · ')}
            </div>
          )}
        </div>

        {/* ── Right Column (Gauge Canvas + Text String) ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div ref={ref} className="visual-area" style={{ flex: 1, width: '100%', minHeight: 0 }} />
          {data.label && (
            <div style={{
              fontSize: 12, fontWeight: 700, color: color, textAlign: 'center',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              marginTop: -12, marginBottom: 4 // tuck it snug under the canvas arc
            }}>
              {data.label as string}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      
      {/* ── Top Header ── */}
      <div>
        <div className="mod-title" style={{
          fontSize: 13, fontWeight: 600, color: 'var(--t-primary)', letterSpacing: '-0.2px',
        }}>
          {data.title as string}
        </div>
        <div className="mod-subtitle" style={{ fontSize: 11, color: 'var(--t-muted)', marginTop: 3 }}>
          {data.subtitle as string}
        </div>
      </div>

      {/* ── Center Canvas (Gauge) ── */}
      <div 
        ref={ref} 
        className="visual-area"
        style={{ flex: 1, minHeight: 0, margin: '14px 0' }} 
      />

      {/* ── Extracted Label (Outside Gauge) ── */}
      {data.label && (
        <div style={{
          fontSize: 13, 
          fontWeight: 600,
          color: color, // Use accent color for emphasis
          textAlign: 'center',
          marginTop: 'auto',
          background: `${color}11`, // very light tint
          padding: '8px 12px',
          borderRadius: 8,
          marginBottom: 4,
        }}>
          {data.label as string}
        </div>
      )}

      {/* ── Footer Stats ── */}
      {data.footer_stats && (
        <div className="footer-stats" style={{ 
          fontSize: 11, 
          color: 'var(--t-muted)', 
          textAlign: 'center', 
          flexShrink: 0,
          borderTop: '1px solid #F4F4F2',
          paddingTop: 8,
        }}>
          {((data.footer_stats as string[]) || []).join(' · ')}
        </div>
      )}

    </div>
  )
}
