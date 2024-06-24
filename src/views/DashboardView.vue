<template>
  <v-app>
    <DashboardToolbar />
    <v-main>
      <v-container class="fill-height">
        <h2>DASHBOARD</h2>
      </v-container>
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
