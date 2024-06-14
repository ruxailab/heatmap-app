<template>
  <div
    :ref="`container-${index}`"
    :id="`containerId-${index}`"
    :style="{
      aspectRatio: `${aspectRatio}`,
    }"
  ></div>
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
    fullDimensions: {
      type: Map,
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
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeHeatmap()
    })
    console.log(this.fullDimensions)

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
      this.heatmapInstance = Heatmap(`#containerId-${this.index}`, {
        size: 30.0, // Radius of the data point, in pixels. Default: 20
        max: 1, // if not set, will be derived from data
        min: 0, // if not set, will be derived from data
        intensity: 1.0,
        gradient: [
          {
            color: [0, 0, 255, 1.0],
            offset: 0,
          },
          {
            color: [0, 0, 255, 1.0],
            offset: 0.2,
          },
          {
            color: [0, 255, 0, 1.0],
            offset: 0.45,
          },
          {
            color: [255, 255, 0, 1.0],
            offset: 0.85,
          },
          {
            color: [255, 0, 0, 1.0],
            offset: 1.0,
          },
        ],
      })

      this.updateHeatmap()
    },
    updateHeatmap() {
      if (!this.heatmapData || !this.heatmapInstance) return

      const transformedData = this.transformCoordinates(this.heatmapData)
      if (!transformedData) return

      this.heatmapInstance.clear()
      this.heatmapInstance.resize()
      this.heatmapInstance.renderData(transformedData)
    },
    transformCoordinates(data) {
      if (!data) return data

      const container = this.$refs[`container-${this.index}`]
      if (!container) return

      const {
        offsetWidth: newContainerWidth,
        offsetHeight: newContainerHeight,
      } = container
      const { width: dimensionsWidth, height: dimensionsHeight } =
        this.fullDimensions

      if (dimensionsWidth === 0 || dimensionsHeight === 0) return

      const scaleX = newContainerWidth / dimensionsWidth
      const scaleY = newContainerHeight / dimensionsHeight

      return data.map((item) => ({
        ...item,
        x: item.x * scaleX,
        y: item.y * scaleY,
      }))
    },
  },
}
</script>

<style scoped>
div {
  border: 1px solid red;
  border-radius: 5px;
}
</style>
