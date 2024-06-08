<template>
  <v-data-table-virtual
    :headers="headers"
    fixed-header
    :items="clicksArray"
    class="elevation-1 scrollable-table"
  >
    <template v-slot:item.time="{ item }">
      <div>{{ formatTime(item.time) }}</div>
    </template>
    <template v-slot:item.url="{ item }">
      <div class="url-cell">{{ item.url }}</div>
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
  },
  data() {
    return {
      headers: [
        { title: 'Number', key: 'number' },
        { title: 'Time', key: 'time' },
        { title: 'Url', key: 'url' },
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
  computed: {
    clicksArray() {
      let clickArray = []
      for (const [url, clicks] of this.clickData.entries()) {
        for (const click of clicks) {
          clickArray.push({
            url: url,
            time: click.time,
          })
        }
      }
      clickArray.sort((a, b) => a.time - b.time)
      return clickArray.map((click, index) => ({ number: index + 1, ...click }))
    },
  },
}
</script>

<style scoped>
.url-cell {
  max-width: 30vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
