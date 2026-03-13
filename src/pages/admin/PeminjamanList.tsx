import { useEffect, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonModal, IonInput, IonToast, IonSearchbar, IonSelect, IonSelectOption, IonMenuButton, IonButtons } from '@ionic/react'
import { adminListPeminjaman, adminCreatePeminjaman, adminUpdatePeminjaman, adminDeletePeminjaman, adminListPembaca, adminListBuku } from '../../lib/api'

export default function PeminjamanList() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<any>({ id_pembaca: '', isbn: '', tanggal_pinjam: '', tanggal_kembali: '' })
  const [notice, setNotice] = useState('')
  const [pembacaOpts, setPembacaOpts] = useState<any[]>([])
  const [bukuOpts, setBukuOpts] = useState<any[]>([])

  async function load() {
    const res = await adminListPeminjaman({ q, per_page: perPage, page: currentPage })
    const payload = res.data ?? {}
    const data = payload.data ?? payload ?? []
    setItems(data)
    if (payload.meta) {
      setCurrentPage(payload.meta.current_page || 1)
      setLastPage(payload.meta.last_page || 1)
      setTotal(payload.meta.total || data.length)
    } else {
      setCurrentPage(1); setLastPage(1); setTotal(data.length)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage])

  useEffect(() => {
    load()
  }, [])

  async function loadOptions() {
    const p = await adminListPembaca({ per_page: 100 }).then(r => r.data?.data ?? r.data ?? []).catch(() => [])
    const b = await adminListBuku({ per_page: 100 }).then(r => r.data?.data ?? r.data ?? []).catch(() => [])
    setPembacaOpts(p)
    setBukuOpts(b)
  }

  function openNew() {
    setEditId(null)
    setForm({ id_pembaca: '', isbn: '', tanggal_pinjam: '', tanggal_kembali: '' })
    setOpen(true)
    loadOptions()
  }

  function openEdit(it: any) {
    const id = it.id_peminjaman ?? it.id
    setEditId(id)
    setForm({ id_pembaca: it.id_pembaca, isbn: it.isbn, tanggal_pinjam: it.tanggal_pinjam, tanggal_kembali: it.tanggal_kembali })
    setOpen(true)
    loadOptions()
  }

  async function save() {
    if (editId) await adminUpdatePeminjaman(editId, form)
    else await adminCreatePeminjaman(form)
    setOpen(false)
    setNotice('Tersimpan')
    await load()
  }

  async function remove(id: number) {
    await adminDeletePeminjaman(id)
    setNotice('Terhapus')
    await load()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Peminjaman</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-[320px] max-w-full">
              <IonSearchbar placeholder="Search peminjaman..." value={q} onIonChange={(e) => setQ(e.detail.value || '')} />
            </div>
            <IonSelect value={perPage} onIonChange={(e) => { setPerPage(e.detail.value); setCurrentPage(1) }}>
              <IonSelectOption value={10}>10 / page</IonSelectOption>
              <IonSelectOption value={20}>20 / page</IonSelectOption>
              <IonSelectOption value={50}>50 / page</IonSelectOption>
              <IonSelectOption value={100}>100 / page</IonSelectOption>
            </IonSelect>
            <IonButton onClick={() => { setCurrentPage(1); load() }}>Refresh</IonButton>
          </div>
          <IonButton onClick={openNew} className="bg-brand">Tambah Peminjaman</IonButton>
        </div>
        <div className="overflow-auto rounded-2xl border border-border bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="border-b border-border px-4 py-3 text-left">ID</th>
                <th className="border-b border-border px-4 py-3 text-left">Tanggal Pinjam</th>
                <th className="border-b border-border px-4 py-3 text-left">Tanggal Kembali</th>
                <th className="border-b border-border px-4 py-3 text-left">Pembaca</th>
                <th className="border-b border-border px-4 py-3 text-left">Buku</th>
                <th className="border-b border-border px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id_peminjaman ?? it.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{it.id_peminjaman ?? it.id}</td>
                  <td className="px-4 py-3">{it.tanggal_pinjam}</td>
                  <td className="px-4 py-3">{it.tanggal_kembali}</td>
                  <td className="px-4 py-3">{it.pembaca ? `${it.pembaca.nama_depan} ${it.pembaca.nama_belakang||''}`.trim() : (it.nama_pembaca || it.id_pembaca)}</td>
                  <td className="px-4 py-3">{it.buku ? `${it.buku.judul} (${it.buku.isbn})` : (it.judul_buku ? `${it.judul_buku} (${it.isbn})` : it.isbn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <IonButton className="border border-border bg-white text-slate-800" onClick={() => openEdit(it)}>Edit</IonButton>
                      <IonButton color="danger" onClick={() => remove(it.id_peminjaman ?? it.id)}>Hapus</IonButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
            <div className="text-muted">Page {currentPage} / {lastPage} • Total {total}</div>
            <div className="flex gap-2">
              <button disabled={currentPage<=1} className="rounded-lg border border-border px-3 py-2 font-extrabold disabled:opacity-50" onClick={() => currentPage>1 && setCurrentPage(currentPage-1)}>Prev</button>
              <button disabled={currentPage>=lastPage} className="rounded-lg border border-border px-3 py-2 font-extrabold disabled:opacity-50" onClick={() => currentPage<lastPage && setCurrentPage(currentPage+1)}>Next</button>
            </div>
          </div>
        </div>
        <IonModal isOpen={open} onDidDismiss={() => setOpen(false)}>
          <div className="ion-padding">
            <h2>{editId ? 'Ubah' : 'Tambah'} Peminjaman</h2>
            <IonItem>
              <IonLabel position="stacked">Pembaca</IonLabel>
              <IonSelect value={form.id_pembaca} onIonChange={(e) => setForm({ ...form, id_pembaca: e.detail.value })}>
                <IonSelectOption value="">-</IonSelectOption>
                {pembacaOpts.map((p) => (
                  <IonSelectOption key={p.id_pembaca ?? p.id} value={p.id_pembaca ?? p.id}>
                    {(p.nama_depan || p.nama_belakang) ? `${p.nama_depan || ''} ${p.nama_belakang || ''}`.trim() : (p.nama || `#${p.id_pembaca||p.id}`)}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">ISBN</IonLabel>
              <IonSelect value={form.isbn} onIonChange={(e) => setForm({ ...form, isbn: e.detail.value })}>
                <IonSelectOption value="">-</IonSelectOption>
                {bukuOpts.map((b) => (
                  <IonSelectOption key={b.isbn} value={b.isbn}>{b.judul} ({b.isbn})</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tanggal Pinjam</IonLabel>
              <IonInput type="date" value={form.tanggal_pinjam} onIonChange={(e) => setForm({ ...form, tanggal_pinjam: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tanggal Kembali</IonLabel>
              <IonInput type="date" value={form.tanggal_kembali} onIonChange={(e) => setForm({ ...form, tanggal_kembali: e.detail.value })} />
            </IonItem>
            <IonButton expand="block" onClick={save}>Simpan</IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setOpen(false)}>Batal</IonButton>
          </div>
        </IonModal>
        <IonToast isOpen={!!notice} message={notice} duration={1500} onDidDismiss={() => setNotice('')} />
      </IonContent>
    </IonPage>
  )
}
