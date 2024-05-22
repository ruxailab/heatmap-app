<script>
import UrlForm from '@/components/UrlForm.vue'

export default {
  components: {
    UrlForm,
  },
  inject: ['toolbarHeight'],
  data() {
    return {
      localToolbarHeigh: 0,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.localToolbarHeigh = this.toolbarHeight()
      console.log('from view:' + this.toolbarHeight())
    })
    // this.$nextTick(() => {
    //   const componentElement = this.$el.querySelector('.toolbar-menu')
    //   if (componentElement) {
    //     console.log(componentElement)
    //     this.toolbarHeight = componentElement.offsetHeight
    //   }
    // })
  },
}
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <UrlForm :toolbarHeight="localToolbarHeigh" />
    </v-responsive>
  </v-container>
</template>

<style>
/* Hides scrollbar */
::-webkit-scrollbar {
  width: 0px;
}
</style>
