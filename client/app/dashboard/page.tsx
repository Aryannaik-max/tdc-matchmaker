'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Profile } from '@/types'
import Sidebar from '@/components/Sidebar'

type FilterName = 'All' | 'Active' | 'Match Sent' | 'On Hold' | 'Matched'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  'Active':     { bg: '#EAF3DE', color: '#27500A' },
  'Match Sent': { bg: '#FEE2E2', color: '#991B1B' },
  'On Hold':    { bg: '#FEF3C7', color: '#92400E' },
  'Matched':    { bg: '#E0E7FF', color: '#3730A3' },
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Profile[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterName>('All')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name?: string; role?: string }>({})
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filters: FilterName[] = ['All', 'Active', 'Match Sent', 'On Hold', 'Matched']

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))

    api.getCustomers()
      .then(data => {
        const list = Array.isArray(data) ? data : data.customers || data.data || []
        setCustomers(list)
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  const filteredCustomers = useMemo(() => {
    let list = activeFilter === 'All'
      ? customers
      : customers.filter(c => c.status === activeFilter)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.religion.toLowerCase().includes(q) ||
        c.designation.toLowerCase().includes(q)
      )
    }

    return list
  }, [activeFilter, customers, search])

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    sent: customers.filter(c => c.status === 'Match Sent').length,
    onHold: customers.filter(c => c.status === 'On Hold').length,
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#f5f4f0' }}>
      <p className="text-sm text-slate-500">Loading your dashboard...</p>
    </div>
  )

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#f5f4f0' }}>
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between px-8"
          style={{ background: 'white', borderBottom: '1px solid #eadfda' }}>
          <div className="relative w-80">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients by name, city, religion..."
              className="w-full rounded-full py-2 pl-9 pr-4 text-sm outline-none"
              style={{ background: '#f8f3ef', color: '#3b1020' }}
            />
          </div>
          <p className="text-sm font-medium text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="space-y-6 pb-12">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#3b1020' }}>
                {getGreeting()}, {user.name?.split(' ')[0] || 'Aryan'}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                You have{' '}
                <span className="font-semibold" style={{ color: '#5a1630' }}>{stats.total} Assigned Clients</span>
                , with{' '}
                <span className="font-semibold" style={{ color: '#e8b06c' }}>{stats.active} needing attention</span>
                {' '}today.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'ASSIGNED', value: stats.total, trend: '+2 this week', trendColor: '#64748b' },
                { label: 'ACTIVE', value: stats.active, trend: '80% engagement', trendColor: '#16a34a' },
                { label: 'MATCHES', value: stats.sent, trend: '+3 this month', trendColor: '#16a34a' },
                { label: 'ON HOLD', value: stats.onHold, trend: 'Needs action', trendColor: '#e8b06c' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm"
                  style={{ border: '1px solid #eadfda' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold" style={{ color: '#3b1020' }}>{s.value}</p>
                  <p className="mt-2 text-xs font-medium" style={{ color: s.trendColor }}>{s.trend}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden"
              style={{ border: '1px solid #eadfda' }}>

              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid #f1ebe7' }}>
                <div>
                  <h2 className="text-base font-bold" style={{ color: '#3b1020' }}>Priority Clients</h2>
                  {search && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {filteredCustomers.length} result{filteredCustomers.length !== 1 ? 's' : ''} for "{search}"
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {filters.map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className="rounded-full px-3 py-1 text-xs font-medium transition"
                      style={{
                        background: activeFilter === f ? '#3b1020' : '#f8f3ef',
                        color: activeFilter === f ? '#f7e6d0' : '#64748b',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <table className="w-full text-sm">
                <thead style={{ background: '#fbf8f6' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">City</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Religion</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Income</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, i) => {
                    const status = statusStyles[customer.status] || statusStyles['Active']
                    return (
                      <tr
                        key={customer.id}
                        className="transition-colors hover:bg-[#fbf8f6] cursor-pointer"
                        style={{ borderTop: i === 0 ? 'none' : '1px solid #f1ebe7' }}
                        onClick={() => router.push(`/dashboard/${customer.id}`)}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                              style={{ background: '#f7e6d0', color: '#5a1630' }}>
                              {getInitials(customer.firstName, customer.lastName)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {customer.firstName} {customer.lastName}
                              </p>
                              <p className="text-xs text-slate-400">{customer.age} yrs · {customer.designation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{ background: status.bg, color: status.color }}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{customer.city}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{customer.religion}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          ₹{(customer.income / 100000).toFixed(1)}L
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={e => { e.stopPropagation(); router.push(`/dashboard/${customer.id}`) }}
                            className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:shadow-sm"
                            style={{ borderColor: '#eadfda', color: '#5a1630', background: 'white' }}
                          >
                            View <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredCustomers.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-sm text-slate-400">
                    {search ? `No clients found for "${search}"` : 'No clients with this status'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}