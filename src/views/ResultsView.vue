<template>
  <v-app theme="dark">
    <v-main>
      <v-container class="d-flex align-center h-100 w-100" fluid>
        <v-row class="mx-auto my-2" align="center">
          <v-col cols="6">
            <div class="d-flex flex-column h-100">
              <v-card
                theme="light"
                class="d-flex align-center pa-5 h-100 w-100 elevation-9"
              >
                <v-stack>
                  <h1>Total Number of Clicks: {{ totalClicks }}</h1>
                  <h2>Total time: {{ totalTime }}</h2>
                </v-stack>
              </v-card>
              <v-card theme="light" class="mt-5 pa-5 h-100 w-100 elevation-9">
                <ClicksHistoryList
                  :clickData="clicksData"
                  :height="tableHeight"
                />
              </v-card>
            </div>
          </v-col>

          <v-col cols="6">
            <v-card theme="light" class="scroll pa-10 w-100 elevation-17">
              <HeatmapCarousel :clicksDataMap="rawClicksData" />
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
  max-width: 50vw;
  width: 100%;
  overflow: hidden;
}
</style>
