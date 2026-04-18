'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', abbr: 'DB' },
  { href: '/admin/dashboard/dishes', label: 'Menu & Dishes', abbr: 'MN' },
  { href: '/admin/dashboard/tables', label: 'Tables', abbr: 'TB' },
  { href: '/admin/dashboard/bookings', label: 'Reservations', abbr: 'RV' },
  { href: '/admin/dashboard/settings', label: 'AI Instructions', abbr: 'AI' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ backgroundColor: '#111111', borderRight: '1px solid #222' }}>
      <div className="p-8 border-b" style={{ borderColor: '#1f1f1f' }}>
        <p className="font-serif text-white text-lg font-semibold">Spice Garden</p>
        <p className="text-xs tracking-widest uppercase mt-1" style={{ color: '#C4973A', letterSpacing: '0.15em' }}>Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-2">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all"
              style={isActive
                ? { backgroundColor: '#1f1f1f', color: '#C4973A', borderLeft: '2px solid #C4973A' }
                : { color: '#6B6560', borderLeft: '2px solid transparent' }}>
              <span className="text-xs font-mono opacity-50">{item.abbr}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-1" style={{ borderColor: '#1f1f1f' }}>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm transition-all" style={{ color: '#3a3a3a' }}>
          View Website
        </Link>
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm transition-all" style={{ color: '#3a3a3a' }}>
          Sign Out
        </Link>
      </div>
    </aside>
  )
}
