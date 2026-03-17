import type { Metadata } from 'next'
import { Orbitron, Share_Tech_Mono, Exo_2 } from 'next/font/google'
import './globals.css'
import { FloatingSymbols } from '@/components/FloatingSymbols'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const shareTech = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-share-tech',
  weight: ['400'],
  display: 'swap',
})

const exo = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AlgebraQuest',
  description: 'Desafie sua mente. Quebre o recorde.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${shareTech.variable} ${exo.variable}`}>
      <body>
        <FloatingSymbols />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  )
}

