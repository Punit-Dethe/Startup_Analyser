import { Module, BmcCell } from '@/lib/types'

const BMC_SECTIONS = [
  'Key Partners', 'Key Activities', 'Value Proposition',
  'Customer Relationships', 'Customer Segments',
  'Key Resources', 'Channels', 'Cost Structure', 'Revenue Streams',
]

const BMC_LAYOUT: Array<{ section: string; gridArea: string; accent: string }> = [
  { section: 'Key Partners',          gridArea: '1 / 1 / 3 / 2', accent: '#6366F1' }, // Indigo
  { section: 'Key Activities',        gridArea: '1 / 2 / 2 / 3', accent: '#3B82F6' }, // Blue
  { section: 'Key Resources',         gridArea: '2 / 2 / 3 / 3', accent: '#14B8A6' }, // Teal
  { section: 'Value Proposition',     gridArea: '1 / 3 / 3 / 4', accent: '#EC4899' }, // Pink
  { section: 'Customer Relationships',gridArea: '1 / 4 / 2 / 5', accent: '#F59E0B' }, // Amber
  { section: 'Channels',              gridArea: '2 / 4 / 3 / 5', accent: '#F97316' }, // Orange
  { section: 'Customer Segments',     gridArea: '1 / 5 / 3 / 6', accent: '#8B5CF6' }, // Violet
  { section: 'Cost Structure',        gridArea: '3 / 1 / 4 / 3', accent: '#EF4444' }, // Red
  { section: 'Revenue Streams',       gridArea: '3 / 3 / 4 / 6', accent: '#10B981' }, // Emerald
]

export default function BmcModule({ module }: { module: Module }) {
  const { data } = module
  const cells = (data.cells as BmcCell[]) || []

  const cellMap: Record<string, string[]> = {}
  cells.forEach(c => {
    // Normalize: lowercase + strip trailing 's' to handle plural/singular and case mismatches
    // e.g. "Value Propositions" → matches "Value Proposition"
    const normalize = (s: string) => s.toLowerCase().replace(/s$/, '').trim()
    const match = BMC_SECTIONS.find(sec => normalize(sec) === normalize(c.section)) || c.section
    cellMap[match] = c.points
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {data.title && (
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--t-primary)',
          letterSpacing: '-0.3px',
          paddingBottom: 8,
          borderBottom: '1px solid var(--border)',
        }}>
          {data.title as string}
        </div>
      )}

      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 10,
        overflow: 'hidden',
      }}>
        {BMC_LAYOUT.map(({ section, gridArea, accent }) => {
          const points = cellMap[section] || []
          return (
            <div
              key={section}
              style={{
                gridArea,
                background: '#FFFFFF',
                border: `1px solid ${accent}66`,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                padding: '16px 20px',
                display: 'flex', flexDirection: 'column', gap: 12,
                overflow: 'hidden',
              }}
            >
              {/* Vibrant Pill Header */}
              <div style={{ display: 'flex', flexShrink: 0 }}>
                <span style={{
                  background: accent + '1A', // ~10% opacity
                  color: accent,
                  padding: '5px 10px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                }}>
                  {section}
                </span>
              </div>

              {/* Data Points with SVG Chevrons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                {points.slice(0, 4).map((p, i) => (
                  <div key={i} style={{
                    fontSize: 12, color: 'var(--t-primary)',
                    display: 'flex', gap: 8, lineHeight: 1.45,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, opacity: 0.85 }}>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <span style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
