<script>
import { RouterView } from 'vue-router'
import Toolbar from './components/Toolbar.vue'
export default {
  name: 'App',
  components: {
    RouterView,
    Toolbar,
  },
  data() {
    return {
      toolbarHeight: 0,
    }
  },
  mounted() {
    this.$nextTick(() => {
      const componentElement = this.$el.querySelector('.toolbar-menu')
      if (componentElement) {
        this.toolbarHeight = componentElement.offsetHeight
      }
    })
  },
  provide() {
    return {
      toolbarHeight: () => this.toolbarHeight,
    }
  },
}
</script>

<template>
  <v-app>
    <Toolbar :url="url" @update:url="updateUrl" ref="toolbar" />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
}
</style>
