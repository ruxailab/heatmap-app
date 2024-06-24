import { defineStore } from 'pinia'
import AuthController from '@/controllers/AuthController'
import router from '@/router'

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
      auth.checkUser()
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
        router.push('/signin')
      } catch (error) {
        console.error('Error signing out: ', error)
        throw error
      }
    },
  },
})
