'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.login(username, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0] font-sans">
      <div className="w-full max-w-md rounded-2xl p-8 bg-white border border-[#eadfda] shadow-sm">
        {/* header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#f7e6d0] flex items-center justify-center mb-3">
            <span className="text-xl font-bold text-[#5a1630]">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-[#3b1020]">TDC Matchmaker</h1>
          <p className="text-sm mt-1 text-slate-500">Internal matchmaker portal</p>
          <div className="mt-3 mx-auto w-16 h-px bg-[#e8b06c]/30"></div>
        </div>

        {/* form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs mb-1.5 block text-slate-500 tracking-wider">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="matchmaker"
              className="w-full rounded-full border-none bg-[#f8f3ef] py-2 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#e8b06c]/40 transition"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div>
            <label className="text-xs mb-1.5 block text-slate-500 tracking-wider">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-full border-none bg-[#f8f3ef] py-2 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#e8b06c]/40 transition"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <p className="text-xs text-red-300">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 text-sm font-medium mt-1 transition ${loading ? 'opacity-70' : 'hover:bg-[#461025]'} text-white`}
            style={{ background: '#5a1630' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex justify-between items-center mt-2">
            <label className="text-xs text-slate-500 flex items-center gap-2">
              <input type="checkbox" className="accent-[#e8b06c]" /> <span>Remember me</span>
            </label>
            <button className="text-xs text-[#5a1630]/90 hover:underline">Forgot?</button>
          </div>
        </div>

        {/* divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/8"></div>
          <span className="text-amber-100/60 text-sm">✦</span>
          <div className="flex-1 h-px bg-white/8"></div>
        </div>

        {/* footer */}
        <p className="text-center text-xs text-slate-500 leading-relaxed">
          Connecting hearts across India since 2020.
          <br />Trusted by 10,000+ families.
        </p>

        <div className="flex justify-center gap-6 mt-4">
          {['Privacy Policy', 'Terms', 'Support'].map((link, i) => (
            <button key={i} className="text-xs text-slate-500 hover:underline">{link}</button>
          ))}
        </div>

        <p className="text-center text-xs mt-4 text-slate-400">Use: matchmaker / tdc123</p>
      </div>
    </div>
  )
}