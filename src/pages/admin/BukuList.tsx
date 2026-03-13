import { useEffect, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonButton, IonModal, IonInput, IonSelect, IonSelectOption, IonToast, IonMenuButton, IonButtons } from '@ionic/react'
import { adminListBuku, adminCreateBuku, adminUpdateBuku, adminDeleteBuku } from '../../lib/api'
import { fetchPublishers } from '../../lib/api'

export default function BukuList() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [editIsbn, setEditIsbn] = useState<string | null>(null)
  const [form, setForm] = useState<any>({ isbn: '', judul: '', edisi: '', kategori: '', harga: 0, id_penerbit: undefined })
  const [publishers, setPublishers] = useState<any[]>([])
  const [notice, setNotice] = useState('')

  async function load() {
    const res = await adminListBuku({ q, per_page: perPage, page: currentPage })
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

  async function loadPublishers() {
    const res = await fetchPublishers({ per_page: 100 })
    setPublishers(res.data.data || res.data)
  }

  useEffect(() => {
    loadPublishers()
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage])

  function openNew() {
    setEditIsbn(null)
    setForm({ isbn: '', judul: '', edisi: '', kategori: '', harga: 0, id_penerbit: undefined })
    setOpen(true)
  }

  function openEdit(it: any) {
    setEditIsbn(it.isbn)
    setForm({ isbn: it.isbn, judul: it.judul, edisi: it.edisi, kategori: it.kategori, harga: it.harga, id_penerbit: it.id_penerbit })
    setOpen(true)
  }

  async function save() {
    if (editIsbn) await adminUpdateBuku(editIsbn, form)
    else await adminCreateBuku(form)
    setOpen(false)
    setNotice('Tersimpan')
    await load()
  }

  async function remove(isbn: string) {
    await adminDeleteBuku(isbn)
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
          <IonTitle>Buku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-[320px] max-w-full">
              <IonSearchbar placeholder="Search buku..." value={q} onIonChange={(e) => setQ(e.detail.value || '')} />
            </div>
            <IonSelect value={perPage} onIonChange={(e) => { setPerPage(e.detail.value); setCurrentPage(1) }}>
              <IonSelectOption value={10}>10 / page</IonSelectOption>
              <IonSelectOption value={20}>20 / page</IonSelectOption>
              <IonSelectOption value={50}>50 / page</IonSelectOption>
              <IonSelectOption value={100}>100 / page</IonSelectOption>
            </IonSelect>
            <IonButton onClick={() => { setCurrentPage(1); load() }}>Refresh</IonButton>
          </div>
          <IonButton onClick={openNew} className="bg-brand">Tambah Buku</IonButton>
        </div>
        <div className="overflow-auto rounded-2xl border border-border bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="border-b border-border px-4 py-3 text-left">ISBN</th>
                <th className="border-b border-border px-4 py-3 text-left">Judul</th>
                <th className="border-b border-border px-4 py-3 text-left">Kategori</th>
                <th className="border-b border-border px-4 py-3 text-left">Harga</th>
                <th className="border-b border-border px-4 py-3 text-left">Penerbit</th>
                <th className="border-b border-border px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.isbn} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{it.isbn}</td>
                  <td className="px-4 py-3">{it.judul}</td>
                  <td className="px-4 py-3">{it.kategori}</td>
                  <td className="px-4 py-3">Rp{it.harga}</td>
                  <td className="px-4 py-3">{(it.penerbit && it.penerbit.nama) ? it.penerbit.nama : (it.nama_penerbit || '-')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <IonButton className="border border-border bg-white text-slate-800" onClick={() => openEdit(it)}>Edit</IonButton>
                      <IonButton color="danger" onClick={() => remove(it.isbn)}>Hapus</IonButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
            <div className="text-muted">Page {currentPage} / {lastPage} • Total {total}</div>
            <div className="flex gap-2">
              <button disabled={currentPage<=1} className="rounded-lg border border-border px-3 py-2 font-extrabold disabled:opacity-50" onClick={() => { if (currentPage>1){ setCurrentPage(currentPage-1); setTimeout(load)}}}>Prev</button>
              <button disabled={currentPage>=lastPage} className="rounded-lg border border-border px-3 py-2 font-extrabold disabled:opacity-50" onClick={() => { if (currentPage<lastPage){ setCurrentPage(currentPage+1); setTimeout(load)}}}>Next</button>
            </div>
          </div>
        </div>
        <IonModal isOpen={open} onDidDismiss={() => setOpen(false)}>
          <div className="ion-padding">
            <h2>{editIsbn ? 'Ubah' : 'Tambah'} Buku</h2>
            <IonItem>
              <IonLabel position="stacked">ISBN</IonLabel>
              <IonInput value={form.isbn} disabled={!!editIsbn} onIonChange={(e) => setForm({ ...form, isbn: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Judul</IonLabel>
              <IonInput value={form.judul} onIonChange={(e) => setForm({ ...form, judul: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Edisi</IonLabel>
              <IonInput value={form.edisi} onIonChange={(e) => setForm({ ...form, edisi: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Kategori</IonLabel>
              <IonInput value={form.kategori} onIonChange={(e) => setForm({ ...form, kategori: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Harga</IonLabel>
              <IonInput type="number" value={form.harga as any} onIonChange={(e) => setForm({ ...form, harga: Number(e.detail.value) })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Penerbit</IonLabel>
              <IonSelect value={form.id_penerbit} onIonChange={(e) => setForm({ ...form, id_penerbit: e.detail.value })}>
                {publishers.map((p) => (
                  <IonSelectOption key={p.id_penerbit ?? p.id} value={p.id_penerbit ?? p.id}>{p.nama || p.name}</IonSelectOption>
                ))}
              </IonSelect>
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
