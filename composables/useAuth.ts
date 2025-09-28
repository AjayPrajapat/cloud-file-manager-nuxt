import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

interface LoginPayload {
  email: string
  password: string
}

interface SignupPayload extends LoginPayload {
  name: string
  role?: 'admin' | 'user'
}

interface AuthResponse {
  user: any
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useStorage('nuxt-cloud-auth-user', null),
    token: useStorage<string | null>('nuxt-cloud-auth-token', null),
    loading: false,
    error: ''
  }),
  getters: {
    isAuthenticated: state => Boolean(state.token),
    isAdmin: state => state.user?.role === 'admin'
  },
  actions: {
    async login(payload: LoginPayload) {
      this.loading = true
      this.error = ''
      try {
        const { data, error } = await useFetch<AuthResponse>('/api/auth', {
          method: 'POST',
          body: { ...payload, mode: 'login' }
        })
        if (error.value) {
          throw error.value
        }
        this.user = data.value?.user ?? null
        this.token = data.value?.token ?? null
      } catch (err: any) {
        this.error = err?.data?.statusMessage ?? err.message ?? 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },
    async signup(payload: SignupPayload) {
      this.loading = true
      this.error = ''
      try {
        const { data, error } = await useFetch<AuthResponse>('/api/auth', {
          method: 'POST',
          body: { ...payload, mode: 'signup' }
        })
        if (error.value) {
          throw error.value
        }
        this.user = data.value?.user ?? null
        this.token = data.value?.token ?? null
      } catch (err: any) {
        this.error = err?.data?.statusMessage ?? err.message ?? 'Signup failed'
        throw err
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
    }
  }
})

export function useAuthHeaders() {
  const auth = useAuthStore()
  return auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
}
