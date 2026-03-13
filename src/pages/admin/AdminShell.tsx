import { IonPage, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonRouterOutlet } from '@ionic/react'
import { Route, Redirect } from 'react-router'
import PenerbitList from './PenerbitList'
import BukuList from './BukuList'
import PembacaList from './PembacaList'
import PeminjamanList from './PeminjamanList'
import Dashboard from './Dashboard'
import { clearAuth } from '../../lib/auth'
import { setTokenHeader } from '../../lib/api'

export default function AdminShell() {
  return (
    <IonPage>
      <IonSplitPane contentId="admin-content">
        <IonMenu contentId="admin-content" type="overlay">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Admin</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonMenuToggle>
                <IonItem routerLink="/admin">
                  <IonLabel>Dashboard</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem routerLink="/admin/penerbit">
                  <IonLabel>Penerbit</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem routerLink="/admin/buku">
                  <IonLabel>Buku</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem routerLink="/admin/pembaca">
                  <IonLabel>Pembaca</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem routerLink="/admin/peminjaman">
                  <IonLabel>Peminjaman</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonItem button onClick={() => { setTokenHeader(null as any); clearAuth(); window.location.href = '/login-admin' }}>
                <IonLabel>Keluar</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonMenu>
        <div id="admin-content" style={{ width: '100%' }}>
          <IonRouterOutlet>
            <Route path="/admin" component={Dashboard} exact />
            <Route path="/admin/penerbit" component={PenerbitList} exact />
            <Route path="/admin/buku" component={BukuList} exact />
            <Route path="/admin/pembaca" component={PembacaList} exact />
            <Route path="/admin/peminjaman" component={PeminjamanList} exact />
            <Redirect exact from="/admin/*" to="/admin" />
          </IonRouterOutlet>
        </div>
      </IonSplitPane>
    </IonPage>
  )
}
