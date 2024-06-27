<template>
  <v-app>
    <TaskToolbar
      @toolbarHeight="updateHeight"
      :isRunning="isChronometerRunning"
    />
    <v-main>
      <v-container class="fill-height">
        <v-responsive class="align-center fill-height mx-auto" max-width="900">
          <UrlForm :toolbarHeight="toolbarHeight" />
        </v-responsive>
        <v-btn color="#F9A826" class="mt-4" @click="logout">Log out</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UrlForm from '@/components/UrlForm.vue'
import TaskToolbar from '@/components/tasks/TaskToolbar.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: {
    TaskToolbar,
    UrlForm,
  },
  provide() {
    return {
      startChronometer: this.startChronometer,
      stopChronometer: this.stopChronometer,
      isChronometerRunning: () => this.isChronometerRunning,
    }
  },
  data() {
    return {
      toolbarHeight: 0,
      isChronometerRunning: false,
    }
  },
  methods: {
    updateHeight(height) {
      this.toolbarHeight = height
    },
    startChronometer() {
      this.isChronometerRunning = true
    },
    stopChronometer() {
      this.isChronometerRunning = false
    },
    toggleChronometer() {
      this.isChronometerRunning = !this.isChronometerRunning
    },
    logout() {
      useAuthStore().logout()
      console.log(useAuthStore().user)
      this.$router.push('/signin')
    },
  },
}
</script>

<style></style>
