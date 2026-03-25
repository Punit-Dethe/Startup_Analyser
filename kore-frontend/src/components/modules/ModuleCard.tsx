'use client'

import { Module, AccentKey } from '@/lib/types'
import ModuleFactory from '@/components/modules/ModuleFactory'
import styles from './ModuleCard.module.css'
import { useEffect, useRef } from 'react'
import { getAccentColor } from '@/lib/theme'

interface ModuleCardProps {
  module: Module
  index: number
}

export default function ModuleCard({ module, index }: ModuleCardProps) {
  const accentColor = getAccentColor(module.accent)
  const sizeClass   = `mod-${module.size}`

  return (
    <div
      className={`${styles.card} ${sizeClass}`}
      style={{ '--accent': accentColor } as React.CSSProperties}
      data-module-id={module.id}
      data-reveal-index={index}
    >
      {/* Content area — no accent bar, content fills the full card */}
      <div className={styles.content}>
        {module.html ? (
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: module.html }}
          />
        ) : (
          <ModuleFactory module={module} />
        )}
      </div>
    </div>
  )
}
