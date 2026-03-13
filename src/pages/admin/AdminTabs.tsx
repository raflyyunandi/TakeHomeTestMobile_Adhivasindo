import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle } from '@ionic/react'
import { Route, Redirect } from 'react-router'
import { bookOutline, businessOutline, peopleOutline, fileTrayFullOutline, logOutOutline } from 'ionicons/icons'
import BukuList from './BukuList'
import PenerbitList from './PenerbitList'
import PembacaList from './PembacaList'
import PeminjamanList from './PeminjamanList'
import AdminLogout from './AdminLogout'

export default function AdminTabs() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Panel</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/admin/buku" component={BukuList} exact />
          <Route path="/admin/penerbit" component={PenerbitList} exact />
          <Route path="/admin/pembaca" component={PembacaList} exact />
          <Route path="/admin/peminjaman" component={PeminjamanList} exact />
          <Route path="/admin/logout" component={AdminLogout} exact />
          <Redirect exact from="/admin" to="/admin/buku" />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="buku" href="/admin/buku">
            <IonIcon icon={bookOutline} />
            <IonLabel>Buku</IonLabel>
          </IonTabButton>
          <IonTabButton tab="penerbit" href="/admin/penerbit">
            <IonIcon icon={businessOutline} />
            <IonLabel>Penerbit</IonLabel>
          </IonTabButton>
          <IonTabButton tab="pembaca" href="/admin/pembaca">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Pembaca</IonLabel>
          </IonTabButton>
          <IonTabButton tab="peminjaman" href="/admin/peminjaman">
            <IonIcon icon={fileTrayFullOutline} />
            <IonLabel>Peminjaman</IonLabel>
          </IonTabButton>
          <IonTabButton tab="logout" href="/admin/logout">
            <IonIcon icon={logOutOutline} />
            <IonLabel>Keluar</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  )
}
