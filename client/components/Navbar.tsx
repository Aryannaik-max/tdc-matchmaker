'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My clients', href: '/clients' },
  { label: 'Match pool', href: '/pool' },
  { label: 'Sent matches', href: '/sent' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string; role?: string }>({})

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('')
    : 'AN'

  return (
    <nav className="flex items-center justify-between px-7 h-[52px] bg-white border-b border-black/[0.08] sticky top-0 z-10">
      
      {/* logo */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#3D1A2E]" />
        <span className="text-[15px] font-medium text-[#3D1A2E] tracking-[0.02em]">
          TDC Matchmaker
        </span>
      </div>

      {/* nav links */}
      <div className="flex gap-1">
        {navItems.map(item => {
          const isActive = pathname?.startsWith(item.href) && item.href !== '/dashboard'
            ? pathname === item.href
            : item.href === '/dashboard' && (pathname === '/dashboard' || pathname?.startsWith('/dashboard/'))
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`
                px-[14px] py-[6px] rounded-lg text-[13px] border-none cursor-pointer transition-all duration-150
                ${isActive
                  ? 'bg-[#f3f2ee] text-[#1a1a18] font-medium'
                  : 'bg-transparent text-[#6b6b65] font-normal hover:bg-[#f8f7f4]'
                }
              `}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* right — date + bell + user */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[#9b9b93]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
        <div className="w-px h-5 bg-black/10" />
        <button
          className="bg-transparent border-none cursor-pointer text-[#9b9b93] text-lg flex items-center"
          aria-label="Notifications"
        >
          <i className="ti ti-bell" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs font-medium text-[#1a1a18]">{user.name || 'Matchmaker'}</div>
            <div className="text-[11px] text-[#9b9b93]">{user.role || 'Senior Matchmaker'}</div>
          </div>
          <div
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            title="Logout"
            className="w-8 h-8 rounded-full bg-[#3D1A2E] text-white text-xs font-medium flex items-center justify-center cursor-pointer"
          >
            {initials}
          </div>
        </div>
      </div>
    </nav>
  )
}