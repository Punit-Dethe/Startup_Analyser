'use client'

import { useEffect, useRef } from 'react'
import { Module, DonutSegment } from '@/lib/types'
import * as echarts from 'echarts'
import { getAccentColor, getChartPalette } from '@/lib/theme'

interface ChartModuleProps {
  module: Module
  variant: string
}

export default function ChartModule({ module, variant }: ChartModuleProps) {
  const ref  = useRef<HTMLDivElement>(null)
  const inst = useRef<echarts.ECharts | null>(null)
  const color = getAccentColor(module.accent)
  const { data } = module

  useEffect(() => {
    if (!ref.current) return

    let rafId: number
    let obs: ResizeObserver

    rafId = requestAnimationFrame(() => {
      if (!ref.current) return
      inst.current = echarts.init(ref.current, null, { renderer: 'canvas' })
      inst.current.setOption(buildOption(variant, data, color))

      obs = new ResizeObserver(() => inst.current?.resize())
      obs.observe(ref.current)
    })

    return () => {
      cancelAnimationFrame(rafId)
      obs?.disconnect()
      inst.current?.dispose()
    }
  }, [variant, color, data])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      {/* Header */}
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

      {/* Chart canvas */}
      <div ref={ref} style={{ flex: 1, minHeight: 0 }} />

      {/* Footer stats */}
      <div className="footer-stats" style={{
        display: 'flex', gap: 16, paddingTop: 8,
        borderTop: '1px solid #F4F4F2', flexShrink: 0,
      }}>
        {((data.footer_stats as string[]) || []).map((s, i) => (
          <span key={i} style={{ fontSize: 11, color: 'var(--t-muted)' }}>{s}</span>
        ))}
      </div>
    </div>
  )
}

