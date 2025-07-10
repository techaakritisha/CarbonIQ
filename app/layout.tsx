// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
// import ChatbotLauncher from '@/components/ui/ChatbotLauncher'
import { Nunito } from 'next/font/google'
import { Toaster } from 'sonner'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'CarbonIQ | Smart Carbon Dashboard',
  description: 'EcoBot powered dashboard for a greener tomorrow 🌱',
  generator: 'CarbonIq',
  keywords: ['Carbon', 'Sustainability', 'Green App', 'EcoBot', 'Climate'],
  authors: [{ name: 'Akriti' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body className="relative bg-green-50 text-gray-800 min-h-screen antialiased">
        {children}
        {/* <ChatbotLauncher /> */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
