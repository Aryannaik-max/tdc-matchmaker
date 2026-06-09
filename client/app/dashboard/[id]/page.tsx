'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Profile, MatchResult } from '@/types'
import Sidebar from '@/components/Sidebar'
import SendMatchModal from '@/components/SendMail'

const avatarColors = [
  { bg: 'bg-[#FAECE7]', color: 'text-[#993C1D]' },
  { bg: 'bg-[#E6F1FB]', color: 'text-[#185FA5]' },
  { bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]' },
  { bg: 'bg-[#EEEDFE]', color: 'text-[#534AB7]' },
]

const statusConfig: Record<string, { bg: string; color: string }> = {
  'Active':     { bg: 'bg-[#E6F1FB]', color: 'text-[#185FA5]' },
  'Match Sent': { bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]' },
  'On Hold':    { bg: 'bg-[#FAEEDA]', color: 'text-[#854F0B]' },
  'Matched':    { bg: 'bg-[#EEEDFE]', color: 'text-[#534AB7]' },
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-[14px] border-b border-black/[0.07]">
      <p className="text-[10px] text-[#9b9b93] tracking-[0.1em] uppercase mb-2.5">
        {label}
      </p>
      {children}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-xs text-[#6b6b65]">{k}</span>
      <span className="text-xs font-medium text-[#1a1a18]">{v}</span>
    </div>
  )
}

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<Profile | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [notes, setNotes] = useState('')
  const [loadingCustomer, setLoadingCustomer] = useState(true)
  const [pendingMatch, setPendingMatch] = useState<Profile | null>(null)
  const [sending, setSending] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [notesSaved, setNotesSaved] = useState(false)
  const [sentMatches, setSentMatches] = useState<string[]>([])
  const [sentMatchProfiles, setSentMatchProfiles] = useState<Profile[]>([])
  const [loadError, setLoadError] = useState('')
  const [toastMessage, setToastMessage] = useState<{ text: string; profile: string } | null>(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }

    const savedNotes = localStorage.getItem(`notes-${id}`)
    if (savedNotes) setNotes(savedNotes)

    const fetchCustomer = async () => {
      try {
        const data = await api.getCustomer(id)
        setCustomer(data)
        if (data.sentMatches?.length) {
          setSentMatches(data.sentMatches)
        }
      } catch (error) {
        console.error(error)
        setLoadError('Unable to load this customer profile right now.')
      } finally {
        setLoadingCustomer(false)
      }
    }

    const fetchMatches = async () => {
      try {
        const data = await api.getMatches(id)
        const list = Array.isArray(data) ? data : data.matches || []
        setMatches(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingMatches(false)
      }
    }

    const fetchSentMatches = async () => {
      try {
        const data = await api.getSentMatches(id)
        setSentMatchProfiles(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchCustomer()
    fetchMatches()
    fetchSentMatches()
  }, [id, router])

  const handleSaveNotes = async () => {
    if (!customer) return
    try {
      await api.saveNotes(customer.id, notes)
    }catch (err) {
      console.error('Failed to save notes', err)
    } finally {
      localStorage.setItem(`notes-${customer.id}`, notes)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    }
  }

  const handleSendMatch = async () => {
    if (!pendingMatch || !customer) return
    setSending(true)
    try {
      await api.sendMatch(customer.id, pendingMatch.id)
      const updated = [...sentMatches, pendingMatch.id]
      setSentMatches(updated)

      const data = await api.getSentMatches(customer.id)
      setSentMatchProfiles(Array.isArray(data) ? data : [])

      setToastMessage({ text: 'Match sent!', profile: `${pendingMatch.firstName} ${pendingMatch.lastName}` })
      setTimeout(() => setToastMessage(null), 3000)
    } catch (err) {
      console.error('Failed to send match', err)
    } finally {
      setSending(false)
      setPendingMatch(null)
    }
  }

  const formatIncome = (income: number) => `₹${(income / 100000).toFixed(1)}L/yr`

  if (loadingCustomer) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="text-center">
        <div className="text-[22px] text-[#3D1A2E] mb-2"></div>
        <p className="text-[13px] text-[#6b6b65]">Loading profile...</p>
      </div>
    </div>
  )

  if (loadError) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="bg-white border border-black/[0.07] rounded-2xl p-8 text-center max-w-[360px]">
        <p className="text-[15px] font-medium text-[#1a1a18]">Profile unavailable</p>
        <p className="text-[13px] text-[#6b6b65] mt-2">{loadError}</p>
        <button 
          onClick={() => router.push('/dashboard')} 
          className="mt-4 px-4 py-2 rounded-lg border border-black/[0.07] bg-transparent text-[#3D1A2E] text-[13px] cursor-pointer font-inherit"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )

  if (!customer) return null

  const initials = customer.firstName[0] + customer.lastName[0]
  const colorIdx = (customer.firstName?.charCodeAt(0) || 0) % avatarColors.length
  const status = statusConfig[customer.status] || { bg: 'bg-[#F1EFE8]', color: 'text-[#5F5E5A]' }

  return (
    <div className="flex min-h-screen bg-[#f5f4f0]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 flex h-[52px] items-center gap-3 border-b border-black/10 bg-white px-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-[13px] text-[#6b6b65] transition-colors hover:text-[#1a1a18]"
          >
            <i className="ti ti-arrow-left text-sm" aria-hidden="true" />
            Back to dashboard
          </button>
        </div>
        <div className="flex items-center gap-4 bg-[#3D1A2E] px-7 py-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-white/20 bg-white/15 text-xl font-medium text-white">
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-medium text-white">
              {customer.firstName} {customer.lastName}
            </div>

            <div className="mt-1 flex items-center gap-3 text-[13px] text-white/60">
              <span className="flex items-center gap-1">
                <i className="ti ti-map-pin text-[13px]" aria-hidden="true" />
                {customer.city}, India
              </span>
              <span className="flex items-center gap-1">
                <i className="ti ti-building text-[13px]" aria-hidden="true" />
                {customer.designation} at {customer.company}
              </span>
              <span className="flex items-center gap-1">
                <i className="ti ti-school text-[13px]" aria-hidden="true" />
                {customer.degree}
              </span>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${status.bg} ${status.color}`}
          >
            {customer.status}
          </span>
        </div>
        <div className="grid grid-cols-[280px_1fr] gap-4 p-6">
          <div className="bg-white border h-full border-black/[0.07] rounded-xl px-4">
            <Section label="Personal">
              <Row k="Age" v={`${customer.age} yrs`} />
              <Row k="Date of birth" v={customer.dateOfBirth || '—'} />
              <Row k="Height" v={`${customer.height} cm`} />
              <Row k="Religion" v={customer.religion} />
              <Row k="Caste" v={customer.caste} />
              <Row k="Marital status" v={customer.maritalStatus} />
              <Row k="Siblings" v={String(customer.siblings)} />
            </Section>
            <Section label="Education & Career">
              <Row k="College" v={customer.college} />
              <Row k="Degree" v={customer.degree} />
              <Row k="Designation" v={customer.designation} />
              <Row k="Income" v={formatIncome(customer.income)} />
            </Section>
            <Section label="Preferences">
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Kids: ${customer.wantKids}`,
                  `Relocate: ${customer.openToRelocate}`,
                  `Pets: ${customer.openToPets}`,
                ].map(tag => (
                  <span key={tag} className="rounded-full border border-black/10 bg-[#f5f4f0] px-2.5 py-1 text-[11px] text-[#6b6b65]">
                    {tag}
                  </span>
                ))}
              </div>
            </Section>
            <Section label="Languages">
              <div className="flex flex-wrap gap-1.5">
                {customer.languages.map(lang => (
                  <span key={lang} className="text-[11px] px-2.5 py-[3px] rounded-full bg-[#f5f4f0] text-[#6b6b65] border border-black/[0.07]">
                    {lang}
                  </span>
                ))}
              </div>
            </Section>
            <Section label="Sent Matches">
              {sentMatchProfiles.length === 0 ? (
                <p className="text-xs text-[#9b9b93]">No matches sent yet.</p>
              ) : (
                <div className='flex flex-col gap-2'>
                  {sentMatchProfiles.map(p => {
                    const idx = (p.firstName?.charCodeAt(0) || 0) % avatarColors.length
                    const av = avatarColors[idx]
                    return (
                      <div
                        key={p.id}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-[#f5f4f0] px-2.5 py-2 transition-colors hover:border-black/[0.15]"
                        onClick={() => router.push(`/match/${p.id}`)}
                      >
                        <div 
                          className={`w-[30px] h-[30px] rounded-lg shrink-0 flex items-center justify-center text-[11px] font-medium ${av.bg} ${av.color}`}
                        >
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#1a1a18] m-0">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-[11px] text-[#6b6b65] m-0 truncate">
                            {p.age} yrs · {p.city}
                          </p>
                        </div>
                        <span className="ml-auto text-[10px] px-[7px] py-[2px] rounded-full bg-[#E1F5EE] text-[#0F6E56] shrink-0 border border-[#0F6E56]/20">
                          Sent
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </Section>

            <Section label="Contact">
              <Row k="Email" v={customer.email} />
              <Row k="Phone" v={customer.phone} />
            </Section>
            <Section label="Matchmaker notes">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes from your call or meeting..."
                className="w-full rounded-lg px-3 py-2.5 text-xs border border-black/[0.07] bg-[#f5f4f0] text-[#1a1a18] outline-none resize-none leading-relaxed font-inherit box-border"
              />
              <button
                onClick={handleSaveNotes}
                className={`w-full mt-2 py-[7px] rounded-lg text-xs cursor-pointer font-inherit transition-all duration-200 border ${
                  notesSaved 
                    ? 'border-[#0F6E56]/30 bg-[#E1F5EE] text-[#0F6E56]' 
                    : 'border-black/[0.07] bg-[#f5f4f0] text-[#6b6b65]'
                }`}
              >
                {notesSaved ? '✓ Saved' : 'Save notes'}
              </button>
            </Section>
          </div>
          <div className="bg-white border border-black/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-[18px] py-4 border-b border-black/[0.07]">
              <div>
                <p className="text-sm font-medium text-[#1a1a18]">Suggested matches</p>
                <p className="text-xs text-[#9b9b93] mt-0.5">AI ranked · top 10 from pool</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#EEEDFE] text-[#534AB7] border border-[#534AB7]/20 flex items-center gap-[5px]">
                <i className="ti ti-sparkles text-xs" aria-hidden="true" />
                AI scored
              </span>
            </div>

            <div className="p-3 flex flex-col gap-2">
              {loadingMatches ? (
                <div className="text-center py-[60px] text-[#9b9b93] text-[13px]">
                  Finding best matches...
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-[60px] text-[#9b9b93] text-[13px]">
                  No matches found
                </div>
              ) : matches.map((match: MatchResult, i: number) => {
                const p = match.profile
                const matchInitials = p.firstName[0] + p.lastName[0]
                const isSent = sentMatches.includes(p.id)
                const mColorIdx = (p.firstName?.charCodeAt(0) || 0) % avatarColors.length
                const mAv = avatarColors[mColorIdx]
                const scoreLabel = match.score >= 85
                  ? { text: 'High potential', bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]' }
                  : match.score >= 65
                  ? { text: 'Good match', bg: 'bg-[#FAEEDA]', color: 'text-[#854F0B]' }
                  : { text: 'Possible match', bg: 'bg-[#F1EFE8]', color: 'text-[#5F5E5A]' }
                  
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-[10px] cursor-pointer border border-black/[0.07] bg-[#f5f4f0] transition-colors duration-150 hover:border-black/[0.15]"
                    onClick={() => router.push(`/match/${p.id}`)}
                  >
                    <div 
                      className={`w-[42px] h-[42px] rounded-[10px] shrink-0 flex items-center justify-center text-[13px] font-medium ${mAv.bg} ${mAv.color}`}
                    >
                      {matchInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#1a1a18]">
                          {p.firstName} {p.lastName}
                        </span>
                        <span 
                          className={`text-[10px] px-[7px] py-[2px] rounded-full ${scoreLabel.bg} ${scoreLabel.color}`}
                        >
                          {scoreLabel.text}
                        </span>
                        {i < 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEEDFE] text-[#534AB7]">
                            AI pick
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6b6b65] mt-0.5 truncate">
                        {p.age} yrs · {p.designation} · {p.city} · {p.religion}
                      </p>
                      {match.reason && (
                        <p className="text-[11px] text-[#9b9b93] mt-[3px] italic truncate">
                          "{match.reason}"
                        </p>
                      )}
                    </div>
                    <div
                      className="flex flex-col items-end gap-2 shrink-0"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="text-right">
                        <div className="text-[18px] font-medium text-[#3D1A2E]">{match.score}%</div>
                        <div className="text-[9px] text-[#9b9b93] tracking-[0.08em] uppercase">MATCH</div>
                      </div>
                      <button
                        onClick={() => setPendingMatch(p)}
                        className={`px-3 py-[5px] rounded-lg text-[11px] cursor-pointer font-inherit transition-all duration-150 border ${
                          isSent
                            ? 'border-[#0F6E56]/30 bg-[#E1F5EE] text-[#0F6E56]'
                            : 'border-black/[0.07] bg-white text-[#1a1a18]'
                        }`}
                      >
                        {isSent ? '✓ Sent' : 'Send match'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[100] bg-[#E1F5EE] border border-[#0F6E56]/30 rounded-[10px] px-[18px] py-3 flex items-center gap-2.5 text-[13px] text-[#0F6E56] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <i className="ti ti-circle-check text-base" />
            Match sent to <strong className="ml-1">{toastMessage.profile}</strong>
          </div>
        )}
        {pendingMatch && customer && (
          <SendMatchModal
            customer={customer}
            match={pendingMatch}
            onClose={() => setPendingMatch(null)}
            onConfirm={handleSendMatch}
          />
        )}
      </main>
    </div>
  )
}