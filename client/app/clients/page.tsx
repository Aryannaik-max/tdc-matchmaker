"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Sidebar from '@/components/Sidebar'
import CustomerCard from '@/components/CustomerCard'
import { api } from '@/lib/api'
import { Profile } from '@/types'

export default function ClientsPage() {
  const [customers, setCustomers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('') // Added search state
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const data = await api.getCustomers()
        const list = Array.isArray(data) ? data : data.customers || data.data || []
        if (mounted) setCustomers(list)
      } catch (err) {
        console.error('Failed to load customers', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetch()
    return () => { mounted = false }
  }, [])

  // Filter customers based on search query
  const filteredCustomers = customers.filter((c) => {
    const searchLower = searchQuery.toLowerCase()
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase()
    return fullName.includes(searchLower)
  })

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5f4f0] font-sans">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[#eadfda] bg-white/80 px-8 backdrop-blur-md">
          <div className="relative w-96 max-w-full flex-1">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Bind input to state
              className="w-full rounded-full border-none bg-[#f8f3ef] py-2 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#e8b06c]/40"
            />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#3b1020]">My Clients</h1>
            <p className="text-sm text-slate-500 mt-1">All assigned clients and profile actions.</p>
          </div>

          {loading ? (
            <div className="text-center text-sm text-slate-500">Loading clients...</div>
          ) : customers.length === 0 ? (
            <div className="rounded-2xl border border-[#eadfda] bg-white p-8 text-center text-slate-500">No clients found.</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="rounded-2xl border border-[#eadfda] bg-white p-8 text-center text-slate-500">
              No clients found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredCustomers.map(c => ( // Map over filtered array instead of all customers
                <CustomerCard key={c.id} customer={c} onClick={() => router.push(`/dashboard/${c.id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}