'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  LogOut,
  Home,
  ShieldCheck,
  Briefcase
} from 'lucide-react'
import { AdminBrand } from './AdminBrand'

interface AdminNavProps {
  userName?: string
  userEmail?: string
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Deals', href: '/admin/deals', icon: Briefcase },
  { name: 'Contacts', href: '/admin/customers', icon: Users },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
]

export default function AdminNav({ userName, userEmail }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200/70 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <AdminBrand subtitle="Admin" />
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      active
                        ? 'bg-gold-50 text-gold-700'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User badge */}
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-gold-50 border border-gold-100 px-3 py-1.5 text-gold-700 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">{userName || userEmail}</span>
            </div>
            
            <Link 
              href="/" 
              target="_blank"
              className="px-3 py-2 rounded-xl text-charcoal-700 hover:text-gold-700 hover:bg-gold-50 transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">View site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-charcoal-700 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 mt-4 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-gold-50 text-gold-700'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

