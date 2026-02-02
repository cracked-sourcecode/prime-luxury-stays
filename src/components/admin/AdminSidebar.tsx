'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  LogOut,
  Home,
  ChevronDown,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Settings,
  Menu,
  X,
  PlusCircle,
  List,
  UserPlus,
  Mail,
  BarChart3,
  Globe,
  CalendarDays,
  ClipboardList
} from 'lucide-react'
import { useAdminLocale } from '@/lib/adminLocale'

interface AdminSidebarProps {
  userName?: string
  userEmail?: string
}

const LOGO_URL = 'https://storage.googleapis.com/primeluxurystays/Logo%20no%20text%20(global%20header).png'

interface NavSection {
  name: string
  icon: React.ElementType
  href?: string
  children?: { name: string; href: string; icon: React.ElementType }[]
}

export default function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale, setLocale, t } = useAdminLocale()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['Properties', 'CRM'])
  
  // Helper to add lang param to hrefs
  const localizeHref = (href: string) => {
    if (locale === 'de') {
      return `${href}?lang=de`
    }
    return href
  }
  
  // Navigation sections with translation keys
  const navSections: NavSection[] = [
    { 
      name: t('dashboard'), 
      href: '/admin', 
      icon: LayoutDashboard 
    },
    { 
      name: t('properties'), 
      icon: Building2,
      children: [
        { name: locale === 'de' ? 'Alle Immobilien' : 'All Properties', href: '/admin/properties', icon: List },
        { name: locale === 'de' ? 'Neue Immobilie' : 'Add Property', href: '/admin/properties/new', icon: PlusCircle },
      ]
    },
    { 
      name: 'CRM', 
      icon: Users,
      children: [
        { name: locale === 'de' ? 'Kontakte' : 'Contacts', href: '/admin/customers', icon: Users },
        { name: locale === 'de' ? 'Deals Pipeline' : 'Deals Pipeline', href: '/admin/deals', icon: Briefcase },
      ]
    },
    { 
      name: t('inquiries'), 
      href: '/admin/inquiries', 
      icon: MessageSquare 
    },
    { 
      name: locale === 'de' ? 'Verfügbarkeit' : 'Availability', 
      href: '/admin/availability', 
      icon: CalendarDays 
    },
    { 
      name: 'WIP', 
      href: '/admin/wip', 
      icon: ClipboardList 
    },
  ]

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

  const toggleSection = (name: string) => {
    setExpandedSections(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        <img src={LOGO_URL} alt="Logo" className="w-10 h-10" />
        {!collapsed && (
          <div>
            <h1 className="font-semibold text-charcoal-900 text-sm">Prime Luxury Stays</h1>
            <p className="text-xs text-gold-600 font-medium">Admin Console</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navSections.map((section) => {
            const Icon = section.icon
            const hasChildren = section.children && section.children.length > 0
            const isExpanded = expandedSections.includes(section.name)
            const sectionActive = section.href 
              ? isActive(section.href)
              : section.children?.some(child => isActive(child.href))

            if (hasChildren) {
              return (
                <div key={section.name}>
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      sectionActive 
                        ? 'bg-gold-50 text-gold-700' 
                        : 'text-charcoal-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {!collapsed && <span className="font-medium text-sm">{section.name}</span>}
                    </div>
                    {!collapsed && (
                      isExpanded 
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {!collapsed && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                      {section.children?.map((child) => {
                        const ChildIcon = child.icon
                        const childActive = isActive(child.href)
                        return (
                          <Link
                            key={child.href}
                            href={localizeHref(child.href)}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              childActive 
                                ? 'bg-gold-100 text-gold-800 font-medium' 
                                : 'text-charcoal-500 hover:bg-gray-50 hover:text-charcoal-700'
                            }`}
                          >
                            <ChildIcon className="w-4 h-4" />
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={section.name}
                href={localizeHref(section.href!)}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  sectionActive 
                    ? 'bg-gold-50 text-gold-700 font-medium' 
                    : 'text-charcoal-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="text-sm">{section.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 p-3 space-y-2">
        {/* Language Switcher */}
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-2'}`}>
          {collapsed ? (
            <button
              onClick={() => setLocale(locale === 'en' ? 'de' : 'en')}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              title={locale === 'en' ? 'Switch to German' : 'Auf Englisch umschalten'}
            >
              <Globe className="w-5 h-5 text-charcoal-600" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-full">
              <button
                onClick={() => setLocale('en')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  locale === 'en' ? 'bg-white shadow-sm text-charcoal-900' : 'text-charcoal-500 hover:text-charcoal-700'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLocale('de')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  locale === 'de' ? 'bg-white shadow-sm text-charcoal-900' : 'text-charcoal-500 hover:text-charcoal-700'
                }`}
              >
                🇩🇪 Deutsch
              </button>
            </div>
          )}
        </div>
        
        <Link 
          href="/" 
          target="_blank"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-charcoal-600 hover:bg-gray-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <Home className="w-5 h-5" />
          {!collapsed && <span className="text-sm">{locale === 'de' ? 'Website ansehen' : 'View Website'}</span>}
        </Link>
        
        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-cream-50 border border-cream-200">
            <p className="text-xs text-charcoal-500">{locale === 'de' ? 'Angemeldet als' : 'Logged in as'}</p>
            <p className="text-sm font-medium text-charcoal-800 truncate">{userName || userEmail}</p>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">{t('logout')}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-charcoal-900">Admin</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white transform transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent />
        
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 rotate-90" />}
        </button>
      </aside>

      {/* Main content wrapper helper - returns the margin class */}
      <style jsx global>{`
        .admin-main {
          margin-left: ${collapsed ? '5rem' : '16rem'};
          padding-top: 0;
        }
        @media (max-width: 1023px) {
          .admin-main {
            margin-left: 0;
            padding-top: 4rem;
          }
        }
      `}</style>
    </>
  )
}

