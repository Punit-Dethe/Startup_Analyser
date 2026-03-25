'use client'

import React, { useState } from 'react'
import { Module, TableColumn } from '@/lib/types'

export default function TableModule({ module }: { module: Module }) {
  const { data } = module
  const columns = (data.columns as TableColumn[]) || []
  const rows    = (data.rows    as Record<string, unknown>[]) || []

  const [sortKey, setSortKey]   = useState<string | null>(null)
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc')

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey]
        const cmp = av == null ? 1 : bv == null ? -1 :
                    typeof av === 'number' && typeof bv === 'number'
                      ? av - bv
                      : String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : rows

  function handleSort(col: TableColumn) {
    if (!col.sortable) return
    if (sortKey === col.key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col.key); setSortDir('asc') }
  }

  function renderCell(value: unknown, type?: string): React.ReactNode {
    if (type === 'delta_badge') {
      const n   = Number(value)
      const pos = n >= 0
      return (
        <span style={{
          padding: '3px 8px', borderRadius: 5,
          fontSize: 11, fontWeight: 600,
          background: pos ? '#DCFCE7' : '#FEE2E2',
          color: pos ? '#16A34A' : '#DC2626',
        }}>
          {pos ? '↗ +' : '↘ '}{String(value)}%
        </span>
      )
    }
    if (type === 'currency') return `$${Number(value).toLocaleString()}`
    if (type === 'percent') return `${String(value)}%`
    return String(value ?? '—')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <div>
        <div className="mod-title" style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)', letterSpacing: '-0.2px' }}>
          {data.title as string}
        </div>
        <div className="mod-subtitle" style={{ fontSize: 11, color: 'var(--t-muted)', marginTop: 3 }}>
          {data.subtitle as string}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  style={{
                    padding: '9px 10px',
                    textAlign: 'left',
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--t-muted)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    borderBottom: '2px solid #DDDDD9',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: i < sorted.length - 1 ? '1px solid #DDDDD9' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F5F5F3')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    style={{
                      padding: '11px 10px',
                      fontSize: 12,
                      color: col.key === columns[0].key ? 'var(--t-primary)' : 'var(--t-secondary)',
                      fontWeight: col.key === columns[0].key ? 600 : 400,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {renderCell(row[col.key], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
