import { defineStore } from 'pinia'
import AuthController from '@/controllers/AuthController'

const auth = new AuthController()

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    async checkUser() {
      try {
        const user = await auth.autoLogin()
        this.setUser(user)
      } catch (error) {
        console.error('Error getting current user: ', error)
      }
    },
    async signIn(email, password) {
      const user = await auth.signIn(email, password)
      this.setUser(user)
    },
    async signUp(email, password) {
      const user = await auth.signUp(email, password)
      this.setUser(user)
    },
    async logout() {
      try {
        await auth.logout()
        this.setUser(null)
      } catch (error) {
        console.error('Error signing out: ', error)
        throw error
      }
    },
  },
})
