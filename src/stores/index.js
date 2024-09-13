import {defineStore} from 'pinia'

export const useStore = defineStore({
    id: 'electron',
    state: () => ({
        clicksData: null,
        mouseData: null,
        totalTime: 0,
        dimensionsPerUrl: new Map(),
        urlImages: null,
        progress: 0,
        fails: 0,
    }),
    actions: {
        setClicksData(clicksData) {
            this.clicksData = clicksData
        },
        setMovementsData(mouseData) {
            this.mouseData = mouseData
        },
        setTotalTime(time) {
            this.totalTime = time
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
