<template>
  <v-data-table-virtual :height="height" fixed-header class="h-100" :headers="headers"
    :items="clickData">
    <template v-slot:item.url="{ value }">
      <p class="scrollable-url-cell">{{ value }}</p>
    </template>
  </v-data-table-virtual>
</template>

<script>
export default {
  props: {
    clickData: {
      type: Object,
      required: true,
    },
    height: {
      required: true,
    },
  },
  data() {
    return {
      headers: [
        { title: 'Number', key: 'number' },
        {
          title: 'Time',
          key: 'time',
          value: (item) => this.formatTime(item.time),
        },
        { title: 'Url', key: 'url' /* nowrap: true, maxWidth: '30vw' */ },
      ],
    }
  },
  methods: {
    formatTime(time) {
      const minutes = Math.floor(time / 60000)
      const seconds = Math.floor((time - minutes * 60000) / 1000)
      const milliseconds = time - minutes * 60000 - seconds * 1000

      return `${minutes}m ${seconds}s ${milliseconds}ms`
    },
  },
}
</script>

<style scoped>
/* .url-cell { */
/*   max-width: 20dvw; */
/*   white-space: nowrap; */
/*   overflow: hidden; */
/*   text-overflow: ellipsis; */
/* } */
.scrollable-url-cell {
  max-width: 30vw;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
