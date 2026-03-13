import { useEffect, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonModal, IonInput, IonToast, IonMenuButton, IonButtons } from '@ionic/react'
import { adminListPenerbit, adminCreatePenerbit, adminUpdatePenerbit, adminDeletePenerbit } from '../../lib/api'

export default function PenerbitList() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [nama, setNama] = useState('')
  const [tahun, setTahun] = useState<number | undefined>()
  const [notice, setNotice] = useState('')

  async function load() {
    const res = await adminListPenerbit({ q, per_page: 10 })
    setItems(res.data.data || res.data)
  }

  useEffect(() => {
    load()
  }, [])

  function openNew() {
    setEditId(null)
    setNama('')
    setTahun(undefined)
    setOpen(true)
  }

  function openEdit(it: any) {
    const id = it.id_penerbit ?? it.id
    setEditId(id)
    setNama(it.nama)
    setTahun(it.tahun_terbit)
    setOpen(true)
  }

  async function save() {
    if (editId) await adminUpdatePenerbit(editId, { nama, tahun_terbit: tahun })
    else await adminCreatePenerbit({ nama, tahun_terbit: tahun })
    setOpen(false)
    setNotice('Tersimpan')
    await load()
  }

  async function remove(id: number) {
    await adminDeletePenerbit(id)
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
          <IonTitle>Penerbit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', gap: 8 }}>
          <IonSearchbar placeholder="Cari" value={q} onIonChange={(e) => setQ(e.detail.value || '')} />
          <IonButton onClick={load}>Cari</IonButton>
          <IonButton onClick={openNew}>Tambah</IonButton>
        </div>
        <IonList>
          {items.map((it) => (
            <IonItem key={it.id_penerbit ?? it.id}>
              <IonLabel>
                <h2>{it.nama}</h2>
                <p>{it.tahun_terbit}</p>
              </IonLabel>
              <IonButton slot="end" onClick={() => openEdit(it)}>Ubah</IonButton>
              <IonButton slot="end" color="danger" onClick={() => remove(it.id_penerbit ?? it.id)}>Hapus</IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonModal isOpen={open} onDidDismiss={() => setOpen(false)}>
          <div className="ion-padding">
            <h2>{editId ? 'Ubah' : 'Tambah'} Penerbit</h2>
            <IonItem>
              <IonLabel position="stacked">Nama</IonLabel>
              <IonInput value={nama} onIonChange={(e) => setNama(e.detail.value || '')} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tahun Terbit</IonLabel>
              <IonInput type="number" value={tahun as any} onIonChange={(e) => setTahun(Number(e.detail.value))} />
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
