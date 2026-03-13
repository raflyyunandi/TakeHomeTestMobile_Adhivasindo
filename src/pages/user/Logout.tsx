import { useEffect } from 'react'
import { IonContent, IonPage, IonSpinner } from '@ionic/react'
import { clearAuth } from '../../lib/auth'
import { setTokenHeader } from '../../lib/api'

export default function Logout() {
  useEffect(() => {
    setTokenHeader(null as any)
    clearAuth()
    window.location.href = '/login-user'
  }, [])

  return (
    <IonPage>
      <IonContent className="grid min-h-screen place-items-center">
        <div className="text-center">
          <IonSpinner />
          <div className="mt-2 text-sm text-slate-500">Keluar...</div>
        </div>
      </IonContent>
    </IonPage>
  )
}
