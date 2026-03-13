import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route, Switch } from 'react-router'
import { getAuth } from './lib/auth'
import LoginUser from './pages/auth/LoginUser'
import LoginAdmin from './pages/auth/LoginAdmin'
import Register from './pages/auth/Register'
import UserTabs from './pages/user/UserTabs'
import AdminShell from './pages/admin/AdminShell'
import AdminTabs from './pages/admin/AdminTabs'
import './App.css'

setupIonicReact()

function App() {
  const auth = getAuth()
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route path="/login-user" component={LoginUser} exact />
            <Route path="/login-admin" component={LoginAdmin} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/user" component={UserTabs} />
            <Route path="/admin" component={AdminTabs} />
            <Route
              path="/"
              render={() => {
                if (auth.user?.role === 'admin') return <Redirect to="/admin" />
                if (auth.user?.role === 'user') return <Redirect to="/user" />
                return <Redirect to="/login-user" />
              }}
              exact
            />
            <Redirect to="/" />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
