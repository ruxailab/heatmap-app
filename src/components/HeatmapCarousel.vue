<template>
  <div class="carousel-container">
    <div v-for="(heatmap, index) in heatmapData" :key="heatmap[0]" class="heatmap-container" :style="{
      // without this, the scroll overflow doesnt work idk why -_-
      transform: `translateX(0%)`,
    }">
      <HeatmapPreview class="heatmap-preview" v-if="activeIndex === index" :heatmapData="heatmap[1]" :index="index"
        :full-dimensions="dimensionsPer.get(heatmap[0]) ?? null" :image="urlImages.get(heatmap[0]) ?? null" />
    </div>
  </div>
  <div class="carousel-controls pt-5">
    <VBtn rounded="xl" @click="prev" :disabled="activeIndex === 0">
      <v-icon>mdi-arrow-left</v-icon>
    </VBtn>
    <p class="scrollable-url-cell mx-7">
      {{ currentHeatmapUrl }}
    </p>
    <VBtn rounded="xl" @click="next" :disabled="activeIndex === heatmapData.size - 1">
      <v-icon>mdi-arrow-right</v-icon>
    </VBtn>
  </div>
</template>

<script>
import HeatmapPreview from './HeatmapPreview.vue'
import { useStore } from '@/stores'

export default {
  components: {
    HeatmapPreview,
  },
  props: {
    clicksDataMap: {
      type: Map,
      required: true,
    },
    urlImages: {
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
    dimensionsPer() {
      const store = useStore()
      return store.dimensionsPerUrl
    },
    currentHeatmapUrl() {
      const urls = Array.from(this.heatmapData.keys())
      return urls[this.activeIndex] || ''
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
    next() {
      if (this.activeIndex < this.heatmapData.size - 1) {
        this.activeIndex++
      }
    },
    prev() {
      if (this.activeIndex > 0) {
        this.activeIndex--
      }
    },
  },
}
</script>

<style scoped>
.carousel-container {
  flex: 1;
  overflow-y: auto;
}

.heatmap-container {
  display: flex;
  transition: transform 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.heatmap-preview {
  flex: 0 0 100%;
}

.carousel-controls {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scrollable-url-cell {
  max-width: 50vw;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
