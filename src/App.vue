<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'
import { useStore } from './stores'

export default {
  name: 'App',
  components: {
    RouterView,
  },
  mounted() {
    const store = useStore()

    if (window.electronAPI) {
      window.electronAPI.on(
        'end-clicks',
        (clicksData, dimensions, full_dimensions) => {
          store.setClicksData(clicksData)
          store.setDimensions(dimensions)
          store.setDimensionsPerUrl(full_dimensions)
        },
      )
      window.electronAPI.on('end-screenshots', (images) => {
        console.log(images)
        store.setUrlImages(images)
      })
      window.electronAPI.on('screenshots-progress', (progress, fails) => {
        store.setProgress(progress, fails)
      })
    }
  },
}
</script>

<style></style>
