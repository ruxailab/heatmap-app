<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="pa-3" outlined>
          <v-card-text class="text-center">
            <span class="display-1">{{ minutes }}:{{ seconds }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Chronometer',
  inject: ['isChronometerRunning'],
  data() {
    return {
      timer: null,
      startTime: 0,
      elapsedTime: 0,
      minutes: '00',
      seconds: '00',
      milliseconds: '000',
    }
  },
  computed: {
    isRunning() {
      return this.isChronometerRunning()
    },
  },
  watch: {
    isRunning(newVal) {
      if (newVal) {
        this.startChronometer()
      } else {
        this.stopChronometer()
      }
    },
  },
  methods: {
    startChronometer() {
      if (!this.timer) {
        this.startTime = performance.now() - this.elapsedTime
        this.timer = setInterval(this.updateTime, 10)
      }
    },
    stopChronometer() {
      this.clearTimer()
    },
    updateTime() {
      this.elapsedTime = performance.now() - this.startTime
      const totalMilliseconds = Math.floor(this.elapsedTime)
      const totalSeconds = Math.floor(totalMilliseconds / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)

      this.minutes = String(totalMinutes).padStart(2, '0')
      this.seconds = String(totalSeconds % 60).padStart(2, '0')
      this.milliseconds = String(totalMilliseconds % 1000).padStart(3, '0')
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
        this.elapsedTime = performance.now() - this.startTime
      }
    },
  },
  beforeDestroy() {
    this.clearTimer()
  },
}
</script>

<style>
.display-1 {
  font-size: 1rem;
}
</style>
