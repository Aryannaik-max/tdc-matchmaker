'use client'

import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', icon: 'ti-layout-dashboard', href: '/dashboard' },
  { label: 'My Clients', icon: 'ti-users', href: '/clients' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#5a1630] text-white shadow-xl">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center text-[#f6c87a]">
            <span className="text-xl leading-none"></span>
          </div>
          <span className="text-xl font-bold tracking-wide text-white">TDC MatchMaker</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8">
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d1a7b8]">
          Matchmaker CRM
        </div>

        <div className="space-y-2">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname?.startsWith('/dashboard'))

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/8 text-[#f6c87a]'
                    : 'text-[#e0bccb] hover:bg-white/4 hover:text-white'
                }`}
              >
                <i
                  className={`ti ${item.icon} text-base transition-colors ${
                    isActive ? 'text-[#f6c87a]' : 'text-[#d1a7b8]'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8b06c] text-sm font-bold text-[#3b1020] shadow-sm">
            AR
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Aryan Sharma</p>
            <p className="truncate text-xs text-[#d1a7b8]">Senior Matchmaker</p>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            className="flex items-center justify-center text-[#d1a7b8] transition-colors hover:text-white"
            aria-label="Settings"
          >
            <i className="ti ti-settings text-base" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}