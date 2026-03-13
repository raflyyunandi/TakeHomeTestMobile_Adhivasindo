import { useState } from 'react'
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonLoading } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { loginUser, fetchMe, setTokenHeader } from '../../lib/api'
import { setAuth } from '../../lib/auth'

export default function LoginUser() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(email, password)
      const token = res.data.token || res.data.access_token
      setTokenHeader(token)
      const me = await fetchMe()
      setAuth(token, me.data.data)
      history.replace('/user')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonPage>
      <IonContent>
        <div className="grid min-h-screen place-items-center bg-bg p-6">
          <div className="w-full max-w-[420px] rounded-card border border-border bg-panel p-4 shadow-panel">
            <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
              <div className="h-11 w-11 rounded-[14px] bg-gradient-to-br from-brand to-violet-300" />
              <div>
                <div className="text-sm font-extrabold">Aplikasi Pinjam Buku</div>
                <div className="mt-0.5 text-xs text-muted">Login User</div>
              </div>
            </div>
            <label className="mb-1 block text-xs font-bold text-slate-700">Email</label>
            <IonInput className="mb-3 rounded-xl border border-border bg-white px-3" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value || '')} />
            <label className="mb-1 block text-xs font-bold text-slate-700">Password</label>
            <IonInput className="mb-3 rounded-xl border border-border bg-white px-3" type="password" value={password} onIonChange={(e) => setPassword(e.detail.value || '')} />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <IonButton className="flex-1 rounded-xl bg-brand font-extrabold" onClick={handleLogin}>Login</IonButton>
              <IonButton className="flex-1 rounded-xl border border-border bg-white font-extrabold text-slate-800" onClick={() => history.push('/login-admin')}>Admin</IonButton>
              <IonButton className="flex-1 rounded-xl border border-border bg-white font-extrabold text-slate-800" onClick={() => history.push('/register')}>Register</IonButton>
            </div>
          </div>
        </div>
        <IonLoading isOpen={loading} message="Memproses" />
        <IonToast isOpen={!!error} message={error} duration={2000} onDidDismiss={() => setError('')} color="danger" />
      </IonContent>
    </IonPage>
  )
}
