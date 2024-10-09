import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shutter Quotation App',
  description: 'An app for managing shutter quotations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
