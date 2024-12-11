'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full border-b border-black/[.08] bg-white z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
        <div className="flex gap-6">
          <Link 
            href="/"
            className={`hover:text-black/60 transition-colors ${
              pathname === '/' ? 'text-black' : 'text-black/40'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/analysis"
            className={`hover:text-black/60 transition-colors ${
              pathname === '/analysis' ? 'text-black' : 'text-black/40'
            }`}
          >
            Analysis
          </Link>
          <Link 
            href="/dashboard"
            className={`hover:text-black/60 transition-colors ${
              pathname === '/dashboard' ? 'text-black' : 'text-black/40'
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
} 