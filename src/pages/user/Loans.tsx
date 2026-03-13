import { useEffect, useMemo, useState } from 'react'
import { IonPage, IonContent, IonRefresher, IonRefresherContent, IonButton, IonInput } from '@ionic/react'
import { fetchLoans } from '../../lib/api'
import UserLayout from '../../components/UserLayout'

export default function Loans() {
  const [loans, setLoans] = useState<any[]>([])
  const [q, setQ] = useState('')

  async function load() {
    const res = await fetchLoans({ per_page: 50 })
    setLoans(res.data.data || res.data)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return loans
    return loans.filter((ln) => {
      const t = `${ln.isbn||''} ${ln.tanggal_pinjam||''} ${ln.tanggal_kembali||''}`.toLowerCase()
      return t.includes(s)
    })
  }, [q, loans])

  function status(ln:any) {
    const today = new Date().toISOString().slice(0,10)
    if (!ln.tanggal_kembali) return { label: 'Aktif', days: null, late: false }
    if (ln.tanggal_kembali < today) {
      const d = Math.ceil((new Date(today).getTime() - new Date(ln.tanggal_kembali).getTime())/86400000)
      return { label: `Terlambat ${d} hari`, days: -d, late: true }
    } else {
      const d = Math.ceil((new Date(ln.tanggal_kembali).getTime() - new Date(today).getTime())/86400000)
      return { label: `Sisa ${d} hari`, days: d, late: false }
    }
  }

  return (
    <IonPage>
      <IonContent>
        <UserLayout active="loans">
          <div className="rounded-card border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-extrabold">Pinjaman Saya</div>
              <IonButton size="small" onClick={load}>Muat ulang</IonButton>
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <IonInput className="min-w-[240px]" placeholder="Cari ISBN / tanggal..." value={q} onIonChange={(e)=>setQ(e.detail.value||'')} />
              <IonButton onClick={()=>setQ('')}>Bersihkan</IonButton>
            </div>
            <div className="">
              {filtered.map((ln) => {
                const st = status(ln)
                return (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-3" key={ln.id || `${ln.isbn}-${ln.tanggal_pinjam}`}>
                    <div className="min-w-0">
                      <div className="truncate font-extrabold">{ln.isbn}</div>
                      <div className="text-sm text-muted">{ln.tanggal_pinjam} • {ln.tanggal_kembali || '-'}</div>
                    </div>
                    <div>
                      <span className={`inline-block rounded-lg border px-2 py-1 text-xs font-extrabold ${st.late ? 'border-red-300 bg-red-100 text-red-800' : 'border-emerald-300 bg-emerald-100 text-emerald-800'}`}>{st.label}</span>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-sm text-muted">Belum ada data.</div>
              )}
            </div>
          </div>
        </UserLayout>
        <IonRefresher slot="fixed" onIonRefresh={async (e) => { await load(); e.detail.complete() }}>
          <IonRefresherContent />
        </IonRefresher>
      </IonContent>
    </IonPage>
  )
}
