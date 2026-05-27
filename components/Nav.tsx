'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, Layers, Bookmark, Info } from 'lucide-react'

const links = [
  { href: '/', label: 'Feed', icon: Mic },
  { href: '/pipeline', label: 'Pipeline', icon: Layers },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/about', label: 'About', icon: Info },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
      <span className="font-semibold text-gray-900 tracking-tight">🎙️ Content Hub</span>
      <div className="flex gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              path === href
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
