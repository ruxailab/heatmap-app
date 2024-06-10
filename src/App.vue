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
      window.electronAPI.on('end-clicks', (clicksData, dimensions) => {
        store.setClicksData(clicksData)
        store.setDimensions(dimensions)
      })
    }
  },
}
</script>

<style>
::-webkit-scrollbar {
  width: 0px;
}
</style>
