import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from '@/firebase'

import { useAuthStore } from '@/stores/auth'

import BlankLayout from '@/layouts/BlankLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import TestLayout from '@/layouts/TestLayout.vue'

import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ResultsView from '@/views/ResultsView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/signin',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: SignInView,
        },
      ],
    },
    {
      path: '/signup',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'SignUp',
          component: SignUpView,
        },
      ],
    },
    {
      path: '/',
      name: 'home',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },

        {
          path: '/results',
          name: 'results',
          component: ResultsView,
        },
      ],
    },
    {
      path: '/task',
      name: 'TaskStart',
      component: TestLayout,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/signin', '/signup']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        authStore.setUser({
          uid: user.uid,
          email: user.email,
        })
      } else {
        authStore.setUser(null)
      }
      resolve()
      unsubscribe()
    })
  })

  if (authRequired && !authStore.user) {
    return next('/signin')
  }

  next()
})

export default router
