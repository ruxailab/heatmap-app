<template>
  <v-app>
    <Toolbar @toolbarHeight="updateHeight" :isRunning="isChronometerRunning" />
    <v-main>
      <v-container class="fill-height">
        <v-responsive class="align-centerfill-height mx-auto" max-width="900">
          <UrlForm :toolbarHeight="toolbarHeight" />
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UrlForm from '@/components/UrlForm.vue'
import Toolbar from '@/components/Toolbar.vue'

export default {
  components: {
    Toolbar,
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
  },
}
</script>

<style></style>
