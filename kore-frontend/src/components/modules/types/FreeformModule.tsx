'use client'

import { Module } from '@/lib/types'

export default function FreeformModule({ module }: { module: Module }) {
  const { data } = module
  const htmlContent = (data.html as string) || '<div style="padding: 20px; text-align: center; color: var(--t-hint);">No HTML content provided</div>'

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
