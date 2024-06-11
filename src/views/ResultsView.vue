<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-card class="pa-5" outlined>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-card class="bg-indigo wrap-text" elevated>
                  <v-card-title>
                    <h1>Total Number of Clicks: {{ totalClicks }}</h1>
                  </v-card-title>
                  <v-card-text>
                    <h2>Total time: {{ totalTime }}</h2>
                  </v-card-text>
                </v-card>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <ClicksHistoryList :clickData="clicksData" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <HeatmapCarousel :clicksDataMap="rawClicksData" />
            </v-col>
          </v-row>
        </v-card>
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
<style scoped></style>
