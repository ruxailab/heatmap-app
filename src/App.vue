<template>
  <v-app>
    <Toolbar :url="url" @update:url="updateUrl" ref="toolbar" :isRunning="isChronometerRunning" />
    <v-main>
      <RouterView @toggle-chronometer="toggleChronometer" />
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router'
import Toolbar from './components/Toolbar.vue'
export default {
  name: 'App',
  components: {
    RouterView,
    Toolbar,
  },
  provide() {
    return {
      startChronometer: this.startChronometer,
      stopChronometer: this.stopChronometer,
      isChronometerRunning: () => this.isChronometerRunning,
      toolbarHeight: () => this.toolbarHeight,
    }
  },
  data() {
    return {
      toolbarHeight: 0,
      isChronometerRunning: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      const componentElement = this.$el.querySelector('.toolbar-menu')
      if (componentElement) {
        this.toolbarHeight = componentElement.offsetHeight
      }
    })
  },
  methods: {
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

<style scoped>
::-webkit-scrollbar {
  width: 0px;
}
</style>
