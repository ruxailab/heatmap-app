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
              <HeatmapPreview :data="arrayToHeatMapArray(clicksData)" />
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import ClicksHistoryList from '@/components/ClicksHistoryList.vue'
import HeatmapPreview from '@/components/HeatmapPreview.vue'
import { useStore } from '@/stores'

export default {
  components: {
    ClicksHistoryList,
    HeatmapPreview,
  },
  data() {
    return {
      totalTime: 0,
      clicksArrayData: null,
    }
  },
  computed: {
    electronAPI() {
      return window.electronAPI
    },
    clicksData() {
      const store = useStore()
      return this.mapToArray(store.clicksData)
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
    arrayToHeatMapArray() {
      let heatMapArray = []
      for (const click of this.clicksData) {
        heatMapArray.push({
          x: click.x,
          y: click.y,
          value: 1,
        })
      }
      return heatMapArray
    },
  },
}
</script>
<style lang="css"></style>
