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
  // deterministic color from name
  const colorIdx = (customer.firstName?.charCodeAt(0) || 0) % avatarColors.length
  const av = avatarColors[colorIdx]

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.07)',
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)')}
    >
      {/* card top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        {/* avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 500,
          background: av.bg, color: av.color,
        }}>
          {initials}
        </div>
        {/* name + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {customer.firstName} {customer.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#6b6b65', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {customer.designation} · {customer.company}
          </div>
        </div>
        {/* status badge */}
        <span style={{
          fontSize: 10, fontWeight: 500,
          padding: '3px 8px', borderRadius: 99,
          background: status.bg, color: status.color,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {status.label}
        </span>
      </div>

      {/* meta row */}
      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#6b6b65', marginBottom: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: 13 }} />
          {customer.city}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="ti ti-user" aria-hidden="true" style={{ fontSize: 13 }} />
          {customer.age} yrs
        </span>
        <span>{customer.maritalStatus}</span>
      </div>

      {/* action buttons */}
      <div style={{
        display: 'flex', gap: 6,
        borderTop: '0.5px solid rgba(0,0,0,0.07)', paddingTop: 12,
      }}>
        
        <button
          onClick={e => { e.stopPropagation(); onClick() }}
          style={{
            flex: 1, padding: '6px 0',
            borderRadius: 8, fontSize: 11, cursor: 'pointer',
            border: 'none',
            background: '#3D1A2E', color: '#fff',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#5a2645')}
          onMouseLeave={e => (e.currentTarget.style.background = '#3D1A2E')}
        >
          View
        </button>
      </div>
    </div>
  )
}