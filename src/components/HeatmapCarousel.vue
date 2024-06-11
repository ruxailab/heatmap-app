<template>
  <v-carousel
    hide-delimiters
    :show-arrows="shouldShowArrows ? 'hover' : false"
    v-model="activeIndex"
  >
    <v-carousel-item v-for="(heatmap, index) in heatmapData" :key="heatmap[0]">
      <p class="single-line">{{ heatmap[0] }}</p>
      <HeatmapPreview
        ref="heatmaps"
        v-if="activeIndex === index"
        :heatmapData="heatmap[1]"
        :index="index"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import HeatmapPreview from './HeatmapPreview.vue'

export default {
  components: {
    HeatmapPreview,
  },
  props: {
    clicksDataMap: {
      type: Map,
      required: true,
    },
  },
  data() {
    return {
      activeIndex: 0,
    }
  },
  computed: {
    heatmapData() {
      let result = new Map()
      for (let [key, value] of this.clicksDataMap.entries()) {
        result.set(key, this.arrayToHeatMapArray(value))
      }
      return result
    },
    shouldShowArrows() {
      return this.heatmapData.size > 1
    },
  },
  watch: {
    activeIndex(newIndex) {
      this.$nextTick(() => {
        const heatmapComponent = this.$refs.heatmaps[newIndex]
        if (heatmapComponent) {
          heatmapComponent.updateHeatmap()
        }
      })
    },
  },
  methods: {
    arrayToHeatMapArray(array) {
      let heatMapArray = []
      for (const click of array) {
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
<style scoped>
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
