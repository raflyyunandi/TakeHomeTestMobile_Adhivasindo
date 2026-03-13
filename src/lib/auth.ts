export type Role = 'user' | 'admin'
export type User = { id: number; name: string; email: string; role: Role }
export type AuthState = { token: string | null; user: User | null }

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function getAuth(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  const user = userRaw ? (JSON.parse(userRaw) as User) : null
  return { token, user }
}

export function setAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated() {
  const { token } = getAuth()
  return !!token
}

export function hasRole(role: Role) {
  const { user } = getAuth()
  return user?.role === role
}
