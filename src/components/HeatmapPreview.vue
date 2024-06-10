<template>
  <div
    ref="container"
    id="containerId"
    :style="{
      aspectRatio: `${aspectRatio}`,
    }"
  ></div>
</template>
<script>
import { useStore } from '@/stores'
import Heatmap from 'visual-heatmap'

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      heatmapInstance: null,
    }
  },
  computed: {
    dimensions() {
      const store = useStore()
      return store.dimensions
    },
    aspectRatio() {
      return this.dimensions.width / this.dimensions.height
    },
  },
  mounted() {
    console.log(this.data)
    this.heatmapInstance = Heatmap('#containerId', {
      size: 30.0, //Radius of the data point, in pixels. Default: 20
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
    window.addEventListener('resize', () => {
      this.updateHeatmap()
    })

    this.updateHeatmap()
    // const transformedData = this.transformCoordinates(this.data)
    // this.heatmapInstance.renderData(transformedData)
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      this.updateHeatmap()
    })
  },
  methods: {
    updateHeatmap() {
      const transformedData = this.transformCoordinates(this.data)

      this.heatmapInstance.clear()
      this.heatmapInstance.resize()
      this.heatmapInstance.renderData(transformedData)
    },
    transformCoordinates(data) {
      const element = this.$refs.container
      if (!element) {
        console.error("Couldn't transform coordinates")
        return
      }

      const {
        offsetWidth: newContainerWidth,
        offsetHeight: newContainerHeight,
      } = element
      const { width: dimensionsWidth, height: dimensionsHeight } =
        this.dimensions

      if (dimensionsWidth === 0 || dimensionsHeight === 0) {
        console.error('Dimensions width or height is zero')
        return
      }

      const scaleX = newContainerWidth / dimensionsWidth
      const scaleY = newContainerHeight / dimensionsHeight
      console.log(scaleX, scaleY)

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
#containerId {
  border: 1px solid red;
  border-radius: 5px;
}
</style>
