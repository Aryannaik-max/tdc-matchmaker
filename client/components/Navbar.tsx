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
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        height: 52,
        background: '#fff',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3D1A2E' }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: '#3D1A2E', letterSpacing: '0.02em' }}>
          TDC Matchmaker
        </span>
      </div>

      {/* nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {navItems.map(item => {
          const isActive = pathname?.startsWith(item.href) && item.href !== '/dashboard'
            ? pathname === item.href
            : item.href === '/dashboard' && (pathname === '/dashboard' || pathname?.startsWith('/dashboard/'))
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? '#f3f2ee' : 'transparent',
                color: isActive ? '#1a1a18' : '#6b6b65',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = '#f8f7f4'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* right — date + bell + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#9b9b93' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
        <div style={{ width: 0.5, height: 20, background: 'rgba(0,0,0,0.1)' }} />
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b9b93', fontSize: 18, display: 'flex', alignItems: 'center' }}
          aria-label="Notifications"
        >
          <i className="ti ti-bell" aria-hidden="true" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{user.name || 'Matchmaker'}</div>
            <div style={{ fontSize: 11, color: '#9b9b93' }}>{user.role || 'Senior Matchmaker'}</div>
          </div>
          <div
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            title="Logout"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#3D1A2E',
              color: '#fff',
              fontSize: 12,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {initials}
          </div>
        </div>
      </div>
    </nav>
  )
}