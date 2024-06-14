import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'electron',
  state: () => ({
    clicksData: null,
    dimensions: null,
    dimensionsPerUrl: new Map(),
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
  },
})
