import { auth } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import i18n from '@/plugins/i18n'
const { t } = i18n.global

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

export default class AuthController {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      return userCredential.user
    } catch (error) {
      const errorMessage =
        t(`firebaseErrors.${error.code}`) || t('firebaseErrors.unknown')
      throw new Error(errorMessage)
    }
  }

  // Sign up with email and password
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      return userCredential.user
    } catch (error) {
      const errorMessage =
        t(`firebaseErrors.${error.code}`) || t('firebaseErrors.unknown')
      throw new Error(errorMessage)
    }
  }

  // Get current user
  getUser() {
    return auth.currentUser
  }

  // Log out
  async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out: ', error)
      throw error
    }
  }

  checkUser() {
    auth.onAuthStateChanged((user) => {
      const authStore = useAuthStore()
      if (user) {
        authStore.setUser(user)
      } else {
        authStore.setUser(null)
      }
    })
  }
}
