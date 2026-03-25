import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kore — AI Business Intelligence',
  description: 'Type a company name or startup idea. Get a complete intelligence dashboard in seconds.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
