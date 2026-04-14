import { Module, BmcCell } from '@/lib/types'

const LEAN_CANVAS_SECTIONS = [
  'Problem', 'Solution', 'Key Metrics',
  'Unique Value Proposition', 'Unfair Advantage',
  'Channels', 'Customer Segments',
  'Cost Structure', 'Revenue Streams',
]

export default function LeanCanvasModule({ module }: { module: Module }) {
  const { data } = module
  const cells = (data.cells as BmcCell[]) || []

  const cellMap: Record<string, string[]> = {}
  cells.forEach(c => {
    const normalize = (s: string) => s.toLowerCase().trim()
    const match = LEAN_CANVAS_SECTIONS.find(sec => normalize(sec) === normalize(c.section)) || c.section
    cellMap[match] = c.points
  })

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      gap: 12,
    }}>
      {/* Simple title */}
      {data.title && (
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#9CA3AF',
          letterSpacing: '-0.2px',
          textAlign: 'center',
        }}>
          {data.title as string}
        </div>
      )}

      {/* Top Row - 5 equal sections */}
      <div style={{
        flex: 2,
        minHeight: 0,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 8,
      }}>
        {/* Problem - #1 */}
        <div style={{ gridArea: '1 / 1 / 3 / 2', background: '#9333EA', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>1</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Problem</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Problem'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Solution - #2 */}
        <div style={{ gridArea: '1 / 2 / 2 / 3', background: '#FB923C', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>2</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Solution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Solution'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics - #8 */}
        <div style={{ gridArea: '2 / 2 / 3 / 3', background: '#F97316', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>8</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Key Metrics</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Key Metrics'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* UVP - #3 */}
        <div style={{ gridArea: '1 / 3 / 3 / 4', background: '#22C55E', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>3</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Unique Value Proposition</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Unique Value Proposition'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unfair Advantage - #9 */}
        <div style={{ gridArea: '1 / 4 / 2 / 5', background: '#84CC16', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>9</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Unfair Advantage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Unfair Advantage'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channels - #5 */}
        <div style={{ gridArea: '2 / 4 / 3 / 5', background: '#14B8A6', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>5</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Channels</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Channels'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments - #4 */}
        <div style={{ gridArea: '1 / 5 / 3 / 6', background: '#06B6D4', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>4</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Customer Segments</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Customer Segments'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - 2 equal sections */}
      <div style={{
        flex: 1,
        minHeight: 0,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
      }}>
        {/* Cost Structure - #7 */}
        <div style={{ background: '#3B82F6', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>7</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Cost Structure</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Cost Structure'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Streams - #6 */}
        <div style={{ background: '#0891B2', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0, minHeight: 0 }}>
          <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.15)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>6</div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1.1 }}>Revenue Streams</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minHeight: 0, overflow: 'auto' }}>
            {(cellMap['Revenue Streams'] || []).map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#FFFFFF', flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                <span style={{ flex: 1 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
