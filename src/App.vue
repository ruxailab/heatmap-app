<script>
import { RouterLink, RouterView } from 'vue-router'
import Toolbar from '@/components/Toolbar.vue'
import HomeView from '@/views/HomeView.vue'

export default {
  components: {
    Toolbar,
    HomeView,
  },
}
</script>

<template>
  <v-app>
    <Toolbar />
    <HomeView />
  </v-app>
</template>

<style scoped></style>
