import { useEffect, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent } from '@ionic/react'
import { adminListBuku, adminListPenerbit, adminListPembaca, adminListPeminjaman } from '../../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ buku: 0, penerbit: 0, pembaca: 0, peminjaman: 0 })
  const [recent, setRecent] = useState<any[]>([])

  function getTotal(res: any) {
    const d = res?.data ?? {}
    if (d?.meta?.total !== undefined) return d.meta.total
    if (Array.isArray(d?.data)) return d.data.length
    if (Array.isArray(d)) return d.length
    return 0
  }

  useEffect(() => {
    async function load() {
      const [buku, penerbit, pembaca, pinjam] = await Promise.all([
        adminListBuku({ per_page: 1 }).catch(() => null),
        adminListPenerbit({ per_page: 1 }).catch(() => null),
        adminListPembaca({ per_page: 1 }).catch(() => null),
        adminListPeminjaman({ per_page: 5 }).catch(() => null),
      ])
      setStats({
        buku: getTotal(buku),
        penerbit: getTotal(penerbit),
        pembaca: getTotal(pembaca),
        peminjaman: getTotal(pinjam),
      })
      const d = pinjam?.data ?? {}
      setRecent(d.data ?? d ?? [])
    }
    load()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mb-4 text-lg font-extrabold">LEARNING MANAGEMENT SYSTEM</div>

        <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-panel">
            <div className="text-sm text-muted">Buku</div>
            <div className="text-3xl font-extrabold">{stats.buku}</div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-panel">
            <div className="text-sm text-muted">Penerbit</div>
            <div className="text-3xl font-extrabold">{stats.penerbit}</div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-panel">
            <div className="text-sm text-muted">Pembaca</div>
            <div className="text-3xl font-extrabold">{stats.pembaca}</div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-panel">
            <div className="text-sm text-muted">Peminjaman</div>
            <div className="text-3xl font-extrabold">{stats.peminjaman}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white">
          <div className="border-b border-border px-4 py-3 font-extrabold">Peminjaman Terbaru</div>
          <div className="overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="border-b border-border px-4 py-3 text-left">ID</th>
                  <th className="border-b border-border px-4 py-3 text-left">ISBN</th>
                  <th className="border-b border-border px-4 py-3 text-left">Tanggal Pinjam</th>
                  <th className="border-b border-border px-4 py-3 text-left">Tanggal Kembali</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id_peminjaman ?? r.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">{r.id_peminjaman ?? r.id}</td>
                    <td className="px-4 py-3">{r.isbn}</td>
                    <td className="px-4 py-3">{r.tanggal_pinjam}</td>
                    <td className="px-4 py-3">{r.tanggal_kembali}</td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td className="px-4 py-3 text-muted" colSpan={4}>Tidak ada data.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
