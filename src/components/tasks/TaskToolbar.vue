<template>
  <v-app-bar ref="toolbar" class="toolbar-menu">
    <v-row class="align-center">
      <!-- Navigation Buttons -->
      <v-col cols="4">
        <v-btn icon @click="navigation('backAction')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn icon @click="navigation('forwardAction')">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn icon @click="navigation('resetURL')">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-col>

      <!-- URL display -->
      <v-col class="text-center">
        <p class="font-weight-bold" :title="url">
          {{ truncatedUrl }}
        </p>
      </v-col>

      <!-- Chronometer and End test -->
      <v-col cols="4" class="justify-end d-flex align-center mr-4">
        <Chronometer />
        <v-btn @click="endTest" class="bg-green">End test</v-btn>
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
  inject: ['stopChronometer'],
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
    this.electronAPI?.on('url-updated', this.updateUrl)
  },
  mounted() {
    this.$nextTick(this.emitToolbarHeight)
  },
  methods: {
    updateUrl(value) {
      this.url = value
    },
    emitToolbarHeight() {
      if (this.$refs.toolbar && this.$refs.toolbar.$el) {
        const toolbarHeight = this.$refs.toolbar.$el.clientHeight
        this.$emit('toolbarHeight', toolbarHeight)
      }
    },
    navigation(action) {
      if (this.electronAPI) this.electronAPI.send(action)
      else console.log('electronAPI not defined in toolbar')
    },
    endTest() {
      this.stopChronometer()
      if (this.electronAPI) {
        this.electronAPI.send('endTest')
        this.$router.push({ name: 'results' })
      } else console.log('electronAPI not defined in toolbar')
    },
  },
}
</script>

<style></style>
