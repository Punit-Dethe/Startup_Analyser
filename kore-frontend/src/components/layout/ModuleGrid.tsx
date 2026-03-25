'use client'

import { useEffect } from 'react'
import { Module } from '@/lib/types'
import ModuleCard from '@/components/modules/ModuleCard'

interface ModuleGridProps {
  modules: Module[]
  activeTab: string
}

export default function ModuleGrid({ modules, activeTab }: ModuleGridProps) {
  const visible = modules.filter(m => m.tab === activeTab)

  // Stagger reveal on tab change
  useEffect(() => {
    const cards = document.querySelectorAll('[data-reveal-index]')
    cards.forEach((el, i) => {
      const card = el as HTMLElement
      card.style.opacity = '0'
      card.style.transform = 'translateY(10px)'
      card.style.transition = 'none'
      setTimeout(() => {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease'
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      }, i * 45)
    })
  }, [activeTab])

  return (
    <div className="module-grid">
      {visible.map((module, index) => (
        <ModuleCard key={module.id} module={module} index={index} />
      ))}
    </div>
  )
}
