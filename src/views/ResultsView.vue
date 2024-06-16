<template>
  <v-app theme="light">
    <v-main>
      <v-container class="d-flex align-center h-100 w-100" fluid>
        <v-row no-gutters class="mx-auto my-2" align="center">
          <v-col>
            <div class="d-flex flex-column h-100">
              <v-card theme="light" class="d-flex align-center pa-5 h-100 w-100 elevation-9">
                <div>
                  <h1>Total Number of Clicks: {{ totalClicks }}</h1>
                  <h2>Total time: {{ totalTime }}</h2>
                </div>
              </v-card>

              <v-card theme="light" class="scroll mt-5 pa-10 w-100 elevation-9">
                <template v-if="isLoading">
                  <v-card-text class="d-flex flex-column align-center justify-center h-100 w-100">
                    <v-progress-linear :model-value="progress" indeterminate :width="100" color="primary">
                    </v-progress-linear>
                    <p class="mt-5">
                      {{ progress + ' %' }}
                    </p>
                  </v-card-text>
                </template>
                <template v-else>
                  <HeatmapCarousel :urlImages="urlImages" :clicksDataMap="rawClicksData" />
                </template>
              </v-card>
            </div>

            <v-card theme="light" class="mt-5 pa-5 h-100 w-100 elevation-9">
              <ClicksHistoryList :clickData="clicksData" :height="tableHeight" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import ClicksHistoryList from '@/components/ClicksHistoryList.vue'
import HeatmapCarousel from '@/components/HeatmapCarousel.vue'
import { useStore } from '@/stores'

export default {
  components: {
    ClicksHistoryList,
    HeatmapCarousel,
  },
  data() {
    return {
      totalTime: 0,
      tableHeight: 500,
    }
  },
  computed: {
    electronAPI() {
      return window.electronAPI
    },
    rawClicksData() {
      const store = useStore()
      return store.clicksData
    },
    clicksData() {
      return this.mapToArray(this.rawClicksData)
    },
    totalClicks() {
      return this.clicksData.length
    },
    urlImages() {
      const store = useStore()
      return store.urlImages
    },
    isLoading() {
      return !this.urlImages
    },
    progress() {
      const store = useStore()
      return Math.floor(store.progress * 100)
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
  },
}
</script>
<style scoped>
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
