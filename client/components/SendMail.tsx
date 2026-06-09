import { Profile } from '@/types'

interface Props {
  customer: Profile
  match: Profile
  onConfirm: () => void
  onClose: () => void
}

function getInitials(f: string, l: string) {
  return `${f[0]}${l[0]}`.toUpperCase()
}

export default function SendMatchModal({ customer, match, onConfirm, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ background: 'white', border: '1px solid #eadfda' }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Confirm Match</p>
          <h2 className="text-lg font-bold" style={{ color: '#3b1020' }}>Send this match?</h2>
          <p className="text-sm text-slate-500 mt-1">This will record a match between the two profiles below.</p>
        </div>

        {/* profiles side by side */}
        <div className="flex items-center gap-4 mb-6">

          {/* customer */}
          <div className="flex-1 rounded-xl p-4 text-center" style={{ background: '#fbf8f6', border: '1px solid #eadfda' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2"
              style={{ background: '#f7e6d0', color: '#5a1630' }}>
              {getInitials(customer.firstName, customer.lastName)}
            </div>
            <p className="text-sm font-semibold" style={{ color: '#3b1020' }}>{customer.firstName} {customer.lastName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{customer.age} · {customer.city}</p>
            <p className="text-xs text-slate-400">{customer.designation}</p>
          </div>

          {/* heart */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#fee2e2' }}>
              <i className="ti ti-heart text-sm" style={{ color: '#991b1b' }} aria-hidden="true"></i>
            </div>
            <div className="h-8 w-px" style={{ background: '#eadfda' }}></div>
          </div>

          {/* match */}
          <div className="flex-1 rounded-xl p-4 text-center" style={{ background: '#fbf8f6', border: '1px solid #eadfda' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2"
              style={{ background: '#f7e6d0', color: '#5a1630' }}>
              {getInitials(match.firstName, match.lastName)}
            </div>
            <p className="text-sm font-semibold" style={{ color: '#3b1020' }}>{match.firstName} {match.lastName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{match.age} · {match.city}</p>
            <p className="text-xs text-slate-400">{match.designation}</p>
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
            style={{ background: '#f8f3ef', color: '#64748b', border: '1px solid #eadfda' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
            style={{ background: '#3b1020', color: '#f7e6d0' }}
          >
            ✦ Send Match
          </button>
        </div>
      </div>
    </div>
  )
}