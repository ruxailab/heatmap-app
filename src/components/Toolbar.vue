<template>
  <v-app-bar app class="toolbar-menu">
    <v-btn icon @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn icon @click="goForward">
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
    <v-btn icon @click="goHome">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <p class="font-weight-bold url-text" :title="url">
      {{ truncatedUrl }}
    </p>
    <v-spacer></v-spacer>
    <Chronometer />
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

<style>
.url-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 60%;
  padding: 0 20px;
}
</style>
