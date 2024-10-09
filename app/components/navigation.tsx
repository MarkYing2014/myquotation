'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className={pathname === '/' ? 'font-bold' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/quotation" className={pathname === '/quotation' ? 'font-bold' : ''}>
            New Quotation
          </Link>
        </li>
      </ul>
    </nav>
  )
}