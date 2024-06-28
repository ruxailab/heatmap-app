<template>
  <v-app theme="light">
    <TaskToolbar
      @toolbarHeight="updateHeight"
      :isRunning="isChronometerRunning"
    />
    <v-main>
      <TestingView
        v-if="inputUrl && toolbarHeight != 0"
        :toolbarHeight="toolbarHeight"
        :input-url="this.inputUrl"
      />
    </v-main>
  </v-app>
</template>

<script>
import TaskToolbar from '@/components/tasks/TaskToolbar.vue'
import TestingView from '@/views/TestingView.vue'

export default {
  components: {
    TaskToolbar,
    TestingView,
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
      inputUrl: '',
    }
  },
  created() {
    this.inputUrl = this.$route.query.url || ''
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

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
