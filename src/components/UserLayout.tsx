import type { ReactNode } from 'react'
import { getAuth } from '../lib/auth'

type Props = { active: 'books' | 'loans'; children: ReactNode }

export default function UserLayout({ active, children }: Props) {
  const auth = getAuth()
  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-bg p-5 text-text md:grid-cols-[260px_1fr] lg:grid-cols-[260px_1fr_340px]">
      <aside className="rounded-card border border-border bg-panel p-4 shadow-panel">
        <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-brand to-violet-300" />
          <div>
            <div className="text-sm font-extrabold">Aplikasi Pinjam Buku</div>
            <div className="mt-0.5 text-xs text-muted">Portal User</div>
          </div>
        </div>
        <div className="grid gap-2">
          <a className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-extrabold ${active==='books'?'bg-violet-100 text-text':'text-text'}`} href="/user/books">
            <span className="h-2 w-2 rounded bg-slate-300" />
            Pinjam Buku
          </a>
          <a className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-extrabold ${active==='loans'?'bg-violet-100 text-text':'text-text'}`} href="/user/loans">
            <span className="h-2 w-2 rounded bg-slate-300" />
            Pinjaman Saya
          </a>
        </div>
        <button className="mt-3 w-full rounded-xl border border-dashed border-border px-3 py-2 text-left text-[13px] font-extrabold text-muted" onClick={() => { localStorage.clear(); window.location.href = '/login-user' }}>
          Log Out
        </button>
      </aside>
      <main className="rounded-card border border-border bg-panel p-4 shadow-panel">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="text-[14px] font-extrabold tracking-wide text-slate-700">{active === 'books' ? 'PINJAM BUKU' : 'PINJAMAN SAYA'}</div>
          <div className="rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted">API: /api</div>
        </div>
        {children}
      </main>
      <aside className="hidden rounded-card border border-border bg-panel p-4 shadow-panel lg:block">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-[14px] bg-gradient-to-br from-cyan-500 to-green-500" />
            <div>
              <div className="text-[13px] font-extrabold">{auth.user?.name || 'User'}</div>
              <div className="text-xs text-muted">{auth.user?.role || '-'}</div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted">JWT</div>
        </div>
        <div className="mt-3 text-sm text-muted">Gunakan filter untuk mempersempit hasil pencarian.</div>
      </aside>
    </div>
  )
}
