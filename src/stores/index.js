import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'electron',
  state: () => ({
    clicksData: null,
    dimensions: null,
    dimensionsPerUrl: new Map(),
    urlImages: null,
    progress: 0,
    fails: 0,
  }),
  actions: {
    setClicksData(clicksData) {
      this.clicksData = clicksData
    },
    setDimensions(dimensions) {
      this.dimensions = dimensions
    },
    setDimensionsPerUrl(dimensionsPerUrl) {
      this.dimensionsPerUrl = dimensionsPerUrl
    },
    setUrlImages(urlImages) {
      this.urlImages = urlImages
    },
    setProgress(progress, fails) {
      this.progress = progress
      this.fails = fails
    },
  },
})
