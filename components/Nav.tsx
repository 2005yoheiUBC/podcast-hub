'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/feed', label: 'Feed' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/saved', label: 'Saved' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between">
      <Link href="/" className="text-2xl font-extrabold text-gray-900 tracking-[0.05em] leading-none font-display">
        RADAR
      </Link>
      <div className="flex gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              path === href
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
