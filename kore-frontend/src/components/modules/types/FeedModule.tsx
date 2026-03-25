import { Module, FeedItem } from '@/lib/types'

const SENTIMENT_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  positive: { bg: '#DCFCE7', color: '#16A34A', label: 'Positive' },
  negative: { bg: '#FEE2E2', color: '#DC2626', label: 'Negative' },
  neutral:  { bg: '#F3F4F6', color: '#6B7280', label: 'Neutral'  },
}

export default function FeedModule({ module }: { module: Module }) {
  const { data } = module
  const items = (data.items as FeedItem[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      <div>
        <div className="mod-title" style={{
          fontSize: 13, fontWeight: 600, color: 'var(--t-primary)', letterSpacing: '-0.2px',
        }}>
          {data.title as string}
        </div>
        <div className="mod-subtitle" style={{ fontSize: 10, color: 'var(--t-muted)', marginTop: 2 }}>
          {data.subtitle as string}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto', minHeight: 0 }}>
        {items.map((item, i) => {
          const sentiment = SENTIMENT_STYLES[item.sentiment ?? 'neutral']
          return (
            <div
              key={i}
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: i < items.length - 1 ? '1px solid #DDDDD9' : 'none',
              }}
            >
              {/* Icon placeholder */}
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: '#F4F4F2',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0C0BC" strokeWidth="1.5">
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                </svg>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Headline */}
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: 'var(--t-primary)', lineHeight: 1.45,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {item.headline}
                </div>

                {/* Meta row */}
                <div className="source-text" style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{item.source}</span>
                  {item.date && (
                    <span style={{ fontSize: 11, color: 'var(--t-hint)' }}>· {item.date}</span>
                  )}
                  {item.sentiment && (
                    <span className="sentiment-badge" style={{
                      fontSize: 10, fontWeight: 600,
                      padding: '1px 6px', borderRadius: 4,
                      background: sentiment.bg,
                      color: sentiment.color,
                      letterSpacing: '0.02em',
                    }}>
                      {sentiment.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
