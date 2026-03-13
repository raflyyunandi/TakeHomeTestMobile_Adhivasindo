import { useEffect, useState } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonRefresher, IonRefresherContent } from '@ionic/react'
import { fetchPublishers } from '../../lib/api'

export default function Publishers() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<any[]>([])

  async function load() {
    const res = await fetchPublishers({ per_page: 100, q })
    setItems(res.data.data || res.data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Penerbit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar placeholder="Cari penerbit" value={q} onIonChange={(e) => setQ(e.detail.value || '')} onIonBlur={load} />
        <IonRefresher slot="fixed" onIonRefresh={async (e) => { await load(); e.detail.complete() }}>
          <IonRefresherContent />
        </IonRefresher>
        <IonList>
          {items.map((it, idx) => (
            <IonItem key={idx}>
              <IonLabel>
                <h2>{it.nama || it.name}</h2>
                <p>{it.tahun_terbit || it.year}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}
