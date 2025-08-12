import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Midjourney 图像生成器',
  description: '通过Midjourney API生成AI图像',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}