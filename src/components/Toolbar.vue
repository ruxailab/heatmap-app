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
    <p class="font-weight-bold url-text">{{ this.url }}</p>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  created() {
    if (window.electronAPI) {
      window.electronAPI.on('url-updated', (value) => {
        this.url = value
      })
    }
  },
  computed: {
    truncatedUrl() {
      return this.url.length > 20 ? this.url.substring(0, 17) + '...' : this.url
    },
  },
  methods: {
    goBack() {
      if (window.electronAPI) window.electronAPI.send('backAction')
      else console.log('electronAPI not defined in toolbar')
    },
    goForward() {
      if (window.electronAPI) window.electronAPI.send('forwardAction')
      else console.log('electronAPI not defined in toolbar')
    },
    goHome() {
      if (window.electronAPI) window.electronAPI.send('resetURL')
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