function buildOption(
  variant: string,
  data: Record<string, unknown>,
  color: string
): echarts.EChartsOption {
  const series  = (data.series  as number[]) || []
  const series2 = (data.series2 as number[]) || []
  const labels  = (data.labels  as string[]) || []
  const unit    = (data.unit    as string)   || ''

  const base: echarts.EChartsOption = {
    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#EBEBEA',
      borderWidth: 1,
      textStyle: { color: '#3D3D3A', fontSize: 11, fontFamily: 'Inter, system-ui' },
      padding: [6, 10],
    },
    grid: { top: 8, right: 10, bottom: 22, left: 10, containLabel: true },
  }

  // Auto-detect data scale for better visualization
  const allValues = [...series, ...series2].filter(v => typeof v === 'number' && !isNaN(v))
  const dataMax = allValues.length > 0 ? Math.max(...allValues) : 100
  const dataMin = allValues.length > 0 ? Math.min(...allValues) : 0
  
  // Determine if we need to adjust the scale
  // If max value is very small (< 10), ensure chart shows proper scale
  const needsScaleAdjustment = dataMax > 0 && dataMax < 10
  const yAxisMax = needsScaleAdjustment ? Math.ceil(dataMax * 1.2) : undefined

  const axisStyles = {
    xAxis: {
      type: 'category' as const,
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 10, color: '#9B9B97', fontFamily: 'Inter, system-ui' },
    },
    yAxis: {
      type: 'value' as const,
      max: yAxisMax,
      axisLabel: {
        fontSize: 10, color: '#9B9B97', fontFamily: 'Inter, system-ui',
        formatter: `{value}${unit}`,
      },
      splitLine: { lineStyle: { color: '#F4F4F2', type: 'dashed' as const } },
    },
  }

  // ── Bar chart ───────────────────────────────────────────────────────────
  if (variant === 'bar') {
    return {
      ...base, ...axisStyles,
      series: [{
        type: 'bar',
        data: series,
        barMaxWidth: 40,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: (p: { dataIndex: number }) => {
            const op = 0.25 + (p.dataIndex / Math.max(series.length - 1, 1)) * 0.75
            return color + Math.round(op * 255).toString(16).padStart(2, '0')
          },
        },
      }],
    }
  }

  // ── Grouped bar chart (2-3 series compared side by side) ───────────────
  if (variant === 'grouped') {
    const seriesDefs = (data.series_list as Array<{ name: string; values: number[] }>) || []
    if (seriesDefs.length === 0) return base
    return {
      ...base, ...axisStyles,
      legend: {
        bottom: 0,
        itemWidth: 8, itemHeight: 8, itemGap: 12,
        textStyle: { fontSize: 10, color: '#9B9B97', fontFamily: 'Inter' },
      },
      grid: { top: 8, right: 10, bottom: 48, left: 10, containLabel: true },
      series: seriesDefs.map((s, idx) => {
        const palette = getChartPalette()
        return {
          type: 'bar' as const,
          name: s.name,
          data: s.values,
          barMaxWidth: 28,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: palette[idx % palette.length],
          },
        }
      }),
    }
  }

  // ── Horizontal bar chart ──────────────────────────────────────────
  if (variant === 'hbar') {
    // Auto-detect scale for horizontal bars
    const hbarMax = dataMax > 0 && dataMax < 10 ? Math.ceil(dataMax * 1.2) : undefined
    
    return {
      ...base,
      grid: { top: 8, right: 40, bottom: 8, left: 10, containLabel: true },
      xAxis: {
        type: 'value' as const,
        max: hbarMax,
        axisLabel: { fontSize: 10, color: '#9B9B97', fontFamily: 'Inter', formatter: `{value}${unit}` },
        splitLine: { lineStyle: { color: '#F4F4F2', type: 'dashed' as const } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category' as const,
        data: labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: '#9B9B97', fontFamily: 'Inter' },
      },
      series: [{
        type: 'bar' as const,
        data: series,
        barMaxWidth: 20,
        label: {
          show: true,
          position: 'right' as const,
          fontSize: 10,
          color: '#9B9B97',
          formatter: (p: any) => `${p.value}${unit}`,
        },
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: (p: { dataIndex: number }) => {
            const palette = getChartPalette()
            return palette[p.dataIndex % palette.length]
          },
        },
      }],
    }
  }

  // ── Line / Area chart ────────────────────────────────────────────────────
  if (variant === 'line' || variant === 'area') {
    const seriesList: echarts.SeriesOption[] = [{
      type: 'line',
      data: series,
      smooth: true,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      areaStyle: variant === 'area' ? { color: color + '22' } : undefined,
      symbol: 'circle', symbolSize: 5,
    }]
    if (series2.length > 0) {
      seriesList.push({
        type: 'line',
        data: series2,
        smooth: true,
        lineStyle: { color: '#9B9B97', width: 1.5, type: 'dashed' },
        itemStyle: { color: '#9B9B97' },
        areaStyle: { color: '#9B9B9711' },
        symbol: 'circle', symbolSize: 4,
      })
    }
    return { ...base, ...axisStyles, series: seriesList }
  }

  // ── Donut / Pie ─────────────────────────────────────────────────────────
  if (variant === 'donut' || variant === 'pie') {
    const segs = (data.segments as Array<{ label: string; value: number; color_key: string }>) || []
    return {
      animation: true,
      animationDuration: 800,
      color: getChartPalette(),
      tooltip: {
        trigger: 'item',
        formatter: (params: any) =>
          `${params.name}: <span style="color:${params.color};font-weight:700">${params.percent}%</span>`,
      },
      legend: {
        orient: 'vertical',
        right: 16,
        top: 'middle',
        itemWidth: 10, itemHeight: 10,
        itemGap: 14,
        formatter: (name: string) => {
          const seg = segs.find(s => s.label === name)
          return seg ? `{name|${name}}  {val|${seg.value}}` : name
        },
        textStyle: {
          fontSize: 12, color: '#3D3D3A', fontFamily: 'Inter',
          rich: {
            name: { fontSize: 12, color: '#3D3D3A', fontWeight: 500 },
            val: { fontSize: 11, color: '#9B9B97', fontWeight: 400 },
          },
        },
      },
      series: [{
        type: 'pie',
        radius: ['34%', '68%'],
        center: ['30%', '55%'],
        padAngle: 5,
        itemStyle: {
          borderRadius: 8,
        },
        data: segs.map(s => ({
          name: s.label,
          value: s.value,
        })),
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' },
        },
      }],
    }
  }

  // ── Waterfall ────────────────────────────────────────────────────────────
  if (variant === 'waterfall') {
    const invisible = (data.invisible as number[]) || []
    return {
      ...base,
      grid: { ...(base.grid as any), top: 30 }, // Additional headroom for top floating labels
      ...axisStyles,
      yAxis: {
        ...axisStyles.yAxis,
        max: (value: { max: number }) => Math.ceil(value.max * 1.15) // Force 15% physical headroom
      },
      series: [
        {
          type: 'bar' as const,
          stack: 'waterfall',
          data: invisible,
          itemStyle: { color: 'transparent' as const },
        },
        {
          type: 'bar' as const,
          stack: 'waterfall',
          data: series.map((v, i) => ({
            value: v,
            itemStyle: {
              color: invisible[i] === 0 && i > 0 ? getAccentColor('quaternary') : (v >= 0 ? getAccentColor('quaternary') : getAccentColor('secondary')),
              borderRadius: [4, 4, 0, 0] as [number, number, number, number],
            },
            label: {
              show: true,
              position: 'top' as const,
              fontSize: 10,
              color: '#3D3D3A',
              padding: [0, 0, 4, 0],
              formatter: (p: any) => {
                const isTotal = invisible[p.dataIndex] === 0 && p.dataIndex > 0
                return `${(!isTotal && p.value >= 0 ? '+' : '')}${p.value}${unit}`
              },
            },
          })),
          barMaxWidth: 40,
        },
      ] as echarts.SeriesOption[],
    }
  }

  // ── Radar ────────────────────────────────────────────────────────────────
  if (variant === 'radar') {
    // Auto-detect scale max from data so values on 1-5, 1-10, or 1-100 all fill the chart correctly
    const dataMax = series.length > 0 ? Math.max(...series.map(Number)) : 100
    const autoMax = dataMax <= 5 ? 5 : dataMax <= 10 ? 10 : 100
    const indicators = labels.map(l => ({ name: l, max: autoMax }))
    return {
      animation: true,
      tooltip: { trigger: 'item' },
      radar: {
        indicator: indicators,
        axisName: { fontSize: 10, color: '#9B9B97' },
        splitLine: { lineStyle: { color: '#F4F4F2' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#EBEBEA' } },
      },
      series: [{
        type: 'radar',
        data: [{ value: series, name: data.title as string }],
        lineStyle: { color },
        itemStyle: { color },
        areaStyle: { color: color + '22' },
      }],
    }
  }

  return base
}
