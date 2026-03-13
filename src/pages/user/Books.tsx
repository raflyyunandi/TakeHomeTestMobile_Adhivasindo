import { useEffect, useState } from 'react'
import { IonPage, IonContent, IonItem, IonLabel, IonSearchbar, IonSelect, IonSelectOption, IonButton, IonInput, IonModal } from '@ionic/react'
import { fetchBooks, fetchPublishers, createBorrow } from '../../lib/api'
import UserLayout from '../../components/UserLayout'

export default function Books() {
  const [q, setQ] = useState('')
  const [kategori, setKategori] = useState('')
  const [idPenerbit, setIdPenerbit] = useState<number | undefined>()
  const [publishers, setPublishers] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [openBorrow, setOpenBorrow] = useState(false)
  const [selectedIsbn, setSelectedIsbn] = useState('')
  const [tanggalPinjam, setTanggalPinjam] = useState('')
  const [tanggalKembali, setTanggalKembali] = useState('')

  async function load() {
    const res = await fetchBooks({ q, kategori, id_penerbit: idPenerbit, per_page: 10 })
    setBooks(res.data.data || res.data)
  }

  async function loadPublishers() {
    const res = await fetchPublishers({ per_page: 100 })
    setPublishers(res.data.data || res.data)
  }

  useEffect(() => {
    load()
    loadPublishers()
  }, [])

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <UserLayout active="books">
          <div className="rounded-card border border-border bg-white p-4 pb-28">
            <div className="mb-3 text-base font-extrabold">Pinjam Buku</div>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="w-full">
                <IonSearchbar placeholder="Cari judul / kategori / ISBN..." value={q} onIonChange={(e) => setQ(e.detail.value || '')} />
              </div>
              <div className="w-full">
                <div className="rounded-xl border border-border bg-white px-2">
                  <IonLabel className="block px-1 pt-2 text-xs font-bold text-slate-700">Penerbit</IonLabel>
                  <IonSelect className="pb-2" placeholder="Semua Penerbit" interface="popover" value={idPenerbit} onIonChange={(e) => setIdPenerbit(e.detail.value)}>
                    <IonSelectOption value={undefined}>Semua Penerbit</IonSelectOption>
                    {publishers.map((p) => (
                      <IonSelectOption key={p.id} value={p.id}>{p.nama || p.name}</IonSelectOption>
                    ))}
                  </IonSelect>
                </div>
              </div>
              <div className="w-full">
                <div className="rounded-xl border border-border bg-white px-2">
                  <IonLabel className="block px-1 pt-2 text-xs font-bold text-slate-700">Kategori</IonLabel>
                  <IonInput className="pb-2" placeholder="Mis. Novel / Programming" value={kategori} onIonChange={(e) => setKategori(e.detail.value || '')} />
                </div>
              </div>
              <div className="w-full flex items-end">
                <IonButton className="w-full sm:w-auto" onClick={load}>Cari</IonButton>
              </div>
            </div>
            <div className="">
              {books.map((b) => (
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between" key={b.isbn}>
                  <div className="min-w-0 sm:max-w-[70%]">
                    <div className="truncate font-extrabold break-words">{b.judul}</div>
                    <div className="text-sm text-muted break-words">{b.isbn} • {b.kategori} • {b.available ? 'Tersedia' : 'Dipinjam'}</div>
                  </div>
                  <div className="w-full sm:w-auto">
                    <IonButton className="w-full sm:w-auto" size="default" disabled={!b.available} onClick={() => { setSelectedIsbn(b.isbn); setOpenBorrow(true) }}>Pinjam</IonButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UserLayout>
        <IonModal isOpen={openBorrow} onDidDismiss={() => setOpenBorrow(false)}>
          <div className="ion-padding">
            <h2>Pinjam Buku</h2>
            <p>ISBN {selectedIsbn}</p>
            <IonItem>
              <IonLabel position="stacked">Tanggal Pinjam</IonLabel>
              <IonInput type="date" value={tanggalPinjam} onIonChange={(e) => setTanggalPinjam(e.detail.value || '')} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tanggal Kembali</IonLabel>
              <IonInput type="date" value={tanggalKembali} onIonChange={(e) => setTanggalKembali(e.detail.value || '')} />
            </IonItem>
            <IonButton expand="block" onClick={async () => { await createBorrow({ isbn: selectedIsbn, tanggal_pinjam: tanggalPinjam, tanggal_kembali: tanggalKembali }); setOpenBorrow(false) }}>Kirim</IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setOpenBorrow(false)}>Batal</IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}
