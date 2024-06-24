import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultsView from '@/views/ResultsView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/signin',
      name: 'Login',
      component: SignInView,
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: SignUpView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: HomeView,
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/signin', '/signup']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !authStore.user) {
    return next('/signin')
  }

  next()
})

export default router
