import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'electron',
  state: () => ({
    clicksData: null,
  }),
  actions: {
    setClicksData(clicksData) {
      this.clicksData = clicksData
    },
  },
})
