'use client'

import { ReactNode, useEffect } from 'react'
import Topbar from './Topbar'
import ChatPanel from './ChatPanel'
import { setTheme } from '@/lib/theme'
import { ChatMessage } from '@/lib/types'

interface AppShellProps {
  children:      ReactNode
  tabs:          Array<{ id: string; label: string; isTemporary?: boolean }>
  activeTab:     string
  onTabChange:   (id: string) => void
  onRemoveTab?:  (id: string) => void  // Callback to remove temporary tabs
  brandColor:    string
  colors?:       Record<string, string>
  logoInitials:  string
  pageTitle:     string
  pageSubtitle?: string
  chatIntro:     string
  // Chat props
  chatHistory:   ChatMessage[]
  isChatLoading: boolean
  onSendChat:    (message: string) => void
  onClear?:      () => void
}

export default function AppShell({
  children,
  tabs,
  activeTab,
  onTabChange,
  onRemoveTab,
  brandColor,
  colors,
  logoInitials,
  pageTitle,
  pageSubtitle,
  chatIntro,
  chatHistory,
  isChatLoading,
  onSendChat,
  onClear,
}: AppShellProps) {
  useEffect(() => {
    if (colors?.primary && colors?.secondary && colors?.tertiary && colors?.quaternary) {
      setTheme({ primary: colors.primary, secondary: colors.secondary, tertiary: colors.tertiary, quaternary: colors.quaternary })
    } else if (brandColor) {
      setTheme({ primary: brandColor, secondary: brandColor + 'CC', tertiary: brandColor + '88', quaternary: brandColor + '55' })
    }
  }, [colors, brandColor])

  const styleVars: Record<string, string> = { '--accent-brand': brandColor }
  if (colors) {
    Object.entries(colors).forEach(([key, val]) => {
      styleVars[`--accent-${key}`] = val
    })
  }

  return (
    <div id="app-shell" style={styleVars as React.CSSProperties}>
      <Topbar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onRemoveTab={onRemoveTab}
        brandColor={brandColor}
        logoInitials={logoInitials}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        onClear={onClear}
      />
      <div className="body-row">
        <ChatPanel
          intro={chatIntro}
          brandColor={brandColor}
          chatHistory={chatHistory}
          isChatLoading={isChatLoading}
          onSend={onSendChat}
        />
        <div className="grid-area">
          {children}
        </div>
      </div>
    </div>
  )
}
