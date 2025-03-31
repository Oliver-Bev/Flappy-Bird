import './globals.css'
import { Press_Start_2P } from 'next/font/google'

const retroFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-retro',
})

export const metadata = {
  title: 'Flappy Bird Next.js',
  description: 'Retro flappy game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={retroFont.className}>{children}</body>
    </html>
  )
}