<template>
  <v-app theme="light">
    <DashboardToolbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import DashboardToolbar from '@/components/dashboard/DashboardToolbar.vue'
export default {
  components: {
    DashboardToolbar,
  },
}
</script>

<style scoped></style>
