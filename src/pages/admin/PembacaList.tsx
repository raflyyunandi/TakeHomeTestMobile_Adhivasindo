import { useEffect, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonButton, IonModal, IonInput, IonToast, IonSelect, IonSelectOption, IonMenuButton, IonButtons } from '@ionic/react'
import { adminListPembaca, adminCreatePembaca, adminUpdatePembaca, adminDeletePembaca } from '../../lib/api'

export default function PembacaList() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<any>({ nama_depan: '', nama_belakang: '', email: '', no_telepon: '', alamat: '' })
  const [notice, setNotice] = useState('')

  async function load() {
    const res = await adminListPembaca({ q, per_page: perPage, page: currentPage })
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

  function openNew() {
    setEditId(null)
    setForm({ nama_depan: '', nama_belakang: '', email: '', no_telepon: '', alamat: '' })
    setOpen(true)
  }

  function openEdit(it: any) {
    const id = it.id_pembaca ?? it.id
    setEditId(id)
    setForm({
      nama_depan: it.nama_depan ?? it.nama?.split(' ')?.[0] ?? '',
      nama_belakang: it.nama_belakang ?? it.nama?.split(' ')?.slice(1)?.join(' ') ?? '',
      email: it.email ?? '',
      no_telepon: it.no_telepon ?? '',
      alamat: it.alamat ?? '',
    })
    setOpen(true)
  }

  async function save() {
    if (editId) await adminUpdatePembaca(editId, form)
    else await adminCreatePembaca(form)
    setOpen(false)
    setNotice('Tersimpan')
    await load()
  }

  async function remove(id: number) {
    await adminDeletePembaca(id)
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
          <IonTitle>Pembaca</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-[320px] max-w-full">
              <IonSearchbar placeholder="Search pembaca..." value={q} onIonChange={(e) => setQ(e.detail.value || '')} />
            </div>
            <IonSelect value={perPage} onIonChange={(e) => { setPerPage(e.detail.value); setCurrentPage(1) }}>
              <IonSelectOption value={10}>10 / page</IonSelectOption>
              <IonSelectOption value={20}>20 / page</IonSelectOption>
              <IonSelectOption value={50}>50 / page</IonSelectOption>
              <IonSelectOption value={100}>100 / page</IonSelectOption>
            </IonSelect>
            <IonButton onClick={() => { setCurrentPage(1); load() }}>Refresh</IonButton>
          </div>
          <IonButton onClick={openNew} className="bg-brand">Tambah Pembaca</IonButton>
        </div>
        <div className="overflow-auto rounded-2xl border border-border bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="border-b border-border px-4 py-3 text-left">ID</th>
                <th className="border-b border-border px-4 py-3 text-left">Nama Depan</th>
                <th className="border-b border-border px-4 py-3 text-left">Nama Belakang</th>
                <th className="border-b border-border px-4 py-3 text-left">Email</th>
                <th className="border-b border-border px-4 py-3 text-left">Telepon</th>
                <th className="border-b border-border px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id_pembaca ?? it.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{it.id_pembaca ?? it.id}</td>
                  <td className="px-4 py-3">{it.nama_depan || (it.nama ? it.nama.split(' ')[0] : '')}</td>
                  <td className="px-4 py-3">{it.nama_belakang || (it.nama ? it.nama.split(' ').slice(1).join(' ') : '')}</td>
                  <td className="px-4 py-3">{it.email}</td>
                  <td className="px-4 py-3">{it.no_telepon || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <IonButton className="border border-border bg-white text-slate-800" onClick={() => openEdit(it)}>Edit</IonButton>
                      <IonButton color="danger" onClick={() => remove(it.id_pembaca ?? it.id)}>Hapus</IonButton>
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
            <h2>{editId ? 'Ubah' : 'Tambah'} Pembaca</h2>
            <IonItem>
              <IonLabel position="stacked">Nama Depan</IonLabel>
              <IonInput value={form.nama_depan} onIonChange={(e) => setForm({ ...form, nama_depan: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Nama Belakang</IonLabel>
              <IonInput value={form.nama_belakang} onIonChange={(e) => setForm({ ...form, nama_belakang: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput type="email" value={form.email} onIonChange={(e) => setForm({ ...form, email: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">No Telepon</IonLabel>
              <IonInput value={form.no_telepon} onIonChange={(e) => setForm({ ...form, no_telepon: e.detail.value })} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Alamat</IonLabel>
              <IonInput value={form.alamat} onIonChange={(e) => setForm({ ...form, alamat: e.detail.value })} />
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
