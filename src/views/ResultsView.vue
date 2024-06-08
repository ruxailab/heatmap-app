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
              <ClicksHistoryList :clickData="clickDataMap" />
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import ClicksHistoryList from '@/components/ClicksHistoryList.vue'
export default {
  components: {
    ClicksHistoryList,
  },
  data() {
    return {
      totalClicks: 11,
      totalTime: 3567,
      clickDataMap: new Map([
        [
          'https://www.google.com/',
          [
            { x: 484, y: 133, time: 649 },
            { x: 402, y: 599, time: 1014 },
            { x: 1105, y: 691, time: 1257 },
            { x: 1371, y: 155, time: 1514 },
            { x: 721, y: 68, time: 1795 },
            { x: 462, y: 664, time: 2091 },
            { x: 1061, y: 760, time: 2355 },
            { x: 1437, y: 238, time: 2640 },
            { x: 711, y: 117, time: 2981 },
            { x: 785, y: 430, time: 3341 },
            { x: 784, y: 405, time: 3567 },
          ],
        ],
      ]),
    }
  },
}
</script>
<style lang="css"></style>
