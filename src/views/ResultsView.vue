<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-card class="pa-5" outlined>
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
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import ClicksHistoryList from '@/components/ClicksHistoryList.vue'
import { useStore } from '@/stores'

export default {
  components: {
    ClicksHistoryList,
  },
  data() {
    return {
      totalClicks: 0,
      totalTime: 0,
    }
  },
  computed: {
    electronAPI() {
      return window.electronAPI
    },
    clicksData() {
      const store = useStore()
      return store.clicksData
    },
    totalClicks() {
      //send from electron directly
    },
    totalTime() {
      //send from electron directly
    },
  },
}
</script>
<style lang="css"></style>
