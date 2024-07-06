<template>
  <v-container class="mx-auto h-100 w-100" fluid>
    <v-row class="d-flex" justify="space-between" align="center">
      <v-col cols="auto">
        <h1 class="text-h3 my-4">Results</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="#ff9800" rounded="lg" @click="$router.push({ name: 'dashboard' })" class="mr-4">Start a new
          test</v-btn>
      </v-col>
    </v-row>
    <v-divider class="border-opacity-50 mb-4"></v-divider>

    <!-- Fast Stats -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card rounded="xl" theme="light" class="pa-4">
          <v-card-title>Total Clicks</v-card-title>
          <v-card-text class="text-h5">{{ totalClicks }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" theme="light" class="pa-4" outlined>
          <v-card-title>Total Time Spent</v-card-title>
          <v-card-text class="text-h5">{{
            formattedTime(totalTime)
            }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Heatmaps -->
    <v-row no-gutters class="mx-auto my-2" align="center">
      <v-col>
        <v-card rounded="xl" theme="light" class="scroll mt-5 pa-10 w-100">
          <v-card-title class="d-flex align-center justify-space-between">
            Heatmap Visualizations
            <div v-if="imagesProgress.fails > 0">
              Failed to load
              <v-chip color="red" v-if="imagesProgress.fails > 0">
                {{ imagesProgress.fails }}
              </v-chip>
              heatmaps
            </div>
          </v-card-title>
          <template v-if="isLoading">
            <v-card-text class="d-flex flex-column align-center justify-center h-100 w-100">
              <v-progress-linear :model-value="imagesProgress.progress" striped rounded :height="15" color="primary">
              </v-progress-linear>
              <p class="mt-5">
                {{ imagesProgress.progress + ' %' }}
              </p>
            </v-card-text>
          </template>
          <template v-else>
            <HeatmapCarousel :urlImages="urlImages" :clicksDataMap="rawClicksData" />
          </template>
        </v-card>

        <!-- Clicks List -->
        <v-card rounded="xl" theme="light" class="mt-5 pa-5 h-100 w-100">
          <v-card-title>Clicks History</v-card-title>
          <ClicksHistoryList :clickData="clicksData" :height="tableHeight" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ClicksHistoryList from '@/components/results/ClicksHistoryList.vue'
import HeatmapCarousel from '@/components/results/HeatmapCarousel.vue'
import { useStore } from '@/stores'

export default {
  components: {
    ClicksHistoryList,
    HeatmapCarousel,
  },
  data() {
    return {
      tableHeight: 500,
    }
  },
  computed: {
    electronAPI() {
      return window.electronAPI
    },
    store() {
      return useStore()
    },
    rawClicksData() {
      return this.store.clicksData
    },
    clicksData() {
      return this.mapToArray(this.rawClicksData)
    },
    totalClicks() {
      return this.clicksData.length
    },
    totalTime() {
      return this.store.totalTime
    },
    urlImages() {
      return this.store.urlImages
    },
    isLoading() {
      return !this.urlImages
    },
    imagesProgress() {
      return {
        progress: Math.floor(this.store.progress * 100),
        fails: this.store.fails,
      }
    },
  },
  methods: {
    mapToArray(clickData) {
      let clickArray = []
      for (const [url, clicks] of clickData.entries()) {
        for (const click of clicks) {
          clickArray.push({
            url: url,
            time: click.time,
            x: click.x,
            y: click.y,
          })
        }
      }
      clickArray.sort((a, b) => a.time - b.time)
      return clickArray.map((click, index) => ({ number: index + 1, ...click }))
    },
    formattedTime(time) {
      const totalSeconds = Math.floor(time / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      const milliseconds = time % 1000

      let result = ''
      if (hours > 0) result += `${hours}h `
      if (minutes > 0) result += `${minutes}m `
      if (seconds > 0) result += `${seconds}s`
      if (hours === 0 && minutes === 0 && seconds > 0)
        result += ` ${milliseconds}ms`

      return result.trim()
    },
  },
}
</script>
<style scoped>
.v-card {
  box-shadow:
    0 4px 4px -2px rgba(0, 0, 0, 0.4),
    0 0 2px 0 rgba(0, 0, 0, 0.3),
    0 0 5px 0 rgba(0, 0, 0, 0.2);
}

.stats {
  width: 100%;
  height: 100%;
}

.scroll {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  height: 100%;
  min-height: 600px;
  max-width: 100vw;
  width: 100%;
  overflow: hidden;
}
</style>
