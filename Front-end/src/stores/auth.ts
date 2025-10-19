import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/api/kalafo'
import { setAuthToken, clearAuthToken } from '@/api/kalafo'

type AuthState = {
  user: Pick<User, 'id' | 'email' | 'role' | 'first_name' | 'last_name'> | null
  token: string | null
  login: (user: User, token?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        if (token) {
          setAuthToken(token)
          set({ user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name }, token })
        }
      },
      logout: () => {
        clearAuthToken()
        set({ user: null, token: null })
      },
    }),
    {
      name: 'kalafo_user',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // After rehydration, re-apply the token to axios
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token)
        }
      },
    }
  )
)