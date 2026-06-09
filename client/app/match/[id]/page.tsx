'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Profile } from '@/types'
import Sidebar from '@/components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCakeCandles, faRulerVertical, faSackDollar, faHandsPraying,
  faLocationDot, faBriefcase, faGraduationCap, faVenusMars,
  faBaby, faPlane, faCat,
  faEnvelope, faPhone
} from '@fortawesome/free-solid-svg-icons'

const avatarColors = [
  { bg: '#FAECE7', color: '#993C1D' },
  { bg: '#E6F1FB', color: '#185FA5' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#EEEDFE', color: '#534AB7' },
]

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-[#f5f4f0] text-[#6b6b65] border border-black/[0.07]">
      {children}
    </span>
  )
}

function StatCard({ icon, label, value, green }: {
  icon: any; label: string; value: string; green?: boolean
}) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-xl p-4 flex flex-col gap-1.5 backdrop-blur-sm">
      <FontAwesomeIcon icon={icon} className="text-white/50 w-4 h-4" />
      <div className={`text-lg font-semibold ${green ? 'text-emerald-300' : 'text-white'}`}>{value}</div>
      <div className="text-[10px] text-white/50 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-[#9b9b93] uppercase tracking-wider">{label}</span>
      <span className="text-[13px] font-medium text-[#1a1a18]">{value}</span>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-black/[0.07]">
        <p className="text-[11px] text-[#9b9b93] uppercase tracking-widest m-0">{title}</p>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

export default function MatchProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }

    const fetchProfile = async () => {
      try {
        const data = await api.getPoolProfile(id)
        setProfile(data)
      } catch (err) {
        console.error(err)
        setLoadError('Unable to load this profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  const formatIncome = (income: number) => `₹${(income / 100000).toFixed(1)}L/yr`

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <p className="text-[13px] text-[#6b6b65]">Loading profile...</p>
    </div>
  )

  if (loadError || !profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="bg-white border border-black/[0.07] rounded-2xl p-8 text-center max-w-sm">
        <p className="text-[15px] font-medium text-[#1a1a18]">Profile unavailable</p>
        <p className="text-[13px] text-[#6b6b65] mt-2">{loadError}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded-lg border border-black/[0.07] bg-transparent text-[#3D1A2E] text-[13px] cursor-pointer font-sans"
        >
          Go back
        </button>
      </div>
    </div>
  )

  const initials = profile.firstName[0] + profile.lastName[0]
  const colorIdx = (profile.firstName?.charCodeAt(0) || 0) % avatarColors.length
  const av = avatarColors[colorIdx]

  const prefTiles = [
    { icon: faBaby,  label: 'Want Kids',        value: profile.wantKids },
    { icon: faPlane, label: 'Open to Relocate',  value: profile.openToRelocate },
    { icon: faCat,   label: 'Open to Pets',      value: profile.openToPets },
  ]

  return (
    <div className="flex min-h-screen bg-[#f5f4f0]">
      <Sidebar />
      <main className="flex-1 overflow-auto overflow-x-hidden">

        {/* topbar */}
        <div className="bg-white border-b border-black/[0.07] px-6 h-[52px] flex items-center sticky top-0 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-[#6b6b65] bg-none border-none cursor-pointer font-sans hover:text-[#1a1a18] transition-colors"
          >
            <i className="ti ti-arrow-left text-[14px]" />
            Back
          </button>
        </div>

        {/* hero banner */}
        <div
          className="relative overflow-hidden px-8 pt-8 pb-8"
          style={{ background: 'linear-gradient(135deg, #3D1A2E 0%, #5a1a3a 100%)' }}
        >
          {/* decorative circles */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/[0.04] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-32 w-36 h-36 rounded-full bg-white/[0.04] translate-y-1/2" />

          {/* profile info */}
          <div className="relative flex items-center gap-5 mb-8">
            <div
              className="w-[72px] h-[72px] rounded-[18px] flex-shrink-0 flex items-center justify-center text-[26px] font-semibold shadow-lg"
              style={{ background: av.bg, color: av.color }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h1 className="text-[22px] font-semibold text-white m-0">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/15 text-white/85 border border-white/20">
                  Pool Member
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-[13px] text-white/65">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" />
                  {profile.city}, {profile.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBriefcase} className="w-3 h-3" />
                  {profile.designation} · {profile.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faGraduationCap} className="w-3 h-3" />
                  {profile.degree} · {profile.college}
                </span>
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faVenusMars} className="w-3 h-3" />
                  {profile.gender} · {profile.age} yrs
                </span>
              </div>
            </div>
          </div>

          {/* stat cards */}
          <div className="relative grid grid-cols-4 gap-3">
            <StatCard icon={faCakeCandles}  label="Age"      value={`${profile.age} yrs`} />
            <StatCard icon={faRulerVertical} label="Height"   value={`${profile.height} cm`} />
            <StatCard icon={faSackDollar}    label="Income"   value={formatIncome(profile.income)} green />
            <StatCard icon={faHandsPraying}  label="Religion" value={profile.religion} />
          </div>
        </div>

        {/* main body */}
        <div className="grid grid-cols-2 gap-4 px-7 pt-5 pb-8">

          {/* Personal Details */}
          <Card title="Personal Details">
            <div className="grid grid-cols-2 gap-5">
              <InfoBlock label="Date of Birth"   value={profile.dateOfBirth || '—'} />
              <InfoBlock label="Gender"          value={profile.gender} />
              <InfoBlock label="Marital Status"  value={profile.maritalStatus} />
              <InfoBlock label="Siblings"        value={String(profile.siblings)} />
              <InfoBlock label="Caste"           value={profile.caste} />
              <InfoBlock label="Religion"        value={profile.religion} />
            </div>
          </Card>

          {/* Education & Career */}
          <Card title="Education & Career">
            <div className="grid grid-cols-2 gap-5">
              <InfoBlock label="College"       value={profile.college} />
              <InfoBlock label="Degree"        value={profile.degree} />
              <InfoBlock label="Company"       value={profile.company} />
              <InfoBlock label="Designation"   value={profile.designation} />
              <InfoBlock label="Annual Income" value={formatIncome(profile.income)} />
            </div>
          </Card>

          {/* Lifestyle & Preferences */}
          <Card title="Lifestyle & Preferences">
            <div className="grid grid-cols-3 gap-3">
              {prefTiles.map(item => (
                <div
                  key={item.label}
                  className="bg-[#f5f4f0] rounded-xl p-4 border border-black/[0.07] text-center"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-black/[0.07] flex items-center justify-center mx-auto mb-2">
                    <FontAwesomeIcon icon={item.icon} className="w-4 h-4 text-[#3D1A2E]" />
                  </div>
                  <div className="text-[13px] font-medium text-[#1a1a18]">{item.value}</div>
                  <div className="text-[10px] text-[#9b9b93] mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Languages + Contact */}
          <div className="flex flex-col gap-4">
            <Card title="Languages">
              <div className="flex gap-2 flex-wrap">
                {profile.languages.map(lang => (
                  <Chip key={lang}>{lang}</Chip>
                ))}
              </div>
            </Card>

            <Card title="Contact Information">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-[34px] h-[34px] rounded-[9px] bg-[#E6F1FB] flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-[#185FA5]" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9b9b93] uppercase tracking-wider">Email</div>
                    <div className="text-[13px] font-medium text-[#1a1a18]">{profile.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[34px] h-[34px] rounded-[9px] bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-[#0F6E56]" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9b9b93] uppercase tracking-wider">Phone</div>
                    <div className="text-[13px] font-medium text-[#1a1a18]">{profile.phone}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}