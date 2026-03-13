import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonPage } from '@ionic/react'
import { Route, Redirect } from 'react-router'
import { bookOutline, businessOutline, fileTrayFullOutline, logOutOutline } from 'ionicons/icons'
import Books from './Books'
import Publishers from './Publishers'
import Loans from './Loans'
import Logout from './Logout'

export default function UserTabs() {
  return (
    <IonPage>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/user/books" component={Books} exact />
          <Route path="/user/publishers" component={Publishers} exact />
          <Route path="/user/loans" component={Loans} exact />
          <Route path="/user/logout" component={Logout} exact />
          <Redirect exact from="/user" to="/user/books" />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="books" href="/user/books">
            <IonIcon icon={bookOutline} />
            <IonLabel>Buku</IonLabel>
          </IonTabButton>
          <IonTabButton tab="publishers" href="/user/publishers">
            <IonIcon icon={businessOutline} />
            <IonLabel>Penerbit</IonLabel>
          </IonTabButton>
          <IonTabButton tab="loans" href="/user/loans">
            <IonIcon icon={fileTrayFullOutline} />
            <IonLabel>Pinjaman</IonLabel>
          </IonTabButton>
          <IonTabButton tab="logout" href="/user/logout">
            <IonIcon icon={logOutOutline} />
            <IonLabel>Keluar</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  )
}
