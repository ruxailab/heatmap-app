<template>
  <v-app-bar class="toolbar-menu">
    <v-row class="align-center">
      <v-col cols="4">
        <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn icon @click="goForward">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn icon @click="goHome">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <p class="font-weight-bold" :title="url">
          {{ truncatedUrl }}
        </p>
      </v-col>
      <v-col cols="4" class="justify-end d-flex align-center mr-4">
        <Chronometer />
        <v-btn class="bg-green">End test</v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import Chronometer from './Chronometer.vue'
const MAX_URL_LENGTH = 30

export default {
  components: {
    Chronometer,
  },
  data() {
    return {
      url: '',
    }
  },
  computed: {
    electronAPI() {
      return window.electronAPI
    },
    truncatedUrl() {
      return this.url.length > MAX_URL_LENGTH
        ? this.url.substring(0, MAX_URL_LENGTH - 3) + '...'
        : this.url
    },
  },
  created() {
    const { electronAPI } = window
    if (electronAPI) {
      electronAPI.on('url-updated', (value) => {
        this.url = value
      })
    }
  },
  methods: {
    goBack() {
      if (this.electronAPI) this.electronAPI.send('backAction')
      else console.log('electronAPI not defined in toolbar')
    },
    goForward() {
      if (this.electronAPI) this.electronAPI.send('forwardAction')
      else console.log('electronAPI not defined in toolbar')
    },
    goHome() {
      if (this.electronAPI) this.electronAPI.send('resetURL')
      else console.log('electronAPI not defined in toolbar')
    },
  },
}
</script>

<style></style>
