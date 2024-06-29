import { defineStore } from 'pinia'
import AuthController from '@/controllers/AuthController'
import router from '@/router'
import UserController from '@/controllers/UserController'

const auth = new AuthController()
const userController = new UserController()

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

      await userController.create({
        id: user.uid,
        email: user.email,
      })

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
