<template>
  <div v-if="showFullDescription !== task.taskName" class="text-container">
    {{ task.taskDescription }}
    <div v-if="task.taskDescription.length > 150" class="fade-out"></div>
  </div>
  <div v-else>
    {{ task.taskDescription }}
  </div>
  <span
    v-if="task.taskDescription.length > 150"
    @click="toggleDescription(task.taskName)"
    style="text-decoration: underline; cursor: pointer"
  >
    {{ showFullDescription === task.taskName ? 'Less...' : 'More...' }}
  </span>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showFullDescription: null,
    }
  },
  methods: {
    toggleDescription(taskName) {
      this.showFullDescription =
        this.showFullDescription === taskName ? null : taskName
    },
  },
}
</script>

<style scoped>
.text-container {
  position: relative;
  max-height: 4.5em;
  overflow: hidden;
}

.fade-out {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 1.5em;
  background: linear-gradient(to right, transparent, white 99%);
}
</style>
