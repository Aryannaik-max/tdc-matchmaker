'use client'
import { Profile } from '@/types'

interface Props {
  customer: Profile
  onClick: () => void
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  'Active':     { bg: '#E6F1FB', color: '#185FA5', label: 'Active' },
  'Match Sent': { bg: '#E1F5EE', color: '#0F6E56', label: 'Match sent' },
  'On Hold':    { bg: '#FAEEDA', color: '#854F0B', label: 'On hold' },
  'Matched':    { bg: '#EEEDFE', color: '#534AB7', label: 'Matched' },
}

const avatarColors = [
  { bg: '#FAECE7', color: '#993C1D' },
  { bg: '#E6F1FB', color: '#185FA5' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#EEEDFE', color: '#534AB7' },
]

export default function CustomerCard({ customer, onClick }: Props) {
  const initials = (customer.firstName?.[0] || '') + (customer.lastName?.[0] || '')
  const status = statusConfig[customer.status] || { bg: '#F1EFE8', color: '#5F5E5A', label: customer.status }
  const colorIdx = (customer.firstName?.charCodeAt(0) || 0) % avatarColors.length
  const av = avatarColors[colorIdx]

  return (
    <div
      onClick={onClick}
      className="bg-white border border-black/[0.07] rounded-xl p-4 cursor-pointer transition-colors duration-150 hover:border-black/[0.15]"
    >
      {/* card top */}
      <div className="flex items-start gap-3 mb-3">
        {/* avatar */}
        <div
          className="w-[38px] h-[38px] rounded-[10px] flex-shrink-0 flex items-center justify-center text-[13px] font-medium"
          style={{ background: av.bg, color: av.color }}
        >
          {initials}
        </div>

        {/* name + role */}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-[#1a1a18] truncate">
            {customer.firstName} {customer.lastName}
          </div>
          <div className="text-[12px] text-[#6b6b65] mt-0.5 truncate">
            {customer.designation} · {customer.company}
          </div>
        </div>

        {/* status badge */}
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* meta row */}
      <div className="flex gap-3 text-[12px] text-[#6b6b65] mb-3.5">
        <span className="flex items-center gap-1">
          <i className="ti ti-map-pin text-[13px]" aria-hidden="true" />
          {customer.city}
        </span>
        <span className="flex items-center gap-1">
          <i className="ti ti-user text-[13px]" aria-hidden="true" />
          {customer.age} yrs
        </span>
        <span>{customer.maritalStatus}</span>
      </div>

      {/* action button */}
      <div className="border-t border-black/[0.07] pt-3">
        <button
          onClick={e => { e.stopPropagation(); onClick() }}
          className="w-full py-1.5 rounded-lg text-[11px] cursor-pointer border-none bg-[#3D1A2E] text-white font-sans transition-colors duration-150 hover:bg-[#5a2645]"
        >
          View
        </button>
      </div>
    </div>
  )
}