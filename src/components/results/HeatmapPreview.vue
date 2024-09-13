<template>
  <div :ref="`${context}`" :id="context" :style="{
    aspectRatio: `${aspectRatio}`,
  }"></div>
</template>
<script>
import Heatmap from 'visual-heatmap'

export default {
  props: {
    heatmapData: {
      type: Object,
      required: true,
    },
    index: {
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
    fullDimensions: {
      type: Object,
      required: true,
    },
    image: {
      required: true,
    },
  },
  data() {
    return {
      heatmapInstance: null,
    }
  },
  computed: {
    aspectRatio() {
      return this.fullDimensions.width / this.fullDimensions.height
    },
    heatmapConfig() {
      if (this.context !== 'move') {
        return {
          size: 30.0, // Increased radius to capture broader mouse movements
          max: 1,
          min: 0,
          intensity: 0.5,
          gradient: [
            {color: [0, 0, 255, 0.8], offset: 0},   // Cooler color for lower intensity
            {color: [0, 255, 0, 0.8], offset: 0.5},  // Midpoint color
            {color: [255, 255, 0, 0.8], offset: 0.75}, // Warmer color as intensity increases
            {color: [255, 0, 0, 0.8], offset: 1.0}   // Warmest color for highest intensity
          ],
        }
      } else {
        return {
          size: 30.0, // Radius of the data point, in pixels
          max: 1,
          min: 0,
          intensity: 1.0,
          gradient: [
            {color: [0, 0, 255, 1.0], offset: 0,},
            {color: [0, 255, 0, 1.0], offset: 0.35,},
            {color: [255, 255, 0, 1.0], offset: 0.7,},
            {color: [255, 0, 0, 1.0], offset: 0.8,},
            {color: [255, 0, 0, 1.0], offset: 1.0,},
          ],
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeHeatmap()
    })

    window.addEventListener('resize', () => {
      this.updateHeatmap()
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      this.updateHeatmap()
    })
  },
  methods: {
    initializeHeatmap() {
      this.heatmapInstance = Heatmap(`#${this.context}`, this.heatmapConfig)

      this.updateHeatmap()
    },
    updateHeatmap() {
      if (!this.heatmapData || !this.heatmapInstance) return

      const transformedData = this.transformCoordinates(this.heatmapData)
      if (!transformedData) return

      this.heatmapInstance.clear()
      this.heatmapInstance.resize()
      this.heatmapInstance.setMax(this.getMaxValue(transformedData) === -Infinity ? 1 : this.getMaxValue(transformedData))
      this.heatmapInstance.renderData(transformedData)

      const dimensions = this.containerDimensions()
      this.heatmapInstance.setBackgroundImage({
        url: this.image,
        height: dimensions.newContainerHeight,
        width: dimensions.newContainerWidth,
      })
    },
    containerDimensions() {
      const container = this.$refs[`${this.context}`]
      if (!container) return

      const {
        offsetWidth: newContainerWidth,
        offsetHeight: newContainerHeight,
      } = container

      return {newContainerWidth, newContainerHeight}
    },
    transformCoordinates(data) {
      if (!data) return data

      const container = this.$refs[`${this.context}`]
      if (!container) return

      const {newContainerWidth, newContainerHeight} =
          this.containerDimensions()
      const {width: dimensionsWidth, height: dimensionsHeight} =
          this.fullDimensions

      if (dimensionsWidth === 0 || dimensionsHeight === 0) return

      const scaleX = newContainerWidth / dimensionsWidth
      const scaleY = newContainerHeight / dimensionsHeight

      return data.map((item) => ({
        ...item,
        x: item.x * scaleX,
        y: item.y * scaleY,
        value: item.value ?? 1,
      }))
    },
    getMaxValue(data) {
      return data.reduce((maxValue, item) => {
        return item.value > maxValue ? item.value : maxValue;
      }, -Infinity);
    }
  },
}
</script>

<style scoped>
div {
  border: 1px solid red;
  border-radius: 5px;
  min-width: 10vw;
}
</style>
